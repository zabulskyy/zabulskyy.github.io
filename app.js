// app.js
"use strict";

// =========================
// "База даних" тесту
// =========================
const TYPES = {
  "СКУФ": "неохайний, неактивний спосіб життя, консервативні погляди",
  "МАСІК": "стабільний, дбайливий, за фемінізм",
  "ТЮБІК": "емоційно недоступний, невпевнений, маніпулятор",
  "ШТРИХ": "небезпечний, пов’язаний з криміналом, контролюючий",
  "ЧЕЧИК": "нейтральний, приємний в спілкуванні, не викликає емоцій",
  "АЛЬФОНС": "підступний спокусник, піздабол, охайний та чистоплотний",
};

// Картинки: поклади файли в папку img/ поруч з index.html
// Замінюй назви файлів як хочеш
const TYPE_IMAGES = {
  "СКУФ": "skuf.png",
  "МАСІК": "masik.png",
  "ТЮБІК": "tyubik.png",
  "ШТРИХ": "shtrykh.png",
  "ЧЕЧИК": "chechyk.png",
  "АЛЬФОНС": "alfons.png",
};

// deterministic tie-break order
const TYPE_ORDER = ["СКУФ", "МАСІК", "ТЮБІК", "ШТРИХ", "ЧЕЧИК", "АЛЬФОНС"];

const QUESTIONS = [
  {
    id: "new_place",
    text: "1) Ти приходиш у нове місце (кафе / офіс / бар). Що робиш першим?",
    choices: [
      { key: "A", label: "Сідаю куди зручно, не заморочуюсь", points: { "СКУФ": 2, "ЧЕЧИК": 1 } },
      { key: "B", label: "Дивлюсь, де всім буде комфортно", points: { "МАСІК": 2 } },
      { key: "C", label: "Перевіряю, де виглядаю найкраще", points: { "АЛЬФОНС": 2 } },
      { key: "D", label: "Вибираю позицію, щоб все контролювати", points: { "ШТРИХ": 2 } },
      { key: "E", label: "Просто йду за потоком", points: { "ЧЕЧИК": 2 } },
    ],
  },
  {
    id: "reply_speed",
    text: "2) Тобі пишуть повідомлення. Ти зазвичай відповідаєш…",
    choices: [
      { key: "A", label: "Коли згадаю", points: { "СКУФ": 2 } },
      { key: "B", label: "Майже одразу", points: { "МАСІК": 2 } },
      { key: "C", label: "Коли це вигідно або цікаво", points: { "АЛЬФОНС": 2, "ТЮБІК": 1 } },
      { key: "D", label: "Коротко і по суті", points: { "ТЮБІК": 2, "ЧЕЧИК": 1 } },
      { key: "E", label: "Нормально, без поспіху", points: { "ЧЕЧИК": 2 } },
    ],
  },
  {
    id: "conflict",
    text: "3) Хтось наїхав на тебе без причини. Ти:",
    choices: [
      { key: "A", label: "Ігнорую, не хочу енергію витрачати", points: { "СКУФ": 2 } },
      { key: "B", label: "Спокійно поясню і закрию питання", points: { "МАСІК": 2 } },
      { key: "C", label: "Переверну ситуацію в свою користь", points: { "АЛЬФОНС": 2, "ТЮБІК": 1 } },
      { key: "D", label: "Поставлю людину на місце", points: { "ШТРИХ": 2 } },
      { key: "E", label: "Усміхнусь і переведу в жарт", points: { "ЧЕЧИК": 2 } },
    ],
  },
  {
    id: "free_day",
    text: "4) У вихідний день без планів ти швидше за все…",
    choices: [
      { key: "A", label: "Залипаю вдома", points: { "СКУФ": 2 } },
      { key: "B", label: "Роблю щось корисне або організоване", points: { "МАСІК": 2 } },
      { key: "C", label: "Йду туди, де можуть бути цікаві люди", points: { "АЛЬФОНС": 2 } },
      { key: "D", label: "Перевіряю, що відбувається навколо і хто де", points: { "ШТРИХ": 2 } },
      { key: "E", label: "Роблю щось просте і спокійне", points: { "ЧЕЧИК": 2 } },
    ],
  },
  {
    id: "group_choice",
    text: "5) Коли компанія вибирає, що робити далі, ти…",
    choices: [
      { key: "A", label: "Мені ок майже будь-що", points: { "ЧЕЧИК": 2 } },
      { key: "B", label: "Пропоную нормальний план", points: { "МАСІК": 2 } },
      { key: "C", label: "Підкидаю найвеселішу ідею", points: { "АЛЬФОНС": 2, "ЧЕЧИК": 1 } },
      { key: "D", label: "Кажу, як буде краще, і веду процес", points: { "ШТРИХ": 2 } },
      { key: "E", label: "Просто підтримую розмову", points: { "ЧЕЧИК": 1, "ТЮБІК": 1 } },
    ],
  },
  {
    id: "after_argument",
    text: "6) Після невеликої сварки ти зазвичай…",
    choices: [
      { key: "A", label: "Чекаю, поки все саме охолоне", points: { "СКУФ": 2, "ТЮБІК": 1 } },
      { key: "B", label: "Пишу першим(ою), щоб закрити питання", points: { "МАСІК": 2 } },
      { key: "C", label: "Роблю вигляд, що нічого не сталось", points: { "ТЮБІК": 2 } },
      { key: "D", label: "Хочу, щоб людина зрозуміла, хто правий", points: { "ШТРИХ": 2 } },
      { key: "E", label: "Легко переводжу все в нейтраль", points: { "ЧЕЧИК": 2 } },
    ],
  },
];

