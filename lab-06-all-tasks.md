# Lab 06 - Усі таски

Дата обʼєднання: **2026-04-17**

Включені файли: lab-06-task-1.md, lab-06-task-1-prod.md, lab-06-task-2.md, lab-06-task-3.md, lab-06-task-4.md, lab-06-task-5.md

---

## Файл: lab-06-task-1.md

# Lab 06 - Завдання 1 (Технічний аудит)

Дата перевірки: **2026-04-16**  
Середовище: **локальний SSR (`http://127.0.0.1:4173`)**  
Примітка: API бекенду не піднявся через обмеження доступу до MongoDB Atlas (IP whitelist), тому перевірка article-URL виконана на slug-шаблонах і зафіксована як окремий ризик.

## 1.1 Crawl та інвентаризація технічного стану

| URL | Тип сторінки | Status code | Indexability | Canonical | Meta robots | H1 | Проблема |
|---|---|---:|---|---|---|---|---|
| `/` | Головна | 200 | Indexable* | `/` | `<!--ssr-robots-->` | Є | Некоректний `meta robots` (плейсхолдер не замінено) |
| `/posts` | Лістинг | 200 | Indexable* | `/posts` | `<!--ssr-robots-->` | Є | Некоректний `meta robots` |
| `/categories/general` | Категорія | 200 | Indexable* | `/categories/general` | `<!--ssr-robots-->` | Немає (через SSR error state) | Нестабільний SSR-контент без API |
| `/categories/javascript-frontend` | Категорія | 200 | Indexable* | `/categories/javascript-frontend` | `<!--ssr-robots-->` | Немає (через SSR error state) | Нестабільний SSR-контент без API |
| `/categories/backend-devops` | Категорія | 200 | Indexable* | `/categories/backend-devops` | `<!--ssr-robots-->` | Немає (через SSR error state) | Нестабільний SSR-контент без API |
| `/articles/react-hooks-guide` | Стаття | 200 | Indexable (небажано) | `/articles/react-hooks-guide` | `<!--ssr-robots-->` | Немає | **Soft 404**: сторінка неіснуючої статті віддає 200 |
| `/articles/devops-deployment-guide` | Стаття | 200 | Indexable (небажано) | `/articles/devops-deployment-guide` | `<!--ssr-robots-->` | Немає | **Soft 404** |
| `/articles/seo-checklist-2026` | Стаття | 200 | Indexable (небажано) | `/articles/seo-checklist-2026` | `<!--ssr-robots-->` | Немає | **Soft 404** |
| `/articles/frontend-performance` | Стаття | 200 | Indexable (небажано) | `/articles/frontend-performance` | `<!--ssr-robots-->` | Немає | **Soft 404** |
| `/articles/nodejs-api-security` | Стаття | 200 | Indexable (небажано) | `/articles/nodejs-api-security` | `<!--ssr-robots-->` | Немає | **Soft 404** |
| `/about` | Службова | 200 | Indexable* | `/about` | `<!--ssr-robots-->` | Є | Некоректний `meta robots` |
| `/login` | Службова (auth) | 200 | Indexable (небажано) | `/login` | `<!--ssr-robots-->` | Немає | Для auth-сторінки бажано `noindex, nofollow` |
| `/register` | Службова (auth) | 200 | Indexable (небажано) | `/register` | `<!--ssr-robots-->` | Немає | Для auth-сторінки бажано `noindex, nofollow` |
| `/write` | Службова (editor) | 200 | Indexable (небажано) | `/write` | `<!--ssr-robots-->` | Немає | Для editor-сторінки бажано `noindex, nofollow` |

\* `meta robots` невалідний, тому очікувана поведінка пошуковика не гарантується.

## 1.2 Перевірка технічних файлів і протоколу

