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
