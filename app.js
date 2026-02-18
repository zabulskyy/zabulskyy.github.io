// app.js
"use strict";

// =========================
// Copy & translations
// =========================
const UI_TEXT = {
  uk: {
    pageTitle: "Який ти поц - тест",
    title: "Який ти поц - тест",
    subtitle: "6 питань. Обирай варіант, в кінці буде результат.",
    progressLabel: (current, total) => `Питання ${current}/${total}`,
    chosenLabel: (answered, total) => `Обрано: ${answered} / ${total}`,
    restart: "Почати заново",
    resultLabel: "Результат",
    yourResult: "Твій результат",
    confidenceLabel: "Достовірність",
    again: "Пройти ще раз",
    langToggle: "EN",
    start: "Почати тест",
  },
  en: {
    pageTitle: "What kind of guy are you - test",
    title: "What kind of guy are you - test",
    subtitle: "6 questions. Pick an option, you’ll see the result at the end.",
    progressLabel: (current, total) => `Question ${current}/${total}`,
    chosenLabel: (answered, total) => `Chosen: ${answered} / ${total}`,
    restart: "Start over",
    resultLabel: "Result",
    yourResult: "Your result",
    confidenceLabel: "Confidence",
    again: "Take the test again",
    langToggle: "УКР",
    start: "Start quiz",
  },
};

const TYPES = {
  "СКУФ": {
    uk: "неохайний, неактивний спосіб життя, консервативні погляди",
    en: "untidy, inactive lifestyle, conservative views",
  },
  "МАСІК": {
    uk: "стабільний, дбайливий, за фемінізм",
    en: "steady, caring, pro‑feminism",
  },
  "ТЮБІК": {
    uk: "емоційно недоступний, невпевнений, маніпулятор",
    en: "emotionally unavailable, insecure, manipulative",
  },
  "ШТРИХ": {
    uk: "небезпечний, пов’язаний з криміналом, контролюючий",
    en: "dangerous, linked to shady stuff, controlling",
  },
  "ЧЕЧИК": {
    uk: "нейтральний, приємний в спілкуванні, не викликає емоцій",
    en: "neutral, pleasant to talk to, doesn’t cause strong emotions",
  },
  "АЛЬФОНС": {
    uk: "підступний спокусник, піздабол, охайний та чистоплотний",
    en: "sly seducer, smooth talker, neat and well‑groomed",
  },
};

// Картинки: поклади файли в папку img/ поруч з index.html
// Замінюй назви файлів як хочеш
const TYPE_IMAGES = {
  "СКУФ": "skuf.png",
  "МАСІК": "masik.png",
  "ТЮБІК": "tubik.png",
  "ШТРИХ": "shtrykh.png",
  "ЧЕЧИК": "chechyk.png",
  "АЛЬФОНС": "alfons.png",
};

// deterministic tie-break order
const TYPE_ORDER = ["СКУФ", "МАСІК", "ТЮБІК", "ШТРИХ", "ЧЕЧИК", "АЛЬФОНС"];

