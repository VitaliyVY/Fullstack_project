# Lab 06 - Завдання 1 (Технічний аудит)

Дата перевірки: **2026-04-16**  
Середовище: **локальний SSR (`http://lamalog`)**  
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