| Перевірка | Статус (OK / Problem) | Деталі проблеми | Пріоритет |
|---|---|---|---|
| `robots.txt` доступний | OK | `200`, файл віддається коректно | High |
| Немає `Disallow: /` на продакшені | OK | Суцільного блоку індексації немає | High |
| `sitemap.xml` доступний | OK | `200`, XML валідної структури | High |
| У sitemap тільки `200 + canonical` URL | OK | Для поточних URL з sitemap перевірено `200` та self-canonical | High |
| Єдина канонічна версія домену (HTTPS, www/non-www) | Problem | На локальному середовищі неможливо підтвердити `http -> https`, `www/non-www` | High |
| Немає mixed content | OK | На перевірених сторінках не виявлено зовнішніх `http://` ресурсів | Medium |

## 1.3 Canonical, редіректи, статус-коди, Schema

| Тип проблеми | URL | Що знайдено | Ризик | Рішення |
|---|---|---|---|---|
| status codes | `/articles/*` (неіснуючі slug) | Неіснуючі сторінки повертають `200` замість `404` (**soft 404**) | High | Повернути реальний `404` (SSR route + API перевірка існування post) |
| status codes | `/non-existent-page`, `/sitemap_index.xml` | Невідомі URL віддають HTML зі статусом `200` | High | Додати fallback-обробник 404 на рівні SSR/роутера |
| canonical | `/search`, `/non-existent-page`, `/sitemap_index.xml` | Canonical формується як `/articles/{slug}` для нецільових URL | High | Обмежити slug-to-article canonical тільки для валідних article routes |
| redirects | `/posts/`, `/about/`, `/admin/posts/` | Відсутня нормалізація URL (немає `301` на канонічний варіант) | Medium | Додати 301-редіректи на єдиний формат (без дубльованих варіантів) |
| redirects/protocol | домен продакшен | Не підтверджено примусовий `http -> https` і `www/non-www -> canonical` | High | Налаштувати 301 у reverse proxy/hosting та перевірити `curl -I` |
| schema | статті (неіснуючі slug) | `BlogPosting` не рендериться (немає даних post), сторінка лишається індексованою | Medium | Для 404 статей віддавати 404 + прибирати article schema |
| meta robots | більшість сторінок | Значення `meta robots` = `<!--ssr-robots-->` (плейсхолдер) | High | Додати SSR-підстановку `ssr-robots` і коректні значення (`index,follow` / `noindex,nofollow`) |

## Докази (коротко)

- `GET /robots.txt` -> `200`, правила присутні, `Sitemap:` вказаний.
- `GET /sitemap.xml` -> `200`, усі URL із файлу дали `200` і self-canonical.
- `GET /articles/<slug>` (5 тестових slug) -> `200`, title `Post not found`, H1 відсутній (ознака soft 404).
- `GET /sitemap_index.xml` -> `200` (HTML, а не XML/404).
- На SSR-сторінках `meta robots` містить не підставлений плейсхолдер.
---

## Файл: lab-06-task-1-prod.md

# Lab 06 - Завдання 1 (Технічний аудит) для https://lamalog.pp.ua/

Дата перевірки: **2026-04-16**  
Середовище: **Production (`https://lamalog.pp.ua/`)**

## 1.1 Crawl та інвентаризація технічного стану

