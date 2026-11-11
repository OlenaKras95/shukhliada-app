# 07 · Що кажуть користувачі

> Етап 0 — дослідження, доповнення до кроків 03–06. Зібрано 2026-11-12.
> Мета: перевірити гіпотези з `research/research.md` на словах реальних людей, а не лише на скрінах і логіці.
> Усе з **публічних** сторінок, без логіну. Імен авторів не наводимо: лише ID відгуку, дату, оцінку й магазин.

## Як збирали

| Код | Джерело | Що взяли |
|---|---|---|
| `[V1]` | App Store, Raindrop.io, стрічка відгуків (RSS, США і Велика Британія): `itunes.apple.com/{us,gb}/rss/customerreviews/id=1021913807/json` | 138 відгуків, 2015-10 — 2026-10 |
| `[V2]` | App Store, mymind (RSS, США і Велика Британія), `id=1520332347` | 199 відгуків, 2020-07 — 2026-09 |
| `[V3]` | App Store, Telegram (RSS, США і Велика Британія), `id=686449807` | 900 відгуків, 2025-10 — 2026-11 |
| `[V4]` | Chrome Web Store, Notion Web Clipper, вкладка відгуків: `chromewebstore.google.com/detail/knheggckgoiihginacbkhaalnibhilkk/reviews` | перші ~70 відгуків стрічки |
| `[V5]` | Chrome Web Store, розширення Raindrop.io: `chromewebstore.google.com/detail/ldgfbffkinooeloadekpmfoklnobpien/reviews` | перші ~80 відгуків стрічки |

Відгуки відібрано вручну за ключовими словами (find, search, organize, folder, tag, lost, save, Pocket, category тощо) і прочитано повністю. Цитати — дослівно, скорочення позначено «…».

## Що чути, за темами

| Тема | Цитата | Джерело | Гіпотеза |
|---|---|---|---|
| **A. Розкидано по місцях, потім не знайти** | «using the bookmarks feature in the web browsers on each was chaos» | `[V1]` 11738340181 · 2024-09-18 · ★5 | 4 |
| | «You no longer have to worry about … remembering where you saved stuff, which browser bookmark, etc.» | `[V1]` 13969354434 · 2026-04-17 · ★5 | 4 |
| | «I no longer need to email myself random notes or screenshot things I can never find again later» (про mymind) | `[V2]` 10916486418 · 2024-02-08 · ★5 | 4 |
| | «Saving is easy, but if you have 10,000+ bookmarks how do you find anything?» (про закладки iOS) | `[V1]` 4133659791 · 2019-05-11 · ★5 | 3, 4 |
| | «it takes far too many clicks just to get to a saved bookmark» | `[V5]` 2025-10-22 · ★1 | 4 |
| **B. Впорядковувати — забагато роботи** | «I was originally saving it to Notion but it felt tedious. Although I love Notion, I just felt there was too much work» | `[V5]` 2026-02-10 · ★5 | 9, патерн 1 |
| | «no folders, no rules, no guilt. I save … and it just finds everything later» | `[V2]` 13453206689 · 2025-11-28 · ★5 | 9, патерн 1 |
| | «could be a 5/5 if you didn't have to open Notion to populate the Database properties» | `[V4]` 2026-03-04 · ★4 | 1, 9 |
| | «I have to manually choose the same database every time I save something» | `[V4]` 2025-05-21 · ★2 | 5, 9 |
| **C. Автокатегорію цінують, але вона має влучати** | «it used to learn and then auto populate this [category] for the next one which doesn't happen anymore» | `[V1]` 11495939438 · 2024-07-15 · ★3 | 9 |
| | «every page starts as "Untagged" where before I would remember the last thing I had» | `[V1]` 11422922429 · 2024-06-25 · ★3 | 9 |
| | «It's AI organizational features aren't good (i.e., it's suggestions aren't even close to what is sensical…)» | `[V5]` 2026-01-18 · ★2 | 1, 9 |
| **D. Чи збереглося?** | «It's not saving my bookmarks, it'll sit their loading and saying retry» | `[V1]` 10983085587 · 2024-02-26 · ★1 | 1 |
| | «it's difficult for me to find anything in it and it doesn't always save what I put in it» | `[V2]` 10069226094 · 2023-06-24 · ★3 | 1, 3 |
| | «please let the icon show whether the link is already saved (like Pocket)» | `[V5]` 2024-03-22 · ★5 | дублікати (бриф §3.1) |
| **E. Тертя при збереженні** | «too much friction in capturing an idea … search for the app, then open it, then click on the bar, then type. Because of this, I sometimes get too lazy and omit jotting something down» | `[V2]` 11387854892 · 2024-06-16 · ★4 | 5 |
| **F. Архів може зникнути** | «I had meticulously saved hundreds of links and now they were gone» | `[V1]` 12059801451 · 2024-12-13 · ★1 | 8 |
| | «all the pictures I collected disappeared» | `[V2]` 11013895603 · 2024-03-06 · ★2 | 8 |
| | «I'm disappointed that it's shutting down and need a replacement … I was able to import my bookmarks easily» (про Pocket) | `[V1]` 12698701729 · 2025-05-25 · ★5 | 8 |
| **G. Забувають, навіщо зберегли** | «you leave a lot of tabs open to come back to — but can't remember why — 2 months later» | `[V2]` 10812529727 · 2024-01-12 · ★5 | нотатка «навіщо зберегли» (бриф §3.3) |

