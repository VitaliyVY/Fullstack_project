# Лабораторна робота №7. Поведінкові фактори та UX, Вебаналітика та SEO-стратегія

---

## Мета

Навчитись оцінювати SEO-ефективність сайту через поведінкові та аналітичні дані: проводити UX-аудит сторінок входу, аналізувати CTR/Bounce/Engagement/Dwell-патерни, коректно налаштовувати GA4 події та конверсії, виконувати фінальний SEO-аудит проєкту з пріоритезацією задач у roadmap.

---

## Інструменти

| Інструмент                      | Для чого                                                   | Посилання                                               |
| ------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| Google Search Console           | Аналіз показів, кліків, CTR, позицій, індексації           | search.google.com/search-console                        |
| Google Analytics 4 (GA4)        | Аналіз поведінки після кліку: engagement, події, конверсії | analytics.google.com                                    |
| Google Tag Manager              | Налаштування SEO-подій без деплою коду                     | tagmanager.google.com                                   |
| Google Looker Studio            | Єдиний SEO-дашборд (GSC + GA4)                             | lookerstudio.google.com                                 |
| Microsoft Clarity               | Heatmaps, записи сесій, rage/dead clicks                   | clarity.microsoft.com                                   |
| Lighthouse / PageSpeed Insights | Технічні UX-обмеження first screen                         | developer.chrome.com/docs/lighthouse, pagespeed.web.dev |
| Google Sheets                   | Таблиці аудиту, backlog і roadmap                          | sheets.google.com                                       |

> Використовуємо лише безкоштовні режими інструментів. Для backlink аналізу достатньо даних `Links` у GSC + Ahrefs Free Backlink Checker.

---

## Сайт доступний онлайн

Публічний URL доступний, обрали варіант А

---

## Завдання

### 1. UX-аудит сайту

#### 1.1 - Визначення пріоритетних landing pages

Обрали 10 пріоритетних сторінок входу з органічного трафіку (28 днів) і заповнили "Landing Audit".

| URL | Тип сторінки | Intent | Organic sessions (28 днів) | CTR (GSC) | Engagement rate (GA4) | Bounce context | Пріоритет |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| https://lamalog.pp.ua/ | homepage | Інформаційний | N/A | 27.91% | N/A | Для homepage частково нормальний, але є ризик слабкого scroll | High |
| https://lamalog.pp.ua/about | інформаційна | Інформаційний | N/A | N/A | N/A | Нормально для info-сторінки, потрібен кращий перехід у контент | Medium |
| https://lamalog.pp.ua/articles/1-2 | інформаційна (стаття) | Інформаційний | N/A | N/A | N/A | Якісний match з наміром, потрібна перевірка метрик по експорту | High |
| https://lamalog.pp.ua/authors/user-wyIRHoeo | інформаційна (автор) | Інформаційний | N/A | N/A | N/A | Є ризик через слабкі trust-сигнали | Medium |
| https://lamalog.pp.ua/posts | категорійна/комерційна | Комерційний/навігаційний | N/A | N/A | N/A | Потенціал покращення через фільтри і CTA | High |
| https://lamalog.pp.ua/categories/javascript-frontend | категорійна/комерційна | Комерційний/навігаційний | N/A | N/A | N/A | Залежить від глибини контенту в категорії | High |
| https://lamalog.pp.ua/categories/backend-devops | категорійна/комерційна | Комерційний/навігаційний | N/A | N/A | N/A | Потрібно підсилити контент і соціальні докази | Medium |
| https://lamalog.pp.ua/write | транзакційна/цільова | Транзакційний | N/A | N/A | N/A | Ймовірний ризик через фрикцію на першому кроці | High |
| https://lamalog.pp.ua/login | транзакційна/цільова | Транзакційний | N/A | N/A | N/A | Потрібна перевірка відсіву між form_start/form_submit | Medium |
| https://lamalog.pp.ua/register | транзакційна/цільова | Транзакційний | N/A | N/A | N/A | Ймовірний ризик через бар'єр заповнення форми | High |

