const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");
const scopaRules = require("../shared/scopa-rules");

const PORT = Number(process.env.PORT || 8787);
const ROOT = path.resolve(__dirname, "..");
const ROOM_TTL_MS = Number(process.env.ROOM_TTL_MS || 1000 * 60 * 60 * 6);
const ROOM_IDLE_MS = Number(process.env.ROOM_IDLE_MS || 1000 * 60 * 45);
const ROOM_CLEANUP_MS = Number(process.env.ROOM_CLEANUP_MS || 1000 * 60 * 5);
const MAX_EVENTS_PER_ROOM = Number(process.env.MAX_EVENTS_PER_ROOM || 500);
const PUBLIC_APP_URL = normalizePublicAppUrl(process.env.PUBLIC_APP_URL || process.env.RENDER_EXTERNAL_URL || "");
const LONG_POLL_MS = 25000;
const TURN_TIMEOUT_MS = Number(process.env.TURN_TIMEOUT_MS || 45000);
const PLAYER_STALE_MS = Number(process.env.PLAYER_STALE_MS || 30000);
const APP_PRESENCE_STALE_MS = Number(process.env.APP_PRESENCE_STALE_MS || 30000);
const CHAT_MAX_LENGTH = 120;
const CHAT_MIN_INTERVAL_MS = 1200;
const REACTIONS = new Map([
  ["thumbsUp", "👍"],
  ["shock", "😮"],
  ["angry", "😤"],
  ["laugh", "😂"]
]);

const rooms = new Map();
const appPresence = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".zip": "application/zip"
};

function id(bytes = 9) {
  return crypto.randomBytes(bytes).toString("base64url");
}

function now() {
  return Date.now();
}

function createRoom(hostName, options = {}) {
  const roomId = id(6);
  const token = id(18);
  const room = {
    roomId,
    status: "waiting",
    hostSeat: "p1",
    createdAt: now(),
    updatedAt: now(),
    expiresAt: now() + ROOM_TTL_MS,
    nextSeq: 0,
    players: {
      p1: createPlayer("p1", hostName || "Игрок 1", token),
      p2: null
    },
    game: null,
    completedMoveIds: new Set(),
    events: [],
    waiters: new Set(),
    turnDeadlineAt: null,
    turnTimer: null,
    publicMatchmaking: Boolean(options.publicMatchmaking)
  };
  rooms.set(roomId, room);
  appendEvent(room, "room.created", publicSnapshot(room));
  appendEvent(room, "player.joined", { seat: "p1", name: room.players.p1.name });
  return { room, seat: "p1", token };
}

function listPublicRooms() {
  return Array.from(rooms.values())
    .filter((room) => {
      markStalePlayers(room);
      return room.publicMatchmaking && room.status === "waiting" && room.players.p1 && room.players.p1.online && !room.players.p2;
    })
    .sort((left, right) => left.createdAt - right.createdAt);
}

function publicRoomSummary(room) {
  return {
    roomId: room.roomId,
    hostName: room.players.p1 ? room.players.p1.name : "Игрок",
    createdAt: room.createdAt,
    waitingSeconds: Math.max(0, Math.floor((now() - room.createdAt) / 1000))
  };
}

function serverStats() {
  cleanupPresence();
  let roomOnlinePlayers = 0;
  let waitingPublicRooms = 0;
  let playingRooms = 0;
  for (const room of rooms.values()) {
    markStalePlayers(room);
    if (room.players.p1 && room.players.p1.online) roomOnlinePlayers += 1;
    if (room.players.p2 && room.players.p2.online) roomOnlinePlayers += 1;
    if (room.status === "playing") playingRooms += 1;
    if (room.publicMatchmaking && room.status === "waiting" && room.players.p1 && room.players.p1.online && !room.players.p2) {
      waitingPublicRooms += 1;
    }
  }
  const appOnlinePlayers = appPresence.size;
  return {
    onlinePlayers: Math.max(appOnlinePlayers, roomOnlinePlayers),
    appOnlinePlayers,
    roomOnlinePlayers,
    waitingPublicRooms,
    playingRooms,
    rooms: rooms.size,
    now: now()
  };
}

function touchPresence(clientId) {
  const normalized = String(clientId || "").trim().slice(0, 80);
  if (!normalized) throw httpError(400, "Missing clientId");
  appPresence.set(normalized, now());
}

