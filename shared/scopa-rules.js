(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ScopaRules = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const suits = [
    { id: "denari", name: "Пентакли", icon: "?" },
    { id: "coppe", name: "Кубки", icon: "¦" },
    { id: "spade", name: "Мечи", icon: "¦" },
    { id: "bastoni", name: "Жезлы", icon: "¦" }
  ];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const primiera = { 7: 21, 6: 18, 1: 16, 5: 15, 4: 14, 3: 13, 2: 12, 8: 10, 9: 10, 10: 10 };

  function createMatch(options = {}) {
    const match = {
      scores: { p1: 0, p2: 0 },
      roundNumber: 0,
      round: null,
      targetScore: options.targetScore || 11,
      status: "playing",
      winner: null
    };
    startRound(match, options.rng);
    return match;
  }

  function startRound(match, rng = Math.random) {
    match.roundNumber += 1;
    const deck = createDeck(rng);
    match.round = {
      deck,
      table: deck.splice(0, 4),
      hands: {
        p1: deck.splice(0, 3),
        p2: deck.splice(0, 3)
      },
      captures: { p1: [], p2: [] },
      scopa: { p1: 0, p2: 0 },
      lastCapture: null,
      turn: match.roundNumber % 2 === 1 ? "p1" : "p2",
      ended: false
    };
    match.status = "playing";
    match.winner = null;
    return match;
  }

  function createDeck(rng = Math.random) {
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
    return shuffle(deck, rng);
  }

  function shuffle(deck, rng) {
    const copy = deck.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function applyMove(match, seat, command) {
    if (!match || match.status !== "playing" || !match.round) return reject("Матч сейчас не активен");
    const round = match.round;
    if (round.ended) return reject("Раунд уже завершен");
    if (round.turn !== seat) return reject("Сейчас ход другого игрока");
    if (!command || command.type !== "playCard") return reject("Такой ход не поддерживается");

    const next = clone(match);
    const nextRound = next.round;
    const hand = nextRound.hands[seat];
    const card = removeById(hand, command.cardId);
    if (!card) return reject("Этой карты нет в руке игрока");

    const selectedIds = new Set(command.tableCardIds || []);
    const picked = nextRound.table.filter((tableCard) => selectedIds.has(tableCard.id));
    if (picked.length !== selectedIds.size) return reject("Выбранной карты нет на столе");

    const selectedSum = sumCards(picked);
    if (picked.length > 0 && selectedSum !== card.value) return reject("Сумма выбранных карт не равна значению вашей карты");

    const exactTableCard = nextRound.table.find((tableCard) => tableCard.value === card.value);
    if (picked.length > 1 && exactTableCard) return reject("Сначала нужно забрать одиночную карту такого же значения");

    if (picked.length === 0 && captureOptions(card, nextRound.table).length > 0) {
      return reject("Эта карта может взять карты со стола, ее нельзя просто положить");
    }

    const effects = [];
    if (picked.length === 0) {
      nextRound.table.push(card);
      effects.push({ type: "placed", seat, cardId: card.id });
    } else {
      effects.push(...capture(nextRound, seat, card, picked));
    }

    if (nextRound.hands.p1.length === 0 && nextRound.hands.p2.length === 0) {
      if (nextRound.deck.length > 0) {
        dealHands(nextRound);
        effects.push({ type: "deal" });
      } else {
        effects.push(...endRound(next));
      }
    } else {
      nextRound.turn = otherSeat(seat);
    }

    return { ok: true, match: next, effects };
  }

  function reject(reason) {
    return { ok: false, reason };
  }

  function capture(round, seat, card, tableCards) {
    const ids = new Set(tableCards.map((item) => item.id));
    round.table = round.table.filter((item) => !ids.has(item.id));
    round.captures[seat].push(card, ...tableCards);
    round.lastCapture = seat;
    const effects = [{ type: "captured", seat, cardId: card.id, tableCardIds: tableCards.map((item) => item.id) }];
    const madeScopa = round.table.length === 0 && (round.deck.length > 0 || round.hands.p1.length > 0 || round.hands.p2.length > 0);
    if (madeScopa) {
      round.scopa[seat] += 1;
      effects.push({ type: "scopa", seat });
    }
    return effects;
  }

  function dealHands(round) {
    round.hands.p1 = round.deck.splice(0, 3);
    round.hands.p2 = round.deck.splice(0, 3);
  }

  function endRound(match) {
    const round = match.round;
    const effects = [];
    if (round.lastCapture && round.table.length > 0) {
      round.captures[round.lastCapture].push(...round.table);
      effects.push({ type: "tableRemainder", seat: round.lastCapture, cardIds: round.table.map((card) => card.id) });
      round.table = [];
    }
    round.ended = true;
    const result = scoreRound(round);
    match.scores.p1 += result.p1.total;
    match.scores.p2 += result.p2.total;
    effects.push({ type: "roundEnded", result });

    const matchCanEnd = match.scores.p1 >= match.targetScore || match.scores.p2 >= match.targetScore;
    if (matchCanEnd && match.scores.p1 !== match.scores.p2) {
      match.status = "finished";
      match.winner = match.scores.p1 > match.scores.p2 ? "p1" : "p2";
      effects.push({ type: "matchEnded", winner: match.winner, scores: { ...match.scores } });
    } else {
      startRound(match);
      effects.push({ type: "roundStarted", roundNumber: match.roundNumber });
    }
    return effects;
  }

  function scoreRound(round) {
    const p1 = scoreBase(round.captures.p1, round.scopa.p1);
    const p2 = scoreBase(round.captures.p2, round.scopa.p2);

    if (round.captures.p1.length > round.captures.p2.length) p1.cards = 1;
    else if (round.captures.p2.length > round.captures.p1.length) p2.cards = 1;

    const p1Denari = round.captures.p1.filter((card) => card.suit === "denari").length;
    const p2Denari = round.captures.p2.filter((card) => card.suit === "denari").length;
    if (p1Denari > p2Denari) p1.denari = 1;
    else if (p2Denari > p1Denari) p2.denari = 1;

    if (hasSettebello(round.captures.p1)) p1.settebello = 1;
    if (hasSettebello(round.captures.p2)) p2.settebello = 1;

    const p1Primiera = primieraTotal(round.captures.p1);
    const p2Primiera = primieraTotal(round.captures.p2);
    if (p1Primiera > p2Primiera) p1.primiera = 1;
    else if (p2Primiera > p1Primiera) p2.primiera = 1;

    p1.total = p1.cards + p1.denari + p1.settebello + p1.primiera + p1.scopa;
    p2.total = p2.cards + p2.denari + p2.settebello + p2.primiera + p2.scopa;
    p1.primieraValue = p1Primiera;
    p2.primieraValue = p2Primiera;
    p1.cardCount = round.captures.p1.length;
    p2.cardCount = round.captures.p2.length;
    p1.denariCount = p1Denari;
    p2.denariCount = p2Denari;
    return { p1, p2 };
  }

  function scoreBase(cards, scopa) {
    return { cards: 0, denari: 0, settebello: 0, primiera: 0, scopa };
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

  function playerView(match, seat) {
    if (!match) return null;
    const opponent = otherSeat(seat);
    const round = match.round;
    return {
      scores: { ...match.scores },
      roundNumber: match.roundNumber,
      targetScore: match.targetScore,
      status: match.status,
      winner: match.winner,
      round: round ? {
        deckCount: round.deck.length,
        table: clone(round.table),
        hand: clone(round.hands[seat] || []),
        opponentHandCount: (round.hands[opponent] || []).length,
        capturesCount: {
          [seat]: round.captures[seat].length,
          [opponent]: round.captures[opponent].length
        },
        scopa: { ...round.scopa },
        turn: round.turn,
        ended: round.ended
      } : null
    };
  }

  function publicView(match) {
    if (!match) return null;
    const round = match.round;
    return {
      scores: { ...match.scores },
      roundNumber: match.roundNumber,
      targetScore: match.targetScore,
      status: match.status,
      winner: match.winner,
      round: round ? {
        deckCount: round.deck.length,
        table: clone(round.table),
        handCounts: {
          p1: round.hands.p1.length,
          p2: round.hands.p2.length
        },
        capturesCount: {
          p1: round.captures.p1.length,
          p2: round.captures.p2.length
        },
        scopa: { ...round.scopa },
        turn: round.turn,
        ended: round.ended
      } : null
    };
  }

  function sumCards(cards) {
    return cards.reduce((sum, card) => sum + card.value, 0);
  }

  function removeById(cards, id) {
    const index = cards.findIndex((card) => card.id === id);
    if (index === -1) return null;
    return cards.splice(index, 1)[0];
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

  function otherSeat(seat) {
    return seat === "p1" ? "p2" : "p1";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  return {
    createMatch,
    startRound,
    applyMove,
    captureOptions,
    scoreRound,
    playerView,
    publicView,
    otherSeat
  };
});
