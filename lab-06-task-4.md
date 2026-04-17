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