function cleanupPresence() {
  const timestamp = now();
  for (const [clientId, lastSeenAt] of appPresence) {
    if (timestamp - lastSeenAt > APP_PRESENCE_STALE_MS) appPresence.delete(clientId);
  }
}

function createPublicRoom(playerName) {
  const created = createRoom(playerName, { publicMatchmaking: true });
  appendEvent(created.room, "matchmaking.waiting", { seat: created.seat });
  return { room: created.room, seat: created.seat, token: created.token };
}

function joinPublicRoom(playerName, roomId = "") {
  const candidates = listPublicRooms();
  const room = roomId ? candidates.find((item) => item.roomId === roomId) : candidates[0];
  if (!room) throw httpError(404, "No public rooms available");
  const joined = joinRoom(room, playerName);
  return { room, seat: joined.seat, token: joined.token };
}

function createPlayer(seat, name, token) {
  return {
    seat,
    name,
    token,
    online: true,
    joinedAt: now(),
    lastSeenAt: now(),
    lastChatAt: 0
  };
}

function publicSnapshot(room, viewerSeat = null) {
  markStalePlayers(room);
  return {
    roomId: room.roomId,
    status: room.status,
    hostSeat: room.hostSeat,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    expiresAt: room.expiresAt,
    turnDeadlineAt: room.turnDeadlineAt,
    turnTimeoutMs: TURN_TIMEOUT_MS,
    serverNow: now(),
    players: {
      p1: publicPlayer(room.players.p1),
      p2: publicPlayer(room.players.p2)
    },
    game: viewerSeat ? scopaRules.playerView(room.game, viewerSeat) : scopaRules.publicView(room.game)
  };
}

function publicPlayer(player) {
  if (!player) return null;
  return {
    seat: player.seat,
    name: player.name,
    online: player.online,
    joinedAt: player.joinedAt,
    lastSeenAt: player.lastSeenAt
  };
}

function appendEvent(room, type, payload) {
  const event = {
    seq: ++room.nextSeq,
    type,
    payload,
    at: now()
  };
  room.updatedAt = event.at;
  room.events.push(event);
  trimEvents(room);
  for (const waiter of room.waiters) waiter();
  room.waiters.clear();
  return event;
}

function scheduleTurn(room) {
  clearTurnTimer(room);
  if (!room || room.status !== "playing" || !room.game || !room.game.round || room.game.round.ended || room.game.status !== "playing") {
    room.turnDeadlineAt = null;
    return;
  }
  room.turnDeadlineAt = now() + TURN_TIMEOUT_MS;
  room.turnTimer = setTimeout(() => applyTimeoutMove(room), TURN_TIMEOUT_MS + 250);
}

function clearTurnTimer(room) {
  if (room && room.turnTimer) clearTimeout(room.turnTimer);
  if (room) room.turnTimer = null;
}

function applyTimeoutMove(room) {
  if (!room || room.status !== "playing" || !room.game || !room.game.round || room.game.status !== "playing") return;
  if (!room.turnDeadlineAt || now() < room.turnDeadlineAt) return scheduleTurn(room);
  const seat = room.game.round.turn;
  const move = firstLegalMove(room.game.round, seat);
  if (!move) return scheduleTurn(room);
  const result = scopaRules.applyMove(room.game, seat, move);
  if (!result.ok) return scheduleTurn(room);
  room.game = result.match;
  if (room.game.status === "finished") room.status = "finished";
  appendEvent(room, "move.accepted", {
    seat,
    clientMoveId: `timeout-${Date.now()}`,
    timeout: true,
    effects: result.effects,
    game: scopaRules.publicView(room.game)
  });
  scheduleTurn(room);
}

function firstLegalMove(round, seat) {
  const hand = (round.hands && round.hands[seat]) || [];
  for (const card of hand) {
    const captures = scopaRules.captureOptions(card, round.table || []);
    if (captures.length > 0) {
      return {
        type: "playCard",
        cardId: card.id,
        tableCardIds: captures[0].map((tableCard) => tableCard.id)
      };
    }
  }
  const discard = hand[0];
  if (!discard) return null;
  return { type: "playCard", cardId: discard.id, tableCardIds: [] };
}