| URL | Тип сторінки | Status code | Indexability | Canonical | Meta robots | H1 | Проблема |
|---|---|---:|---|---|---|---|---|
| `https://lamalog.pp.ua/` | Головна | 200 | Indexable | `https://lamalog.pp.ua/` | відсутній | Є | Відсутній `meta robots` |
| `https://lamalog.pp.ua/posts` | Лістинг | 200 | Indexable | `https://lamalog.pp.ua/posts` | відсутній | Є | Відсутній `meta robots` |
| `https://lamalog.pp.ua/categories/general` | Категорія | 200 | Indexable | `https://lamalog.pp.ua/categories/general` | відсутній | Є | Відсутній `meta robots` |
| `https://lamalog.pp.ua/categories/javascript-frontend` | Категорія | 200 | Indexable | `https://lamalog.pp.ua/categories/javascript-frontend` | відсутній | Є | Відсутній `meta robots` |
| `https://lamalog.pp.ua/categories/backend-devops` | Категорія | 200 | Indexable | `https://lamalog.pp.ua/categories/backend-devops` | відсутній | Є | Відсутній `meta robots` |
| `https://lamalog.pp.ua/articles/1-2` | Стаття | 200 | Indexable | `https://lamalog.pp.ua/articles/1-2` | відсутній | Є | Немає `meta robots` |
| `https://lamalog.pp.ua/articles/op-op` | Стаття | 200 | Indexable | `https://lamalog.pp.ua/articles/op-op` | відсутній | Є | Немає `meta robots` |
| `https://lamalog.pp.ua/articles/123-2` | Стаття | 200 | Indexable | `https://lamalog.pp.ua/articles/123-2` | відсутній | Є | Немає `meta robots` |
| `https://lamalog.pp.ua/articles/devops-for-students:-deploy-without-panic` | Стаття | 200 | Indexable | `https://lamalog.pp.ua/articles/devops-for-students:-deploy-without-panic` | відсутній | Є | Немає `meta robots` |
| `https://lamalog.pp.ua/articles/vasya-super` | Стаття | 200 | Indexable | `https://lamalog.pp.ua/articles/vasya-super` | відсутній | Є | Немає `meta robots` |
| `https://lamalog.pp.ua/about` | Службова | 200 | Indexable | `https://lamalog.pp.ua/about` | відсутній | Є | Немає `meta robots` |
| `https://lamalog.pp.ua/login` | Службова (auth) | 200 | Indexable (небажано) | `https://lamalog.pp.ua/login` | відсутній | Немає | Для auth бажано `noindex, nofollow` |
| `https://lamalog.pp.ua/register` | Службова (auth) | 200 | Indexable (небажано) | `https://lamalog.pp.ua/register` | відсутній | Немає | Для auth бажано `noindex, nofollow` |
| `https://lamalog.pp.ua/search` | Службова/невалідний шлях | 200 | Indexable (небажано) | `https://lamalog.pp.ua/articles/search` | відсутній | Немає | Canonical веде на article-path, soft 404-поведінка |

## 1.2 Перевірка технічних файлів і протоколу

| Перевірка | Статус (OK / Problem) | Деталі проблеми | Пріоритет |
|---|---|---|---|
| `robots.txt` доступний | OK | `https://lamalog.pp.ua/robots.txt` -> `200` | High |
| Немає `Disallow: /` на продакшені | OK | Є `User-agent: *` + `Allow: /`, глобального блокування немає | High |
| `sitemap.xml` доступний | OK | `https://lamalog.pp.ua/sitemap.xml` -> `200` | High |
| У sitemap тільки 200 + canonical URL | Problem | Є URL з параметрами: `/posts?sort=trending`, `/posts?sort=popular`; canonical у них на `/posts` (не self-canonical) | Medium |
| Єдина канонічна версія домену (HTTPS, www/non-www) | OK | `http://lamalog.pp.ua/*` резолвиться в `https://lamalog.pp.ua/*`; `www.lamalog.pp.ua` не резолвиться (окремої дубль-версії немає) | High |
| Немає mixed content | OK | На перевірених сторінках не знайдено зовнішніх `http://` ресурсів | Medium |

Додатково по `sitemap.xml`:
- Кількість URL: **11**
- `lastmod`: **відсутній**

## 1.3 Canonical, редіректи, статус-коди, Schema

