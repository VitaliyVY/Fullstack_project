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
| https://lamalog.pp.ua/ | homepage | Інформаційний | N/A | N/A | N/A | Для homepage частково нормальний, але є ризик слабкого scroll | High |
| https://lamalog.pp.ua/about | інформаційна | Інформаційний | N/A | N/A | N/A | Нормально для info-сторінки, потрібен кращий перехід у контент | Medium |
| https://lamalog.pp.ua/articles/1-2 | інформаційна (стаття) | Інформаційний | N/A | N/A | N/A | Якісний match з наміром, потрібна перевірка метрик по експорту | High |
| https://lamalog.pp.ua/authors/user-wyIRHoeo | інформаційна (автор) | Інформаційний | N/A | N/A | N/A | Є ризик через слабкі trust-сигнали | Medium |
| https://lamalog.pp.ua/posts | категорійна/комерційна | Комерційний/навігаційний | N/A | N/A | N/A | Потенціал покращення через фільтри і CTA | High |
| https://lamalog.pp.ua/categories/javascript-frontend | категорійна/комерційна | Комерційний/навігаційний | N/A | N/A | N/A | Залежить від глибини контенту в категорії | High |
| https://lamalog.pp.ua/categories/backend-devops | категорійна/комерційна | Комерційний/навігаційний | N/A | N/A | N/A | Потрібно підсилити контент і соціальні докази | Medium |
| https://lamalog.pp.ua/write | транзакційна/цільова | Транзакційний | N/A | N/A | N/A | Ймовірний ризик через фрикцію на першому кроці | High |
| https://lamalog.pp.ua/login | транзакційна/цільова | Транзакційний | N/A | N/A | N/A | Потрібна перевірка відсіву між form_start/form_submit | Medium |
| https://lamalog.pp.ua/register | транзакційна/цільова | Транзакційний | N/A | N/A | N/A | Ймовірний ризик через бар'єр заповнення форми | High |

Примітка: у репозиторії немає page-level експорту GSC/GA4 за 28 днів, тому числові поля позначені як `N/A` до моменту вивантаження офіційного звіту.

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

Станом на підготовку цього звіту в репозиторії є лише підтверджений скріншот GSC Performance (діапазон `3 months`, Search type: `Web`) без CSV-експорту на рівні запитів/URL.

Підтверджені агреговані метрики з артефакту:

| Джерело | Період | Clicks | Impressions | CTR | Avg position | Доказ |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Google Search Console Performance | 3 months | 6 | 17 | 35.3% | 2.4 | `lab_4_info/Google_Search_Console.png` |

Що поки неможливо підтвердити без експорту:
- вибірка 15-30 запитів;
- сегментація brand/non-brand, mobile/desktop, informational/commercial;
- MoM-тренд по кожному запиту/URL.

#### 2.2 - GA4 аналіз (після кліку)

Підтверджених експортів GA4 у репозиторії немає, тому таблиця заповнена тільки перевіреним статусом доступності даних:

| Landing page | Organic sessions | Engaged sessions | Engagement rate | Avg engagement time | Key events | Conversion rate | Висновок |
| --- | ---: | ---: | ---: | --- | --- | ---: | --- |
| / | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /posts | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /categories/javascript-frontend | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /categories/backend-devops | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /articles/1-2 | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /about | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /authors/user-wyIRHoeo | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /write | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /login | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |
| /register | N/A | N/A | N/A | N/A | N/A | N/A | Потрібен експорт GA4 за `google/organic`. |

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

**Висновок по розділу 2.** Підтверджено лише агрегований факт із GSC (за 3 місяці: 6 кліків, 17 показів, CTR 35.3%, позиція 2.4). Для правдивого page-level та query-level аналізу обов'язково потрібні офіційні експорти з GSC і GA4; до їх отримання всі детальні числові поля позначені як `N/A`.
