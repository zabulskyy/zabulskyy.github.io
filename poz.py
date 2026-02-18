from dataclasses import dataclass
from collections import Counter
from typing import Dict, List, Tuple



TYPES: Dict[str, str] = {
    "СКУФ": "неохайний, неактивний спосіб життя, консервативні погляди",
    "МАСІК": "стабільний, дбайливий, за фемінізм",
    "ТЮБІК": "емоційно недоступний, невпевнений, маніпулятор",
    "ШТРИХ": "небезпечний, пов’язаний з криміналом, контролюючий",
    "ЧЕЧИК": "нейтральний, приємний в спілкуванні, не викликає емоцій",
    "АЛЬФОНС": "підступний спокусник, піздабол, охайний та чистоплотний",
}

TYPE_ORDER: List[str] = ["СКУФ", "МАСІК", "ТЮБІК", "ШТРИХ", "ЧЕЧИК", "АЛЬФОНС"]

QUESTIONS_DB = [
    {
        "id": "new_place",
        "text": "1) Ти приходиш у нове місце (кафе / офіс / бар). Що робиш першим?",
        "choices": [
            {"key": "A", "label": "Сідаю куди зручно, не заморочуюсь", "points": {"СКУФ": 2, "ЧЕЧИК": 1}},
            {"key": "B", "label": "Дивлюсь, де всім буде комфортно", "points": {"МАСІК": 2}},
            {"key": "C", "label": "Перевіряю, де виглядаю найкраще", "points": {"АЛЬФОНС": 2}},
            {"key": "D", "label": "Вибираю позицію, щоб все контролювати", "points": {"ШТРИХ": 2}},
            {"key": "E", "label": "Просто йду за потоком", "points": {"ЧЕЧИК": 2}},
        ],
    },
    {
        "id": "reply_speed",
        "text": "2) Тобі пишуть повідомлення. Ти зазвичай відповідаєш…",
        "choices": [
            {"key": "A", "label": "Коли згадаю", "points": {"СКУФ": 2}},
            {"key": "B", "label": "Майже одразу", "points": {"МАСІК": 2}},
            {"key": "C", "label": "Коли це вигідно або цікаво", "points": {"АЛЬФОНС": 2, "ТЮБІК": 1}},
            {"key": "D", "label": "Коротко і по суті", "points": {"ТЮБІК": 2, "ЧЕЧИК": 1}},
            {"key": "E", "label": "Нормально, без поспіху", "points": {"ЧЕЧИК": 2}},
        ],
    },
    {
        "id": "conflict",
        "text": "3) Хтось наїхав на тебе без причини. Ти:",
        "choices": [
            {"key": "A", "label": "Ігнорую, не хочу енергію витрачати", "points": {"СКУФ": 2}},
            {"key": "B", "label": "Спокійно поясню і закрию питання", "points": {"МАСІК": 2}},
            {"key": "C", "label": "Переверну ситуацію в свою користь", "points": {"АЛЬФОНС": 2, "ТЮБІК": 1}},
            {"key": "D", "label": "Поставлю людину на місце", "points": {"ШТРИХ": 2}},
            {"key": "E", "label": "Усміхнусь і переведу в жарт", "points": {"ЧЕЧИК": 2}},
        ],
    },
    {
        "id": "free_day",
        "text": "4) У вихідний день без планів ти швидше за все…",
        "choices": [
            {"key": "A", "label": "Залипаю вдома", "points": {"СКУФ": 2}},
            {"key": "B", "label": "Роблю щось корисне або організоване", "points": {"МАСІК": 2}},
            {"key": "C", "label": "Йду туди, де можуть бути цікаві люди", "points": {"АЛЬФОНС": 2}},
            {"key": "D", "label": "Перевіряю, що відбувається навколо і хто де", "points": {"ШТРИХ": 2}},
            {"key": "E", "label": "Роблю щось просте і спокійне", "points": {"ЧЕЧИК": 2}},
        ],
    },
    {
        "id": "group_choice",
        "text": "5) Коли компанія вибирає, що робити далі, ти…",
        "choices": [
            {"key": "A", "label": "Мені ок майже будь-що", "points": {"ЧЕЧИК": 2}},
            {"key": "B", "label": "Пропоную нормальний план", "points": {"МАСІК": 2}},
            {"key": "C", "label": "Підкидаю найвеселішу ідею", "points": {"АЛЬФОНС": 2, "ЧЕЧИК": 1}},
            {"key": "D", "label": "Кажу, як буде краще, і веду процес", "points": {"ШТРИХ": 2}},
            {"key": "E", "label": "Просто підтримую розмову", "points": {"ЧЕЧИК": 1, "ТЮБІК": 1}},
        ],
    },
    {
        "id": "after_argument",
        "text": "6) Після невеликої сварки ти зазвичай…",
        "choices": [
            {"key": "A", "label": "Чекаю, поки все саме охолоне", "points": {"СКУФ": 2, "ТЮБІК": 1}},
            {"key": "B", "label": "Пишу першим(ою), щоб закрити питання", "points": {"МАСІК": 2}},
            {"key": "C", "label": "Роблю вигляд, що нічого не сталось", "points": {"ТЮБІК": 2}},
            {"key": "D", "label": "Хочу, щоб людина зрозуміла, хто правий", "points": {"ШТРИХ": 2}},
            {"key": "E", "label": "Легко переводжу все в нейтраль", "points": {"ЧЕЧИК": 2}},
        ],
    },
]

