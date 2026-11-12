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
    { title: "Звідки дані", path: "research/research.html#data" },
    { title: "Конкуренти", path: "research/research.html#competitors" },
    { title: "Бенчмарк", path: "research/research.html#benchmark" },
    { title: "Патерни", path: "research/research.html#patterns" },
    { title: "Висновки", path: "research/research.html#conclusions" },
    { title: "Джерела", path: "research/research.html#sources" }
  ] }
];