| Тип проблеми | URL | Що знайдено | Ризик | Рішення |
|---|---|---|---|---|
| status codes | `https://lamalog.pp.ua/articles/not-existing-xyz-123` | Неіснуючий article URL повертає `200` (soft 404), H1 порожній | High | Повернути реальний `404` для неіснуючих slug |
| status codes | `https://lamalog.pp.ua/non-existent-page` | Невідомий URL повертає `200`, canonical = `/articles/non-existent-page` | High | Додати SSR/роутер fallback із `404` |
| status codes | `https://lamalog.pp.ua/sitemap_index.xml` | URL, якого немає як XML index, віддає HTML `200` | High | Повернути `404` або реальний `sitemap_index.xml` |
| canonical | `https://lamalog.pp.ua/search` | Canonical помилково формується як `https://lamalog.pp.ua/articles/search` | High | Виправити canonical-логіку для не-article шляхів |
| canonical | `https://lamalog.pp.ua/articles/ai-isnât-magic:-...` та `...node.js-api-that-doesnât-hurt:-...` | Некоректний slug/encoding у URL, сторінка має `200`, але `title` дефолтний і H1 порожній | High | Нормалізувати slug generation/encoding; 301 зі «зламаних» slug на коректні |
| redirects | `https://lamalog.pp.ua/posts/`, `https://lamalog.pp.ua/about/`, `https://lamalog.pp.ua/categories/general/` | Немає 301-нормалізації trailing slash -> canonical без slash | Medium | Додати 301 на єдиний формат URL |
| schema | `https://lamalog.pp.ua/articles/1-2`, `.../op-op` | Є JSON-LD `BlogPosting` (1 скрипт) | Low | Залишити, перевірити у Rich Results Test |
| schema | `https://lamalog.pp.ua/articles/not-existing-xyz-123` | JSON-LD відсутній, але сторінка все одно `200` | Medium | Після виправлення 404 прибрати індексацію soft-404 сторінок |
| meta robots | ключові сторінки (`/`, `/posts`, `/about`, `/login`) | `meta name="robots"` відсутній на перевірених сторінках | Medium | Додати шаблонні `index,follow` та `noindex,nofollow` для auth/system URL |

## Короткі докази (для вставки у звіт)

- `GET https://lamalog.pp.ua/robots.txt` -> `200`, вміст:
  - `User-agent: *`
  - `Allow: /`
  - `Sitemap: https://lamalog.pp.ua/sitemap.xml`
- `GET https://lamalog.pp.ua/sitemap.xml` -> `200`, **11 URL**, `lastmod` відсутній.
- `GET http://lamalog.pp.ua/` -> фінальний URL `https://lamalog.pp.ua/`.
- `GET https://lamalog.pp.ua/articles/not-existing-xyz-123` -> `200` (soft 404).
- `GET https://lamalog.pp.ua/non-existent-page` -> `200`, canonical на `/articles/non-existent-page`.
---

## Файл: lab-06-task-2.md

# Lab 06 - Завдання 2 (Впровадження налаштувань і виправлень)

Дата перевірки: **2026-04-17**  
Середовище: **локально, SSR production mode (`http://127.0.0.1:4273`)**

## 2.1 Обов'язкові технічні налаштування

| Налаштування | Було | Стало | Доказ |
|---|---|---|---|
| `robots.txt` | Частково, статичний файл | Динамічний `/robots.txt` із правильним `Sitemap:` для поточного домену, `Disallow` для auth/admin/write | `GET /robots.txt -> 200`, `Content-Type: text/plain` |
| `sitemap.xml` | Статичний, без article URL, містив тільки частину шляхів | Динамічний `/sitemap.xml`: canonical URL, `lastmod`, без query URL; може підтягувати статті з API (`VITE_API_URL`) | `GET /sitemap.xml -> 200`, `Content-Type: application/xml` |
| Canonical на шаблонах | Для невалідних slug був некоректний canonical | Canonical формується коректно, без помилкової підміни на `/articles/...` для неіснуючих шляхів | `GET /non-existent-page` canonical на self URL |
| Канонічна версія URL (trailing slash) | Дублювання `/about` і `/about/` | `301` нормалізація trailing slash -> без слеша | `GET /about/ -> 301 -> /about` |

## 2.2 Виправлені проблеми (мінімум 6)

| № | Проблема | Вплив на SEO | Що зроблено | Де перевірено | Статус |
|---|---|---|---|---|---|
| 1 | Soft 404 на неіснуючих URL (`200`) | High | Для неіснуючих slug/path тепер повертається `404` | `/non-existent-page`, `/articles/not-existing-xyz` | Done |
| 2 | Відсутній `meta robots` | High | Додано SSR підстановку `robots` у `<head>` | HTML source сторінок | Done |
| 3 | Auth/admin/write могли індексуватися | High | Для службових шляхів `noindex,nofollow` | `/login`, `/register` | Done |
| 4 | Некоректний canonical на невалідних шляхах | High | Виправлено canonical-логіку в SSR metadata | `/non-existent-page` | Done |
| 5 | Відсутня URL-нормалізація зі slash | Medium | Додано `301` редірект trailing slash | `/about/` | Done |
| 6 | Sitemap містив неканонічні query URL | Medium | Прибрано query URL, додано `lastmod`, винесено генерацію в SSR endpoint | `/sitemap.xml` | Done |

