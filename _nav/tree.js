/*
 * Дерево сторінок репо — єдине джерело для навігатора.
 *
 * Правила:
 *  - тут лише сторінки, які вже існують; нова HTML-сторінка стає вузлом тут у тому самому кроці;
 *  - href — шлях від кореня репо, без початкового "/";
 *  - children — вкладені сторінки або розділи сторінки (#якір); вузол із children згортається:
 *    стрілка ховає/показує підпункти, назва відкриває сторінку; поточна сторінка розгорнута;
 *
 * Формат:
 *  { title: "Сторінка", href: "dir/page.html", children: [ ... ] }
 *  Вузол без href — гілка без своєї сторінки: лише «Екрани» і групи в ній. Клік по назві згортає гілку.
 *
 * Гілка «Екрани» — вайрфрейми. Її розділи — групи з sitemap.md («Екрани», колонка «Група»):
 * { title: "Група", children: [ екрани групи ] }. Розділ групи з'являється разом з першою сторінкою
 * групи; назви екранів — з реєстру. Children екрана — лише сторінки його станів, зони екрана в дереві не показуємо.
 */
window.NAV_TREE = [
  { title: "Старт", href: "index.html" },
  { title: "Ресерч", href: "research/research.html", children: [
    { title: "TL;DR", href: "research/research.html#tldr" },
    { title: "Звідки дані", href: "research/research.html#data" },
    { title: "Конкуренти", href: "research/research.html#competitors" },
    { title: "Бенчмарк", href: "research/research.html#benchmark" },
    { title: "Патерни", href: "research/research.html#patterns" },
    { title: "Висновки", href: "research/research.html#conclusions" },
    { title: "Джерела", href: "research/research.html#sources" }
  ] },
  { title: "Персони і jobs", href: "personas.html", children: [
    { title: "TL;DR", href: "personas.html#tldr" },
    { title: "Персони", href: "personas.html#personas" },
    { title: "Ієрархія jobs", href: "personas.html#jobs" },
    { title: "JTBD-матриця", href: "personas.html#matrix" },
    { title: "Висновок", href: "personas.html#conclusion" }
  ] },
  { title: "Структура IA", href: "ia.html", children: [
    { title: "TL;DR", href: "ia.html#tldr" },
    { title: "Карта екранів", href: "ia.html#sitemap" },
    { title: "Навігація", href: "ia.html#navigation" },
    { title: "Flows", href: "ia.html#flows", children: [
      { title: "Як читати", href: "ia.html#flows-read" },
      { title: "Чому ці jobs", href: "ia.html#flows-why" },
      { title: "Main · Відкласти й дістати", href: "ia.html#flow-main" },
      { title: "R4 · Дістати за пам'яттю", href: "ia.html#flow-r4" },
      { title: "R3 · Порядок без сортування", href: "ia.html#flow-r3" },
      { title: "R3, далі · Шар «Посилання»", href: "ia.html#flow-r3-next" },
      { title: "E2 · Не втратити все", href: "ia.html#flow-e2" },
      { title: "Кінці без виходу", href: "ia.html#dead-ends" }
    ] },
    { title: "Трасування", href: "ia.html#trace" }
  ] },
  { title: "Екрани", children: [
    { title: "Шухляда", children: [
      { title: "Моя Шухляда", href: "wireframes/drawer.html", children: [
        { title: "Порожній", href: "wireframes/drawer-empty.html" },
        { title: "Завантаження", href: "wireframes/drawer-loading.html" },
        { title: "Помилка", href: "wireframes/drawer-error.html" },
        { title: "Успіх", href: "wireframes/drawer-success.html" }
      ] }
    ] },
    { title: "Пошук", children: [
      { title: "Пошук", href: "wireframes/search.html", children: [
        { title: "Порожній", href: "wireframes/search-empty.html" },
        { title: "Завантаження", href: "wireframes/search-loading.html" },
        { title: "Помилка", href: "wireframes/search-error.html" },
        { title: "Успіх", href: "wireframes/search-success.html" }
      ] }
    ] },
    { title: "Посилання", children: [
      { title: "Посилання", href: "wireframes/link.html", children: [
        { title: "Завантаження", href: "wireframes/link-loading.html" },
        { title: "Помилка", href: "wireframes/link-error.html" },
        { title: "Успіх", href: "wireframes/link-success.html" }
      ] }
    ] },
    { title: "Мої дані", children: [
      { title: "Акаунт", href: "wireframes/account.html", children: [
        { title: "Порожній", href: "wireframes/account-empty.html" },
        { title: "Завантаження", href: "wireframes/account-loading.html" },
        { title: "Помилка", href: "wireframes/account-error.html" },
        { title: "Успіх", href: "wireframes/account-success.html" }
      ] },
      { title: "Вхід", href: "wireframes/login.html", children: [
        { title: "Завантаження", href: "wireframes/login-loading.html" },
        { title: "Помилка", href: "wireframes/login-error.html" },
        { title: "Успіх", href: "wireframes/login-success.html" }
      ] }
    ] }
  ] }
];
