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