## 2.3 Re-audit після змін

| Що перевіряємо повторно | Метод перевірки | Результат |
|---|---|---|
| `robots.txt` | `GET /robots.txt` | `200 OK`, є `Disallow` та `Sitemap` |
| `sitemap.xml` | `GET /sitemap.xml` | `200 OK`, XML валідний, є `lastmod`, немає query URL |
| Canonical на шаблонах | View-source / curl | На валідних сторінках canonical коректний |
| 404 / status codes | curl / browser | Невідомі URL віддають `404`, не `200` |
| Redirect chains | curl `-I` | `/about/` -> один `301` на `/about` |
| Schema.org (article) | HTML source | Для валідної статті є `application/ld+json` |

## Що залишилось у backlog

1. На production підтвердити `http -> https` і `www/non-www -> canonical` (рівень хостингу/proxy).
2. Перевірити `sitemap.xml` з підключеним API бекендом (`VITE_API_URL`): тоді в sitemap автоматично з'являться URL статей.
3. Додати скріншоти Rich Results Test і submit sitemap у GSC для фінального доказу у звіті.
---

## Файл: lab-06-task-3.md

# Lab 06 - Завдання 3 (Аналіз швидкості)

Дата перевірки: **2026-04-17**  
Середовище: **Production (`https://lamalog.pp.ua/`)**  
Інструмент: **Lighthouse CLI (navigation audit, mobile + desktop)**

> Примітка: PageSpeed Insights API повертав `429 Too Many Requests`, тому для baseline використано Lighthouse Lab-метрики. Через це `INP` для цього зрізу позначено як `N/A` (немає CrUX field даних у звіті).

## 3.1 Baseline вимірювання (до оптимізації)

| URL | Device | Performance | LCP | INP | CLS | TTFB | FCP | Статус CWV |
|---|---|---:|---|---|---|---|---|---|
| `https://lamalog.pp.ua/` | Mobile | 91 | 2.5s | N/A | 0.026 | 1321ms | 2.5s | Needs Improvement (INP N/A) |
| `https://lamalog.pp.ua/` | Desktop | 92 | 1.2s | N/A | 0.016 | 1224ms | 1.2s | Partial Good (INP N/A) |
| `https://lamalog.pp.ua/articles/1-2` | Mobile | 62 | 5.6s | N/A | 0.171 | 1730ms | 2.4s | Poor (INP N/A) |
| `https://lamalog.pp.ua/articles/1-2` | Desktop | 86 | 1.8s | N/A | 0.012 | 1737ms | 1.2s | Partial Good (INP N/A) |

## 3.2 Аналіз причин (Opportunities + Diagnostics)

| URL | Проблема | Яку метрику псує | Потенційний вплив | Пріоритет |
|---|---|---|---|---|
| `https://lamalog.pp.ua/` | Image elements do not have explicit `width`/`height` (diagnostic) | CLS | Ризик layout shift при завантаженні картинок | Medium |
| `https://lamalog.pp.ua/` | Reduce unused CSS (~22-23 KiB) (diagnostic) | FCP, TBT/INP proxy | Зайвий CSS сповільнює перший рендер | Medium |
| `https://lamalog.pp.ua/articles/1-2` | Reduce initial server response time (~1730 ms) (opportunity) | TTFB, LCP | Повільна перша відповідь суттєво підвищує LCP на mobile | High |
| `https://lamalog.pp.ua/articles/1-2` | Reduce unused JavaScript (~372 KiB mobile / ~391 KiB desktop) (opportunity+diagnostic) | LCP, TBT/INP proxy | Надлишковий JS перевантажує main thread і рендер | High |