# =========================

@dataclass(frozen=True)
class Choice:
    key: str
    label: str
    points: Dict[str, int]

@dataclass(frozen=True)
class Question:
    qid: str
    text: str
    choices: List[Choice]

def validate_db(types: Dict[str, str], questions_raw: List[Dict]) -> List[Question]:
    known_types = set(types.keys())
    questions: List[Question] = []

    for q in questions_raw:
        if "id" not in q or "text" not in q or "choices" not in q:
            raise ValueError(f"Bad question entry (missing keys): {q}")

        qid = str(q["id"])
        text = str(q["text"])
        choices_raw = q["choices"]

        if not isinstance(choices_raw, list) or not choices_raw:
            raise ValueError(f"Question '{qid}' has no choices.")

        seen_keys = set()
        choices: List[Choice] = []
        for c in choices_raw:
            key = str(c["key"]).upper()
            if key in seen_keys:
                raise ValueError(f"Duplicate choice key '{key}' in question '{qid}'.")
            seen_keys.add(key)

            label = str(c["label"])
            points = dict(c.get("points", {}))

            # validate points
            for t, pts in points.items():
                if t not in known_types:
                    raise ValueError(f"Unknown type '{t}' in question '{qid}' choice '{key}'.")
                if not isinstance(pts, int) or pts < 0:
                    raise ValueError(f"Bad points '{pts}' for type '{t}' in '{qid}' choice '{key}'.")

            choices.append(Choice(key=key, label=label, points=points))

        questions.append(Question(qid=qid, text=text, choices=choices))

    return questions

def ask_choice(question: Question) -> Choice:
    valid = {c.key for c in question.choices}
    while True:
        print("\n" + question.text)
        for c in question.choices:
            print(f"  {c.key}) {c.label}")
        ans = input("> ").strip().upper()
        if ans in valid:
            return next(c for c in question.choices if c.key == ans)
        print(f"Невірно. Введи одну з літер: {', '.join(sorted(valid))}")

def pick_winner(scores: Counter, type_order: List[str]) -> str:
    if not scores:
        return type_order[0]
    best = max(scores.values())
    candidates = {t for t, s in scores.items() if s == best}
    for t in type_order:
        if t in candidates:
            return t
    return next(iter(candidates))

def run_test(questions: List[Question], type_order: List[str]) -> Tuple[str, Counter]:
    scores: Counter = Counter()
    for q in questions:
        choice = ask_choice(q)
        for t, pts in choice.points.items():
            scores[t] += pts
    winner = pick_winner(scores, type_order)
    return winner, scores


def main():
    questions = validate_db(TYPES, QUESTIONS_DB)

    print("Тест: Який ти поц (6 питань, скоринг)")
    print("Відповідай літерами A/B/C...")

    winner, scores = run_test(questions, TYPE_ORDER)

    print("\n" + "=" * 54)
    print(f"Твій результат: {winner}")
    print(f"Характеристики: {TYPES[winner]}")
    print("=" * 54)

    print("\nБали:")
    for t in TYPE_ORDER:
        print(f"  {t}: {scores.get(t, 0)}")


if __name__ == "__main__":
    main()
