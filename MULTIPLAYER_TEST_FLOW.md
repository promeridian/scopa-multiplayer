# Multiplayer Test Flow

## Local URL

Dev server:

`http://localhost:8787`

The current client cache version in `index.html` is `20260504-07`.

Local invite links contain `localhost` and are only for two-browser testing on the same computer. A friend in Telegram needs a deployed HTTPS URL generated with `PUBLIC_APP_URL`.

## Browser Two-Client Flow

Use two separate browser profiles, two different browsers, or one normal window plus one private window. This avoids sharing the same `localStorage` session.

1. Open `http://localhost:8787` as host.
2. Tap `Игра с другом`.
3. Tap `Создать комнату`.
4. Copy the invite URL from the lobby.
5. Open that invite URL in the second browser context.
6. Confirm both clients enter the game screen.
7. Confirm the top game status shows:
   - room id;
   - `P1` on the host, `P2` on the friend;
   - `ваш ход` for one client and `ход друга` for the other;
   - green `вы` and green `друг` indicators.
8. On the active-turn client, select a hand card and legal table cards, then tap `Положить` or `Забрать`.
9. Confirm both clients update from the server snapshot.
10. Close or refresh one client.
11. Confirm the other client receives offline/reconnect status after `leave` or subsequent join.
12. Reopen the invite URL in the same second browser context.
13. Confirm the player reconnects with the same seat and the status indicators return online.

## API Smoke Test

Run:

`node tests/server-smoke.mjs`

This test covers:

- room creation;
- second player join;
- private player view;
- accepted legal move;
- returned `move.accepted` event;
- `leave`;
- reconnect with the same `playerToken`;
- `heartbeat`.

If `npm` is available, the equivalent command is:

`npm run smoke:server`

## Headless Two-Client Browser Smoke

Run:

`node tests/two-client-browser.mjs`

This test opens two isolated browser contexts, creates a room through the UI, joins through the invite URL, clicks a legal card move in the active player's browser, and checks that both clients keep a visible game status.

If `npm` is available:

`npm run test:two-client`
