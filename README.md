# Шухляда

**Репо:** https://github.com/OlenaKras95/shukhliada-app · **Сайт:** https://olenakras95.github.io/shukhliada-app/

Особистий цифровий архів посилань: фільми й серіали, місця, статті, документи, події, курси. Усе в одному місці.

**Навіщо.** Посилання розкидані по закладках, нотатках, «Збереженому» в Telegram і чатах, і згадати, де що лежить, неможливо. Шухляда це виправляє: зберегти посилання займає кілька секунд, а знайти його можна одним пошуком.

**Для кого.** Люди 22–40 років, які багато часу проводять онлайн: дизайнери, айтівці, студенти, ті, хто вчиться, планує поїздки й події.

## Перша версія
- Збереження вставкою посилання (`Ctrl+V`); назва, опис та іконка сайту підтягуються автоматично
- 8 категорій, серед них «Покупки» й «Інше»; категорії визначаються за сайтом і запам'ятовують виправлення; прості теги, нотатка, позначка «Вже переглянуто»
- Пошук, стійкий до одруківок і до різних форм слова (`Ctrl+K`), і фільтри
- Вхід через Google, синхронізація між пристроями; експорт усієї Шухляди одним файлом
- Desktop-first; зберігати й шукати можна й з телефона (на Android — через «Поділитися»); українською

## Настрій
М'який, теплий, людяний: затишний особистий простір, а не робочий інструмент.

## Стек
Next.js · Tailwind CSS · Supabase · Vercel

## Етапи
0. Дослідження — завершено
1. Клікабельний прототип з тестовими даними (зараз)
2. Бенчмарк і візуальний напрям
3. Робочий застосунок

Повний бриф лежить у [CLAUDE.md](./CLAUDE.md).

## Артефакти
| Що | Де |
|---|---|
| Стартова сторінка | [index.html](./index.html) · [на сайті](https://olenakras95.github.io/shukhliada-app/) |
| Бриф і правила роботи | [CLAUDE.md](./CLAUDE.md) |
| Дослідження | [research/](./research/) |
| Ресерч | [research/research.md](./research/research.md) · [research.html](./research/research.html) · [на сайті](https://olenakras95.github.io/shukhliada-app/research/research.html) |
| Відгуки користувачів | [research/notes/07-reviews.md](./research/notes/07-reviews.md) |
| Персони (primary — «Скидає з телефона») | [research/notes/10-personas.md](./research/notes/10-personas.md) |
| Jobs to be done і JTBD-матриця | [research/notes/11-jtbd.md](./research/notes/11-jtbd.md) |
| Персони і jobs — сторінка | [personas.html](./personas.html) · [на сайті](https://olenakras95.github.io/shukhliada-app/personas.html) |
| Критика персон і доресерч | [research/notes/12-personas-review.md](./research/notes/12-personas-review.md) |
| Карта: сутності, екрани, навігація й трасування (чернетки) | [sitemap.md](./sitemap.md) |
| User flows: main job, R4, R3, E2 (чернетки) | [flows.md](./flows.md) |
| Структура IA: дерево екранів, навігація, flows і трасування — знімок `sitemap.md` і `flows.md` | [ia.html](./ia.html) · [на сайті](https://olenakras95.github.io/shukhliada-app/ia.html) |
| Збирання `ia.html`: `node _build/build-ia.mjs` | [_build/build-ia.mjs](./_build/build-ia.mjs) · шаблон [_build/ia.template.html](./_build/ia.template.html) |
| Діаграми flows у SVG — малює заздалегідь, коли діаграми у `flows.md` змінилися (потрібен Chrome чи Edge) | [_build/render-flows.mjs](./_build/render-flows.mjs) · готові SVG [_build/flows-svg.json](./_build/flows-svg.json) |
| Скріни дослідження | [research/screens/](./research/screens/) · перелік: [README.md](./research/screens/README.md) |
| Голос продукту: принципи, словник, заборонене, правила мікрокопі | [voice.md](./voice.md) |
| Тексти інтерфейсу: ключі, «було» і «стало» — джерело правди тексту | [microcopy.md](./microcopy.md) |
| Мова конкурентів (розділ ресерчу) | [research/research.md, «Мова конкурентів»](./research/research.md#мова-конкурентів) |
| Правила вайрфреймів: рамка, стани, вкладки, підписи зон | [wireframes/_conventions.md](./wireframes/_conventions.md) |
| Вайрфрейм «Моя Шухляда» (головний) і стани | [drawer.html](./wireframes/drawer.html) · [на сайті](https://olenakras95.github.io/shukhliada-app/wireframes/drawer.html) |
| Вайрфрейм «Пошук» і стани; попередження для тегу без посилань | [search.html](./wireframes/search.html) · [search-empty.html#vydalyty-teh](./wireframes/search-empty.html#vydalyty-teh) · [на сайті](https://olenakras95.github.io/shukhliada-app/wireframes/search.html) |
| Вайрфрейм «Посилання» і стани; дані сторінки підтягуються | [link.html](./wireframes/link.html) · [link-loading.html#pidtiahuietsia](./wireframes/link-loading.html#pidtiahuietsia) · [на сайті](https://olenakras95.github.io/shukhliada-app/wireframes/link.html) |
| Вайрфрейм «Акаунт» і стани; «назавжди» для порожньої Шухляди | [account.html](./wireframes/account.html) · [account-empty.html#nazavzhdy](./wireframes/account-empty.html#nazavzhdy) · [на сайті](https://olenakras95.github.io/shukhliada-app/wireframes/account.html) |
| Вайрфрейм «Вхід» і стани | [login.html](./wireframes/login.html) · [на сайті](https://olenakras95.github.io/shukhliada-app/wireframes/login.html) |
| Навігатор: дерево сторінок | [_nav/tree.js](./_nav/tree.js) |
| Навігатор: скрипт і стилі | [_nav/nav.js](./_nav/nav.js) · [_nav/nav.css](./_nav/nav.css) |
