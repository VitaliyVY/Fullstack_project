# Лабораторна робота №3. Семантичне ядро та структура сайту (IT-блог)

## 1. Класифікація інтенту

Теоретична база по 4 типах інтенту застосована: informational, navigational, transactional, commercial.

Практична частина виконана на IT-тематиці. Підсумкова таблиця на 40 ключів з інтентами:
- [keywords_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\keywords_it_blog.tsv)

## 1.3 Аналіз через Google Search

Для 3 запитів (react hooks tutorial, docker tutorial, react vs vue) зафіксовано:
- People also ask
- Related searches
- Autocomplete

Релевантні знайдені формулювання додані в семантичне ядро.

## 2. Збір семантичного ядра

Структура таблиці:
- keyword
- intent
- volume
- competition
- cluster
- target_page
- priority
- notes

Мінімальна вимога виконана: 40+ ключових слів.

## 2.3 Розширення через Google Trends (IT-блог)

Порівняння зроблено для 4 груп схожих формулювань:

1. JavaScript basics:
- `javascript tutorial`
- `javascript for beginners`
- `what is javascript`
- `learn javascript`

2. React hooks:
- `react hooks tutorial`
- `react hooks for beginners`
- `useState example`
- `useEffect example`

3. Node.js:
- `node.js tutorial`
- `node.js for beginners`
- `how to install node.js`
- `node.js api tutorial`

4. DevOps:
- `docker tutorial`
- `docker compose example`
- `kubernetes basics`
- `devops roadmap`

Що перевірялось у Trends:
- який варіант є лідером;
- чи є сезонні піки (місяці);
- загальна стабільність/спад/ріст.

Нотатки про сезонність вже внесені в `notes` для кожного ключа у файлі:
- [keywords_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\keywords_it_blog.tsv)

## 3. Кластеризація

Підсумкова таблиця кластерів (kebab-case, 8 кластерів):
- [clusters_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\clusters_it_blog.tsv)

Кількість кластерів >= 6: виконано.

## 4. Silo-структура сайту

Аркуш Structure:
- [structure_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\structure_it_blog.tsv)

Аркуш InternalLinks (10+ посилань):
- [internal_links_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\internal_links_it_blog.tsv)

## 4.3 Контрольні питання

1. Кожна категорія виділена в окремий силос (JavaScript, React, Node.js, DevOps, Git, Career).
2. Перехресні посилання є, але лише контекстно виправдані (related-матеріали).
3. Максимальна глибина кліків: 3 (`/` -> `/categories/...` -> `/articles/...`).
4. Orphan pages відсутні: для ключових сторінок є вхідні посилання з категорій/related/menu.

## Пакет для Google Sheets

Встав у `A1` відповідних аркушів:
- `Keywords`: [keywords_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\keywords_it_blog.tsv)
- `Clusters`: [clusters_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\clusters_it_blog.tsv)
- `Structure`: [structure_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\structure_it_blog.tsv)
- `InternalLinks`: [internal_links_it_blog.tsv](d:\CHNU_(Master)\SEO_2\Fullstack_project\Fullstack_project\internal_links_it_blog.tsv)

## Скріншоти Keyword Planner

- EN (Ukraine): ![Keyword Planner EN](images/Keyword%20Stats_UKR_eng.png)
- UKR (Ukraine): ![Keyword Planner UKR](images/Keyword%20Stats_UKR_ukr2.png)

## Скріншот Google Trends

- IT variants comparison: ![Google Trends IT](images/filter_1.png)

## Посилання на Google Sheets

- https://docs.google.com/spreadsheets/d/1DwbDk32QMn_SHBu6StWJBqq7bKUZTq0D-EdYlxwHSp4/edit?usp=sharing

Що лишилось для здачі:
- Нічого. Пакет артефактів повний.