// =========================
// App state + helpers
// =========================
const state = { idx: 0, scores: initScores() };

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

restartBtn.addEventListener("click", () => {
  state.idx = 0;
  state.scores = initScores();
  render();
});

function render() {
  if (state.idx < QUESTIONS.length) {
    const q = QUESTIONS[state.idx];
    progressEl.textContent = `Питання ${state.idx + 1}/${QUESTIONS.length}`;

    appEl.innerHTML = `
      <div class="q">${esc(q.text)}</div>
      <div>
        ${q.choices.map(c => `
          <button class="opt" data-key="${esc(c.key)}">
            <strong>${esc(c.key)})</strong> ${esc(c.label)}
          </button>
        `).join("")}
      </div>
      <div class="muted">Обрано: ${state.idx} / ${QUESTIONS.length}</div>
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
  progressEl.textContent = "Результат";

  const scoreLines = TYPE_ORDER
    .map(t => `${t}: ${state.scores[t] || 0}`)
    .join("\n");

  const imgFile = TYPE_IMAGES[winner];
  const imgHtml = imgFile
    ? `<img class="result-img" src="img/${esc(imgFile)}" alt="${esc(winner)}" />`
    : "";

  appEl.innerHTML = `
    <div class="q">Твій результат: ${esc(winner)}</div>
    <!-- <div class="muted">${esc(TYPES[winner] || "")}</div> -->
    <div class="muted">Достовірність: <strong id="confidenceText">0%</strong></div>
    <div class="conf-bar" role="progressbar" aria-label="Достовірність" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${confidence}">
      <div class="conf-fill" id="confidenceFill" style="width: 0%"></div>
    </div>
    ${imgHtml}
    <div class="hr"></div>
    <!-- <div class="muted">Бали:</div> -->
    <!-- <pre class="scores">${esc(scoreLines)}</pre> -->
    <div class="row">
      <button class="btn" id="againBtn">Пройти ще раз</button>
    </div>
  `;

  animateConfidence(confidence);

  const againBtn = document.getElementById("againBtn");
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      state.idx = 0;
      state.scores = initScores();
      render();
    });
  }
}

render();