**Контраргумент до «Що не спрацює» (черга зі статусами):** частина людей цінує саме «на потім» і нагадування. «Best save for later app … I use it to save links for later reading» `[V1]` 4116094455 · 2019-05-07 · ★5; «many key features, including reminders, highlights and tags» `[V1]` 13536150591 · 2025-12-20 · ★5.

## Telegram: тиша

У 900 відгуках App Store за рік (`[V3]`) «Saved Messages» згадано **один раз**, і схвально: «I even use the "Saved Messages" chat as a personal cloud» (14059930152 · 2026-05-13 · ★5). Про те, що там нічого не знайти, ніхто не пише. Це не спростовує біль із брифу: у відгуки на месенджер пишуть про месенджер. Але й не підтверджує — **дані не підтверджені**.

## Що це змінює

- **Гіпотеза 9 (автокатегорія) отримала докази з обох боків.** Люди цінують, коли сервіс сам пам'ятає категорію (тема C), і дратуються, коли підказки «не влучають». Отже, «Змінити» в повідомленні — не прикраса, а страховка від головного ризику патерну.
- **Гіпотеза 1 (видно, що збереглося):** «sit loading and saying retry», «doesn't always save» — людина не впевнена, що збереження відбулося. Підтверджено як біль, частота невідома.
- **Гіпотеза 5 (5 секунд):** кожен зайвий крок відсікає збереження — «too lazy and omit». Це аргумент за `Ctrl+V` без питань.
- **Гіпотеза 8 (архів може зникнути):** два свіжі випадки втрати даних і хвиля переходів після закриття Pocket. Експорт лишається першим кандидатом після MVP (бриф §3.6).
- **Нове для брифу:** людина хоче бачити, що посилання **вже** збережене (тема D) — це наш «Вже в Шухляді» (§3.1), тепер з доказом.
- **Гіпотеза 7 (українська, теплий тон)** — у відгуках доказів немає. Лишається «дані не підтверджені».

## Межі

- **Лише англомовні відгуки** з магазинів США і Великої Британії. Українських користувачів серед них не видно; як болить саме нашій аудиторії — **дані не підтверджені**.
- **Відбір вручну за ключовими словами.** Частоти немає: у магазинах пишуть переважно ті, хто дуже задоволений або дуже незадоволений. Цитати показують, що біль **є**, але не скільки людей його мають.
- **Не зібрано:** Google Play (немає відкритої стрічки), Reddit (раніше 403), Telegram-канали й форуми. Відгуки Chrome Web Store — лише перші сторінки стрічки.
- **Старі відгуки** (2015–2019) взято лише там, де формулювання точно описує тему; поведінка продукту відтоді могла змінитися.
