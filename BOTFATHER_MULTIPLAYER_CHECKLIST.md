# BotFather Multiplayer Checklist

Use this checklist only after the Node deployment is available over HTTPS.

## Before BotFather

- Deploy this multiplayer folder, not the old single-player static folder.
- Confirm `GET https://<host>/api/health` returns `"ok": true`.
- Open `https://<host>/` in a normal browser and create a room.
- Open the invite URL `https://<host>/?room=<roomId>` in a second browser profile and join.
- Verify that both players see the same first move.

## BotFather Setup

1. Open BotFather.
2. Select the bot that owns the Mini App.
3. Open Mini App settings.
4. Set the Mini App URL to `https://<host>/`.
5. Save changes.

## Telegram Test

- Launch the Mini App from Telegram.
- Create a multiplayer room.
- Send the invite link to a friend.
- Friend opens the link from Telegram and joins.
- Test a legal move, reconnect, and app background/foreground.

## Notes

- GitHub Pages cannot host this multiplayer build by itself because the game needs `server/server.js`.
- Invite links use normal query URLs: `https://<host>/?room=<roomId>`.
- Telegram `startapp` payloads shaped as `room_<roomId>` are also supported by the client.