Примітка: для `CTR (GSC)` використано реальний експорт GSC `Сторінки.csv` (період: останні 3 місяці, дата експорту: 2026-04-22). Значення `Organic sessions (28 днів)` та `Engagement rate (GA4)` позначені як `N/A`, бо GA4 експорт містить нульові/порожні дані.

Перевірка мінімальних вимог:
- Інформаційні URL: 4 (`/`, `/about`, `/articles/1-2`, `/authors/...`)
- Комерційні/категорійні URL: 3 (`/posts`, `/categories/javascript-frontend`, `/categories/backend-devops`)
- Транзакційні або цільові URL: 3 (`/write`, `/login`, `/register`)

#### 1.2 - UX-чекліст першого екрана (above the fold)

Для 6 пріоритетних URL виконали перевірку first screen:

| URL | Match між Title/H1/intent | Чітка цінність за 3-5 с | Помітний CTA | Елементи довіри | Mobile UX | Висновок |
| --- | --- | --- | --- | --- | --- | --- |
| https://lamalog.pp.ua/ | Так | Частково | Частково | Частково | Добре | Потрібно спростити hero і зробити головний CTA контрастною кнопкою. |
| https://lamalog.pp.ua/posts | Так | Так | Частково | Частково | Частково | Сильна структура, але фільтр/пошук на мобільному бажано зробити помітнішим. |
| https://lamalog.pp.ua/categories/javascript-frontend | Так | Так | Частково | Частково | Добре | Додати один головний CTA (наприклад, "Почати з базового гайду"). |
| https://lamalog.pp.ua/articles/1-2 | Так | Так | Частково | Частково | Добре | Бракує довірчих елементів та явного наступного кроку після читання. |
| https://lamalog.pp.ua/about | Так | Так | Ні | Так | Добре | Сильний trust, але потрібен CTA у контентну воронку. |
| https://lamalog.pp.ua/write | Так | Частково | Так | Ні | Частково | Для мобільного варто спростити перший крок форми та зменшити фрикцію. |

Критерії Mobile UX перевірено:
- `44x44 px` для tap targets: часткові проблеми на сторінках зі щільним інтерфейсом (`/posts`, `/write`).
- Відсутність горизонтального скролу: критичних зламів не виявлено.
- Кнопки не перекриті sticky-елементами: критичних перекриттів не виявлено.
- Форма на першому кроці не перевантажена: частково порушено на `/write`.

#### 1.3 - Пошук UX-проблем, що впливають на SEO

Зафіксували 12 UX-проблем і класифікували їх:

| № | URL | Проблема | Категорія (Relevance/Usability/Trust/Navigation/Speed) | Вплив на SEO | Severity | Гіпотеза виправлення |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [https://lamalog.pp.ua/](https://lamalog.pp.ua/) | Довгий hero-текст ускладнює швидке розуміння цінності за 3-5 секунд. | Relevance | Вище bounce, нижчий dwell на вході. | High | Скоротити hero до чіткого H1, підзаголовка і одного CTA. |
| 2 | [https://lamalog.pp.ua/](https://lamalog.pp.ua/) | Головний CTA виглядає як текстове посилання, а не кнопка. | Usability | Менше кліків у цільовий сценарій. | High | Зробити контрастну primary-кнопку з дієвим copy. |
| 3 | [https://lamalog.pp.ua/](https://lamalog.pp.ua/) | Є заявка на експертність, але мало видимих social proof елементів. | Trust | Нижча довіра, коротші сесії. | Medium | Додати метрики, бейджі, блок "популярне". |
| 4 | [https://lamalog.pp.ua/about](https://lamalog.pp.ua/about) | Немає CTA у контентну воронку. | Navigation | Менше переходів на статті. | Medium | Додати CTA "Читати статті" або "Почати з категорії". |
| 5 | [https://lamalog.pp.ua/about](https://lamalog.pp.ua/about) | Перший екран не виділяє короткий summary-value блок. | Relevance | Нижча швидкість сприйняття меседжу. | Medium | Додати короткий блок "Що отримає користувач". |
| 6 | [https://lamalog.pp.ua/posts](https://lamalog.pp.ua/posts) | Кнопка фільтра/пошуку на мобільному не завжди достатньо помітна. | Usability | Менше взаємодій, слабший engagement. | Medium | Підсилити контраст і розмір керуючих елементів. |
| 7 | [https://lamalog.pp.ua/categories/javascript-frontend](https://lamalog.pp.ua/categories/javascript-frontend) | Немає головного CTA-сценарію у верхній частині сторінки. | Navigation | Нижча глибина перегляду категорії. | Medium | Додати CTA "Почати з..." та блок рекомендованого маршруту. |
| 8 | [https://lamalog.pp.ua/categories/backend-devops](https://lamalog.pp.ua/categories/backend-devops) | Обмежений обсяг контенту на категорійній landing-сторінці. | Relevance | Слабша релевантність під ширші запити. | Medium | Розширити контент і додати внутрішні лінки на суміжні теми. |
| 9 | [https://lamalog.pp.ua/authors/user-wyIRHoeo](https://lamalog.pp.ua/authors/user-wyIRHoeo) | Профіль автора не підсилений достатніми E-E-A-T сигналами. | Trust | Менше довіри до автора і статей. | Medium | Додати досвід, теми експертизи, лічильники матеріалів. |
| 10 | [https://lamalog.pp.ua/articles/1-2](https://lamalog.pp.ua/articles/1-2) | Немає явного "наступного кроку" після читання статті. | Navigation | Втрата глибини сесії та dwell chain. | High | Додати блок "Related articles" і CTA на категорію. |
| 11 | [https://lamalog.pp.ua/write](https://lamalog.pp.ua/write) | Перший крок форми має зайву фрикцію для мобільних користувачів. | Usability | Зниження form_start/form_submit. | High | Розбити форму на кроки, спростити початкове заповнення. |
| 12 | [https://lamalog.pp.ua/register](https://lamalog.pp.ua/register) | Реєстраційний екран не комунікує чітку цінність до заповнення. | Relevance | Вищий bounce на транзакційній точці входу. | Medium | Додати короткий value-block і trust-microcopy біля форми. |

[1]: https://lamalog.pp.ua/ "Lama Dev Blog App"
[2]: https://lamalog.pp.ua/about "About Us | Lama Dev Blog App"
[3]: https://lamalog.pp.ua/posts "Development Blog | Lama Dev Blog App"
[4]: https://lamalog.pp.ua/categories/javascript-frontend "JavaScript / Frontend Development | Lama Dev Blog App"
[5]: https://lamalog.pp.ua/categories/backend-devops "Backend / DevOps | Lama Dev Blog App"
[6]: https://lamalog.pp.ua/authors/user-wyIRHoeo "user-wyIRHoeo | Author | Lama Dev Blog App"
[7]: https://lamalog.pp.ua/articles/1-2 "Fullstack Without the Chaos: How to Combine React/Next.js, Node.js, Performance, and SEO in One Product | Lama Dev Blog App"
[8]: https://lamalog.pp.ua/write "Write | Lama Dev Blog App"
[9]: https://lamalog.pp.ua/register "Register | Lama Dev Blog App"

**Висновок.** Основні UX-проблеми сайту зосереджені у трьох зонах: слабка комунікація цінності на першому екрані, недостатньо виражені CTA та обмежені елементи довіри. Це може негативно впливати на bounce rate, engagement, dwell time і глибину перегляду, а отже — опосередковано погіршувати SEO-ефективність сторінок.

### 2. Аналіз поведінкових показників

#### 2.1 - GSC аналіз (до кліку)

У репозиторії є реальний експорт GSC (дата експорту: 2026-04-22, фільтр: `Тип пошуку = Інтернет`, період: `Останні 3 місяці`).

Підтверджені дані з CSV:

| Query/URL | Сегмент | Impressions | Clicks | CTR | Avg position | Тренд (MoM) | Доказ |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| `lama dev` | brand / all devices | 6 | 0 | 0% | 8 | N/A | `https___lamalog.pp.ua_-Performance-on-Search-2026-04-22/Запити.csv` |
| `https://lamalog.pp.ua/` | landing page | 43 | 12 | 27.91% | 3.14 | N/A | `https___lamalog.pp.ua_-Performance-on-Search-2026-04-22/Сторінки.csv` |
| `https://lamalog.pp.ua/sitemap.xml` | technical page | 5 | 1 | 20% | 2.2 | N/A | `https___lamalog.pp.ua_-Performance-on-Search-2026-04-22/Сторінки.csv` |
| `Desktop` | device | 37 | 13 | 35.14% | 2.68 | N/A | `https___lamalog.pp.ua_-Performance-on-Search-2026-04-22/Пристрої.csv` |
| `Mobile` | device | 6 | 0 | 0% | 6 | N/A | `https___lamalog.pp.ua_-Performance-on-Search-2026-04-22/Пристрої.csv` |

Що ще відсутнє і де це взяти:
- Вибірка 15-30 запитів: у GSC `Ефективність -> Результати пошуку -> Запити -> Експорт CSV` (зараз у файлі лише 1 запит).
- Segment brand/non-brand: у GSC додати `+ Новий фільтр -> Запит`, зробити 2 експорти (`містить бренд` і `не містить бренд`).
- Segment mobile/desktop: у GSC вкладка `Пристрої` або фільтр `Пристрій`, експортувати окремо по кожному типу.
- Segment informational/commercial: у GSC фільтр `Запит` (за патернами наміру) і окремі експорти по групах.
- MoM по query/URL: у GSC `Дата -> Порівняти` (наприклад, `останні 28 днів` проти `попередніх 28 днів`) і повторний експорт таблиць `Запити` та `Сторінки`.

#### 2.2 - GA4 аналіз (після кліку)

У репозиторії є частковий GA4-експорт `download2.csv` (період `2026-04-22` - `2026-04-23`) та перевірка Realtime:

| Джерело | Дата перевірки | Підтверджений факт | Доказ |
| --- | --- | --- | --- |
| GA4 Realtime (`Кількість подій за Назва події`) | 2026-04-22 | `page_view = 25` | скріншот перевірки в інтерфейсі GA4 |
| GA4 Explore export (`Цільова сторінка`) | 2026-04-22 - 2026-04-23 | Є дані по `/` і `/write` | `download2.csv` |

Тому таблиця нижче заповнена тільки перевіреним статусом доступності агрегованих даних:

| Landing page | Organic sessions | Engaged sessions | Engagement rate | Avg engagement time | Key events | Conversion rate | Висновок |
| --- | ---: | ---: | ---: | --- | --- | ---: | --- |
| / | 1 | 0 | 0 | 0 s | N/A | N/A | За `download2.csv` є базові GA4-метрики; для key events і conversion потрібен окремий експорт. |
| /posts | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /categories/javascript-frontend | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /categories/backend-devops | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /articles/1-2 | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /about | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /authors/user-wyIRHoeo | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /write | 1 | 1 | 1 | 31 s | N/A | N/A | За `download2.csv` є базові GA4-метрики; для key events і conversion потрібен окремий експорт. |
| /login | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /register | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |

Що ще відсутнє і де це взяти:
- `Organic sessions`, `Engaged sessions`, `Engagement rate`, `Avg engagement time` для всіх 10 URL:
  `GA4 -> Reports -> Engagement -> Landing page`, фільтр `Session source / medium = google / organic`, період `останні 28 днів`, експорт CSV.
- `Key events` і `Conversion rate` по кожному landing URL:
  `GA4 -> Reports -> Engagement -> Events` (або `Advertising -> Attribution`), додати зріз по `Landing page + query string`, застосувати фільтр `google / organic`, експорт CSV.
- Щоб бачити `form_start`, `form_submit`, `click_cta_primary` по URL:
  `GA4 -> Explore -> Free form`, рядки: `Landing page`, стовпці/фільтри: `Event name`, метрика: `Event count`, експорт CSV.

#### 2.3 - Bounce і dwell context-аналіз

Контекстна інтерпретація без підстановки непідтверджених чисел:

| URL | Тип intent | Bounce/engagement контекст | Dwell-патерн | Нормально чи ризик | Що робити |
| --- | --- | --- | --- | --- | --- |
| / | Інформаційний/навігаційний | Якісний аудит показує ризик слабкого першого екрану; точний bounce не підтверджений | N/A | Ризик | Перебудувати hero + чіткий CTA у перші 3-5 секунд. |
| /posts | Комерційний/навігаційний | Ймовірна залежність від якості фільтрів і пошуку; потрібні фактичні GA4-дані | N/A | Умовно нормально | Зробити фільтри/пошук помітнішими, особливо на мобільному. |
| /categories/javascript-frontend | Комерційний/навігаційний | Сценарій переходу між статтями можна підсилити; без підтверджених чисел | N/A | Умовно нормально | Додати рекомендований маршрут читання і головний CTA. |
| /categories/backend-devops | Комерційний/навігаційний | Для висновку щодо bounce потрібен page-level звіт GA4/GSC | N/A | Ризик | Розширити контент кластера + внутрішню перелінковку. |
| /articles/1-2 | Інформаційний | По UX видно сильний контентний потенціал; dwell треба підтвердити в GA4 | N/A | Умовно нормально | Додати блок "наступний крок" для передачі ваги на інші URL. |
| /about | Інформаційний/брендовий | Ймовірний early-exit через відсутність CTA; метрики не підтверджені | N/A | Ризик | Додати CTA на категорії/статті і блок популярного контенту. |
| /write | Транзакційний | UX вказує на фрикцію першого кроку; фактичний bounce не підтверджений | N/A | Ризик (високий) | Спростити форму і перший крок. |
| /register | Транзакційний | Без GA4-експорту неможливо чисельно оцінити відсів | N/A | Ризик | Прибрати зайві поля і підсилити trust-microcopy. |

#### 2.4 - Мікроконверсії як ранні SEO-сигнали

Події для мікроконверсій визначено, але поточні значення не заповнюються без експорту GA4:

| Мікроконверсія | Event name | Де тригериться | Навіщо для SEO | Поточне значення | Ціль на 30 днів |
| --- | --- | --- | --- | --- | --- |
| Скрол до 75% у статті | scroll_75 | /articles/* | Підтверджує якість контенту і match intent | N/A | +10-15 п.п. після оптимізації контенту |
| Клік по основному CTA | click_cta_primary | / | Показує рух із landing у цільову дію | N/A | +20% до поточного значення |
| Перехід на пов'язану статтю | click_related_article | /articles/*, /categories/* | Підсилює глибину перегляду і внутрішню релевантність | N/A | +30% до поточного значення |
| Старт форми | form_start | /write, /login, /register | Ранній сигнал наміру до конверсії | N/A | +20% до поточного значення |
| Успішний submit форми | form_submit | /login, /register, /write | Фінальна оцінка внеску SEO у цільову дію | N/A | +15% до поточного значення |

**Висновок по розділу 2.** Підтверджено реальні дані з експорту GSC (`Запити.csv`, `Сторінки.csv`, `Пристрої.csv`, дата експорту 2026-04-22) та часткові GA4-метрики з `download2.csv` (2026-04-22 - 2026-04-23), а також працездатність трекінгу в Realtime (`page_view = 25` на 2026-04-22). Для повного закриття розділу 2 бракує окремих експортів із GSC порівнянням періодів (MoM) і GA4 по `google / organic` для всіх 10 URL та event-level конверсій.
