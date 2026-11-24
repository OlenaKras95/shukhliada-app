/*
 * Дерево сторінок репо — єдине джерело для навігатора.
 *
 * Правила:
 *  - тут лише сторінки, які вже існують;
 *  - гілка (branch) з'являється разом зі своєю першою сторінкою;
 *  - path — шлях від кореня репо, без початкового "/";
 *  - children — вкладені сторінки або розділи сторінки (#якір); пункт із children
 *    стає дропдауном: стрілка ховає/показує підпункти, назва відкриває сторінку.
 *
 * Формат:
 *  { title: "Сторінка", path: "dir/page.html", children: [ ... ] }
 *  { branch: "Гілка", items: [ { title, path, children? }, ... ] }
 */
window.NAV_TREE = [
  { title: "Старт", path: "index.html" },
  { title: "Ресерч", path: "research/research.html", children: [
    { title: "TL;DR", path: "research/research.html#tldr" },
    { title: "Звідки дані", path: "research/research.html#data" },
    { title: "Конкуренти", path: "research/research.html#competitors" },
    { title: "Бенчмарк", path: "research/research.html#benchmark" },
    { title: "Патерни", path: "research/research.html#patterns" },
    { title: "Висновки", path: "research/research.html#conclusions" },
    { title: "Джерела", path: "research/research.html#sources" }
  ] },
  { title: "Персони і jobs", path: "personas.html", children: [
    { title: "TL;DR", path: "personas.html#tldr" },
    { title: "Персони", path: "personas.html#personas" },
    { title: "Ієрархія jobs", path: "personas.html#jobs" },
    { title: "JTBD-матриця", path: "personas.html#matrix" },
    { title: "Висновок", path: "personas.html#conclusion" }
  ] },
  { title: "Структура IA", path: "ia.html", children: [
    { title: "TL;DR", path: "ia.html#tldr" },
    { title: "Карта екранів", path: "ia.html#sitemap" },
    { title: "Навігація", path: "ia.html#navigation" },
    { title: "Flows", path: "ia.html#flows", children: [
      { title: "Як читати", path: "ia.html#flows-read" },
      { title: "Чому ці jobs", path: "ia.html#flows-why" },
      { title: "Main · Відкласти й дістати", path: "ia.html#flow-main" },
      { title: "R4 · Дістати за пам'яттю", path: "ia.html#flow-r4" },
      { title: "R3 · Порядок без сортування", path: "ia.html#flow-r3" },
      { title: "R3, далі · Шар «Посилання»", path: "ia.html#flow-r3-next" },
      { title: "E2 · Не втратити все", path: "ia.html#flow-e2" },
      { title: "Кінці без виходу", path: "ia.html#dead-ends" }
    ] },
    { title: "Трасування", path: "ia.html#trace" }
  ] }
];
