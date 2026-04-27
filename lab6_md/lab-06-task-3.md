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
