# Movie Catalog – Next.js SPA

Проверочное (test) задание «Каталог фильмов».
Полностью готовый проект на **Next.js 14 + TypeScript** с поиском по OMDb API, избранным, кэшированием через React-Query и поддержкой тёмной / светлой темы.

---

## Стек

| Задача                | Библиотека / подход                                        |
| --------------------- | ---------------------------------------------------------- |
| Фреймворк / SSR       | Next.js 14 (app-router **не нужен** → страницы в `/pages`) |
| Язык                  | TypeScript 5                                               |
| Стили                 | CSS-Modules + PostCSS nesting                              |
| Кэш / серверный стейт | **@tanstack/react-query v5**                               |
| UI-иконки             | lucide-react                                               |
| HTTP на сервере       | axios                                                      |
| Состояние темы        | Context API + `data-theme`                                 |
| Хранилище избранного  | localStorage<br/>(анонимному гостю выдаётся UUID)          |

---

## Быстрый старт

```bash
git clone https://github.com/Agarey/2025-04-24-UPPERCASE
cd movie-catalog
cp .env.example .env.local        # ⇐ впишите ключи (см. ниже)
npm i                             # или pnpm / yarn
npm run dev
```

Откройте `http://localhost:3000`.

Сборка production:

```bash
npm run build && npm start
```

---

## .env переменные

| Переменная                      | Пример                     | Назначение                 |
| ------------------------------- | -------------------------- | -------------------------- |
| `OMDB_API_URL`                  | `https://www.omdbapi.com/` | базовый URL OMDb           |
| `OMDB_API_KEY`                  | `xxxxxxxx`                 | ваш персональный ключ      |
| `NEXT_PUBLIC_PLACEHOLDER_IMAGE` | `/img/no-poster.png`       | запасная картинка          |
| `NEXT_PUBLIC_SITE_URL`          | `http://localhost:3000`    | нужен SSR-странице деталей |

`.env.example` уже присутствует – скопируйте как `.env.local` и заполните.

---

## Архитектура

```
│
├─ pages/                      # Next-страницы (SSR + CSR)
│   ├─ index.tsx               # Главная (поиск, сетка, пагинация)
│   ├─ movie/[id].tsx          # Детальная, getServerSideProps
│   └─ favorites.tsx           # Избранное (CSR)
│
├─ components/                 # UI-компоненты (по одному файлу)
│   ├─ MovieCard.tsx
│   ├─ MovieGrid.tsx
│   ├─ Filters/…
│   └─ …
│
├─ hooks/                      # кастомные React-хуки
│   ├─ useMovies.ts            # ⇐ бизнес-логика списка
│   ├─ useHeaderSearch.ts
│   └─ useFavorite.ts
│
├─ pages/api/                  # Next API routes (проксирующие OMDb)
│   ├─ search.ts               # поиск
│   ├─ details.ts              # batch-детали
│   └─ movie/[id].ts           # полные детали
│
├─ utils/                      # чистые функции / helpers
│   ├─ favorites.ts            # localStorage CRUD
│   ├─ pagination.ts
│   └─ …
└─ styles/                     # CSS-modules (+ globals)
```

---

## Реализованные фишки

| Фича                       | Детали реализации                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SSR начальная загрузка** | `getServerSideProps` отдаёт случайный поисковый запрос, чтобы каталог был наполнен ещё до JS.                                                        |
| **Детальная страница**     | `/movie/[id]` –– расширенная информация (жанр, актёры, бюджет).                                                                                      |
| **React-Query кэш**        | - ключ `search/<term>` на списки <br/>- ключ `details/<ids>` на пачки деталей <br/>- `placeholderData` сохраняет прежний результат ⇢ нет скачков UI. |
| **Пагинация**              | 10 карточек на страницу, аккуратные «…» при длинных списках.                                                                                         |
| **Избранное**              | Кнопка ★ на карточке (в том числе в оверлее). Данные лежат в `localStorage`, у анонимного гостя генерируется `crypto.randomUUID()`.                  |
| **Тёмная / светлая тема**  | По умолчанию учитывается `prefers-color-scheme`; можно переключить в меню профиля.                                                                   |
| **Адаптивность**           | Flex-/Grid-вёрстка, дробные `sizes` для `next/image`.                                                                                                |
| **Авторский кэш API**      | Внутри `pages/api/*` простейший LRU на `Map` с TTL: `/search` – 10 мин, `/details` и `/movie/:id` – 60 мин.                                          |
| **Skeleton-загрузки**      | Плашки вместо постера / текста до получения деталей.                                                                                                 |

---

## Пояснения

| Вопрос                                    | Ответ                                                                                                                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SSR или CSR?**                          | Главная страница — CSR (быстрый внутренний роутинг). Детальная — SSR, т.к. полноценная SEO-мета и прямой URL-share без Flash-of-Loading.                            |
| **Две ступени данных (search → details)** | OMDb в поисковом ответе не содержит Plot/Rating — поэтому загружаем минимум, а детали догружаем пачкой только для видимых карточек.                                 |
| **localStorage-избранное**                | Нет серверной авторизации, но хочется UX «сохранил → вернулся». UUID гостя решает коллизию «один key = один список у всех».                                         |
| **CSS-Modules**                           | Достаточно для интервью-проекта, нет оверхеда Tailwind. При надобности легко заменить.                                                                              |

---

## Скрипты npm

| Скрипт   | Действие                         |
| -------- | -------------------------------- |
| `dev`    | Запуск dev-сервера `next dev`    |
| `build`  | Production-сборка                |
| `start`  | `NODE_ENV=production next start` |
| `lint`   | ESLint + TypeScript check        |

---
