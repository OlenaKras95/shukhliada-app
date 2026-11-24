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
 *
 * Гілка «Екрани» — вайрфрейми. Розділи в ній — групи з sitemap.md («Екрани», колонка «Група»),
 * вкладеними гілками: { branch: "Група", items: [ екрани групи ] }. Розділ групи з'являється
 * разом з першою сторінкою групи; назви екранів — з реєстру.
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
  ] },
  { branch: "Екрани", items: [
    { branch: "Шухляда", items: [
      { title: "Моя Шухляда", path: "wireframes/drawer.html", children: [
        { title: "Порожній", path: "wireframes/drawer-empty.html" },
        { title: "Завантаження", path: "wireframes/drawer-loading.html" },
        { title: "Помилка", path: "wireframes/drawer-error.html" },
        { title: "Успіх", path: "wireframes/drawer-success.html" }
      ] }
    ] },
    { branch: "Пошук", items: [
      { title: "Пошук", path: "wireframes/search.html", children: [
        { title: "Порожній", path: "wireframes/search-empty.html" },
        { title: "Завантаження", path: "wireframes/search-loading.html" },
        { title: "Помилка", path: "wireframes/search-error.html" },
        { title: "Успіх", path: "wireframes/search-success.html" }
      ] }
    ] },
    { branch: "Посилання", items: [
      { title: "Посилання", path: "wireframes/link.html", children: [
        { title: "Завантаження", path: "wireframes/link-loading.html" },
        { title: "Помилка", path: "wireframes/link-error.html" },
        { title: "Успіх", path: "wireframes/link-success.html" }
      ] }
    ] },
    { branch: "Мої дані", items: [
      { title: "Акаунт", path: "wireframes/account.html", children: [
        { title: "Порожній", path: "wireframes/account-empty.html" },
        { title: "Завантаження", path: "wireframes/account-loading.html" },
        { title: "Помилка", path: "wireframes/account-error.html" },
        { title: "Успіх", path: "wireframes/account-success.html" }
      ] },
      { title: "Вхід", path: "wireframes/login.html", children: [
        { title: "Завантаження", path: "wireframes/login-loading.html" },
        { title: "Помилка", path: "wireframes/login-error.html" },
        { title: "Успіх", path: "wireframes/login-success.html" }
      ] }
    ] }
  ] }
];