function trimEvents(room) {
  if (room.events.length <= MAX_EVENTS_PER_ROOM) return;
  room.events.splice(0, room.events.length - MAX_EVENTS_PER_ROOM);
}

function findPlayerByToken(room, token) {
  if (!token) return null;
  return Object.values(room.players).find((player) => player && player.token === token) || null;
}

function touchPlayer(room, player) {
  if (!player) return;
  const wasOffline = !player.online;
  player.online = true;
  player.lastSeenAt = now();
  if (wasOffline) appendEvent(room, "player.reconnected", { seat: player.seat, name: player.name });
}

function markStalePlayers(room) {
  if (!room || !room.players) return;
  const timestamp = now();
  for (const player of Object.values(room.players)) {
    if (!player || !player.online) continue;
    if (timestamp - player.lastSeenAt <= PLAYER_STALE_MS) continue;
    player.online = false;
    appendEvent(room, "player.offline", { seat: player.seat });
  }
}

function joinRoom(room, name, token) {
  const existing = findPlayerByToken(room, token);
  if (existing) {
    touchPlayer(room, existing);
    return { seat: existing.seat, token: existing.token, reconnected: true };
  }

  if (!room.players.p2) {
    const nextToken = id(18);
    room.players.p2 = createPlayer("p2", name || "Игрок 2", nextToken);
    room.game = scopaRules.createMatch();
    room.status = "playing";
    scheduleTurn(room);
    appendEvent(room, "player.joined", { seat: "p2", name: room.players.p2.name });
    appendEvent(room, "match.started", publicSnapshot(room));
    return { seat: "p2", token: nextToken, reconnected: false };
  }

  const offlineSeat = ["p2", "p1"].find((seat) => room.players[seat] && !room.players[seat].online);
  if (offlineSeat) {
    const nextToken = id(18);
    const player = room.players[offlineSeat];
    player.name = name || player.name;
    player.token = nextToken;
    touchPlayer(room, player);
    return { seat: offlineSeat, token: nextToken, reconnected: true };
  }

  throw httpError(409, "Room is full");
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  res.end(body);
}