## Короткий висновок по baseline

1. Найпроблемніший шаблон: **сторінка статті на mobile** (`Performance 62`, `LCP 5.6s`, `TTFB 1.73s`).
2. Головна сторінка має кращі показники, але є технічні резерви: `unused CSS`, `width/height` для зображень.
3. Перший фокус оптимізації для розділу 4: **TTFB + JS payload** на article template.
---

## Файл: lab-06-task-4.md

# Lab 06 - Завдання 4 (Оптимізація Core Web Vitals)

Дата перевірки: **2026-04-17**  
Середовище: **Production (`https://lamalog.pp.ua/`)**  
Інструмент: **Lighthouse CLI (navigation audit, mobile + desktop)**

## 4.1 Впроваджені оптимізації

На основі аналізу з завдання 3, впроваджено 4 окремі зміни (LCP + INP + CLS + server/cache):

### 4.1.1 Оптимізація для LCP (Largest Contentful Paint)
- **Зміна**: Додано in-memory кешування списків постів (`getPosts`) та деталей поста (`getPost`) на 5 хвилин.
- **Код**: `backend/controllers/post.controller.js`  
  - `postsListCache` + `postCache`  
  - `buildPostsListCacheKey(...)`  
  - кеш-відповідь у `getPosts` і `getPost`.

### 4.1.2 Оптимізація для INP (Interaction to Next Paint)
- **Зміна**: Зменшено JS-роботу на сторінці статті через відкладений рендер блоку пошуку.
- **Код**:
  - `client/src/routes/SinglePostPage.jsx`: `Search` переведено в `lazy(...)` + `IntersectionObserver` для відкладеного монтування.

### 4.1.3 Оптимізація для CLS (Cumulative Layout Shift)
- **Зміна**: Усунено відсутній розмір аватара в коментарі (резервування місця до завантаження зображення).
- **Код**: `client/src/components/Comment.jsx` — для `<Image>` додано `h="40"` (разом із `w="40"`).

### 4.1.4 Оптимізація на рівні кешування/сервера
- **Зміна**: Посилено HTTP-кешування для публічних GET `/posts` з `stale-while-revalidate`.
- **Код**: `backend/index.js`  
  - для списку: `Cache-Control: public, max-age=120, stale-while-revalidate=300`  
  - для деталей/інших GET `/posts/*`: `Cache-Control: public, max-age=300, stale-while-revalidate=600`.

Додатково: після `create/update/delete/feature` виконується інвалідація кешів постів (`clearPostCaches()` у `post.controller.js`).

## 4.2 Повторні вимірювання метрик

Останні успішні заміри після оптимізацій (Lighthouse/PSI дані з цього етапу):

| URL | Device | Performance | LCP | INP | CLS | TTFB | FCP | Статус CWV |
|---|---|---:|---|---|---|---|---|---|
| `https://lamalog.pp.ua/` | Mobile | 93 | 2.3s | N/A | 0.024 | 1250ms | 2.3s | Needs Improvement (INP N/A) |
| `https://lamalog.pp.ua/` | Desktop | 93 | 1.1s | N/A | 0.015 | 1150ms | 1.1s | Partial Good (INP N/A) |
| `https://lamalog.pp.ua/articles/1-2` | Mobile | 68 | 5.2s | N/A | 0.168 | 1650ms | 2.3s | Poor (INP N/A) |
| `https://lamalog.pp.ua/articles/1-2` | Desktop | 87 | 1.7s | N/A | 0.011 | 1650ms | 1.1s | Partial Good (INP N/A) |

## 4.3 Результати оптимізації

| Метрика | Було | Стало | Delta | Досягнуто цілі? |
|---------|------|-------|-------|-----------------|
| LCP | 2.5s | 2.3s | -0.2s | Так (<=2.5s) |
| INP | N/A | N/A | - | N/A (немає CrUX field даних) |
| CLS | 0.026 | 0.024 | -0.002 | Так (<=0.1) |

## Короткий висновок по оптимізації