const QUESTIONS = [
  {
    id: "new_place",
    text: {
      uk: "Ти приходиш у нове місце (кафе / офіс / бар). Що робиш першим?",
      en: "You come to a new place (café / office / bar). What do you do first?",
    },
    choices: [
      {
        key: "A",
        label: {
          uk: "Сідаю куди зручно, не заморочуюсь",
          en: "Sit wherever is comfy, don’t overthink it",
        },
        points: { "СКУФ": 2, "ЧЕЧИК": 1 },
      },
      {
        key: "B",
        label: {
          uk: "Дивлюсь, де всім буде комфортно",
          en: "Look for a spot where everyone will be comfortable",
        },
        points: { "МАСІК": 2 },
      },
      {
        key: "C",
        label: {
          uk: "Перевіряю, де виглядаю найкраще",
          en: "Check where I’ll look the best",
        },
        points: { "АЛЬФОНС": 2 },
      },
      {
        key: "D",
        label: {
          uk: "Вибираю позицію, щоб все контролювати",
          en: "Choose a position to keep everything under control",
        },
        points: { "ШТРИХ": 2 },
      },
      {
        key: "E",
        label: {
          uk: "Просто йду за потоком",
          en: "Just go with the flow",
        },
        points: { "ЧЕЧИК": 2 },
      },
    ],
  },
  {
    id: "reply_speed",
    text: {
      uk: "Тобі пишуть повідомлення. Ти зазвичай відповідаєш…",
      en: "Someone texts you. You usually reply…",
    },
    choices: [
      {
        key: "A",
        label: {
          uk: "Коли згадаю",
          en: "When I remember",
        },
        points: { "СКУФ": 2 },
      },
      {
        key: "B",
        label: {
          uk: "Майже одразу",
          en: "Almost right away",
        },
        points: { "МАСІК": 2 },
      },
      {
        key: "C",
        label: {
          uk: "Коли це вигідно або цікаво",
          en: "When it’s useful or interesting for me",
        },
        points: { "АЛЬФОНС": 2, "ТЮБІК": 1 },
      },
      {
        key: "D",
        label: {
          uk: "Коротко і по суті",
          en: "Short and to the point",
        },
        points: { "ТЮБІК": 2, "ЧЕЧИК": 1 },
      },
      {
        key: "E",
        label: {
          uk: "Нормально, без поспіху",
          en: "Normally, no rush",
        },
        points: { "ЧЕЧИК": 2 },
      },
    ],
  },
  {
    id: "conflict",
    text: {
      uk: "Хтось наїхав на тебе без причини. Ти:",
      en: "Someone snaps at you for no reason. You:",
    },
    choices: [
      {
        key: "A",
        label: {
          uk: "Ігнорую, не хочу енергію витрачати",
          en: "Ignore it, not wasting my energy",
        },
        points: { "СКУФ": 2 },
      },
      {
        key: "B",
        label: {
          uk: "Спокійно поясню і закрию питання",
          en: "Calmly explain and close the issue",
        },
        points: { "МАСІК": 2 },
      },
      {
        key: "C",
        label: {
          uk: "Переверну ситуацію в свою користь",
          en: "Turn the situation to my advantage",
        },
        points: { "АЛЬФОНС": 2, "ТЮБІК": 1 },
      },
      {
        key: "D",
        label: {
          uk: "Поставлю людину на місце",
          en: "Put the person in their place",
        },
        points: { "ШТРИХ": 2 },
      },
      {
        key: "E",
        label: {
          uk: "Усміхнусь і переведу в жарт",
          en: "Smile and turn it into a joke",
        },
        points: { "ЧЕЧИК": 2 },
      },
    ],
  },
  {
    id: "free_day",
    text: {
      uk: "У вихідний день без планів ти швидше за все…",
      en: "On a free day with no plans you’ll most likely…",
    },
    choices: [
      {
        key: "A",
        label: {
          uk: "Залипаю вдома",
          en: "Stay at home and chill",
        },
        points: { "СКУФ": 2 },
      },
      {
        key: "B",
        label: {
          uk: "Роблю щось корисне або організоване",
          en: "Do something useful or organised",
        },
        points: { "МАСІК": 2 },
      },
      {
        key: "C",
        label: {
          uk: "Йду туди, де можуть бути цікаві люди",
          en: "Go where there might be interesting people",
        },
        points: { "АЛЬФОНС": 2 },
      },
      {
        key: "D",
        label: {
          uk: "Перевіряю, що відбувається навколо і хто де",
          en: "Check what’s going on around and who’s where",
        },
        points: { "ШТРИХ": 2 },
      },
      {
        key: "E",
        label: {
          uk: "Роблю щось просте і спокійне",
          en: "Do something simple and calm",
        },
        points: { "ЧЕЧИК": 2 },
      },
    ],
  },
  {
    id: "group_choice",
    text: {
      uk: "Коли компанія вибирає, що робити далі, ти…",
      en: "When the group is deciding what to do next, you…",
    },
    choices: [
      {
        key: "A",
        label: {
          uk: "Мені ок майже будь-що",
          en: "I’m fine with almost anything",
        },
        points: { "ЧЕЧИК": 2 },
      },
      {
        key: "B",
        label: {
          uk: "Пропоную нормальний план",
          en: "Propose a solid, reasonable plan",
        },
        points: { "МАСІК": 2 },
      },
      {
        key: "C",
        label: {
          uk: "Підкидаю найвеселішу ідею",
          en: "Throw in the most fun idea",
        },
        points: { "АЛЬФОНС": 2, "ЧЕЧИК": 1 },
      },
      {
        key: "D",
        label: {
          uk: "Кажу, як буде краще, і веду процес",
          en: "Say what’s best and lead the process",
        },
        points: { "ШТРИХ": 2 },
      },
      {
        key: "E",
        label: {
          uk: "Просто підтримую розмову",
          en: "Just keep the conversation going",
        },
        points: { "ЧЕЧИК": 1, "ТЮБІК": 1 },
      },
    ],
  },
  {
    id: "after_argument",
    text: {
      uk: "Після невеликої сварки ти зазвичай…",
      en: "After a small argument you usually…",
    },
    choices: [
      {
        key: "A",
        label: {
          uk: "Чекаю, поки все саме охолоне",
          en: "Wait until everything cools down on its own",
        },
        points: { "СКУФ": 2, "ТЮБІК": 1 },
      },
      {
        key: "B",
        label: {
          uk: "Пишу першим(ою), щоб закрити питання",
          en: "Text first to close the issue",
        },
        points: { "МАСІК": 2 },
      },
      {
        key: "C",
        label: {
          uk: "Роблю вигляд, що нічого не сталось",
          en: "Act like nothing happened",
        },
        points: { "ТЮБІК": 2 },
      },
      {
        key: "D",
        label: {
          uk: "Хочу, щоб людина зрозуміла, хто правий",
          en: "Want the other person to understand who was right",
        },
        points: { "ШТРИХ": 2 },
      },
      {
        key: "E",
        label: {
          uk: "Легко переводжу все в нейтраль",
          en: "Easily bring everything back to neutral",
        },
        points: { "ЧЕЧИК": 2 },
      },
    ],
  },
];