function sendError(res, error) {
  sendJson(res, error.status || 500, { error: error.message || "Server error" });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) reject(httpError(413, "Request body is too large"));
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(httpError(400, "Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

async function waitForEvents(room, since) {
  const existing = room.events.filter((event) => event.seq > since);
  if (existing.length > 0) return existing;

  await new Promise((resolve) => {
    const timeout = setTimeout(resolve, LONG_POLL_MS);
    const waiter = () => {
      clearTimeout(timeout);
      resolve();
    };
    room.waiters.add(waiter);
  });

  return room.events.filter((event) => event.seq > since);
}

async function handleApi(req, res, url) {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  if (req.method === "GET" && url.pathname === "/api/health") {
    const stats = serverStats();
    return sendJson(res, 200, {
      ok: true,
      rooms: stats.rooms,
      activeRooms: stats.playingRooms,
      onlinePlayers: stats.onlinePlayers,
      waitingPublicRooms: stats.waitingPublicRooms,
      now: stats.now
    });
  }

  if (req.method === "GET" && url.pathname === "/api/stats") {
    return sendJson(res, 200, serverStats());
  }

  if (req.method === "POST" && url.pathname === "/api/presence") {
    const body = await readBody(req);
    touchPresence(body.clientId);
    return sendJson(res, 200, serverStats());
  }

  if (req.method === "POST" && url.pathname === "/api/rooms") {
    const body = await readBody(req);
    const { room, seat, token } = createRoom(body.playerName);
    return sendJson(res, 201, {
      room: publicSnapshot(room, seat),
      seat,
      playerToken: token,
      inviteUrl: inviteUrl(req, room.roomId)
    });
  }

  if (req.method === "GET" && url.pathname === "/api/matchmaking/rooms") {
    return sendJson(res, 200, {
      rooms: listPublicRooms().map(publicRoomSummary),
      now: now()
    });
  }

  if (req.method === "POST" && url.pathname === "/api/matchmaking/rooms") {
    const body = await readBody(req);
    const created = createPublicRoom(body.playerName);
    return sendJson(res, 201, {
      room: publicSnapshot(created.room, created.seat),
      seat: created.seat,
      playerToken: created.token,
      matched: false,
      seq: created.room.nextSeq
    });
  }

  if (req.method === "POST" && url.pathname === "/api/matchmaking/join") {
    const body = await readBody(req);
    const joined = joinPublicRoom(body.playerName, body.roomId);
    return sendJson(res, 200, {
      room: publicSnapshot(joined.room, joined.seat),
      seat: joined.seat,
      playerToken: joined.token,
      matched: true,
      seq: joined.room.nextSeq
    });
  }

  const match = url.pathname.match(/^\/api\/rooms\/([^/]+)(?:\/([^/]+))?$/);
  if (!match) throw httpError(404, "API route not found");

  const room = rooms.get(match[1]);
  if (!room) throw httpError(404, "Room not found");
  const action = match[2] || "";

  if (req.method === "GET" && !action) {
    return sendJson(res, 200, { room: publicSnapshot(room), seq: room.nextSeq });
  }

  if (req.method === "POST" && action === "join") {
    const body = await readBody(req);
    const joined = joinRoom(room, body.playerName, body.playerToken);
    return sendJson(res, 200, {
      room: publicSnapshot(room, joined.seat),
      seat: joined.seat,
      playerToken: joined.token,
      reconnected: joined.reconnected,
      seq: room.nextSeq
    });
  }

  if (req.method === "POST" && action === "leave") {
    const body = await readBody(req);
    const player = findPlayerByToken(room, body.playerToken);
    if (!player) throw httpError(403, "Invalid player token");
    const wasOnline = player.online;
    player.online = false;
    player.lastSeenAt = now();
    if (wasOnline) appendEvent(room, "player.offline", { seat: player.seat });
    return sendJson(res, 200, { room: publicSnapshot(room, player.seat), seq: room.nextSeq });
  }

  if (req.method === "POST" && action === "heartbeat") {
    const body = await readBody(req);
    const player = findPlayerByToken(room, body.playerToken);
    if (!player) throw httpError(403, "Invalid player token");
    touchPlayer(room, player);
    return sendJson(res, 200, { room: publicSnapshot(room, player.seat), seq: room.nextSeq });
  }

  if (req.method === "POST" && action === "reaction") {
    const body = await readBody(req);
    const player = findPlayerByToken(room, body.playerToken);
    if (!player) throw httpError(403, "Invalid player token");
    touchPlayer(room, player);
    if (room.status !== "playing") throw httpError(409, "Room is not playing");
    const reactionId = String(body.reactionId || "");
    const emoji = REACTIONS.get(reactionId);
    if (!emoji) throw httpError(400, "Unknown reaction");
    const reactionEvent = appendEvent(room, "reaction.sent", {
      seat: player.seat,
      reactionId,
      emoji
    });
    return sendJson(res, 200, { room: publicSnapshot(room, player.seat), seq: room.nextSeq, event: reactionEvent });
  }

  if (req.method === "POST" && action === "chat") {
    const body = await readBody(req);
    const player = findPlayerByToken(room, body.playerToken);
    if (!player) throw httpError(403, "Invalid player token");
    touchPlayer(room, player);
    if (room.status !== "playing") throw httpError(409, "Room is not playing");
    const timestamp = now();
    if (timestamp - (player.lastChatAt || 0) < CHAT_MIN_INTERVAL_MS) throw httpError(429, "Сообщения можно отправлять не так часто");
    const text = normalizeChatText(body.text);
    if (!text) throw httpError(400, "Сообщение не может быть пустым");
    player.lastChatAt = timestamp;
    const chatEvent = appendEvent(room, "chat.message", {
      seat: player.seat,
      text
    });
    return sendJson(res, 200, { room: publicSnapshot(room, player.seat), seq: room.nextSeq, event: chatEvent });
  }

  if (req.method === "POST" && action === "move") {
    const body = await readBody(req);
    const player = findPlayerByToken(room, body.playerToken);
    if (!player) throw httpError(403, "Invalid player token");
    touchPlayer(room, player);
    if (room.status !== "playing" || !room.game) throw httpError(409, "Room is not playing");

    const clientMoveId = body.clientMoveId || "";
    if (clientMoveId && room.completedMoveIds.has(`${player.seat}:${clientMoveId}`)) {
      return sendJson(res, 200, {
        room: publicSnapshot(room, player.seat),
        seq: room.nextSeq,
        duplicate: true
      });
    }

    const result = scopaRules.applyMove(room.game, player.seat, body.move || body);
    if (!result.ok) {
      const rejectedEvent = appendEvent(room, "move.rejected", {
        seat: player.seat,
        clientMoveId: clientMoveId || null,
        reason: result.reason
      });
      return sendJson(res, 409, { error: result.reason, room: publicSnapshot(room, player.seat), seq: room.nextSeq, event: rejectedEvent });
    }

    room.game = result.match;
    if (clientMoveId) room.completedMoveIds.add(`${player.seat}:${clientMoveId}`);
    if (room.game.status === "finished") room.status = "finished";
    scheduleTurn(room);
    const acceptedEvent = appendEvent(room, "move.accepted", {
      seat: player.seat,
      clientMoveId: clientMoveId || null,
      effects: result.effects,
      game: scopaRules.publicView(room.game)
    });
    return sendJson(res, 200, { room: publicSnapshot(room, player.seat), seq: room.nextSeq, event: acceptedEvent });
  }

  if (req.method === "GET" && action === "events") {
    const token = url.searchParams.get("token");
    const player = findPlayerByToken(room, token);
    if (!player) throw httpError(403, "Invalid player token");
    touchPlayer(room, player);
    const since = Number(url.searchParams.get("since") || 0);
    const events = await waitForEvents(room, Number.isFinite(since) ? since : 0);
    return sendJson(res, 200, { events, room: publicSnapshot(room, player.seat), seq: room.nextSeq });
  }

  throw httpError(404, "API route not found");
}

function normalizeChatText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, CHAT_MAX_LENGTH);
}

