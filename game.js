(function () {
  "use strict";

  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (tg) {
    tg.ready();
    tg.expand();
  }

  const DONATE_URL = "https://t.me/appsmeridian_bot?start=dl-1777825418218";
  const CHANNEL_URL = "https://t.me/+N-lQ58PBI9ZiMDJi";
  const USE_CARD_IMAGES = true;
  const CARD_ASSET_VERSION = "20260505-20";
  const MUSIC_TRACKS = [
    "./assets/audio/cooking-with-the-italians.mp3",
    "./assets/audio/the-little-cafe.mp3"
  ];
  const AUDIO_SETTINGS_VERSION = 4;
  const LEGACY_DEFAULT_AUDIO_SETTINGS = {
    musicVolume: 28,
    voiceVolume: 90,
    sfxVolume: 70,
    vibrationEnabled: true
  };
  const DEFAULT_AUDIO_SETTINGS = {
    musicVolume: 9,
    voiceVolume: 65,
    sfxVolume: 50,
    vibrationEnabled: true
  };
  const VOLUME_LIMITS = {
    musicVolume: 100,
    voiceVolume: 100,
    sfxVolume: 100
  };
  const VOICE_CLIPS = {
    scopaPlayer: [
      "./assets/audio/voice/player-scopa01.mp3",
      "./assets/audio/voice/player-scopa02.mp3",
      "./assets/audio/voice/player-scopa03.mp3",
      "./assets/audio/voice/player-scopa04.mp3",
      "./assets/audio/voice/player-scopa05.mp3",
      "./assets/audio/voice/player-scopa06.mp3",
      "./assets/audio/voice/player-scopa07.mp3",
      "./assets/audio/voice/player-scopa08.mp3",
      "./assets/audio/voice/player-scopa09.mp3",
      "./assets/audio/voice/player-scopa10.mp3",
      "./assets/audio/voice/player-scopa11.mp3",
      "./assets/audio/voice/player-scopa12.mp3"
    ],
    scopaBot: [
      "./assets/audio/voice/bot-scopa00.mp3",
      "./assets/audio/voice/bot-scopa01.mp3",
      "./assets/audio/voice/bot-scopa02.mp3",
      "./assets/audio/voice/bot-scopa03.mp3",
      "./assets/audio/voice/bot-scopa04.mp3",
      "./assets/audio/voice/bot-scopa05.mp3",
      "./assets/audio/voice/bot-scopa06.mp3",
      "./assets/audio/voice/bot-scopa07.mp3",
      "./assets/audio/voice/bot-scopa08.mp3",
      "./assets/audio/voice/bot-scopa09.mp3",
      "./assets/audio/voice/bot-scopa10.mp3",
      "./assets/audio/voice/bot-scopa11.mp3",
      "./assets/audio/voice/bot-scopa12.mp3",
      "./assets/audio/voice/bot-scopa13.mp3",
      "./assets/audio/voice/bot-scopa14.mp3",
      "./assets/audio/voice/bot-scopa15.mp3",
      "./assets/audio/voice/bot-scopa16.mp3"
    ],
    invalidMove: [
      "./assets/audio/voice/player-error01.mp3",
      "./assets/audio/voice/player-error02.mp3",
      "./assets/audio/voice/player-error03.mp3",
      "./assets/audio/voice/player-error04.mp3",
      "./assets/audio/voice/player-error05.mp3",
      "./assets/audio/voice/player-error06.mp3",
      "./assets/audio/voice/player-error07.mp3",
      "./assets/audio/voice/player-error08.mp3",
      "./assets/audio/voice/player-error09.mp3",
      "./assets/audio/voice/player-error10.mp3",
      "./assets/audio/voice/player-error11.mp3",
      "./assets/audio/voice/player-error12.mp3",
      "./assets/audio/voice/player-error13.mp3",
      "./assets/audio/voice/player-error14.mp3",
      "./assets/audio/voice/player-error15.mp3",
      "./assets/audio/voice/player-error16.mp3",
      "./assets/audio/voice/player-error17.mp3",
      "./assets/audio/voice/player-error18.mp3",
      "./assets/audio/voice/player-error19.mp3"
    ],
    mustTakeSingle: [
      "./assets/audio/voice/player-card-no-sum01.mp3",
      "./assets/audio/voice/player-card-no-sum02.mp3",
      "./assets/audio/voice/player-card-no-sum03.mp3",
      "./assets/audio/voice/player-card-no-sum04.mp3",
      "./assets/audio/voice/player-card-no-sum05.mp3",
      "./assets/audio/voice/player-card-no-sum06.mp3",
      "./assets/audio/voice/player-card-no-sum07.mp3"
    ],
    settebello: [
      "./assets/audio/voice/settebello01.mp3",
      "./assets/audio/voice/settebello02.mp3",
      "./assets/audio/voice/settebello03.mp3",
      "./assets/audio/voice/settebello04.mp3",
      "./assets/audio/voice/settebello05.mp3",
      "./assets/audio/voice/settebello06.mp3",
      "./assets/audio/voice/settebello07.mp3",
      "./assets/audio/voice/settebello08.mp3",
      "./assets/audio/voice/settebello09.mp3",
      "./assets/audio/voice/settebello10.mp3"
    ],
    roundWinPlayer: [
      "./assets/audio/voice/round-win-player01.mp3",
      "./assets/audio/voice/round-win-player02.mp3",
      "./assets/audio/voice/round-win-player03.mp3",
      "./assets/audio/voice/round-win-player04.mp3",
      "./assets/audio/voice/round-win-player05.mp3",
      "./assets/audio/voice/round-win-player06.mp3",
      "./assets/audio/voice/round-win-player07.mp3",
      "./assets/audio/voice/round-win-player08.mp3"
    ],
    roundWinBot: [
      "./assets/audio/voice/round-win-bot01.mp3",
      "./assets/audio/voice/round-win-bot02.mp3",
      "./assets/audio/voice/round-win-bot03.mp3",
      "./assets/audio/voice/round-win-bot04.mp3",
      "./assets/audio/voice/round-win-bot05.mp3",
      "./assets/audio/voice/round-win-bot06.mp3",
      "./assets/audio/voice/round-win-bot07.mp3",
      "./assets/audio/voice/round-win-bot08.mp3"
    ],
    matchWinPlayer: [
      "./assets/audio/voice/match-win-player01.mp3",
      "./assets/audio/voice/match-win-player02.mp3",
      "./assets/audio/voice/match-win-player03.mp3",
      "./assets/audio/voice/match-win-player04.mp3",
      "./assets/audio/voice/match-win-player05.mp3",
      "./assets/audio/voice/match-win-player06.mp3",
      "./assets/audio/voice/match-win-player07.mp3",
      "./assets/audio/voice/match-win-player08.mp3",
      "./assets/audio/voice/match-win-player09.mp3",
      "./assets/audio/voice/match-win-player10.mp3"
    ],
    matchLosePlayer: [
      "./assets/audio/voice/match-lose-player01.mp3",
      "./assets/audio/voice/match-lose-player02.mp3",
      "./assets/audio/voice/match-lose-player03.mp3",
      "./assets/audio/voice/match-lose-player04.mp3",
      "./assets/audio/voice/match-lose-player05.mp3",
      "./assets/audio/voice/match-lose-player06.mp3",
      "./assets/audio/voice/match-lose-player07.mp3",
      "./assets/audio/voice/match-lose-player08.mp3"
    ],
    dealChatterRare: [
      "./assets/audio/voice/deal-chatter-rare01.mp3",
      "./assets/audio/voice/deal-chatter-rare02.mp3"
    ]
  };
  const audioSettings = loadAudioSettings();
  const sound = createSoundEngine(audioSettings.sfxVolume);
  const music = createMusicPlayer(MUSIC_TRACKS, audioSettings.musicVolume);
  const voice = createVoicePlayer(VOICE_CLIPS, audioSettings.voiceVolume, {
    onStart: () => music.duck(),
    onEnd: () => music.restore()
  });

  const suits = [
    { id: "denari", name: "Пентакли", icon: "?" },
    { id: "coppe", name: "Кубки", icon: "¦" },
    { id: "spade", name: "Мечи", icon: "¦" },
    { id: "bastoni", name: "Жезлы", icon: "¦" }
  ];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const rankNames = { 1: "Туз", 8: "Валет", 9: "Рыцарь", 10: "Король" };
  const suitNamesGenitive = {
    denari: "пентаклей",
    coppe: "кубков",
    spade: "мечей",
    bastoni: "жезлов"
  };
  const MULTIPLAYER_REACTIONS = [
    { id: "thumbsUp", emoji: "👍", label: "Палец вверх" },
    { id: "shock", emoji: "😮", label: "Шок" },
    { id: "angry", emoji: "😤", label: "Возмущение" },
    { id: "laugh", emoji: "😂", label: "Смех" }
  ];
  const primiera = { 7: 21, 6: 18, 1: 16, 5: 15, 4: 14, 3: 13, 2: 12, 8: 10, 9: 10, 10: 10 };

  const playerScoreEl = document.getElementById("playerScore");
  const appShell = document.querySelector(".app-shell");
  const topbar = document.querySelector(".topbar");
  const tableZone = document.querySelector(".table-zone");
  const botScoreEl = document.getElementById("botScore");
  const playerScoreLabel = document.querySelector(".score-player span");
  const botScoreLabel = document.querySelector(".score-bot span");
  const opponentSectionLabel = document.querySelector(".opponent .section-label");
  const opponentAvatar = document.querySelector(".bot-avatar-ui");
  const opponentOnlineBadge = createOpponentOnlineBadge();
  const playerAvatarCounter = document.getElementById("playerAvatarCounter");
  const botAvatarCounter = document.getElementById("botAvatarCounter");
  const deckCountEl = document.getElementById("deckCount");
  const botHandEl = document.getElementById("botHand");
  const playerScopaEl = document.getElementById("playerScopa");
  const botScopaEl = document.getElementById("botScopa");
  const tableSumEl = document.getElementById("tableSum");
  const tableCardsEl = document.getElementById("tableCards");
  const playerHandEl = document.getElementById("playerHand");
  const playButton = document.getElementById("playButton");
  const statusText = document.getElementById("statusText");
  const roundPanel = document.getElementById("roundPanel");
  const roundBreakdown = document.getElementById("roundBreakdown");
  const nextRoundButton = document.getElementById("nextRoundButton");
  const newMatchButton = document.getElementById("newMatchButton");
  const backHomeButton = document.getElementById("backHomeButton");
  const musicButton = document.getElementById("musicButton");
  const settingsButton = document.getElementById("settingsButton");
  const settingsPanel = document.getElementById("settingsPanel");
  const closeSettingsButton = document.getElementById("closeSettingsButton");
  const developersPanel = document.getElementById("developersPanel");
  const closeDevelopersButton = document.getElementById("closeDevelopersButton");
  const supportFeaturePanel = document.getElementById("supportFeaturePanel");
  const closeSupportFeatureButton = document.getElementById("closeSupportFeatureButton");
  const musicVolume = document.getElementById("musicVolume");
  const voiceVolume = document.getElementById("voiceVolume");
  const sfxVolume = document.getElementById("sfxVolume");
  const vibrationToggle = document.getElementById("vibrationToggle");
  const musicVolumeValue = document.getElementById("musicVolumeValue");
  const voiceVolumeValue = document.getElementById("voiceVolumeValue");
  const sfxVolumeValue = document.getElementById("sfxVolumeValue");
  const channelButton = document.getElementById("channelButton");
  const donateButton = document.getElementById("donateButton");
  const rulesButton = document.getElementById("rulesButton");
  const topRulesCardButton = document.getElementById("topRulesCardButton");
  const rulesPanel = document.getElementById("rulesPanel");
  const closeRulesButton = document.getElementById("closeRulesButton");
  const loadingScreen = document.getElementById("loadingScreen");
  const homeScreen = document.getElementById("homeScreen");
  const quickPlayButton = document.getElementById("quickPlayButton");
  const homeChannelButton = document.getElementById("homeChannelButton");
  const homeRulesButton = document.getElementById("homeRulesButton");
  const homeSoundButton = document.getElementById("homeSoundButton");
  const homeSettingsButton = document.getElementById("homeSettingsButton");
  const homeNewMatchButton = document.getElementById("homeNewMatchButton");
  const homeOnlineButton = document.getElementById("homeOnlineButton");
  const homeFriendButton = document.getElementById("homeFriendButton");
  const homeOnlineStats = document.getElementById("homeOnlineStats");
  const homeDevelopersButton = document.getElementById("homeDevelopersButton");
  const scopaCelebration = document.getElementById("scopaCelebration");
  const scopaCelebrationText = document.getElementById("scopaCelebrationText");
  const confettiLayer = document.getElementById("confettiLayer");
  const modalBackdrop = document.getElementById("modalBackdrop");

  let match;
  const multiplayerSession = {
    active: false,
    roomId: null,
    seat: null,
    pendingMove: false,
    resultOpen: false,
    timeoutNotice: null,
    waitingMode: ""
  };
  const multiplayerGameStatus = createMultiplayerGameStatus();
  let multiplayerTurnTimer = null;
  let multiplayerWaitingTimer = null;
  const multiplayerReactionTimers = { player: null, opponent: null };
  let multiplayerChatMessages = [];
  let homeStatsTimer = null;
  let appPresenceClientId = "";
  const multiplayerWaitingOverlay = createMultiplayerWaitingOverlay();
  const multiplayerReactionBubbles = createMultiplayerReactionBubbles();
  const multiplayerChatPanel = createMultiplayerChatPanel();

  function createDeck() {
    const deck = [];
    for (const suit of suits) {
      for (let i = 0; i < ranks.length; i += 1) {
        deck.push({
          id: `${suit.id}-${ranks[i]}`,
          suit: suit.id,
          suitName: suit.name,
          icon: suit.icon,
          rank: ranks[i],
          value: i + 1
        });
      }
    }
    return shuffle(deck);
  }

  function shuffle(deck) {
    const copy = deck.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function newMatch() {
    multiplayerSession.active = false;
    multiplayerSession.roomId = null;
    multiplayerSession.seat = null;
    multiplayerSession.pendingMove = false;
    multiplayerSession.resultOpen = false;
    multiplayerSession.timeoutNotice = null;
    multiplayerSession.waitingMode = "";
    hideMultiplayerWaiting();
    multiplayerGameStatus.hidden = true;
    hideMultiplayerReaction();
    hideMultiplayerChat();
    if (playerScoreLabel) playerScoreLabel.textContent = "Вы";
    if (botScoreLabel) botScoreLabel.textContent = "Бот";
    if (opponentSectionLabel) opponentSectionLabel.textContent = "Рука бота";
    if (opponentAvatar) opponentAvatar.alt = "Бот";
    updateOpponentPresence(null);
    sound.play("deal");
    match = { scores: { player: 0, bot: 0 }, roundNumber: 0, round: null };
    startRound();
  }

  function leaveMultiplayerRoom() {
    multiplayerSession.active = false;
    multiplayerSession.roomId = null;
    multiplayerSession.seat = null;
    multiplayerSession.pendingMove = false;
    multiplayerSession.resultOpen = false;
    multiplayerSession.timeoutNotice = null;
    multiplayerSession.waitingMode = "";
    hideMultiplayerWaiting();
    multiplayerGameStatus.hidden = true;
    hideMultiplayerReaction();
    hideMultiplayerChat();
    if (multiplayerTurnTimer) {
      window.clearInterval(multiplayerTurnTimer);
      multiplayerTurnTimer = null;
    }
    updateTurnHighlight(null);
    if (playerScoreLabel) playerScoreLabel.textContent = "Вы";
    if (botScoreLabel) botScoreLabel.textContent = "Бот";
    if (opponentSectionLabel) opponentSectionLabel.textContent = "Рука бота";
    if (opponentAvatar) opponentAvatar.alt = "Бот";
    updateOpponentPresence(null);
    roundPanel.hidden = true;
    modalBackdrop.hidden = true;
    homeScreen.classList.remove("hidden");
    setStatus("Вы вышли из сетевой комнаты. Можно создать новую комнату или играть с ботом.", "");
  }

  function startRound() {
    match.roundNumber += 1;
    const deck = createDeck();
    match.round = {
      deck,
      table: deck.splice(0, 4),
      playerHand: deck.splice(0, 3),
      botHand: deck.splice(0, 3),
      captures: { player: [], bot: [] },
      scope: { player: 0, bot: 0 },
      selectedHandId: null,
      selectedTableIds: new Set(),
      lastCapture: null,
      nextBotDelay: 650,
      turn: "player",
      ended: false
    };
    roundPanel.hidden = true;
    setStatus("Выберите карту. Для взятки отметьте карты на столе с такой же суммой.", "");
    render();
    preloadRoundImages();
    hideLoading();
    if (Math.random() < 0.18) voice.play("dealChatterRare", 700);
  }

  function render() {
    const round = match.round;
    playerScoreEl.textContent = String(match.scores.player);
    botScoreEl.textContent = String(match.scores.bot);
    playerAvatarCounter.textContent = String(match.scores.player);
    botAvatarCounter.textContent = String(match.scores.bot);
    deckCountEl.textContent = String(round.deck.length);
    playerScopaEl.textContent = String(round.scope.player);
    botScopaEl.textContent = String(round.scope.bot);

    botHandEl.innerHTML = "";
    for (let i = 0; i < round.botHand.length; i += 1) {
      const back = document.createElement("div");
      back.className = "card-back";
      botHandEl.appendChild(back);
    }

    tableSumEl.textContent = String(sumCards(round.table.filter((card) => round.selectedTableIds.has(card.id))));
    tableCardsEl.innerHTML = "";
    if (round.table.length === 0) {
      tableCardsEl.appendChild(emptyText("Стол пуст"));
    } else {
      for (const card of round.table) {
        tableCardsEl.appendChild(cardButton(card, "table"));
      }
    }

    playerHandEl.innerHTML = "";
    for (const card of round.playerHand) {
      playerHandEl.appendChild(cardButton(card, "hand"));
    }

    playButton.disabled = !round.selectedHandId || round.turn !== "player" || round.ended || multiplayerSession.pendingMove;
    playButton.textContent = round.selectedTableIds.size > 0 ? "Забрать" : "Положить";
  }

  function cardButton(card, zone) {
    const round = match.round;
    const button = document.createElement("button");
    const selected = zone === "hand" ? round.selectedHandId === card.id : round.selectedTableIds.has(card.id);
    button.type = "button";
    button.className = `card ${card.suit}${selected ? " selected" : ""}`;
    button.dataset.cardId = card.id;
    button.dataset.zone = zone;
    button.setAttribute("aria-label", `${displayRank(card)} ${card.suitName}`);
    if (USE_CARD_IMAGES) {
      button.classList.add("card-image-button");
      button.innerHTML = `<img class="card-image" src="${cardImagePath(card)}" alt="" loading="eager" decoding="async">`;
    } else {
      button.innerHTML = `
        <span class="card-corner card-corner-top"><span>${card.rank}</span><span>${card.icon}</span></span>
        ${card.value <= 7 ? pipGrid(card) : courtArt(card)}
        <span class="card-corner card-corner-bottom"><span>${card.rank}</span><span>${card.icon}</span></span>
      `;
    }
    button.addEventListener("click", () => {
      if (round.turn !== "player" || round.ended || multiplayerSession.pendingMove) return;
      if (zone === "hand") selectHand(card.id);
      else toggleTable(card.id);
    });
    return button;
  }

  function cardImagePath(card) {
    return `./assets/cards/${card.suit}-${card.value}.png?v=${CARD_ASSET_VERSION}`;
  }

  function preloadRoundImages() {
    if (!USE_CARD_IMAGES || !match || !match.round) return;
    const round = match.round;
    const cards = [...round.table, ...round.playerHand, ...round.botHand];
    for (const card of cards) preloadImage(cardImagePath(card));
  }

  function preloadImage(src) {
    if (!src) return;
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    if (typeof image.decode === "function") image.decode().catch(() => {});
  }

  function pipGrid(card) {
    const pips = Array.from({ length: card.value }, (_, index) => {
      const slot = pipSlots(card.value)[index];
      return `<span class="pip ${slot}">${card.icon}</span>`;
    }).join("");
    return `<span class="pip-grid pips-${card.value}" aria-hidden="true">${pips}</span>`;
  }

  function pipSlots(value) {
    return {
      1: ["center"],
      2: ["top-center", "bottom-center"],
      3: ["top-center", "center", "bottom-center"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
      6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
      7: ["top-left", "top-right", "middle-left", "middle-right", "center", "bottom-left", "bottom-right"]
    }[value];
  }

  function courtArt(card) {
    const title = displayRank(card);
    const crest = card.value === 8 ? "V" : card.value === 9 ? "R" : "K";
    return `
      <span class="court-art" aria-hidden="true">
        <span class="court-crest">${crest}</span>
        <span class="court-head"></span>
        <span class="court-body"></span>
        <span class="court-prop">${card.icon}</span>
        <span class="court-title">${title}</span>
      </span>
    `;
  }

  function emptyText(text) {
    const item = document.createElement("div");
    item.className = "section-label";
    item.textContent = text;
    return item;
  }

  function displayRank(card) {
    return rankNames[card.rank] || card.rank;
  }

  function selectHand(cardId) {
    const round = match.round;
    round.selectedHandId = round.selectedHandId === cardId ? null : cardId;
    round.selectedTableIds.clear();
    sound.play("tap");
    setStatus("Теперь выберите карты на столе с такой же суммой или сыграйте карту без взятки.", "");
    render();
  }

  function toggleTable(cardId) {
    const round = match.round;
    if (!round.selectedHandId) {
      sound.play("warn");
      triggerHaptic("error");
      setStatus("Сначала выберите карту из руки.", "warn");
      return;
    }
    if (round.selectedTableIds.has(cardId)) round.selectedTableIds.delete(cardId);
    else round.selectedTableIds.add(cardId);
    sound.play("tap");
    render();
  }

  function playSelected() {
    if (multiplayerSession.active) return playSelectedMultiplayer();

    const round = match.round;
    clearCardSelectionDom();
    const card = removeById(round.playerHand, round.selectedHandId);
    if (!card) return;

    const picked = round.table.filter((tableCard) => round.selectedTableIds.has(tableCard.id));
    const selectedSum = sumCards(picked);
    if (picked.length > 0 && selectedSum !== card.value) {
      round.playerHand.push(card);
      sound.play("warn");
      triggerHaptic("error");
      voice.play("invalidMove");
      setStatus(`Сумма выбранных карт ${selectedSum}, нужна ${card.value}.`, "warn");
      render();
      return;
    }

    const exactTableCard = round.table.find((tableCard) => tableCard.value === card.value);
    if (picked.length > 1 && exactTableCard) {
      round.playerHand.push(card);
      sound.play("warn");
      triggerHaptic("error");
      voice.play("mustTakeSingle");
      setStatus(`По правилам нужно взять одиночную карту ${displayCard(exactTableCard)}.`, "warn");
      render();
      return;
    }

    if (picked.length === 0 && captureOptions(card, round.table).length > 0) {
      round.playerHand.push(card);
      sound.play("warn");
      triggerHaptic("error");
      voice.play("invalidMove");
      setStatus("Эта карта может быть сыграна, сбросить ее нельзя!", "warn");
      render();
      return;
    }

    if (picked.length === 0) {
      round.table.push(card);
      sound.play("place");
      setStatus(`Вы положили ${displayCard(card)} на стол.`, "");
    } else {
      capture("player", card, picked);
      sound.play("capture");
      triggerHaptic("capture");
      setStatus(`Вы взяли ${formatCardCount(picked.length + 1)}.`, "win");
    }

    round.selectedHandId = null;
    round.selectedTableIds.clear();
    render();
    afterTurn();
  }

  function playSelectedMultiplayer() {
    const round = match.round;
    if (!round || !round.selectedHandId || round.turn !== "player" || round.ended || multiplayerSession.pendingMove) return;
    if (!window.scopaMultiplayer || typeof window.scopaMultiplayer.submitMove !== "function") {
      setStatus("Сетевое подключение еще не готово.", "warn");
      return;
    }

    const move = {
      type: "playCard",
      cardId: round.selectedHandId,
      tableCardIds: Array.from(round.selectedTableIds)
    };
    multiplayerSession.pendingMove = true;
    playButton.disabled = true;
    setStatus("Отправляем ход на сервер...", "");
    window.scopaMultiplayer.submitMove(move)
      .then(() => {
        sound.play(move.tableCardIds.length > 0 ? "capture" : "place");
      })
      .catch((error) => {
        multiplayerSession.pendingMove = false;
        sound.play("warn");
        triggerHaptic("error");
        setStatus(error.message || "Сервер отклонил ход.", "warn");
        render();
      });
  }

  function capture(owner, card, tableCards) {
    const round = match.round;
    const ids = new Set(tableCards.map((item) => item.id));
    round.table = round.table.filter((item) => !ids.has(item.id));
    round.captures[owner].push(card, ...tableCards);
    round.lastCapture = owner;
    const hasSettebelloCapture = owner === "player" && [card, ...tableCards].some((item) => item.suit === "denari" && item.value === 7);
    const madeScopa = round.table.length === 0 && (round.deck.length > 0 || round.playerHand.length > 0 || round.botHand.length > 0);
    if (madeScopa) {
      round.scope[owner] += 1;
      sound.play("scopa");
      voice.play(owner === "player" ? "scopaPlayer" : "scopaBot");
      showScopaCelebration(owner);
      triggerScopaImpact();
      if (owner === "player") round.nextBotDelay = Math.max(round.nextBotDelay, 3000);
    }
    if (hasSettebelloCapture) {
      round.nextBotDelay = Math.max(round.nextBotDelay, madeScopa ? 3500 : 2200);
      triggerRareImpact("settebello");
      voice.play("settebello", madeScopa ? 1000 : 0);
    }
  }

  function afterTurn() {
    if (multiplayerSession.active) return;
    const round = match.round;
    if (round.playerHand.length === 0 && round.botHand.length === 0) {
      if (round.deck.length > 0) dealHands();
      else return endRound();
    }

    const delay = round.nextBotDelay || 650;
    round.nextBotDelay = 650;
    round.turn = "bot";
    setTimeout(botTurn, delay);
  }

  function dealHands() {
    if (multiplayerSession.active) return;
    const round = match.round;
    round.playerHand = round.deck.splice(0, 3);
    round.botHand = round.deck.splice(0, 3);
    sound.play("deal");
    setStatus("Новая сдача. Ваш ход.", "");
    round.turn = "player";
    preloadRoundImages();
    render();
  }

  function botTurn() {
    if (multiplayerSession.active) return;
    const round = match.round;
    if (round.ended) return;
    const move = chooseBotMove();
    const card = removeById(round.botHand, move.card.id);

    if (move.capture.length > 0) {
      capture("bot", card, move.capture);
      sound.play("capture");
      setStatus(`Бот сыграл ${displayCard(card)} и взял ${formatCardCount(move.capture.length)}.`, "warn");
    } else {
      round.table.push(card);
      sound.play("place");
      setStatus(`Бот положил ${displayCard(card)}. Ваш ход.`, "");
    }

    if (round.playerHand.length === 0 && round.botHand.length === 0) {
      if (round.deck.length > 0) dealHands();
      else return endRound();
    } else {
      round.turn = "player";
    }
    render();
  }

  function chooseBotMove() {
    const round = match.round;
    const moves = [];
    for (const card of round.botHand) {
      const captures = captureOptions(card, round.table);
      if (captures.length === 0) {
        moves.push({ card, capture: [], score: discardScore(card) });
      } else {
        for (const captureSet of captures) {
          moves.push({ card, capture: captureSet, score: botScoreMove(card, captureSet, round.table.length) });
        }
      }
    }
    moves.sort((a, b) => b.score - a.score);
    return moves[0];
  }

  function captureOptions(card, table) {
    const results = [];
    const exact = table.filter((tableCard) => tableCard.value === card.value);
    if (exact.length > 0) return exact.map((tableCard) => [tableCard]);

    const total = 1 << table.length;
    for (let mask = 1; mask < total; mask += 1) {
      const set = [];
      for (let i = 0; i < table.length; i += 1) {
        if (mask & (1 << i)) set.push(table[i]);
      }
      if (sumCards(set) === card.value) results.push(set);
    }
    return results;
  }

  function botScoreMove(card, captureSet, tableSize) {
    const cards = [card, ...captureSet];
    let score = cards.length * 2;
    if (cards.some((item) => item.suit === "denari")) score += 4;
    if (cards.some((item) => item.suit === "denari" && item.value === 7)) score += 20;
    if (captureSet.length === tableSize) score += 9;
    score += cards.reduce((sum, item) => sum + (primiera[item.rank] || 0) / 10, 0);
    return score;
  }

  function discardScore(card) {
    let score = -card.value;
    if (card.suit === "denari") score -= 3;
    if (card.suit === "denari" && card.value === 7) score -= 30;
    return score;
  }

  function endRound() {
    const round = match.round;
    if (round.lastCapture && round.table.length > 0) {
      round.captures[round.lastCapture].push(...round.table);
      round.table = [];
    }
    round.ended = true;
    const result = scoreRound(round);
    match.scores.player += result.player.total;
    match.scores.bot += result.bot.total;
    const isMatchOver = match.scores.player >= 11 || match.scores.bot >= 11;
    const isTie = isMatchOver && match.scores.player === match.scores.bot;
    showRoundPanel(result, isMatchOver);
    if (isMatchOver && match.scores.player > match.scores.bot) {
      sound.play("victory");
      showScopaCelebration("victory");
      triggerRareImpact("victory");
      voice.play("matchWinPlayer", 800);
    } else {
      sound.play("round");
      if (isMatchOver) {
        if (!isTie) voice.play("matchLosePlayer", 800);
      } else if (result.player.total > result.bot.total) voice.play("roundWinPlayer", 600);
      else if (result.bot.total > result.player.total) voice.play("roundWinBot", 600);
    }
    setStatus(match.scores.player >= 11 || match.scores.bot >= 11 ? "Матч завершен. Можно начать новый." : "Раунд завершен.", "win");
    render();
  }

  function scoreRound(round) {
    const player = scoreBase(round.captures.player, round.scope.player);
    const bot = scoreBase(round.captures.bot, round.scope.bot);

    if (round.captures.player.length > round.captures.bot.length) player.cards = 1;
    else if (round.captures.bot.length > round.captures.player.length) bot.cards = 1;

    const playerDenari = round.captures.player.filter((card) => card.suit === "denari").length;
    const botDenari = round.captures.bot.filter((card) => card.suit === "denari").length;
    if (playerDenari > botDenari) player.denari = 1;
    else if (botDenari > playerDenari) bot.denari = 1;

    if (hasSettebello(round.captures.player)) player.settebello = 1;
    if (hasSettebello(round.captures.bot)) bot.settebello = 1;

    const playerPrimiera = primieraTotal(round.captures.player);
    const botPrimiera = primieraTotal(round.captures.bot);
    if (playerPrimiera > botPrimiera) player.primiera = 1;
    else if (botPrimiera > playerPrimiera) bot.primiera = 1;

    player.total = player.cards + player.denari + player.settebello + player.primiera + player.scopa;
    bot.total = bot.cards + bot.denari + bot.settebello + bot.primiera + bot.scopa;
    player.primieraValue = playerPrimiera;
    bot.primieraValue = botPrimiera;
    player.cardCount = round.captures.player.length;
    bot.cardCount = round.captures.bot.length;
    player.denariCount = playerDenari;
    bot.denariCount = botDenari;
    return { player, bot };
  }

  function scoreBase(cards, scopa) {
    return { cards: 0, denari: 0, settebello: 0, primiera: 0, scopa };
  }

  function hasSettebello(cards) {
    return cards.some((card) => card.suit === "denari" && card.value === 7);
  }

  function primieraTotal(cards) {
    let total = 0;
    for (const suit of suits) {
      const best = cards
        .filter((card) => card.suit === suit.id)
        .reduce((max, card) => Math.max(max, primiera[card.rank] || 0), 0);
      total += best;
    }
    return total;
  }

  function applyMultiplayerRoom(room, seat) {
    if (!room || !room.game || !room.game.round || !seat) return;

    hideMultiplayerWaiting();
    if (multiplayerSession.roomId && multiplayerSession.roomId !== room.roomId) clearMultiplayerChat();
    const game = room.game;
    const round = game.round;
    const opponent = seat === "p1" ? "p2" : "p1";
    multiplayerSession.active = true;
    multiplayerSession.roomId = room.roomId;
    multiplayerSession.seat = seat;
    multiplayerSession.waitingMode = room.clientMode || "";
    multiplayerSession.pendingMove = false;
    updateMultiplayerGameStatus(room, game, round);
    showMultiplayerChat();
    updateOpponentPresence(room);
    updateTurnHighlight(round.turn === seat ? "player" : "opponent");
    if (playerScoreLabel) playerScoreLabel.textContent = "Вы";
    if (botScoreLabel) botScoreLabel.textContent = "Друг";
    if (opponentSectionLabel) opponentSectionLabel.textContent = "Рука друга";
    if (opponentAvatar) opponentAvatar.alt = "Друг";

    match = {
      scores: {
        player: game.scores[seat] || 0,
        bot: game.scores[opponent] || 0
      },
      roundNumber: game.roundNumber,
      round: {
        deck: placeholderCards("deck", round.deckCount),
        table: round.table || [],
        playerHand: round.hand || [],
        botHand: placeholderCards("opponent", round.opponentHandCount),
        captures: { player: [], bot: [] },
        scope: {
          player: (round.scopa && round.scopa[seat]) || 0,
          bot: (round.scopa && round.scopa[opponent]) || 0
        },
        selectedHandId: null,
        selectedTableIds: new Set(),
        lastCapture: null,
        nextBotDelay: 0,
        turn: round.turn === seat ? "player" : "bot",
        ended: round.ended || game.status === "finished"
      }
    };

    if (!multiplayerSession.resultOpen) {
      roundPanel.hidden = true;
      modalBackdrop.hidden = true;
    }
    homeScreen.classList.add("hidden");
    hideLoading();

    const timeoutNotice = getActiveTimeoutNotice();
    if (timeoutNotice) {
      setStatus(timeoutNotice.text, timeoutNotice.mode);
    } else if (game.status === "finished") {
      const winnerText = game.winner === seat ? "Вы выиграли матч." : "Друг выиграл матч.";
      setStatus(`${winnerText} Можно создать новую комнату.`, game.winner === seat ? "win" : "warn");
    } else if (isOpponentOffline(room)) {
      setStatus("Друг не онлайн. Ждем переподключения.", "warn");
    } else if (match.round.turn === "player") {
      setStatus("Ваш ход. Выберите карту и карты на столе, затем подтвердите ход.", "");
    } else {
      setStatus("Ход друга. Ждем ответ сервера.", "warn");
    }
    render();
  }

  function placeholderCards(prefix, count) {
    return Array.from({ length: Math.max(0, Number(count) || 0) }, (_, index) => ({ id: `${prefix}-${index}` }));
  }

  function createMultiplayerGameStatus() {
    const item = document.createElement("div");
    item.className = "multiplayer-game-status";
    item.hidden = true;
    item.setAttribute("aria-live", "polite");
    if (topbar && topbar.parentNode) topbar.parentNode.insertBefore(item, topbar.nextSibling);
    return item;
  }

  function createMultiplayerWaitingOverlay() {
    const item = document.createElement("div");
    item.className = "multiplayer-waiting-overlay";
    item.hidden = true;
    item.innerHTML = `
      <div class="multiplayer-waiting-spinner" aria-hidden="true"></div>
      <strong>Ищем игрока</strong>
      <span class="multiplayer-waiting-time">0с</span>
      <p>Комната видна в списке игры по сети.</p>
      <button class="text-button multiplayer-waiting-friend" type="button" hidden>Перейти в игру с другом</button>
    `;
    tableZone.appendChild(item);
    item.querySelector(".multiplayer-waiting-friend").addEventListener("click", () => {
      if (window.scopaMultiplayer && typeof window.scopaMultiplayer.switchToFriendInvite === "function") {
        window.scopaMultiplayer.switchToFriendInvite();
      }
    });
    return item;
  }

  function createMultiplayerReactionBubbles() {
    return {
      player: createMultiplayerReactionBubble("player"),
      opponent: createMultiplayerReactionBubble("opponent")
    };
  }

  function createMultiplayerReactionBubble(side) {
    const item = document.createElement("div");
    item.className = `multiplayer-reaction-bubble ${side}`;
    item.hidden = true;
    item.setAttribute("aria-live", "polite");
    const target = side === "player" ? document.querySelector(".hand-zone") : document.querySelector(".opponent");
    (target || tableZone).appendChild(item);
    return item;
  }

  function createMultiplayerChatPanel() {
    const item = document.createElement("section");
    item.className = "multiplayer-chat";
    item.hidden = true;
    item.setAttribute("aria-label", "Миничат");
    item.innerHTML = `
      <div class="multiplayer-chat-log" aria-live="polite"></div>
      <form class="multiplayer-chat-form">
        <input class="multiplayer-chat-input" type="text" maxlength="120" autocomplete="off" placeholder="Сообщение другу">
        <button class="multiplayer-chat-send" type="submit">Отпр.</button>
      </form>
    `;
    const handZone = document.querySelector(".hand-zone");
    if (handZone && handZone.parentNode) {
      handZone.parentNode.insertBefore(item, handZone.nextSibling);
    } else if (multiplayerGameStatus.parentNode) {
      multiplayerGameStatus.parentNode.insertBefore(item, multiplayerGameStatus.nextSibling);
    }
    item.querySelector(".multiplayer-chat-form").addEventListener("submit", (event) => {
      event.preventDefault();
      sendMultiplayerChatMessage();
    });
    return item;
  }

  function showMultiplayerWaiting(room, seat) {
    multiplayerSession.active = true;
    multiplayerSession.roomId = room && room.roomId;
    multiplayerSession.seat = seat;
    multiplayerSession.pendingMove = false;
    multiplayerSession.resultOpen = false;
    multiplayerSession.timeoutNotice = null;
    multiplayerSession.waitingMode = "online";
    homeScreen.classList.add("hidden");
    hideLoading();
    roundPanel.hidden = true;
    modalBackdrop.hidden = true;
    updateTurnHighlight(null);
    updateOpponentPresence(null);
    if (playerScoreLabel) playerScoreLabel.textContent = "Вы";
    if (botScoreLabel) botScoreLabel.textContent = "Друг";
    if (opponentSectionLabel) opponentSectionLabel.textContent = "Рука друга";
    if (opponentAvatar) opponentAvatar.alt = "Друг";
    playerScoreEl.textContent = "0";
    botScoreEl.textContent = "0";
    playerAvatarCounter.textContent = "0";
    botAvatarCounter.textContent = "0";
    deckCountEl.textContent = "0";
    playerScopaEl.textContent = "0";
    botScopaEl.textContent = "0";
    tableSumEl.textContent = "0";
    botHandEl.innerHTML = "";
    tableCardsEl.innerHTML = "";
    playerHandEl.innerHTML = "";
    playButton.disabled = true;
    playButton.textContent = "Положить";
    multiplayerGameStatus.hidden = false;
    multiplayerGameStatus.innerHTML = `
      <span>Комната ${String((room && room.roomId) || "").slice(0, 8)}</span>
      <strong>${seat === "p2" ? "P2" : "P1"}</strong>
      <em class="turn-away">поиск игрока</em>
      <span class="online">вы</span>
    `;
    multiplayerWaitingOverlay.querySelector("p").textContent = "Комната видна в списке игры по сети.";
    multiplayerWaitingOverlay.querySelector(".multiplayer-waiting-friend").hidden = true;
    multiplayerWaitingOverlay.hidden = false;
    updateMultiplayerWaiting(room);
    if (multiplayerWaitingTimer) window.clearInterval(multiplayerWaitingTimer);
    multiplayerWaitingTimer = window.setInterval(() => updateMultiplayerWaiting(room), 1000);
    setStatus("Ищем игрока. Комната открыта для подключения в списке игры по сети.", "warn");
  }

  function updateMultiplayerWaiting(room) {
    if (multiplayerWaitingOverlay.hidden) return;
    const createdAt = Number(room && room.createdAt) || Date.now();
    const serverNow = Number(room && room.serverNow) || Date.now();
    const clientReceivedAt = Number(room && room.clientReceivedAt) || Date.now();
    const estimatedServerNow = serverNow + (Date.now() - clientReceivedAt);
    const elapsed = Math.max(0, Math.floor((estimatedServerNow - createdAt) / 1000));
    multiplayerWaitingOverlay.querySelector(".multiplayer-waiting-time").textContent = `${elapsed}с`;
    const friendButton = multiplayerWaitingOverlay.querySelector(".multiplayer-waiting-friend");
    const showInviteOffer = elapsed >= 60;
    friendButton.hidden = !showInviteOffer;
    if (showInviteOffer) {
      multiplayerWaitingOverlay.querySelector("p").textContent = "Пока никто не подключился. Можно пригласить друга по ссылке.";
    }
  }

  function hideMultiplayerWaiting() {
    multiplayerWaitingOverlay.hidden = true;
    if (multiplayerWaitingTimer) {
      window.clearInterval(multiplayerWaitingTimer);
      multiplayerWaitingTimer = null;
    }
  }

  function createOpponentOnlineBadge() {
    const opponent = document.querySelector(".opponent");
    if (!opponent) return null;
    const badge = document.createElement("span");
    badge.className = "opponent-online-badge offline";
    badge.hidden = true;
    badge.setAttribute("aria-label", "Друг не онлайн");
    badge.title = "Друг не онлайн";
    opponent.appendChild(badge);
    return badge;
  }

  function updateOpponentPresence(room) {
    if (!opponentOnlineBadge) return;
    if (!room || !multiplayerSession.active) {
      opponentOnlineBadge.hidden = true;
      opponentOnlineBadge.classList.remove("online", "offline");
      return;
    }
    const online = !isOpponentOffline(room);
    opponentOnlineBadge.hidden = false;
    opponentOnlineBadge.classList.toggle("online", online);
    opponentOnlineBadge.classList.toggle("offline", !online);
    opponentOnlineBadge.setAttribute("aria-label", online ? "Друг онлайн" : "Друг не онлайн");
    opponentOnlineBadge.title = online ? "Друг онлайн" : "Друг не онлайн";
  }

  function isOpponentOffline(room) {
    if (!room || !room.players || !multiplayerSession.seat) return false;
    const opponentSeat = multiplayerSession.seat === "p1" ? "p2" : "p1";
    const opponent = room.players[opponentSeat];
    return Boolean(opponent && !opponent.online);
  }

  function updateMultiplayerGameStatus(room, game, round) {
    const seatLabel = multiplayerSession.seat === "p1" ? "P1" : "P2";
    const isOwnTurn = round.turn === multiplayerSession.seat;
    const turnLabel = isOwnTurn ? "ваш ход" : "ход друга";
    const ownOnline = room.players && room.players[multiplayerSession.seat] && room.players[multiplayerSession.seat].online;
    const opponentSeat = multiplayerSession.seat === "p1" ? "p2" : "p1";
    const opponentOnline = room.players && room.players[opponentSeat] && room.players[opponentSeat].online;
    const remainingSeconds = turnRemainingSeconds(room);
    multiplayerGameStatus.hidden = false;
    multiplayerGameStatus.innerHTML = `
      <span>Комната ${String(room.roomId || "").slice(0, 8)}</span>
      <strong>${seatLabel}</strong>
      <em class="${isOwnTurn ? "turn-own" : "turn-away"}">${game.status === "finished" ? "матч завершен" : turnLabel}</em>
      <span class="turn-timer" data-turn-deadline="${room.turnDeadlineAt || ""}" data-server-now="${room.serverNow || ""}" data-client-received-at="${Date.now()}">${remainingSeconds > 0 ? `${remainingSeconds}с` : "--"}</span>
      <span class="${ownOnline ? "online" : "offline"}">вы</span>
      <span class="${opponentOnline ? "online" : "offline"}">друг</span>
      <div class="multiplayer-reactions" aria-label="Реакции">
        ${MULTIPLAYER_REACTIONS.map((reaction) => `
          <button class="multiplayer-reaction-button" type="button" data-reaction-id="${reaction.id}" aria-label="${reaction.label}" title="${reaction.label}">${reaction.emoji}</button>
        `).join("")}
      </div>
    `;
    bindMultiplayerReactionButtons();
    startTurnTimer();
  }

  function bindMultiplayerReactionButtons() {
    for (const button of multiplayerGameStatus.querySelectorAll(".multiplayer-reaction-button")) {
      button.addEventListener("click", () => sendMultiplayerReaction(button.dataset.reactionId));
    }
  }

  function sendMultiplayerReaction(reactionId) {
    const reaction = MULTIPLAYER_REACTIONS.find((item) => item.id === reactionId);
    if (!reaction || !multiplayerSession.active) return;
    showMultiplayerReaction(reaction.emoji, "player");
    if (!window.scopaMultiplayer || typeof window.scopaMultiplayer.sendReaction !== "function") return;
    window.scopaMultiplayer.sendReaction(reactionId).catch(() => {
      setStatus("Не удалось отправить реакцию.", "warn");
    });
  }

  function showMultiplayerReaction(emoji, side = "opponent") {
    if (!emoji) return;
    if (!multiplayerSession.active) return;
    const targetSide = side === "player" ? "player" : "opponent";
    const bubble = multiplayerReactionBubbles[targetSide];
    if (!bubble) return;
    bubble.textContent = emoji;
    bubble.hidden = false;
    bubble.classList.remove("pop");
    void bubble.offsetWidth;
    bubble.classList.add("pop");
    window.clearTimeout(multiplayerReactionTimers[targetSide]);
    multiplayerReactionTimers[targetSide] = window.setTimeout(() => hideMultiplayerReaction(targetSide), 1700);
  }

  function hideMultiplayerReaction(side = "") {
    const sides = side ? [side] : ["player", "opponent"];
    for (const targetSide of sides) {
      const bubble = multiplayerReactionBubbles[targetSide];
      if (!bubble) continue;
      window.clearTimeout(multiplayerReactionTimers[targetSide]);
      multiplayerReactionTimers[targetSide] = null;
      bubble.hidden = true;
      bubble.classList.remove("pop");
    }
  }

  function showMultiplayerChat() {
    multiplayerChatPanel.hidden = false;
    renderMultiplayerChat();
  }

  function hideMultiplayerChat() {
    multiplayerChatPanel.hidden = true;
    clearMultiplayerChat();
  }

  function clearMultiplayerChat() {
    multiplayerChatMessages = [];
    renderMultiplayerChat();
  }

  function addMultiplayerChatMessage(message) {
    multiplayerChatMessages.push(message);
    if (multiplayerChatMessages.length > 30) multiplayerChatMessages = multiplayerChatMessages.slice(-30);
    renderMultiplayerChat();
  }

  function renderMultiplayerChat() {
    const log = multiplayerChatPanel.querySelector(".multiplayer-chat-log");
    if (!log) return;
    if (!multiplayerChatMessages.length) {
      log.innerHTML = `<p class="multiplayer-chat-empty">Миничат пуст</p>`;
      return;
    }
    log.innerHTML = multiplayerChatMessages.slice(-4).map((message) => `
      <p class="${message.own ? "own" : "away"}">
        <strong>${message.own ? "Вы" : "Друг"}</strong>
        <span>${escapeHtml(message.text)}</span>
      </p>
    `).join("");
    log.scrollTop = log.scrollHeight;
  }

  function sendMultiplayerChatMessage() {
    const input = multiplayerChatPanel.querySelector(".multiplayer-chat-input");
    if (!input) return;
    const text = input.value.replace(/\s+/g, " ").trim().slice(0, 120);
    if (!text || !multiplayerSession.active) return;
    input.value = "";
    addMultiplayerChatMessage({ own: true, text });
    if (!window.scopaMultiplayer || typeof window.scopaMultiplayer.sendChatMessage !== "function") return;
    window.scopaMultiplayer.sendChatMessage(text).catch((error) => {
      setStatus(error.message || "Не удалось отправить сообщение.", "warn");
    });
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

  function turnRemainingSeconds(room) {
    if (!room || !room.turnDeadlineAt) return 0;
    const serverNow = room.serverNow || Date.now();
    return Math.max(0, Math.ceil((room.turnDeadlineAt - serverNow) / 1000));
  }

  function startTurnTimer() {
    if (multiplayerTurnTimer) window.clearInterval(multiplayerTurnTimer);
    updateTurnTimerLabel();
    multiplayerTurnTimer = window.setInterval(updateTurnTimerLabel, 1000);
  }

  function updateTurnTimerLabel() {
    const timer = multiplayerGameStatus.querySelector(".turn-timer");
    if (!timer) return;
    const deadline = Number(timer.dataset.turnDeadline || 0);
    const serverNow = Number(timer.dataset.serverNow || 0);
    const clientReceivedAt = Number(timer.dataset.clientReceivedAt || 0);
    if (!deadline || !serverNow || !clientReceivedAt) {
      timer.textContent = "--";
      return;
    }
    const estimatedServerNow = serverNow + (Date.now() - clientReceivedAt);
    const remaining = Math.max(0, Math.ceil((deadline - estimatedServerNow) / 1000));
    timer.textContent = `${remaining}с`;
    timer.classList.toggle("urgent", remaining <= 10);
  }

  function updateTurnHighlight(activeSide) {
    document.body.classList.toggle("turn-player", activeSide === "player");
    document.body.classList.toggle("turn-opponent", activeSide === "opponent");
  }

  function handleMultiplayerEvent(event, seat) {
    if (!event || !event.payload || !seat) return;
    if (event.type === "reaction.sent") {
      if (event.payload.seat !== seat) showMultiplayerReaction(event.payload.emoji, "opponent");
      return;
    }
    if (event.type === "chat.message") {
      if (event.payload.seat !== seat) addMultiplayerChatMessage({ own: false, text: event.payload.text });
      return;
    }
    if (event.type !== "move.accepted") return;
    const effects = event.payload.effects || [];
    const roundEnded = effects.find((effect) => effect.type === "roundEnded");
    const matchEnded = effects.find((effect) => effect.type === "matchEnded");
    const scopaEffect = effects.find((effect) => effect.type === "scopa");

    if (event.payload.timeout) {
      const ownTimeout = event.payload.seat === seat;
      multiplayerSession.timeoutNotice = {
        seq: event.seq || Date.now(),
        expiresAt: Date.now() + 9000,
        mode: "warn",
        text: ownTimeout
          ? "Время вышло. Сделали ход за вас, пока вы спали."
          : "Друг не успел походить. Сервер сделал ход за него."
      };
    }

    if (scopaEffect) {
      const owner = scopaEffect.seat === seat ? "player" : "bot";
      showScopaCelebration(owner);
      triggerScopaImpact();
      sound.play("scopa");
    }

    if (roundEnded) {
      showMultiplayerRoundPanel(roundEnded.result, matchEnded, event.payload.game, seat);
    }
  }

  function getActiveTimeoutNotice() {
    if (!multiplayerSession.timeoutNotice) return null;
    if (Date.now() <= multiplayerSession.timeoutNotice.expiresAt) return multiplayerSession.timeoutNotice;
    multiplayerSession.timeoutNotice = null;
    return null;
  }

  function showMultiplayerRoundPanel(result, matchEnded, publicGame, seat) {
    const opponent = seat === "p1" ? "p2" : "p1";
    const player = result[seat];
    const bot = result[opponent];
    const isMatchOver = Boolean(matchEnded);
    const scores = publicGame && publicGame.scores ? publicGame.scores : { [seat]: match.scores.player, [opponent]: match.scores.bot };
    const rows = [
      ["Карт больше", player.cards, bot.cards],
      [`Пентакли (${player.denariCount}:${bot.denariCount})`, player.denari, bot.denari],
      ["Сеттебелло (7 пентаклей)", player.settebello, bot.settebello],
      [`Примьера раунда (${player.primieraValue}:${bot.primieraValue})`, player.primiera, bot.primiera],
      ["Скопа", player.scopa, bot.scopa],
      ["Итого за раунд", player.total, bot.total, "total"]
    ];

    multiplayerSession.resultOpen = true;
    roundPanel.classList.toggle("match-result", isMatchOver);
    roundPanel.querySelector("h2").textContent = isMatchOver
      ? (matchEnded.winner === seat ? "Вы выиграли!" : "Друг выиграл")
      : `Раунд ${Math.max(1, match.roundNumber - 1)} завершен`;

    const playerLeft = Math.max(0, 11 - (scores[seat] || 0));
    const botLeft = Math.max(0, 11 - (scores[opponent] || 0));
    const roundSummary = isMatchOver
      ? `<div class="match-summary"><span>Итоговый счет</span><strong>${scores[seat] || 0}:${scores[opponent] || 0}</strong></div>`
      : `<div class="match-summary"><span>Счет матча</span><strong>${scores[seat] || 0}:${scores[opponent] || 0}</strong><em>До победы: вам — ${playerLeft}, другу — ${botLeft}</em></div>`;
    roundBreakdown.innerHTML = `${roundSummary}<span class="round-head-spacer"></span><strong class="round-player-head">Вы</strong><strong class="round-bot-head">Друг</strong>`;
    for (const [label, playerValue, botValue, kind] of rows) {
      const labelClass = kind === "total" ? "round-label round-total-label" : "round-label";
      const playerClass = kind === "total" ? "round-score-value round-player-value round-total-value" : "round-score-value round-player-value";
      const botClass = kind === "total" ? "round-score-value round-bot-value round-total-value" : "round-score-value round-bot-value";
      roundBreakdown.insertAdjacentHTML("beforeend", `<span class="${labelClass}">${label}</span><span class="${playerClass}">${playerValue}</span><span class="${botClass}">${botValue}</span>`);
    }
    roundBreakdown.insertAdjacentHTML("beforeend", `<div class="score-note">Раунд рассчитан сервером. Следующая сдача уже синхронизирована.</div>`);
    nextRoundButton.textContent = isMatchOver ? "Закрыть" : "К столу";
    modalBackdrop.hidden = false;
    roundPanel.hidden = false;
  }

  window.scopaGameMultiplayer = {
    applyRoom: applyMultiplayerRoom,
    handleEvent: handleMultiplayerEvent,
    leaveRoom: leaveMultiplayerRoom,
    showWaiting: showMultiplayerWaiting
  };

  function showRoundPanel(result, isMatchOver) {
    const rows = [
      ["Карт больше", result.player.cards, result.bot.cards],
      [`Пентакли (${result.player.denariCount}:${result.bot.denariCount})`, result.player.denari, result.bot.denari],
      ["Сеттебелло (7 пентаклей)", result.player.settebello, result.bot.settebello],
      [`Примьера раунда (${result.player.primieraValue}:${result.bot.primieraValue})`, result.player.primiera, result.bot.primiera],
      ["Скопа", result.player.scopa, result.bot.scopa],
      ["Итого за раунд", result.player.total, result.bot.total, "total"]
    ];
    roundPanel.classList.toggle("match-result", isMatchOver);
    roundPanel.querySelector("h2").textContent = isMatchOver
      ? (match.scores.player === match.scores.bot ? "Ничья!" : (match.scores.player > match.scores.bot ? "Вы выиграли!" : "Вы проиграли"))
      : `Раунд ${match.roundNumber} завершен`;
    const playerLeft = Math.max(0, 11 - match.scores.player);
    const botLeft = Math.max(0, 11 - match.scores.bot);
    const roundSummary = isMatchOver
      ? `<div class="match-summary"><span>Итоговый счет</span><strong>${match.scores.player}:${match.scores.bot}</strong></div>`
      : `<div class="match-summary"><span>Счет матча</span><strong>${match.scores.player}:${match.scores.bot}</strong><em>До победы: вам — ${playerLeft}, боту — ${botLeft}</em></div>`;
    roundBreakdown.innerHTML = isMatchOver
      ? `${roundSummary}<span class="round-head-spacer"></span><strong class="round-player-head">Вы</strong><strong class="round-bot-head">Бот</strong>`
      : `${roundSummary}<span class="round-head-spacer"></span><strong class="round-player-head">Вы</strong><strong class="round-bot-head">Бот</strong>`;
    for (const [label, player, bot, kind] of rows) {
      const labelClass = kind === "total" ? "round-label round-total-label" : "round-label";
      const playerClass = kind === "total" ? "round-score-value round-player-value round-total-value" : "round-score-value round-player-value";
      const botClass = kind === "total" ? "round-score-value round-bot-value round-total-value" : "round-score-value round-bot-value";
      roundBreakdown.insertAdjacentHTML("beforeend", `<span class="${labelClass}">${label}</span><span class="${playerClass}">${player}</span><span class="${botClass}">${bot}</span>`);
    }
    roundBreakdown.insertAdjacentHTML("beforeend", `
      <div class="score-note">Числа в скобках — данные за этот раунд: количество пентаклей и сумма примьеры.</div>
      <div class="development-note">
        <strong>Игра находится в разработке</strong>
        <span>Мы хотим добавить онлайн-режим и приватные партии с друзьями прямо в Telegram.</span>
        <a class="support-link" href="${DONATE_URL}" target="_blank" rel="noopener">Поддержать разработку</a>
      </div>
    `);
    nextRoundButton.textContent = isMatchOver ? "Новый матч" : "Следующий раунд";
    modalBackdrop.hidden = false;
    roundPanel.hidden = false;
  }

  function sumCards(cards) {
    return cards.reduce((sum, card) => sum + card.value, 0);
  }

  function removeById(cards, id) {
    const index = cards.findIndex((card) => card.id === id);
    if (index === -1) return null;
    return cards.splice(index, 1)[0];
  }

  function displayCard(card) {
    return `«${displayRank(card)} ${suitNamesGenitive[card.suit] || card.suitName.toLowerCase()}»`;
  }

  function clearCardSelectionDom() {
    document.querySelectorAll(".card.selected").forEach((item) => item.classList.remove("selected"));
  }

  function formatCardCount(count) {
    return `${count} ${pluralizeRu(count, "карту", "карты", "карт")}`;
  }

  function pluralizeRu(count, one, few, many) {
    const mod10 = Math.abs(count) % 10;
    const mod100 = Math.abs(count) % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  function setStatus(text, mode) {
    statusText.textContent = text;
    statusText.className = `status${mode ? ` ${mode}` : ""}`;
  }

  function triggerHaptic(kind) {
    if (!audioSettings.vibrationEnabled) return;
    if (kind === "capture") {
      if (navigator.vibrate) navigator.vibrate(35);
      if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
      return;
    }
    if (kind === "error") {
      if (navigator.vibrate) navigator.vibrate([50, 40, 80]);
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("error");
    }
  }

  function triggerRareImpact(kind) {
    if (!audioSettings.vibrationEnabled) return;
    if (kind === "settebello") {
      if (navigator.vibrate) navigator.vibrate([90, 70, 140]);
      if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred("medium");
        window.setTimeout(() => tg.HapticFeedback.notificationOccurred("success"), 150);
      }
      return;
    }
    if (kind === "victory") {
      if (navigator.vibrate) navigator.vibrate([120, 60, 160, 80, 220]);
      if (tg && tg.HapticFeedback) {
        [0, 170, 380, 650].forEach((delay) => {
          window.setTimeout(() => tg.HapticFeedback.impactOccurred("heavy"), delay);
        });
      }
    }
  }

  function hideLoading() {
    window.setTimeout(() => {
      loadingScreen.classList.add("hidden");
    }, 650);
  }

  function loadAudioSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem("scopaAudioSettings") || "{}");
      const migratedSavedDefaults = saved.settingsVersion !== AUDIO_SETTINGS_VERSION
        && saved.musicVolume === LEGACY_DEFAULT_AUDIO_SETTINGS.musicVolume
        && saved.voiceVolume === LEGACY_DEFAULT_AUDIO_SETTINGS.voiceVolume
        && saved.sfxVolume === LEGACY_DEFAULT_AUDIO_SETTINGS.sfxVolume;
      const migratedPreviousDefaults = saved.settingsVersion !== AUDIO_SETTINGS_VERSION
        && saved.musicVolume === 18
        && saved.voiceVolume === 100
        && saved.sfxVolume === 85;
      const migratedBoostDefaults = saved.settingsVersion !== AUDIO_SETTINGS_VERSION
        && saved.musicVolume === 18
        && saved.voiceVolume === 130
        && saved.sfxVolume === 100;
      if (migratedSavedDefaults || migratedPreviousDefaults || migratedBoostDefaults) {
        return { ...DEFAULT_AUDIO_SETTINGS, settingsVersion: AUDIO_SETTINGS_VERSION };
      }
      return {
        musicVolume: clampVolume(saved.musicVolume ?? DEFAULT_AUDIO_SETTINGS.musicVolume, "musicVolume"),
        voiceVolume: clampVolume(saved.voiceVolume ?? DEFAULT_AUDIO_SETTINGS.voiceVolume, "voiceVolume"),
        sfxVolume: clampVolume(saved.sfxVolume ?? DEFAULT_AUDIO_SETTINGS.sfxVolume, "sfxVolume"),
        vibrationEnabled: saved.vibrationEnabled ?? DEFAULT_AUDIO_SETTINGS.vibrationEnabled,
        settingsVersion: AUDIO_SETTINGS_VERSION
      };
    } catch (error) {
      return { ...DEFAULT_AUDIO_SETTINGS, settingsVersion: AUDIO_SETTINGS_VERSION };
    }
  }

  function saveAudioSettings() {
    localStorage.setItem("scopaAudioSettings", JSON.stringify(audioSettings));
  }

  function clampVolume(value, kind = "musicVolume") {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    const max = VOLUME_LIMITS[kind] || 100;
    return Math.max(0, Math.min(max, Math.round(number)));
  }

  function syncVolumeControls() {
    musicVolume.max = String(VOLUME_LIMITS.musicVolume);
    voiceVolume.max = String(VOLUME_LIMITS.voiceVolume);
    sfxVolume.max = String(VOLUME_LIMITS.sfxVolume);
    musicVolume.value = String(audioSettings.musicVolume);
    voiceVolume.value = String(audioSettings.voiceVolume);
    sfxVolume.value = String(audioSettings.sfxVolume);
    vibrationToggle.checked = Boolean(audioSettings.vibrationEnabled);
    musicVolumeValue.textContent = `${audioSettings.musicVolume}%`;
    voiceVolumeValue.textContent = `${audioSettings.voiceVolume}%`;
    sfxVolumeValue.textContent = `${audioSettings.sfxVolume}%`;
  }

  function updateVolume(kind, value) {
    const volume = clampVolume(value, kind);
    audioSettings[kind] = volume;
    if (kind === "musicVolume") music.setVolume(volume);
    if (kind === "voiceVolume") voice.setVolume(volume);
    if (kind === "sfxVolume") sound.setVolume(volume);
    syncVolumeControls();
    saveAudioSettings();
  }

  function bindVolumeControl(input, kind) {
    const update = () => updateVolume(kind, input.value);
    input.addEventListener("input", update);
    input.addEventListener("change", update);
  }

  function updateVibration(enabled) {
    audioSettings.vibrationEnabled = Boolean(enabled);
    saveAudioSettings();
  }

  function showScopaCelebration(owner) {
    const colors = ["#f1bd4d", "#fff2bd", "#e85151", "#4db6ff", "#65df8f", "#b98cff"];
    const isVictory = owner === "victory";
    const opponentScopaText = multiplayerSession.active ? "Скопа у друга" : "Скопа у бота";
    scopaCelebrationText.textContent = isVictory ? "Победа в матче" : (owner === "player" ? "Ваша Скопа" : opponentScopaText);
    confettiLayer.innerHTML = "";

    for (let i = 0; i < (isVictory ? 58 : 34); i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty("--fall-x", `${Math.round((Math.random() - 0.5) * 180)}px`);
      piece.style.setProperty("--fall-rotate", `${Math.round(360 + Math.random() * 620)}deg`);
      piece.style.setProperty("--fall-duration", `${(isVictory ? 2300 : 1800) + Math.round(Math.random() * 900)}ms`);
      piece.style.animationDelay = `${Math.round(Math.random() * (isVictory ? 760 : 520))}ms`;
      confettiLayer.appendChild(piece);
    }

    scopaCelebration.hidden = false;
    window.clearTimeout(showScopaCelebration.hideTimer);
    showScopaCelebration.hideTimer = window.setTimeout(() => {
      scopaCelebration.hidden = true;
      confettiLayer.innerHTML = "";
    }, isVictory ? 3900 : 3000);
  }

  function triggerScopaImpact() {
    appShell.classList.remove("shake");
    void appShell.offsetWidth;
    appShell.classList.add("shake");
    window.setTimeout(() => appShell.classList.remove("shake"), 950);

    if (!audioSettings.vibrationEnabled) return;
    if (navigator.vibrate) navigator.vibrate([80, 60, 90, 70, 120, 80, 160]);
    if (tg && tg.HapticFeedback) {
      const pulses = [0, 140, 300, 500, 760];
      for (const delay of pulses) {
        window.setTimeout(() => tg.HapticFeedback.impactOccurred("heavy"), delay);
      }
    }
  }

  function createSoundEngine(initialVolume) {
    let context = null;
    let unlocked = false;
    let volume = volumeToLevel(initialVolume, "sfxVolume");

    function ensureContext() {
      if (!context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;
        context = new AudioContext();
      }
      if (context.state === "suspended") context.resume();
      return context;
    }

    function unlock() {
      unlocked = true;
      ensureContext();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    }

    function tone(freq, start, duration, type, gainValue) {
      const audio = ensureContext();
      if (!audio || !unlocked || volume <= 0) return;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, audio.currentTime + start);
      gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, (gainValue || 0.07) * volume), audio.currentTime + start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(audio.currentTime + start);
      osc.stop(audio.currentTime + start + duration + 0.02);
    }

    function play(name) {
      const patterns = {
        tap: [[620, 0, 0.045, "sine", 0.028], [820, 0.035, 0.035, "triangle", 0.018]],
        place: [[220, 0, 0.06, "square", 0.035], [165, 0.045, 0.08, "triangle", 0.025]],
        capture: [[420, 0, 0.06, "triangle", 0.045], [640, 0.055, 0.08, "sine", 0.055]],
        scopa: [[523, 0, 0.08, "triangle", 0.045], [659, 0.07, 0.08, "triangle", 0.05], [784, 0.14, 0.12, "sine", 0.06]],
        warn: [[140, 0, 0.1, "sawtooth", 0.035]],
        deal: [[190, 0, 0.035, "sawtooth", 0.018], [260, 0.035, 0.04, "triangle", 0.02], [190, 0.08, 0.035, "sawtooth", 0.018], [300, 0.115, 0.045, "triangle", 0.02]],
        round: [[330, 0, 0.09, "sine", 0.04], [440, 0.08, 0.1, "sine", 0.04], [550, 0.17, 0.14, "sine", 0.045]],
        victory: [[392, 0, 0.09, "triangle", 0.045], [523, 0.08, 0.11, "triangle", 0.055], [659, 0.18, 0.13, "sine", 0.06], [784, 0.31, 0.2, "sine", 0.065]]
      };
      for (const args of patterns[name] || []) tone(...args);
    }

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    function setVolume(nextVolume) {
      volume = volumeToLevel(nextVolume, "sfxVolume");
    }

    return { play, setVolume };
  }

  function createMusicPlayer(tracks, initialVolume) {
    let index = 0;
    let enabled = false;
    let ducked = false;
    let restoreTimer = null;
    let baseVolume = volumeToLevel(initialVolume);
    let audio = null;
    let gainController = null;

    function ensureAudio() {
      if (audio) return audio;
      audio = new Audio(tracks[index]);
      audio.preload = "none";
      gainController = createMediaGainController([audio], baseVolume);
      audio.addEventListener("ended", () => {
        index = (index + 1) % tracks.length;
        audio.src = tracks[index];
        if (enabled) audio.play().catch(() => {});
      });
      applyMusicVolume();
      return audio;
    }

    async function toggle() {
      const player = ensureAudio();
      enabled = !enabled;
      if (!enabled) {
        player.pause();
        return false;
      }

      try {
        gainController?.resume();
        await player.play();
        return true;
      } catch (error) {
        enabled = false;
        return false;
      }
    }

    function setVolume(nextVolume) {
      baseVolume = volumeToLevel(nextVolume);
      applyMusicVolume();
    }

    function duck(duration = 0) {
      ducked = true;
      applyMusicVolume();
      window.clearTimeout(restoreTimer);
      if (duration > 0) restoreTimer = window.setTimeout(restore, duration);
    }

    function restore() {
      ducked = false;
      applyMusicVolume();
      window.clearTimeout(restoreTimer);
    }

    function applyMusicVolume() {
      const nextVolume = ducked ? baseVolume * 0.25 : baseVolume;
      gainController?.setVolume(nextVolume);
      if (!audio) return;
      audio.volume = Math.max(0, Math.min(1, nextVolume));
      audio.muted = baseVolume <= 0;
    }

    return { toggle, setVolume, duck, restore };
  }

  function createVoicePlayer(clips, initialVolume, hooks = {}) {
    const sourcesByName = {};
    let pendingTimer = null;
    let playId = 0;
    let volume = volumeToLevel(initialVolume, "voiceVolume");
    let unlocked = false;
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = Math.min(1, volume);
    audio.muted = volume <= 0;

    for (const [name, sources] of Object.entries(clips)) {
      sourcesByName[name] = Array.isArray(sources) ? sources : [sources];
    }
    const gainController = createMediaGainController([audio], volume);

    function stopAll() {
      audio.pause();
      audio.currentTime = 0;
    }

    function play(name, delay = 0) {
      const variants = sourcesByName[name] || [];
      if (!variants.length) return;
      const src = variants[Math.floor(Math.random() * variants.length)];
      const voiceRun = ++playId;

      window.clearTimeout(pendingTimer);
      pendingTimer = window.setTimeout(() => {
        stopAll();
        gainController.resume();
        gainController.setVolume(volume);
        audio.src = src;
        audio.currentTime = 0;
        audio.volume = Math.min(1, volume);
        audio.muted = volume <= 0;
        hooks.onStart?.();
        audio.onended = () => {
          if (voiceRun === playId) hooks.onEnd?.();
        };
        audio.onerror = () => {
          if (voiceRun === playId) hooks.onEnd?.();
        };
        audio.play().catch(() => {
          if (!unlocked) unlockAudioElement(audio).catch(() => {});
          if (voiceRun === playId) hooks.onEnd?.();
        });
      }, delay);
    }

    function unlock() {
      if (unlocked) return;
      unlocked = true;
      const firstClip = Object.values(sourcesByName)[0]?.[0];
      if (firstClip) audio.src = firstClip;
      unlockAudioElement(audio).catch(() => {});
      gainController.resume();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    }

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    function setVolume(nextVolume) {
      volume = volumeToLevel(nextVolume, "voiceVolume");
      gainController.setVolume(volume);
      audio.volume = Math.min(1, volume);
      audio.muted = volume <= 0;
    }

    return { play, setVolume };
  }

  async function unlockAudioElement(clip) {
    const previousVolume = clip.volume;
    const previousMuted = clip.muted;
    try {
      clip.pause();
      clip.currentTime = 0;
      clip.volume = 0;
      clip.muted = false;
      await clip.play();
      clip.pause();
      clip.currentTime = 0;
    } finally {
      clip.volume = previousVolume;
      clip.muted = previousMuted;
    }
  }

  function volumeToLevel(value, kind = "musicVolume") {
    const normalized = clampVolume(value, kind) / 50;
    if (normalized <= 0) return 0;
    return normalized;
  }

  function createMediaGainController(elements, initialVolume) {
    let context = null;
    let gain = null;
    let connected = false;
    let currentVolume = Math.max(0, Math.min(2, initialVolume));

    function ensureGraph() {
      if (connected) return true;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;

      try {
        context = context || new AudioContext();
        gain = gain || context.createGain();
        gain.gain.value = currentVolume;
        for (const element of elements) {
          const source = context.createMediaElementSource(element);
          source.connect(gain);
        }
        gain.connect(context.destination);
        connected = true;
        return true;
      } catch (error) {
        return false;
      }
    }

    function resume() {
      if (ensureGraph() && context && context.state === "suspended") context.resume().catch(() => {});
    }

    function setVolume(nextVolume) {
      currentVolume = Math.max(0, Math.min(2, nextVolume));
      if (ensureGraph() && gain) {
        const now = context.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(currentVolume, now, 0.025);
      }
    }

    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });

    return { setVolume, resume };
  }

  async function toggleMusicFromButton(button) {
    const playing = await music.toggle();
    musicButton.classList.toggle("active", playing);
    musicButton.classList.toggle("muted", !playing);
    homeSoundButton.classList.toggle("active", playing);
    homeSoundButton.classList.toggle("muted", !playing);
    musicButton.textContent = "\u266b";
    musicButton.setAttribute("aria-label", playing ? "Выключить музыку" : "Включить музыку");
    musicButton.setAttribute("title", playing ? "Выключить музыку" : "Включить музыку");
    button?.setAttribute("aria-label", playing ? "Выключить музыку" : "Включить музыку");
    button?.setAttribute("title", playing ? "Выключить музыку" : "Включить музыку");
  }

  async function refreshHomeOnlineStats() {
    if (!homeOnlineStats) return;
    try {
      const data = await sendAppPresence();
      renderHomeOnlineStats(data);
    } catch {
      try {
        const response = await fetch("/api/stats", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        renderHomeOnlineStats(await response.json());
      } catch {
        homeOnlineStats.classList.add("offline");
        homeOnlineStats.innerHTML = `
          <span class="home-online-dot" aria-hidden="true"></span>
          <span>Онлайн: <strong>--</strong></span>
        `;
      }
    }
  }

  async function sendAppPresence() {
    const response = await fetch("/api/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ clientId: getAppPresenceClientId() })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  function getAppPresenceClientId() {
    if (appPresenceClientId) return appPresenceClientId;
    try {
      const stored = localStorage.getItem("scopaAppPresenceId");
      if (stored) {
        appPresenceClientId = stored;
        return appPresenceClientId;
      }
      appPresenceClientId = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("scopaAppPresenceId", appPresenceClientId);
      return appPresenceClientId;
    } catch {
      if (!appPresenceClientId) appPresenceClientId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return appPresenceClientId;
    }
  }

  function renderHomeOnlineStats(data) {
    if (!homeOnlineStats) return;
    try {
      const onlinePlayers = Math.max(0, Number(data.onlinePlayers) || 0);
      const waitingPublicRooms = Math.max(0, Number(data.waitingPublicRooms) || 0);
      homeOnlineStats.classList.remove("offline");
      homeOnlineStats.innerHTML = `
        <span class="home-online-dot" aria-hidden="true"></span>
        <span>Онлайн: <strong>${onlinePlayers}</strong>${waitingPublicRooms > 0 ? ` · ищут игру: <strong>${waitingPublicRooms}</strong>` : ""}</span>
      `;
    } catch {
      homeOnlineStats.classList.add("offline");
      homeOnlineStats.innerHTML = `
        <span class="home-online-dot" aria-hidden="true"></span>
        <span>Онлайн: <strong>--</strong></span>
      `;
    }
  }

  function startHomeStatsRefresh() {
    refreshHomeOnlineStats();
    if (homeStatsTimer) window.clearInterval(homeStatsTimer);
    homeStatsTimer = window.setInterval(refreshHomeOnlineStats, 10000);
  }

  homeSoundButton.classList.add("muted");

  playButton.addEventListener("click", playSelected);
  musicButton.addEventListener("click", () => toggleMusicFromButton(musicButton));
  settingsButton.addEventListener("click", () => {
    sound.play("tap");
    syncVolumeControls();
    settingsPanel.hidden = false;
  });
  closeSettingsButton.addEventListener("click", () => {
    sound.play("tap");
    settingsPanel.hidden = true;
  });
  settingsPanel.addEventListener("click", (event) => {
    if (event.target === settingsPanel) settingsPanel.hidden = true;
  });
  closeDevelopersButton.addEventListener("click", () => {
    sound.play("tap");
    developersPanel.hidden = true;
  });
  developersPanel.addEventListener("click", (event) => {
    if (event.target === developersPanel) developersPanel.hidden = true;
  });
  closeSupportFeatureButton.addEventListener("click", () => {
    sound.play("tap");
    supportFeaturePanel.hidden = true;
  });
  supportFeaturePanel.addEventListener("click", (event) => {
    if (event.target === supportFeaturePanel) supportFeaturePanel.hidden = true;
  });
  bindVolumeControl(musicVolume, "musicVolume");
  bindVolumeControl(voiceVolume, "voiceVolume");
  bindVolumeControl(sfxVolume, "sfxVolume");
  vibrationToggle.addEventListener("change", () => updateVibration(vibrationToggle.checked));
  nextRoundButton.addEventListener("click", () => {
    roundPanel.classList.remove("match-result");
    modalBackdrop.hidden = true;
    if (multiplayerSession.active) {
      multiplayerSession.resultOpen = false;
      roundPanel.hidden = true;
      render();
      return;
    }
    if (match.scores.player >= 11 || match.scores.bot >= 11) newMatch();
    else startRound();
  });
  newMatchButton.addEventListener("click", () => {
    if (multiplayerSession.active && window.scopaMultiplayer && typeof window.scopaMultiplayer.leaveRoom === "function") {
      sound.play("tap");
      window.scopaMultiplayer.leaveRoom({ openLobby: true, mode: multiplayerSession.waitingMode || "" });
      return;
    }
    newMatch();
  });
  backHomeButton.addEventListener("click", () => {
    sound.play("tap");
    homeScreen.classList.remove("hidden");
  });
  quickPlayButton.addEventListener("click", () => {
    sound.play("tap");
    homeScreen.classList.add("hidden");
  });
  homeRulesButton?.addEventListener("click", () => {
    sound.play("tap");
    rulesPanel.hidden = false;
  });
  homeSoundButton.addEventListener("click", () => {
    sound.play("tap");
    toggleMusicFromButton(homeSoundButton);
  });
  homeSettingsButton.addEventListener("click", () => {
    sound.play("tap");
    syncVolumeControls();
    settingsPanel.hidden = false;
  });
  homeNewMatchButton?.addEventListener("click", () => {
    newMatch();
    homeScreen.classList.add("hidden");
  });
  homeOnlineButton.addEventListener("click", () => {
    sound.play("tap");
    if (window.scopaMultiplayer && window.scopaMultiplayer.openNetworkMatch) window.scopaMultiplayer.openNetworkMatch();
    else supportFeaturePanel.hidden = false;
  });
  homeFriendButton.addEventListener("click", () => {
    sound.play("tap");
    if (window.scopaMultiplayer && window.scopaMultiplayer.openLobby) window.scopaMultiplayer.openLobby();
    else supportFeaturePanel.hidden = false;
  });
  homeDevelopersButton.addEventListener("click", () => {
    sound.play("tap");
    developersPanel.hidden = false;
  });
  homeScreen.addEventListener("pointermove", (event) => {
    const rect = homeScreen.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    homeScreen.style.setProperty("--hero-drift-x", `${(x * 18).toFixed(1)}px`);
    homeScreen.style.setProperty("--hero-drift-y", `${(y * 12).toFixed(1)}px`);
  });
  homeScreen.addEventListener("pointerleave", () => {
    homeScreen.style.setProperty("--hero-drift-x", "0px");
    homeScreen.style.setProperty("--hero-drift-y", "0px");
  });
  homeChannelButton.addEventListener("click", (event) => {
    event.preventDefault();
    const popup = window.open(CHANNEL_URL, "_blank", "noopener,noreferrer");
    if (!popup && tg) tg.openTelegramLink(CHANNEL_URL);
  });
  channelButton.addEventListener("click", (event) => {
    event.preventDefault();
    const popup = window.open(CHANNEL_URL, "_blank", "noopener,noreferrer");
    if (!popup && tg) tg.openTelegramLink(CHANNEL_URL);
  });
  donateButton.addEventListener("click", (event) => {
    if (!DONATE_URL) {
      event.preventDefault();
      setStatus("Ссылка для донатов пока не настроена.", "warn");
      return;
    }

    event.preventDefault();
    const popup = window.open(DONATE_URL, "_blank", "noopener,noreferrer");
    if (!popup && tg) tg.openTelegramLink(DONATE_URL);
  });
  rulesButton?.addEventListener("click", () => {
    sound.play("tap");
    rulesPanel.hidden = false;
  });
  topRulesCardButton.addEventListener("click", () => {
    sound.play("tap");
    rulesPanel.hidden = false;
  });
  closeRulesButton.addEventListener("click", () => {
    sound.play("tap");
    rulesPanel.hidden = true;
  });
  rulesPanel.addEventListener("click", (event) => {
    if (event.target === rulesPanel) rulesPanel.hidden = true;
  });
  document.addEventListener("click", (event) => {
    const supportLink = event.target.closest(".support-link");
    if (!supportLink) return;
    event.preventDefault();
    const popup = window.open(DONATE_URL, "_blank", "noopener,noreferrer");
    if (!popup && tg) tg.openTelegramLink(DONATE_URL);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !rulesPanel.hidden) rulesPanel.hidden = true;
    if (event.key === "Escape" && !settingsPanel.hidden) settingsPanel.hidden = true;
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshHomeOnlineStats();
  });

  syncVolumeControls();
  startHomeStatsRefresh();
  newMatch();
})();









