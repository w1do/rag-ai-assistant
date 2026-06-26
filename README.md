# AI Assistant RAG System

MVP-сервис для быстрой сборки AI-ассистентов с использованием RAG-пайплайна.

## Особенности
- **DDD + CQRS Архитектура**: Чистая и масштабируемая структура проекта.
- **RAG Пайплайн**: Загрузка PDF документов, векторизация и интеллектуальный поиск.
- **Голосовая транскрипция**: Поддержка аудиосообщений через OpenAI Whisper.
- **Генерация статей**: Создание контента на основе анализа сайтов конкурентов.
- **Интеграция с PolzaAi**: Поддержка OpenAI-совместимых API (PolzaAi) для работы с текстом.
- **Qdrant**: Быстрое векторное хранилище для поиска контекста.

## Технологический стек
- Laravel 13
- React 19 + Inertia.js v2
- Tailwind CSS 4
- LLPhant (RAG Framework)
- Qdrant (Vector DB)
- Redis + Laravel Horizon (Queue management)

## Требования
- PHP 8.4+
- Node.js & NPM
- Docker (для Qdrant, Redis, Postgres)

## Установка

1. Клонируйте репозиторий.
2. Установите зависимости:
   ```bash
   composer install
   npm install
   ```
3. Настройте окружение:
   ```bash
   cp .env.example .env
   ```
4. Настройте ключи API в `.env`:
   - `OPENAI_API_KEY`: Ваш ключ (OpenAI или PolzaAi)
   - `OPENAI_BASE_URL`: Базовый URL (для PolzaAi: `https://api.polzai.ru/v1`)
   - `QDRANT_HOST`: Хост Qdrant
5. Запустите миграции:
   ```bash
   php artisan migrate
   ```
6. Соберите фронтенд:
   ```bash
   npm run build
   ```

## Функционал проекта
- [Прокси-парсинг через Firecrawl](docs/firecrawl_proxy.md) — надежный сбор данных с поддержкой ротации прокси и повторных попыток.
- [Общий статус проекта](SUMMARY.md) — краткая информация о состоянии разработки.

## Документация
Подробное описание архитектуры и принципов работы системы доступно в файле [DOCUMENTATION.md](DOCUMENTATION.md).
