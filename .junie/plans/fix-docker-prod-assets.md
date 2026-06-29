---
sessionId: session-260630-013648-1juh
---

# Root Cause

### Почему на проде старый дизайн

`public/build` находится в `.gitignore` — это правильно, локально он генерируется через `npm run dev/build`.

Но в `Dockerfile` есть **критическая проблема с порядком слоёв**:

```dockerfile

# Stage 2: Frontend Assets

FROM node:22-alpine AS node_stage
...
RUN npm run build

# Stage 4: Final Production Image

...

# Copy build assets from node_stage  ← ✅ свежие ассеты

COPY --from=node_stage /var/www/html/public/build ./public/build

# Copy application files  ← ⚠️ COPY . . идёт ПОСЛЕ

COPY . .
```

`.dockerignore` содержит `public/build`, поэтому `COPY . .` не перезаписывает ассеты — **это работает правильно**.

### Реальная причина

Проблема в **Docker layer cache**. При сборке образа на CI/CD или сервере:

1. Если `package.json`, `package-lock.json` или исходники не изменились — Docker использует **закешированный слой** `node_stage` со **старыми ассетами**.
2. Изменения в `.tsx`/`.css` файлах не инвалидируют кеш `node_stage`, потому что `COPY . .` в `node_stage` идёт **после** `npm ci` — но сам `npm run build` зависит от всех исходников.

**Конкретно**: если на сервере/CI собирается образ с `--cache-from` или просто с локальным кешем Docker, и `package.json` не менялся — слой с `npm ci` берётся из кеша, а `COPY . .` + `npm run build` могут тоже закешироваться если Docker не видит изменений в контексте.

### Дополнительная проблема

В `node_stage` порядок такой:
```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .                    ← все исходники
COPY --from=composer_stage  ← vendor
RUN npm run build
```

Это **правильный** порядок для кеширования `npm ci`. Но если CI использует `--cache-from` с предыдущим образом, слой `COPY . .` может не инвалидироваться корректно при некоторых конфигурациях.

### Решение

Добавить `--no-cache` при сборке на проде, **или** явно передавать `BUILD_DATE` ARG для инвалидации кеша, **или** убедиться что CI всегда собирает без кеша для `node_stage`.

# Technical Design

### Изменения в Dockerfile

Добавить `ARG CACHEBUST` перед `COPY . .` в `node_stage` для принудительной инвалидации кеша при каждой сборке:

```dockerfile

# Stage 2: Frontend Assets

FROM node:22-alpine AS node_stage

WORKDIR /var/www/html

COPY package.json package-lock.json ./
RUN npm ci

# Инвалидирует кеш при каждой сборке если передать --build-arg CACHEBUST=$(date +%s)

ARG CACHEBUST=1
COPY . .
COPY --from=composer_stage /var/www/html/vendor ./vendor

RUN npm run build
```

При сборке передавать:
```bash
docker build --build-arg CACHEBUST=$(date +%s) -t myapp .
```

### Альтернатива — проще

Если CI/CD позволяет, просто добавить `--no-cache` к `docker build`:
```bash
docker build --no-cache -t myapp .
```

Это гарантирует что `npm run build` всегда выполняется заново со свежими исходниками.

### Файлы для изменения

- `Dockerfile` — добавить `ARG CACHEBUST` в `node_stage`
- CI/CD конфигурация (если есть) — передавать `--build-arg CACHEBUST=$(date +%s)` или `--no-cache`

# Delivery Steps

### ✓ Step 1: Add CACHEBUST ARG to node_stage in Dockerfile
Dockerfile инвалидирует кеш node_stage при каждой сборке через ARG CACHEBUST.

- Добавить `ARG CACHEBUST=1` перед `COPY . .` в `node_stage`
- Это гарантирует что при передаче `--build-arg CACHEBUST=$(date +%s)` Docker не использует закешированный слой со старыми ассетами
- Слои `npm ci` остаются закешированными (зависят только от `package.json`/`package-lock.json`) — сборка остаётся быстрой
- Только `COPY . .` и `npm run build` будут выполняться заново

### ✓ Step 2: Update CI/CD build command to pass CACHEBUST
Команда сборки Docker образа обновлена для передачи динамического CACHEBUST.

- Найти место где запускается `docker build` (CI/CD скрипт, Makefile, или документация)
- Обновить команду: `docker build --build-arg CACHEBUST=$(date +%s) -t <image> .`
- Если CI/CD файл отсутствует — обновить `README.md` или `DOCUMENTATION.md` с правильной командой сборки
- Проверить что новый образ содержит свежие ассеты