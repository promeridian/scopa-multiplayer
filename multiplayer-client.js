(function () {
  "use strict";

  const STORAGE_KEY = "scopaMultiplayerSession";
  const state = {
    room: null,
    seat: null,
    playerToken: null,
    seq: 0,
    polling: false,
    panel: null,
    statusEl: null,
    inviteEl: null,
    onlineRoomsEl: null,
    primaryButton: null,
    leaveButton: null,
    heartbeatTimer: null,
    waitingRefreshTimer: null,
    roomsRefreshTimer: null,
    initialInviteHandled: false,
    joiningInvite: false,
    mode: "friend"
  };

  function api(path, options = {}) {
    return fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      return data;
    });
  }

  function playerName() {
    const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
    const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
    if (user) return [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "Игрок";
    return "Игрок";
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveSession() {
    if (!state.room || !state.playerToken) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      roomId: state.room.roomId,
      seat: state.seat,
      playerToken: state.playerToken,
      seq: state.seq
    }));
  }

  function roomFromUrl() {
    const url = new URL(window.location.href);
    const directRoom = url.searchParams.get("room");
    if (directRoom) return directRoom;
    const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
    const startParam = tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param;
    if (startParam && startParam.startsWith("room_")) return startParam.slice(5);
    return "";
  }

  function ensurePanel() {
    if (state.panel) return;
    const backdrop = document.createElement("section");
    backdrop.className = "settings-panel multiplayer-panel";
    backdrop.hidden = true;
    backdrop.setAttribute("aria-label", "Игра с другом");
    backdrop.innerHTML = `
      <div class="settings-sheet developers-sheet multiplayer-sheet">
        <div class="rules-header">
          <div>
            <p class="eyebrow">Multiplayer</p>
            <h2>Игра с другом</h2>
          </div>
          <button class="icon-button multiplayer-close" type="button" aria-label="Закрыть окно">&times;</button>
        </div>
        <div class="developers-content multiplayer-content">
          <p class="multiplayer-status">Готовим приватную комнату.</p>
          <button class="primary-button multiplayer-primary" type="button">Создать комнату</button>
          <div class="multiplayer-invite" hidden>
            <strong>Ссылка-приглашение</strong>
            <input class="multiplayer-invite-input" type="text" readonly>
            <button class="primary-button multiplayer-share" type="button">Поделиться</button>
          </div>
          <div class="multiplayer-online-rooms" hidden></div>
          <button class="text-button multiplayer-leave" type="button" hidden>Покинуть комнату</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    state.panel = backdrop;
    state.statusEl = backdrop.querySelector(".multiplayer-status");
    state.inviteEl = backdrop.querySelector(".multiplayer-invite");
    state.onlineRoomsEl = backdrop.querySelector(".multiplayer-online-rooms");
    state.primaryButton = backdrop.querySelector(".multiplayer-primary");
    state.leaveButton = backdrop.querySelector(".multiplayer-leave");
    backdrop.querySelector(".multiplayer-close").addEventListener("click", close);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) close();
    });
    state.primaryButton.addEventListener("click", createRoom);
    state.leaveButton.addEventListener("click", () => leaveCurrentRoom({ openLobby: true, mode: state.mode }));
    backdrop.querySelector(".multiplayer-share").addEventListener("click", shareInvite);
  }

  function setStatus(text) {
    ensurePanel();
    state.statusEl.textContent = text;
  }

  function hideInvite() {
    if (!state.inviteEl) return;
    state.inviteEl.hidden = true;
    const inviteInput = state.inviteEl.querySelector("input");
    if (inviteInput) inviteInput.value = "";
  }

  function openLobby() {
    ensurePanel();
    state.mode = "friend";
    state.panel.hidden = false;
    state.panel.querySelector(".rules-header h2").textContent = "Игра с другом";
    state.panel.setAttribute("aria-label", "Игра с другом");
    state.primaryButton.textContent = "Создать комнату";
    hideInvite();
    if (state.onlineRoomsEl) state.onlineRoomsEl.hidden = true;
    stopRoomsRefresh();
    const roomId = roomFromUrl();
    if (roomId) {
      state.joiningInvite = true;
      state.primaryButton.hidden = true;
      hideInvite();
      setStatus("Подключаемся к комнате друга...");
      joinRoom(roomId);
      return;
    }

    state.joiningInvite = false;
    state.primaryButton.hidden = false;
    if (state.leaveButton) state.leaveButton.hidden = !state.room;
    const saved = readSession();
    if (saved.roomId && saved.playerToken) {
      joinRoom(saved.roomId, saved.playerToken);
      return;
    }

    setStatus("Создайте приватную комнату и отправьте ссылку другу в Telegram.");
  }

  function openNetworkMatch() {
    ensurePanel();
    state.mode = "online";
    state.panel.hidden = false;
    state.panel.querySelector(".rules-header h2").textContent = "Игра по сети";
    state.panel.setAttribute("aria-label", "Игра по сети");
    hideInvite();
    state.primaryButton.hidden = false;
    state.primaryButton.textContent = "Поиск игры";
    if (state.leaveButton) state.leaveButton.hidden = !state.room;
    setStatus("Выберите доступную комнату или создайте поиск.");
    refreshPublicRooms();
    startRoomsRefresh();
  }

  function close() {
    if (!state.room) stopRoomsRefresh();
    if (state.panel) state.panel.hidden = true;
  }

  async function createRoom() {
    try {
      if (state.mode === "online") return createPublicSearch();
      if (state.room && state.playerToken) {
        notifyLeave();
        resetLocalSession({ keepPanel: true, resetGame: false });
      }
      state.primaryButton.disabled = true;
      state.primaryButton.textContent = "Создаем...";
      hideInvite();
      setStatus("Создаем комнату...");
      const data = await api("/api/rooms", {
        method: "POST",
        body: JSON.stringify({ playerName: playerName() })
      });
      applyJoin(data);
      if (state.joiningInvite) setStatus(data.room.status === "playing" ? "Друг подключен. Переходим к игре..." : "Вы в комнате. Ждем второго игрока.");
      showInvite(data.inviteUrl);
      setStatus("Комната создана. Ждем второго игрока.");
      poll();
    } catch (error) {
      state.primaryButton.hidden = false;
      state.primaryButton.hidden = false;
      state.primaryButton.textContent = "Создать комнату";
      hideInvite();
      setStatus(`Не удалось создать комнату: ${error.message}`);
    } finally {
      state.primaryButton.disabled = false;
    }
  }

  async function createPublicSearch() {
    try {
      if (state.room && state.playerToken) {
        notifyLeave();
        resetLocalSession({ keepPanel: true, resetGame: false });
      }
      state.mode = "online";
      state.primaryButton.disabled = true;
      state.primaryButton.hidden = true;
      hideInvite();
      if (state.leaveButton) state.leaveButton.hidden = false;
      if (state.onlineRoomsEl) state.onlineRoomsEl.hidden = true;
      setStatus("Создаем публичный поиск...");
      const data = await api("/api/matchmaking/rooms", {
        method: "POST",
        body: JSON.stringify({ playerName: playerName() })
      });
      applyJoin(data);
      setStatus("Вы создали публичную комнату. Ждем второго игрока.");
      poll();
    } catch (error) {
      state.primaryButton.hidden = false;
      setStatus(`Не удалось создать поиск: ${error.message}`);
    } finally {
      state.primaryButton.disabled = false;
    }
  }

  async function joinPublicRoom(roomId) {
    try {
      if (state.room && state.playerToken) {
        notifyLeave();
        resetLocalSession({ keepPanel: true, resetGame: false });
      }
      stopRoomsRefresh();
      state.mode = "online";
      state.primaryButton.disabled = true;
      setStatus("Подключаемся к выбранной комнате...");
      const data = await api("/api/matchmaking/join", {
        method: "POST",
        body: JSON.stringify({ playerName: playerName(), roomId })
      });
      applyJoin(data);
      setStatus("Игрок найден. Переходим к игре...");
      poll();
    } catch (error) {
      state.primaryButton.disabled = false;
      setStatus(`Не удалось подключиться: ${error.message}`);
      refreshPublicRooms();
    }
  }

  async function joinRoom(roomId, token) {
    try {
      ensurePanel();
      state.panel.hidden = false;
      state.primaryButton.disabled = true;
      setStatus("Подключаемся к комнате...");
      const data = await api(`/api/rooms/${encodeURIComponent(roomId)}/join`, {
        method: "POST",
        body: JSON.stringify({ playerName: playerName(), playerToken: token || readSession().playerToken || "" })
      });
      applyJoin(data);
      setStatus(data.room.status === "playing" ? "Друг подключен. Сервер уже принимает и валидирует ходы." : "Вы в комнате. Ждем второго игрока.");
      poll();
    } catch (error) {
      setStatus(`Не удалось подключиться: ${error.message}`);
    } finally {
      state.primaryButton.disabled = false;
    }
  }

  function applyJoin(data) {
    state.room = data.room;
    state.seat = data.seat;
    state.playerToken = data.playerToken;
    state.seq = data.seq || 0;
    if (state.leaveButton) state.leaveButton.hidden = false;
    state.primaryButton.textContent = "Создать новую комнату";
    if (state.mode === "online" && data.room && data.room.status === "waiting") {
      state.primaryButton.hidden = true;
    } else if (!state.joiningInvite || !data.room || data.room.status !== "playing") {
      state.primaryButton.hidden = false;
    }
    if (state.mode === "online" && state.inviteEl) state.inviteEl.hidden = true;
    if (state.onlineRoomsEl) state.onlineRoomsEl.hidden = true;
    saveSession();
    syncGame();
    startHeartbeat();
    startWaitingRefresh();
  }

  function showInvite(inviteUrl) {
    if (!inviteUrl || state.mode !== "friend") {
      if (state.inviteEl) state.inviteEl.hidden = true;
      return;
    }
    const input = state.inviteEl.querySelector("input");
    input.value = inviteUrl;
    state.inviteEl.hidden = false;
    if (isLocalInvite(inviteUrl)) {
      setStatus("Локальная ссылка localhost подходит только для теста на этом компьютере. Для друга нужен HTTPS-домен и PUBLIC_APP_URL на сервере.");
    }
  }

  async function refreshPublicRooms() {
    if (state.mode !== "online" || !state.onlineRoomsEl || state.room) return;
    try {
      const data = await api("/api/matchmaking/rooms");
      renderPublicRooms(data.rooms || []);
    } catch (error) {
      state.onlineRoomsEl.hidden = false;
      state.onlineRoomsEl.innerHTML = `<p class="multiplayer-empty">Не удалось обновить список комнат: ${escapeHtml(error.message)}</p>`;
    }
  }

  function renderPublicRooms(rooms) {
    if (!state.onlineRoomsEl) return;
    state.onlineRoomsEl.hidden = false;
    if (!rooms.length) {
      state.onlineRoomsEl.innerHTML = `<p class="multiplayer-empty">Сейчас никто не ищет игру. Создайте поиск, и другой игрок сможет подключиться.</p>`;
      return;
    }
    state.onlineRoomsEl.innerHTML = `
      <strong>Вы можете присоединиться к этим игрокам</strong>
      <div class="multiplayer-room-list">
        ${rooms.map((room) => `
          <button class="multiplayer-room-item" type="button" data-room-id="${escapeHtml(room.roomId)}">
            <span>${escapeHtml(room.hostName || "Игрок")}</span>
            <em>ждет ${Math.max(0, Number(room.waitingSeconds) || 0)}с</em>
          </button>
        `).join("")}
      </div>
    `;
    for (const button of state.onlineRoomsEl.querySelectorAll(".multiplayer-room-item")) {
      button.addEventListener("click", () => joinPublicRoom(button.dataset.roomId));
    }
  }

  function startRoomsRefresh() {
    stopRoomsRefresh();
    state.roomsRefreshTimer = window.setInterval(refreshPublicRooms, 3000);
  }

  function stopRoomsRefresh() {
    if (!state.roomsRefreshTimer) return;
    window.clearInterval(state.roomsRefreshTimer);
    state.roomsRefreshTimer = null;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  async function shareInvite() {
    const input = state.inviteEl.querySelector("input");
    const text = input.value;
    if (navigator.share && !isLocalInvite(text)) {
      try {
        await navigator.share({ title: "Scopa", text: "Присоединяйся к игре в Скопу", url: text });
        setStatus("Ссылка отправлена.");
        return;
      } catch {
        // Fall back to clipboard when native sharing is cancelled or unavailable.
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      if (isLocalInvite(text)) {
        setStatus("Ссылка скопирована, но localhost не откроется у друга. Нужен HTTPS-адрес приложения.");
        return;
      }
      setStatus("Ссылка скопирована. Отправьте ее другу в Telegram.");
    } catch {
      input.focus();
      input.select();
      setStatus("Скопируйте ссылку и отправьте ее другу в Telegram.");
    }
  }

  async function poll() {
    if (state.polling || !state.room || !state.playerToken) return;
    state.polling = true;
    while (state.polling && state.room && state.playerToken) {
      try {
        const data = await api(`/api/rooms/${encodeURIComponent(state.room.roomId)}/events?since=${state.seq}&token=${encodeURIComponent(state.playerToken)}`);
        state.room = data.room;
        state.seq = data.seq || state.seq;
        for (const event of data.events || []) handleEvent(event);
        saveSession();
        syncGame();
      } catch (error) {
        setStatus(`Связь с сервером потеряна: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  function isLocalInvite(inviteUrl) {
    try {
      const url = new URL(inviteUrl);
      return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
    } catch {
      return false;
    }
  }

  async function submitMove(move) {
    if (!state.room || !state.playerToken) throw new Error("Нет активной сетевой комнаты.");
    const response = await fetch(`/api/rooms/${encodeURIComponent(state.room.roomId)}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerToken: state.playerToken,
        clientMoveId: createClientMoveId(),
        move
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (data.room) {
        state.room = data.room;
        state.seq = data.seq || state.seq;
        saveSession();
        syncGame();
      }
      throw new Error(data.error || "Сервер отклонил ход.");
    }
    state.room = data.room;
    state.seq = data.seq || state.seq;
    if (data.event) handleEvent(data.event);
    saveSession();
    syncGame();
    return data;
  }

  async function sendReaction(reactionId) {
    if (!state.room || !state.playerToken) throw new Error("Нет активной сетевой комнаты.");
    const response = await fetch(`/api/rooms/${encodeURIComponent(state.room.roomId)}/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerToken: state.playerToken,
        reactionId
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Не удалось отправить реакцию.");
    state.room = data.room;
    state.seq = data.seq || state.seq;
    if (data.event) handleEvent(data.event);
    saveSession();
    return data;
  }

  async function sendChatMessage(text) {
    if (!state.room || !state.playerToken) throw new Error("Нет активной сетевой комнаты.");
    const response = await fetch(`/api/rooms/${encodeURIComponent(state.room.roomId)}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerToken: state.playerToken,
        text
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Не удалось отправить сообщение.");
    state.room = data.room;
    state.seq = data.seq || state.seq;
    if (data.event) handleEvent(data.event);
    saveSession();
    return data;
  }

  function createClientMoveId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function syncGame() {
    if (!state.room || !state.seat) return;
    if (!state.room.game && state.mode === "online" && state.room.status === "waiting") {
      if (state.panel) state.panel.hidden = true;
      if (state.onlineRoomsEl) state.onlineRoomsEl.hidden = true;
      stopRoomsRefresh();
      if (window.scopaGameMultiplayer && typeof window.scopaGameMultiplayer.showWaiting === "function") {
        window.scopaGameMultiplayer.showWaiting({ ...state.room, clientReceivedAt: Date.now() }, state.seat);
      }
      return;
    }
    if (!state.room.game) return;
    stopWaitingRefresh();
    state.joiningInvite = false;
    if (state.panel) state.panel.hidden = true;
    if (state.onlineRoomsEl) state.onlineRoomsEl.hidden = true;
    stopRoomsRefresh();
    if (window.scopaGameMultiplayer && typeof window.scopaGameMultiplayer.applyRoom === "function") {
      window.scopaGameMultiplayer.applyRoom({ ...state.room, clientMode: state.mode }, state.seat);
    }
  }

  function startHeartbeat() {
    if (state.heartbeatTimer) return;
    state.heartbeatTimer = window.setInterval(sendHeartbeat, 10000);
    sendHeartbeat();
  }

  async function sendHeartbeat() {
    if (!state.room || !state.playerToken) return;
    try {
      const data = await api(`/api/rooms/${encodeURIComponent(state.room.roomId)}/heartbeat`, {
        method: "POST",
        body: JSON.stringify({ playerToken: state.playerToken })
      });
      state.room = data.room;
      state.seq = data.seq || state.seq;
      saveSession();
      syncGame();
    } catch {
      // Long polling already reports connection loss; heartbeat stays quiet.
    }
  }

  function startWaitingRefresh() {
    if (state.waitingRefreshTimer) return;
    state.waitingRefreshTimer = window.setInterval(() => {
      if (!state.room || !state.playerToken || state.room.game || state.room.status !== "waiting") {
        stopWaitingRefresh();
        return;
      }
      sendHeartbeat();
    }, 1500);
  }

  function stopWaitingRefresh() {
    if (!state.waitingRefreshTimer) return;
    window.clearInterval(state.waitingRefreshTimer);
    state.waitingRefreshTimer = null;
  }

  function notifyLeave() {
    if (!state.room || !state.playerToken) return;
    const url = `/api/rooms/${encodeURIComponent(state.room.roomId)}/leave`;
    const body = JSON.stringify({ playerToken: state.playerToken });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  }

  function resetLocalSession({ keepPanel = false, resetGame = true, clearUrl = true } = {}) {
    state.polling = false;
    stopWaitingRefresh();
    stopRoomsRefresh();
    if (state.heartbeatTimer) {
      window.clearInterval(state.heartbeatTimer);
      state.heartbeatTimer = null;
    }
    localStorage.removeItem(STORAGE_KEY);
    state.room = null;
    state.seat = null;
    state.playerToken = null;
    state.seq = 0;
    state.joiningInvite = false;
    state.mode = "friend";
    hideInvite();
    if (state.onlineRoomsEl) state.onlineRoomsEl.hidden = true;
    if (state.primaryButton) {
      state.primaryButton.hidden = false;
      state.primaryButton.disabled = false;
      state.primaryButton.textContent = "Создать комнату";
    }
    if (state.leaveButton) state.leaveButton.hidden = true;
    if (clearUrl) clearRoomFromUrl();
    if (resetGame && window.scopaGameMultiplayer && typeof window.scopaGameMultiplayer.leaveRoom === "function") {
      window.scopaGameMultiplayer.leaveRoom();
    }
    if (state.panel && !keepPanel) state.panel.hidden = true;
  }

  function clearRoomFromUrl() {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has("room")) return;
      url.searchParams.delete("room");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // URL cleanup is best-effort only.
    }
  }

  function leaveCurrentRoom({ openLobby = false, mode = "" } = {}) {
    const previousMode = mode || state.mode;
    notifyLeave();
    resetLocalSession({ keepPanel: openLobby, resetGame: true });
    if (!openLobby) return;
    ensurePanel();
    if (previousMode === "online") {
      openNetworkMatch();
      setStatus("Вы вышли из поиска. Можно выбрать доступную комнату или создать новый поиск.");
      return;
    }
    openLobby();
    setStatus("Вы вышли из комнаты. Можно создать новую и отправить ссылку другому другу.");
  }

  function switchToFriendInvite() {
    notifyLeave();
    resetLocalSession({ keepPanel: true, resetGame: true });
    openLobby();
    setStatus("Создайте комнату для друга, и появится ссылка-приглашение.");
  }

  function handleEvent(event) {
    state.seq = Math.max(state.seq, event.seq || 0);
    if (window.scopaGameMultiplayer && typeof window.scopaGameMultiplayer.handleEvent === "function") {
      window.scopaGameMultiplayer.handleEvent(event, state.seat);
    }
    if (event.type === "player.joined" && event.payload.seat === "p2") {
      setStatus("Друг подключен. Сервер готов принимать ходы.");
    }
    if (event.type === "player.reconnected") {
      setStatus("Игрок переподключился.");
    }
    if (event.type === "player.offline") {
      setStatus("Игрок отключился. Комната остается доступной для переподключения.");
    }
  }

  window.scopaMultiplayer = {
    openLobby,
    openNetworkMatch,
    joinRoom,
    createRoom,
    leaveRoom: leaveCurrentRoom,
    switchToFriendInvite,
    submitMove,
    sendReaction,
    sendChatMessage
  };

  function openInitialInvite() {
    if (state.initialInviteHandled || !roomFromUrl()) return;
    state.initialInviteHandled = true;
    openLobby();
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", openInitialInvite, { once: true });
  } else {
    window.setTimeout(openInitialInvite, 0);
  }
  window.addEventListener("load", openInitialInvite);
  window.addEventListener("visibilitychange", () => {
    if (!document.hidden && state.room && state.playerToken) {
      sendHeartbeat();
      poll();
    }
  });
  window.addEventListener("focus", () => {
    if (state.room && state.playerToken) {
      sendHeartbeat();
      poll();
    }
  });
  window.addEventListener("pagehide", notifyLeave);
})();