function inviteUrl(req, roomId) {
  if (PUBLIC_APP_URL) return `${PUBLIC_APP_URL}/?room=${encodeURIComponent(roomId)}`;
  const host = req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`;
  const proto = req.headers["x-forwarded-proto"] || "http";
  return `${proto}://${host}/?room=${encodeURIComponent(roomId)}`;
}

function normalizePublicAppUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      throw new Error("PUBLIC_APP_URL must use https in production");
    }
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch (error) {
    console.warn(`Ignoring invalid PUBLIC_APP_URL: ${error.message}`);
    return "";
  }
}

function serveStatic(req, res, url) {
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const requested = path.resolve(ROOT, `.${pathname}`);
  if (!requested.startsWith(ROOT)) throw httpError(403, "Forbidden");

  let filePath = requested;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) throw httpError(404, "File not found");
  const ext = path.extname(filePath).toLowerCase();
  const cacheControl = ext === ".html"
    ? "no-store"
    : "public, max-age=31536000, immutable";
  const headers = {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Cache-Control": cacheControl
  };
  const encoding = compressionEncoding(req, ext);
  if (encoding) {
    headers["Content-Encoding"] = encoding;
    headers["Vary"] = "Accept-Encoding";
  }
  res.writeHead(200, headers);
  const stream = fs.createReadStream(filePath);
  if (encoding === "br") return stream.pipe(zlib.createBrotliCompress()).pipe(res);
  if (encoding === "gzip") return stream.pipe(zlib.createGzip()).pipe(res);
  stream.pipe(res);
}

function compressionEncoding(req, ext) {
  if (![".html", ".css", ".js", ".json"].includes(ext)) return "";
  const accepted = String(req.headers["accept-encoding"] || "");
  if (accepted.includes("br")) return "br";
  if (accepted.includes("gzip")) return "gzip";
  return "";
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    if (req.url && req.url.startsWith("/api/")) return sendError(res, error);
    res.writeHead(error.status || 500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(error.message || "Server error");
  }
});

function cleanupRooms() {
  const timestamp = now();
  cleanupPresence();
  for (const [roomId, room] of rooms) {
    markStalePlayers(room);
    const expired = timestamp > room.expiresAt;
    const idle = timestamp - room.updatedAt > ROOM_IDLE_MS;
    const finishedIdle = room.status === "finished" && timestamp - room.updatedAt > 1000 * 60 * 10;
    if (expired || idle || finishedIdle) {
      clearTurnTimer(room);
      for (const waiter of room.waiters) waiter();
      room.waiters.clear();
      rooms.delete(roomId);
    }
  }
}

setInterval(cleanupRooms, ROOM_CLEANUP_MS).unref();

server.listen(PORT, () => {
  console.log(`Scopa multiplayer server: http://localhost:${PORT}`);
});