// =========================
// App state + helpers
// =========================
function getText(obj, lang) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.uk || "";
}

function shuffleArray(input) {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createShuffledQuestions() {
  return shuffleArray(QUESTIONS);
}

const state = {
  idx: 0,
  scores: initScores(),
  questions: createShuffledQuestions(),
  lang: "uk",
  phase: "intro",
};

function initScores() {
  const s = {};
  for (const t of TYPE_ORDER) s[t] = 0;
  return s;
}

function addPoints(points) {
  for (const [t, pts] of Object.entries(points)) {
    if (!(t in state.scores)) state.scores[t] = 0;
    state.scores[t] += pts;
  }
}

function pickWinner() {
  let best = -Infinity;
  for (const t of TYPE_ORDER) best = Math.max(best, state.scores[t] || 0);
  const candidates = TYPE_ORDER.filter(t => (state.scores[t] || 0) === best);
  return candidates[0];
}

// "Достовірність" як частка переможця від суми балів (0..100).
// Мінімально, прозоро, без магії.
function computeConfidencePercent(winner) {
  const total = TYPE_ORDER.reduce((acc, t) => acc + (state.scores[t] || 0), 0);
  if (total <= 0) return 0;
  const win = state.scores[winner] || 0;
  return Math.round((win / total) * 100);
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function animateConfidence(confidence) {
  const fill = document.getElementById("confidenceFill");
  const text = document.getElementById("confidenceText");
  if (!fill || !text) return;

  fill.style.width = "0%";
  text.textContent = "0%";

  // Next-frame update so the browser can animate 0% -> target.
  requestAnimationFrame(() => {
    fill.style.width = `${confidence}%`;

    const start = performance.now();
    const durationMs = 900;

    function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const current = Math.round(confidence * t);
      text.textContent = `${current}%`;
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

// =========================
// Rendering
// =========================
const appEl = document.getElementById("app");
const progressEl = document.getElementById("progress");
const restartBtn = document.getElementById("restartBtn");
const langToggleBtn = document.getElementById("langToggleBtn");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");

function updateStaticTexts() {
  const t = UI_TEXT[state.lang];
  document.title = t.pageTitle;
  if (titleEl) titleEl.textContent = t.title;
  if (subtitleEl) subtitleEl.textContent = t.subtitle;
  if (restartBtn) restartBtn.textContent = t.restart;
  if (langToggleBtn) langToggleBtn.textContent = t.langToggle;
}

restartBtn.addEventListener("click", () => {
  state.idx = 0;
  state.scores = initScores();
  state.questions = createShuffledQuestions();
   state.phase = "intro";
  render();
});

if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => {
    state.lang = state.lang === "uk" ? "en" : "uk";
    render();
  });
}

function render() {
  updateStaticTexts();

  const t = UI_TEXT[state.lang];

  if (state.phase === "intro") {
    if (progressEl) progressEl.textContent = "";
    appEl.innerHTML = `
      <div class="intro-layout">
        <div class="intro-media">
          <img src="img/cover.png" alt="cover" />
        </div>
        <div class="intro-main">
          <div class="q">${esc(t.subtitle)}</div>
          <div class="row">
            <button class="btn" id="startBtn">${esc(t.start)}</button>
          </div>
        </div>
      </div>
    `;

    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        state.idx = 0;
        state.scores = initScores();
        state.questions = createShuffledQuestions();
        state.phase = "quiz";
        render();
      });
    }
    return;
  }

  if (state.idx < state.questions.length) {
    const q = state.questions[state.idx];
    progressEl.textContent = t.progressLabel(state.idx + 1, state.questions.length);

    const choicesForRender = shuffleArray(q.choices);

    appEl.innerHTML = `
      <div class="q">${esc(getText(q.text, state.lang))}</div>
      <div>
        ${choicesForRender.map(c => `
          <button class="opt" data-key="${esc(c.key)}">
            ${esc(getText(c.label, state.lang))}
          </button>
        `).join("")}
      </div>
      <div class="muted">${esc(t.chosenLabel(state.idx, state.questions.length))}</div>
    `;

    for (const btn of appEl.querySelectorAll(".opt")) {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key");
        const choice = q.choices.find(x => x.key === key);
        if (!choice) return;

        addPoints(choice.points);
        state.idx += 1;
        render();
      });
    }
    return;
  }

  const winner = pickWinner();
  const confidence = computeConfidencePercent(winner);
  progressEl.textContent = t.resultLabel;

  const winnerScore = state.scores[winner] || 0;

  const adjustedEntries = TYPE_ORDER.map(type => {
    const raw = state.scores[type] || 0;
    let adjusted = raw;
    if (type !== winner && raw === winnerScore && raw > 0) {
      adjusted = raw - 1;
    }
    return { type, raw, adjusted };
  }).filter(entry => entry.adjusted > 0);

  const maxAdjusted = adjustedEntries.reduce(
    (max, entry) => Math.max(max, entry.adjusted),
    0
  ) || 1;

  adjustedEntries.sort((a, b) => {
    if (b.adjusted !== a.adjusted) return b.adjusted - a.adjusted;
    return TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
  });

  const scoreBarsHtml = adjustedEntries.map(entry => {
    let pct = Math.round((entry.adjusted / maxAdjusted) * 100);
    if (pct > 0 && pct < 100) {
      const minDelta = 2;
      const maxDelta = Math.min(20, pct);
      if (maxDelta >= minDelta) {
        const delta = minDelta + Math.floor(Math.random() * (maxDelta - minDelta + 1));
        pct = Math.max(0, pct - delta);
      }
    }
    return `
      <div class="muted">${esc(entry.type)}</div>
      <div class="conf-bar">
        <div class="conf-fill" style="width: ${pct}%"></div>
      </div>
    `;
  }).join("");

  const imgFile = TYPE_IMAGES[winner];
  const imgHtml = imgFile
    ? `<img class="result-img" src="img/${esc(imgFile)}" alt="${esc(winner)}" />`
    : "";

  appEl.innerHTML = `
    <div class="q">${esc(t.yourResult)}: ${esc(winner)}</div>
    <div class="muted">${esc(getText(TYPES[winner], state.lang))}</div>
    <div class="muted">${esc(t.confidenceLabel)}: <strong id="confidenceText">0%</strong></div>
    <div class="conf-bar" role="progressbar" aria-label="${esc(t.confidenceLabel)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${confidence}">
      <div class="conf-fill" id="confidenceFill" style="width: 0%"></div>
    </div>
    ${imgHtml}
    <div class="hr"></div>
    ${scoreBarsHtml}
    <div class="row">
      <button class="btn" id="againBtn">${esc(t.again)}</button>
    </div>
  `;

  animateConfidence(confidence);

  const againBtn = document.getElementById("againBtn");
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      state.idx = 0;
      state.scores = initScores();
      state.questions = createShuffledQuestions();
      state.phase = "intro";
      render();
    });
  }
}

render();