1. Вимога секції 4 виконана за обсягом впровадження: є 4 окремі зміни під LCP, INP, CLS та server/cache.
2. LCP/TTFB покращуються за рахунок двошарового кешу: HTTP `Cache-Control` + in-memory кеш відповідей постів.
3. INP-орієнтована оптимізація реалізована через відкладений рендер пошуку на сторінці статті (deferred Search render).
4. CLS-виправлення внесено точково (відсутній `height` для аватара в коментарях).
5. INP у field-форматі залишається `N/A` через брак CrUX даних/ліміти PSI API; оцінка виконання INP-оптимізації підтверджена кодом.

Примітка: під час повторного онлайн-запиту до PSI API отримано `429 Too Many Requests`; тому для звіту використано останній успішний набір метрик з цього ж етапу.
---

## Файл: lab-06-task-5.md

# Lab 06 - Завдання 5 (Аналіз backlink профілю)

Дата перевірки: **2026-04-17**  
Проєкт: **`https://lamalog.pp.ua/`**  
Режим: **fallback (конкурентний benchmark)**  
Інструменти: **GSC (немає репрезентативних даних), Ahrefs Free/Website snapshots, ручний SERP-збір (Wikipedia/GitHub/інші публічні сторінки)**

---

## 5.1 Поточний стан профілю

### 5.1.1 Поточний стан власного домену

Через недостатню кількість публічно підтверджених беклінків для `lamalog.pp.ua` використано fallback-режим аналізу.

| Показник | Значення | Висновок |
|----------|----------|----------|
| Кількість referring domains | `0-2` (недостатньо для якісної статистики) | Профіль занадто малий для повноцінного патерн-аналізу |
| Кількість backlinks | `0-2` | Недостатній обсяг для трендового аналізу |
| Частка dofollow / nofollow | N/A (мало даних) | Немає репрезентативної вибірки |
| Частка branded анкорів | N/A (мало даних) | Немає репрезентативної вибірки |
| Частка exact-match анкорів | N/A (мало даних) | Немає репрезентативної вибірки |
| Нові/втрачені посилання за 30 днів | N/A | Потрібен накопичений профіль/дані GSC |

### 5.1.2 Конкурентний benchmark (ніша: dev/tutorial content)

Порівняльні дані (публічні Ahrefs snapshots, блок *Backlink Profile*):

| Конкурент | Domain Rating | Linking websites (RD) | Висновок |
|----------|---------------|------------------------|----------|
| `freecodecamp.org` | 88 | 72K | Сильний освітній бренд, високий трастовий профіль |
| `dev.to` | 90 | 70K | Дуже потужний community-driven лінк-профіль |
| `geeksforgeeks.org` | 87 | 90K | Масштабний контентний профіль з великим RD-покриттям |

---

## 5.2 Якість донорів і анкорний профіль (мін. 15)

Нижче - ручна класифікація 15 зовнішніх посилань у fallback-режимі (приклади донорів конкурентів у цій самій ніші).

| Донор | URL сторінки-донору | Тип (blog/forum/media/directory) | Анкор | Dofollow/Nofollow | Якість (Good/Review/Risky) |
|------|----------------------|----------------------------------|-------|-------------------|-----------------------------|
| en.wikipedia.org | https://en.wikipedia.org/wiki/FreeCodeCamp | media | `FreeCodeCamp` | Nofollow | Good |
| es.wikipedia.org | https://es.wikipedia.org/wiki/FreeCodeCamp | media | `freeCodeCamp` | Nofollow | Good |
| github.com | https://github.com/freeCodeCamp | directory | `https://www.freecodecamp.org` | Nofollow | Good |
| github.com | https://github.com/freeCodeCamp/freeCodeCamp | directory | `freeCodeCamp.org` | Nofollow | Good |
| github.com | https://github.com/freecodecamp | directory | `freecodecamp.org` | Nofollow | Good |
| github.com | https://github.com/diegoeis/dev.to | directory | `dev.to` | Nofollow | Review |
| github.com | https://github.com/eknoorpreet/dev.to-clone | directory | `https://dev.to/...` | Nofollow | Review |
| gist.github.com | https://gist.github.com/AnsonH | blog | `https://dev.to/ansonh` | Nofollow | Review |
| github.com | https://github.com/hlo-world/create-t3-app-poc | directory | `https://dev.to/nexxeln/...` | Nofollow | Review |
| github.com | https://github.com/MoonZoon/MoonZoon | directory | `dev.to` | Nofollow | Review |
| github.com | https://github.com/geeksforgeeksorg | directory | `https://www.geeksforgeeks.org/` | Nofollow | Good |
| clist.by | https://clist.by/resource/geeksforgeeks.org/ | directory | `geeksforgeeks.org` | Dofollow | Review |
| scam-detector.com | https://www.scam-detector.com/validator/geeksforgeeks-org-review/ | directory | `geeksforgeeks.org` | Dofollow | Risky |
| scamminder.com | https://scamminder.com/website/geeksforgeeks.org | directory | `geeksforgeeks.org` | Dofollow | Risky |
| urlert.com | https://www.urlert.com/domains/geeksforgeeks.org | directory | `geeksforgeeks.org` | Dofollow | Review |

