Ассистент, для обучения на знаниях бизнеса с помощью ИИ, для построения умных  чат-ботов 
# BotSync RAG System

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
- [Лендинг BotSync](docs/landing_page.md) — презентационная страница с SEO-оптимизацией, демо-чатом и тарифами.
- [Интеграция и синхронизация](docs/data_sync.md) — возможности подключения к CRM, внешним системам и автоматический сбор данных.
- [Настройки и кастомизация](docs/assistant_settings.md) — стили общения, брендинг и логика fallback.
- [Маркетплейс чатов](docs/marketplace.md) — каталог ИИ-ассистентов с фильтрацией по категориям (Бизнес, RAG, Общение).
- [Прокси-парсинг через Firecrawl](docs/firecrawl_proxy.md) — надежный сбор данных с поддержкой ротации прокси и повторных попыток.
- [Конфигурация Qdrant](docs/qdrant_configuration.md) — решение проблемы 401 и настройка API-ключа для векторного хранилища.
- [Развертывание и Docker](docs/deployment.md) — конфигурация продакшен-окружения и решение проблем сборки.
- [Общий статус проекта](SUMMARY.md) — краткая информация о состоянии разработки.

## Документация
Подробное описание архитектуры и принципов работы системы доступно в файле [DOCUMENTATION.md](DOCUMENTATION.md).

### Контакты

> Разработал Денис Митрофанов

**Сайт: [AI-инженер](https://w1do.ru)**

**TG: [W1DO_DIGITAL](https://t.me/W1DO_DIGITAL)**

**MAX: [Простите за MAX](https://max.ru/u/f9LHodD0cOKlpm9dqNIVXbxyaDeOEKzC4jizdf-1qeqNIOnm7yL9qs68d58)**

**Мой канал: [YouTube](https://www.youtube.com/@w1do_digital)**

## Для работодателей и нанимателей
- Только удаленка
- Внедрение AI / Разработка (Claude, Junie, Codex)

