# Scopa Multiplayer Architecture

## Goal

Create a separate Telegram Mini App version for a private online match with a friend. The original single-player project stays unchanged; all multiplayer work lives in this folder.

Source baseline: `20260503-54` from `C:\Users\SerBer\Documents\Codex\2026-04-30\mini-app-telegram`.

## Runtime Shape

The app becomes two parts:

- Static Mini App client: `index.html`, `styles.css`, `game.js`, assets, plus a small multiplayer client adapter.
- Room server: a small HTTPS-capable Node service that owns rooms, seats, game state, event history, reconnect tokens, and move validation.

The server must be authoritative. Clients can request moves, but they do not decide the final game state.

## Rooms

Each private match has a room:

- `roomId`: short random public id used in invite links.
- `status`: `waiting`, `playing`, `finished`, `abandoned`.
- `players`: two seats, `p1` and `p2`.
- `hostSeat`: initially `p1`.
- `createdAt`, `updatedAt`, `expiresAt`.
- `game`: authoritative match and round state.
- `events`: ordered event log with monotonically increasing `seq`.

Room lifecycle:

1. Host taps "Игра с другом".
2. Client calls `POST /api/rooms`.
3. Server creates `roomId`, assigns `p1`, returns `playerToken` and invite URL.
4. Host shares invite through Telegram.
5. Friend opens link with `?room=<roomId>`.
6. Client calls `POST /api/rooms/<roomId>/join`.
7. When both seats are occupied, server starts match and broadcasts snapshot.

## Invite Link

Telegram Mini App invite URL should use a normal query parameter:

`https://<app-host>/?room=<roomId>`

If later the bot deep-link flow is needed, the same payload can be wrapped as:

`https://t.me/<bot>?startapp=room_<roomId>`

The client should support both:

- `room` query param from web URL.
- `startapp` payload from `Telegram.WebApp.initDataUnsafe.start_param`.

The invite contains no private token. A player receives a private `playerToken` only after joining through the server.

## Server

The first implementation uses a dependency-free Node HTTP server with JSON APIs and long polling. This avoids adding a build step while the architecture is still moving.

Planned endpoints:

- `POST /api/rooms` creates a room and returns host seat/token.
- `GET /api/rooms/:roomId` returns public room status.
- `POST /api/rooms/:roomId/join` joins or reconnects a player.
- `POST /api/rooms/:roomId/leave` marks a player offline.
- `POST /api/rooms/:roomId/move` submits an intended move.
- `GET /api/rooms/:roomId/events?since=<seq>&token=<playerToken>` long-polls events.

Later this can move to WebSocket without changing the game protocol:

- client still sends `join`, `move`, `heartbeat`;
- server still emits ordered events and snapshots.

## Synchronization

The server emits ordered events:

- `room.created`
- `player.joined`
- `player.reconnected`
- `player.offline`
- `match.started`
- `move.accepted`
- `move.rejected`
- `round.ended`
- `match.ended`
- `snapshot`

Clients keep:

- latest `seq`;
- own `seat`;
- private `playerToken`;
- current server snapshot.

Client flow:

1. Render only from server snapshot/events in multiplayer mode.
2. On local tap, send a move command.
3. Disable controls while the move is pending or when it is not this player's turn.
4. Apply only server-confirmed events.

## Move Model

A move command should be small and deterministic:

```json
{
  "type": "playCard",
  "cardId": "denari-7",
  "tableCardIds": ["coppe-4", "spade-3"],
  "clientMoveId": "uuid-or-random-id"
}
```

Server validation:

- token belongs to a room player;
- room is `playing`;
- it is this player's turn;
- card belongs to this player's hand;
- selected table cards exist;
- Scopa capture rules are valid;
- no duplicate `clientMoveId` is applied twice.

## Reconnect

The client stores room credentials locally in `scopaMultiplayerSession`:

- `roomId`
- `playerToken`
- `seat`
- latest `seq`

On reload:

1. If URL has `room`, attempt join/reconnect for that room.
2. Else if saved room exists and is not expired, call join with the saved token.
3. Server returns latest snapshot and event `seq`.
4. Client resumes long polling from that `seq`.

Offline handling:

- Server marks player offline after missed heartbeat or failed long-poll timeout.
- Room remains resumable for a grace period.
- The other player sees "Друг переподключается".
- If grace period expires, room becomes `abandoned`.

## Implementation Steps

1. Add room server and client lobby adapter.
2. Route home buttons to multiplayer lobby and invite creation.
3. Extract Scopa rules from `game.js` into a pure shared module.
4. Replace bot turns in multiplayer mode with server-authorized player turns.
5. Add snapshots, reconnect, and move replay.
6. Add deployment notes for HTTPS hosting behind Telegram Mini App.