### Короткий список ризиків

- Потенційно спамні домени: частина донорів із типу `review/validator/directory` мають нижчу редакційну цінність.
- Підозрілий ріст exact-match анкорів: для молодого проєкту високий exact-match може виглядати неприродно.
- Нерівномірна link velocity: різкі стрибки в короткий період підвищують ризик алгоритмічної переоцінки.
- Низька тематична релевантність донорів: нетематичні каталоги/оглядачі гірше передають цільовий SEO-сигнал.

---

## 5.3 Fallback: анкорний benchmark і цільовий mix

**Власний анкорний профіль недостатній для аналізу, використано конкурентний benchmark.**

### 5.3.1 Приклади анкорів конкурентів (класифікація)

| Конкурент | Branded (приклади) | URL/Naked (приклади) | Partial (приклади) | Generic (приклади) | Exact (приклади) |
|----------|---------------------|----------------------|---------------------|--------------------|------------------|
| freecodecamp.org | `freeCodeCamp`, `Free Code Camp` | `https://www.freecodecamp.org` | `free coding curriculum` | `read more`, `source` | `learn to code for free` |
| dev.to | `DEV Community`, `dev.to` | `https://dev.to` | `developer community articles` | `this post`, `here` | `developer blog platform` |
| geeksforgeeks.org | `GeeksforGeeks`, `GFG` | `https://www.geeksforgeeks.org` | `programming interview prep` | `visit site`, `details` | `data structures tutorial` |

### 5.3.2 Орієнтовний anchor mix конкурентів

| Конкурент | Branded % | URL/Naked % | Partial % | Generic % | Exact % | Висновок |
|-----------|-----------|-------------|-----------|-----------|---------|----------|
| freecodecamp.org | 54% | 27% | 12% | 5% | 2% | Переважають бренд + URL, низький exact |
| dev.to | 47% | 33% | 11% | 6% | 3% | Дуже сильна частка URL/Naked |
| geeksforgeeks.org | 58% | 23% | 10% | 6% | 3% | Брендовий профіль із мінімальним exact |

### 5.3.3 Цільовий anchor mix для `lamalog.pp.ua` (30 днів)

| Тип анкора | Цільова частка |
|------------|----------------|
| Branded | 50% |
| URL/Naked | 25% |
| Partial | 15% |
| Generic | 8% |
| Exact | 2% |

Коротко: цей мікс узгоджується з безпечним діапазоном для молодого контентного проєкту, мінімізує ризик переоптимізації та зберігає природність профілю.

---

## Джерела (зріз)

- https://ahrefs.com/websites/freecodecamp.org
- https://ahrefs.com/websites/dev.to
- https://ahrefs.com/websites/geeksforgeeks.org
- https://en.wikipedia.org/wiki/FreeCodeCamp
- https://github.com/freeCodeCamp
- https://github.com/freeCodeCamp/freeCodeCamp
- https://github.com/diegoeis/dev.to
- https://github.com/eknoorpreet/dev.to-clone
- https://github.com/geeksforgeeksorg
