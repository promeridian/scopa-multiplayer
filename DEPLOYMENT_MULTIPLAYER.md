# Multiplayer Deployment Notes

## What Changed

The multiplayer version is no longer a pure static GitHub Pages app. It needs a Node server because rooms, private player tokens, authoritative game state, long polling, reconnect, and move validation must live outside the browser.

## Runtime

- Node.js 20+ recommended.
- Start command: `npm start` or `node server/server.js`.
- Default local port: `8787`.
- Production port: set `PORT` from the hosting platform.

## Required HTTPS

Telegram Mini Apps must be served over HTTPS in production. Put the Node app behind a platform or proxy that terminates TLS:

- Render Web Service;
- Fly.io;
- Railway;
- VPS with nginx/Caddy;
- any Node-compatible host with HTTPS.

GitHub Pages alone is not enough for multiplayer because it cannot run `server/server.js`.

Important: local invite links like `http://localhost:8787/?room=...` work only on the same computer. They are not valid links for a friend in Telegram. For real friend invites, deploy the Node app to HTTPS and set `PUBLIC_APP_URL` to that HTTPS address.

## Environment Variables

- `PORT`: server port. Usually provided by the host.
- `PUBLIC_APP_URL`: public HTTPS Mini App URL, for example `https://scopa.example.com`. Set this in production so invite links are clickable and openable by another player. On Render this can be omitted because the server also reads Render's `RENDER_EXTERNAL_URL`.
- `ROOM_TTL_MS`: maximum lifetime for a room. Default: 6 hours.
- `ROOM_IDLE_MS`: idle room cleanup threshold. Default: 45 minutes.
- `ROOM_CLEANUP_MS`: cleanup interval. Default: 5 minutes.
- `MAX_EVENTS_PER_ROOM`: retained event log length. Default: 500.
- `TURN_TIMEOUT_MS`: turn time limit. Default: 45 seconds. When it expires, the server performs a simple legal auto-move for the active player.

## Health Check

Use:

`GET /api/health`

Example response:

```json
{
  "ok": true,
  "rooms": 1,
  "activeRooms": 1,
  "now": 1777920000000
}
```

## Publish Package

Build a deployment folder and zip:

`node scripts/build-publish.js`

Outputs:

- `publish_scopa_multiplayer/`
- `scopa-multiplayer-publish.zip`

The package includes static files, `assets/`, `server/`, `shared/`, and deployment docs. It intentionally excludes old backups, previous static publish folders, video frames, and historical zip archives.

Deployment helper files included:

- `Procfile`: generic Node web process.
- `render.yaml`: Render Blueprint.
- `railway.json`: Railway deployment settings and health check.
- `fly.toml`: Fly.io app template using the included Dockerfile.
- `Dockerfile`: container deployment.
- `.dockerignore`: excludes backups, zips, tests, and local files from Docker context.
- `.env.example`: local environment variable template.
- `Caddyfile`: minimal Caddy reverse proxy example.
- `nginx-scopa.conf`: minimal nginx reverse proxy example.
- `BOTFATHER_MULTIPLAYER_CHECKLIST.md`: checklist for switching the Mini App URL.

## Render

Recommended fastest path:

1. Upload the contents of `publish_scopa_multiplayer/` to a GitHub repository.
2. In Render, create a new Web Service from that repository.
3. Use Runtime `Node`.
4. Build Command can be empty.
5. Start Command: `npm start`.
6. Health Check Path: `/api/health`.
7. Render will provide `PORT`; do not hardcode it.

The included `render.yaml` can also be used as a Blueprint.

## Railway

1. Create a new project from the repository or upload package.
2. Railway detects Node from `package.json`.
3. Start Command: `npm start`.
4. Railway provides `PORT`.
5. Use the generated HTTPS domain as the Telegram Mini App URL.

## Fly.io / Docker

Use the included `Dockerfile`.

The container exposes `8787`, but the app still respects `PORT` if the platform sets it.

## VPS With Caddy Or Nginx

Run the app with a process manager:

`npm start`

Put it behind HTTPS reverse proxy:

- app listens on `127.0.0.1:8787`;
- public domain serves HTTPS;
- proxy `/` and `/api/*` to the Node process.

Keep long-polling in mind: proxy read timeout should be above 25 seconds.

## Telegram BotFather

Set the Mini App URL to the HTTPS URL of this Node deployment, not the old GitHub Pages static URL.

Invite links use:

`https://<app-host>/?room=<roomId>`

The client also supports Telegram `startapp` payloads shaped as:

`room_<roomId>`
