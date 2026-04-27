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
