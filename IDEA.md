📝 Итоговое ТЗ (исправленная секция AI)
AI и векторный поиск
Компонент	Технология	Назначение
RAG-фреймворк	LLPhant	Полный пайплайн: чтение документов → семантический чанкинг → эмбеддинги → векторный поиск → генерация ответа . Аналог LlamaIndex для PHP
Векторная БД	Qdrant	Хранение эмбеддингов. LLPhant имеет нативный адаптер
LLM	OpenAI API (через LLPhant)	Генерация ответов, структурирование голоса, база знаний
Эмбеддинги	OpenAI text-embedding-3-small (через LLPhant)	Преобразование текста в векторы (1536 dim)
Голос	OpenAI Whisper API	Транскрипция аудио
💡 Почему LLPhant лучше для твоего MVP
Меньше зависимостей — не нужно подключать отдельные библиотеки для парсинга PDF, чанкинга и эмбеддингов

Готовый QuestionAnswering — поиск + генерация работают из одного метода

Документация как у LlamaIndex — легко переносить знания с Python

Активная поддержка — проект развивается, есть интеграция с Qdrant

Извини за упущение! Добавляй LLPhant в ТЗ как основной RAG-фреймворк вместо PHind. Хочешь, я перепишу полный раздел про RAG-пайплайн с учётом LLPhant? Или покажу, как настроить гибридный поиск (dense + sparse) через LLPhant + Qdrant?

перепиши  план
Техническое задание (MVP)
Сервис быстрой сборки AI-ассистентов с RAG на Laravel + Inertia + React + LLPhant + Qdrant
1. Цель проекта
   Разработать MVP сервиса для быстрого создания AI-ассистентов: клиент загружает файл (PDF) или записывает голосовое описание компании — система парсит, векторизует через LLPhant + Qdrant и отвечает на вопросы через RAG-пайплайн. Дополнительная фича — генерация базы знаний по URL.

2. Технологический стек (полный список)
   2.1. Бэкенд
   Компонент	Технология	Обоснование
   Фреймворк	Laravel 12+	Мощные очереди, Eloquent ORM, безопасность, экосистема
   Язык	PHP 8.2+	Строгая типизация, поддержка современных фич
   База данных	PostgreSQL 15+	Хранение пользователей, ассистентов, чанков, базы знаний
   Очереди	Redis + Laravel Horizon	Асинхронная обработка тяжелых задач (PDF, аудио)
   Кеширование	Redis	Кеш эмбеддингов, частых запросов
   Авторизация	Laravel Fortify	Бэкенд аутентификации (login, registration, 2FA, password reset)
   Права доступа	Spatie/laravel-permission	Роли: admin, user
   2.2. AI и векторный поиск (RAG)
   Компонент	Технология	Обоснование
   RAG-фреймворк	LLPhant	Полный пайплайн: чтение документов → семантический чанкинг → эмбеддинги → векторный поиск → генерация ответа. Аналог LlamaIndex для PHP
   Векторная БД	Qdrant (self-hosted в Docker)	Хранение и поиск эмбеддингов. LLPhant имеет нативный адаптер
   LLM	OpenAI API (через LLPhant)	Генерация ответов, структурирование голоса, наполнение базы знаний
   Эмбеддинги	OpenAI text-embedding-3-small (через LLPhant)	Преобразование текста в векторы (1536 dim)
   Распознавание голоса	OpenAI Whisper API	Транскрипция аудио в текст
   Парсинг PDF	LLPhant PdfExtractor	Извлечение текста из PDF (встроен в LLPhant)
   2.3. Фронтенд
   Компонент	Технология	Обоснование
   Фреймворк	React 19 + TypeScript	UI-библиотека для SPA, современные хуки, типобезопасность
   Связка	Inertia.js v2	SPA-навигация без написания API, серверное роутинг
   Стили	Tailwind CSS 4	Utility-first CSS, быстрая разработка
   UI-компоненты	shadcn/ui (Radix UI)	Готовые, кастомизируемые компоненты. Современный внешний вид
   Сборка	Vite	Быстрая горячая перезагрузка (HMR)
   Маркдаун	Showdown / react-markdown	Отображение форматированных ответов чата
   2.4. Инфраструктура и DevOps
   Компонент	Технология	Обоснование
   Контейнеризация	Docker + Docker Compose	Все сервисы в контейнерах: Laravel, Qdrant, PostgreSQL, Redis
   WebSockets	Laravel Reverb	Реал-тайм статус обработки
   Мониторинг	Laravel Horizon	Управление очередями и мониторинг воркеров
   Роутинг (типобезопасный)	Laravel Wayfinder	Type-safe route generation для Inertia
   Тестирование	PestPHP	Фреймворк для тестирования
   Деплой	На выбор: Vercel + AWS/Render	—
3. Архитектура и взаимодействие сервисов
   text
   ┌─────────────────────────────────────────────────────────────┐
   │                     Клиент (браузер)                        │
   └─────────────────────────────────────────────────────────────┘
   │
   ▼
   ┌─────────────────────────────────────────────────────────────┐
   │              Laravel + Inertia (Монолит)                    │
   │  ┌──────────────────────────────────────────────────────┐   │
   │  │  Web Routes (Inertia)                               │   │
   │  │  - Админка (React)                                  │   │
   │  │  - Клиентский чат (React)                           │   │
   │  └──────────────────────────────────────────────────────┘   │
   │                                                             │
   │  ┌──────────────────────────────────────────────────────┐   │
   │  │  Jobs (Laravel Horizon / Redis)                     │   │
   │  │  - ProcessDocumentJob (PDF → чанки → эмбеддинги)    │   │
   │  │  - TranscribeVoiceJob (аудио → текст)               │   │
   │  │  - GenerateKnowledgeJob (URL → анализ → база знаний) │   │
   │  └──────────────────────────────────────────────────────┘   │
   │                                                             │
   │  ┌──────────────────────────────────────────────────────┐   │
   │  │  RAG-сервис (LLPhant)                               │   │
   │  │  - DocumentSplitter (семантический чанкинг)         │   │
   │  │  - OpenAIEmbeddingGenerator (эмбеддинги)            │   │
   │  │  - QdrantVectorStore (сохранение/поиск)            │   │
   │  │  - QuestionAnswering (готовый RAG-пайплайн)         │   │
   │  └──────────────────────────────────────────────────────┘   │
   └─────────────────────────────────────────────────────────────┘
   │
   ┌────────────────────┼────────────────────┐
   ▼                    ▼                    ▼
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │   PostgreSQL    │  │   Qdrant        │  │   OpenAI API    │
   │   (основная БД) │  │   (векторы)     │  │   (GPT/Emb)     │
   │                 │  │                 │  │                 │
   │ • users         │  │ • Коллекция     │  │ • Эмбеддинги    │
   │ • assistants    │  │   "chunks"      │  │ • Ответы        │
   │ • chunks        │  │   - dense vector│  │ • Транскрипция  │
   │ • knowledge     │  │   - payload     │  │ • Генерация     │
   └─────────────────┘  └─────────────────┘  └─────────────────┘
   Ключевая особенность: Это монолитная архитектура (не раздельный фронт и бэк), поэтому:

Нет CORS-проблем

Нет дублирования авторизации

TypeScript-типы для роутов через Wayfinder

Один деплой для всего приложения

4. Детальный RAG-пайплайн через LLPhant
   4.1. Установка LLPhant
   bash
   composer require theodo-group/llphant
   composer require theodo-group/llphant-qdrant-adapter
   4.2. Настройка конфига
   php
   // config/llphant.php
   return [
   'embedding_generator' => [
   'class' => \LLPhant\Embeddings\EmbeddingGenerator\OpenAI\OpenAIEmbeddingGenerator::class,
   'model' => 'text-embedding-3-small',
   'dimensions' => 1536,
   ],
   'chat' => [
   'class' => \LLPhant\Chat\OpenAIChat::class,
   'model' => 'gpt-4o-mini',
   ],
   'vector_store' => [
   'adapter' => \LLPhant\Embeddings\VectorStores\Qdrant\QdrantVectorStore::class,
   'host' => env('QDRANT_HOST', 'localhost'),
   'port' => env('QDRANT_PORT', 6333),
   'collection' => 'assistant_chunks',
   ],
   ];
   4.3. RAG-сервис (основной класс)
   php
   namespace App\Services\AI;

use LLPhant\Embeddings\Document;
use LLPhant\Embeddings\DocumentSplitter\DocumentSplitter;
use LLPhant\Embeddings\EmbeddingGenerator\OpenAI\OpenAIEmbeddingGenerator;
use LLPhant\Embeddings\VectorStores\Qdrant\QdrantVectorStore;
use LLPhant\QuestionAnswering;
use LLPhant\Chat\OpenAIChat;

class RAGService
{
private OpenAIEmbeddingGenerator $embeddingGenerator;
private QdrantVectorStore $vectorStore;
private QuestionAnswering $qa;

    public function __construct()
    {
        $this->embeddingGenerator = new OpenAIEmbeddingGenerator();
        $this->vectorStore = new QdrantVectorStore(
            host: config('llphant.vector_store.host'),
            port: config('llphant.vector_store.port'),
            collection: config('llphant.vector_store.collection')
        );
        $this->qa = new QuestionAnswering(
            chat: new OpenAIChat(),
            embeddingGenerator: $this->embeddingGenerator,
            vectorStore: $this->vectorStore
        );
    }

    /**
     * Обработка PDF: извлечение текста, чанкинг, эмбеддинги, сохранение в Qdrant
     */
    public function processDocument(string $filePath, int $assistantId, string $sourceName): array
    {
        // 1. Извлечение текста из PDF (встроенный экстрактор LLPhant)
        $extractor = new \LLPhant\Embeddings\DocumentUtils\PdfExtractor();
        $text = $extractor->extractText($filePath);

        // 2. Семантический чанкинг (умная нарезка)
        $documents = DocumentSplitter::splitText(
            text: $text,
            maxLength: 500, // токенов на чанк
            overlap: 50     // перекрытие между чанками
        );

        $savedChunks = [];

        // 3. Для каждого чанка — генерируем эмбеддинг и сохраняем
        foreach ($documents as $doc) {
            $doc->metadata = [
                'assistant_id' => $assistantId,
                'source' => $sourceName,
                'chunk_index' => $doc->chunkIndex ?? 0,
            ];

            // Генерация эмбеддинга
            $doc->embedding = $this->embeddingGenerator->generateEmbedding($doc->content);

            // Сохранение в Qdrant
            $this->vectorStore->addDocument($doc);

            // Сохранение в PostgreSQL для резерва и метаданных
            $chunk = Chunk::create([
                'assistant_id' => $assistantId,
                'content' => $doc->content,
                'source' => $sourceName,
                'metadata' => $doc->metadata,
                'qdrant_id' => $doc->id, // ID из Qdrant для связки
            ]);

            $savedChunks[] = $chunk;
        }

        return $savedChunks;
    }

    /**
     * Гибридный поиск + генерация ответа через QuestionAnswering
     */
    public function ask(string $question, int $assistantId, int $limit = 5): array
    {
        // QuestionAnswering сам выполняет:
        // 1. Генерацию эмбеддинга вопроса
        // 2. Поиск в Qdrant
        // 3. Формирование промпта с контекстом
        // 4. Генерацию ответа через LLM
        $answer = $this->qa->answerQuestion(
            question: $question,
            additionalMetadata: [
                'assistant_id' => $assistantId // Фильтрация по ассистенту
            ],
            limit: $limit
        );

        // Дополнительно — получаем источники (найденные чанки)
        $sources = $this->vectorStore->search(
            embedding: $this->embeddingGenerator->generateEmbedding($question),
            limit: $limit,
            metadataFilter: ['assistant_id' => $assistantId]
        );

        return [
            'answer' => $answer,
            'sources' => $sources,
        ];
    }

    /**
     * Гибридный поиск (только поиск, без генерации)
     */
    public function search(string $query, int $assistantId, int $limit = 10): array
    {
        $embedding = $this->embeddingGenerator->generateEmbedding($query);

        return $this->vectorStore->search(
            embedding: $embedding,
            limit: $limit,
            metadataFilter: ['assistant_id' => $assistantId]
        );
    }

    /**
     * Удаление всех чанков ассистента из Qdrant
     */
    public function deleteAssistant(int $assistantId): void
    {
        $this->vectorStore->deleteByFilter(['assistant_id' => $assistantId]);
    }
}
4.4. Гибридный поиск через Qdrant (dense + sparse)
По умолчанию LLPhant использует dense-векторы. Для полноценного гибридного поиска (dense + sparse + RRF) можно расширить RAGService через прямое обращение к Qdrant API:

php
use Illuminate\Support\Facades\Http;

class HybridSearchService extends RAGService
{
public function hybridSearch(string $query, int $assistantId, int $limit = 5): array
{
$denseEmbedding = $this->embeddingGenerator->generateEmbedding($query);

        // 1. Получаем sparse-вектор (BM25) через Qdrant
        $sparseResponse = Http::post(config('llphant.vector_store.host') . '/collections/assistant_chunks/points/search', [
            'query' => $query,
            'using' => 'sparse',
            'limit' => 20,
            'filter' => [
                'must' => [
                    ['key' => 'assistant_id', 'match' => ['value' => $assistantId]]
                ]
            ]
        ]);

        $sparseVector = $sparseResponse->json()['result']['vector'] ?? null;

        // 2. Выполняем гибридный запрос с RRF-фьюжном
        $response = Http::post(config('llphant.vector_store.host') . '/collections/assistant_chunks/points/query', [
            'prefetch' => [
                [
                    'query' => $denseEmbedding,
                    'using' => 'dense',
                    'limit' => 20,
                ],
                [
                    'query' => $sparseVector,
                    'using' => 'sparse',
                    'limit' => 20,
                ],
            ],
            'query' => ['fusion' => 'rrf', 'k' => 60],
            'filter' => [
                'must' => [
                    ['key' => 'assistant_id', 'match' => ['value' => $assistantId]]
                ]
            ],
            'limit' => $limit,
        ]);

        return $response->json()['result'] ?? [];
    }
}
5. Пайплайны обработки (LLPhant)
   5.1. Загрузка PDF
   text
1. Клиент загружает PDF → сохраняется в Storage
2. Создаётся Job: ProcessDocumentJob → попадает в очередь Redis
3. Воркер (Horizon):
   a) Вызывает RAGService->processDocument():
    - PdfExtractor извлекает текст
    - DocumentSplitter режет на чанки (семантически)
    - OpenAIEmbeddingGenerator генерирует эмбеддинги
    - QdrantVectorStore сохраняет в Qdrant
      b) Сохраняет метаданные в PostgreSQL
4. Статус обновляется через WebSocket (Reverb) или Inertia polling
   5.2. Голосовое описание
   text
1. Клиент записывает аудио → загружает
2. Job: TranscribeVoiceJob:
   a) Отправляет аудио в OpenAI Whisper → получает текст
   b) Отправляет текст в GPT с промптом: "Извлеки структуру компании"
   c) Сохраняет структурированный JSON как чанки в БД
   d) Вызывает RAGService->processDocument() для индексации в Qdrant
   5.3. RAG-чат
   text
1. Пользователь задаёт вопрос в чате
2. RAGService->ask():
   a) Генерирует эмбеддинг вопроса через OpenAIEmbeddingGenerator
   b) Выполняет поиск в QdrantVectorStore (с фильтром по assistant_id)
   c) QuestionAnswering формирует промпт с контекстом
   d) OpenAIChat генерирует ответ
3. Ответ + источники возвращаются клиенту
4. История сохраняется в PostgreSQL
   5.4. База знаний и парсинг URL
   text
1. Клиент вводит URL
2. Job: GenerateKnowledgeJob:
   a) Парсит сайт через WebParser
   b) Извлекает текстовый контент
   c) Отправляет в GPT для генерации заголовка
   d) Сохраняет контент в базу знаний
   e) Индексирует контент в Qdrant
3. Показывает в админке в разделе базы знаний
6. Структура БД
   sql
   -- пользователи (из Fortify)
   users (id, name, email, password, ...)

-- ассистенты
assistants (
id, user_id, name, description,
status (draft|processing|ready),
created_at, updated_at
)

-- чанки (метаданные, эмбеддинги хранятся в Qdrant)
chunks (
id, assistant_id, content,
source (string),
qdrant_id (string), -- ID в Qdrant для связки
metadata (jsonb), -- страница, индекс и т.д.
created_at
)

-- база знаний
knowledge (
id, assistant_id, type, name, url, content, status (pending|processing|ready|error),
created_at, updated_at
)

-- история чатов
chat_history (
id, assistant_id, user_id,
question, answer,
sources (jsonb), -- массив id чанков
created_at
)
7. Ключевые фичи MVP
#	Фича	Описание	Технологии
1	Создание ассистента (2 таба)	Таб 1: голос → транскрипция → структурирование → заливка. Таб 2: PDF → парсинг → чанкинг → эмбеддинги → Qdrant	React, Inertia, Whisper, LLPhant (PdfExtractor, DocumentSplitter), Qdrant
2	RAG-чат	Вопрос → гибридный поиск (LLPhant + Qdrant) → контекст → GPT → ответ + источники	LLPhant QuestionAnswering, OpenAIChat
3	Генератор статей	URL конкурента → парсинг → анализ → генерация 3-5 статей	Laravel HTTP, DOMDocument, OpenAI
4	Статус обработки	Прогресс-бар при загрузке, обновление через Inertia polling	Inertia, Reverb
5	Админка	Дашборд, CRUD ассистентов, просмотр чанков, редактор статей	React, shadcn/ui
8. Docker-окружение
   yaml
   services:
   postgres:
   image: postgres:15
   environment:
   POSTGRES_DB: laravel
   POSTGRES_USER: laravel
   POSTGRES_PASSWORD: secret
   volumes:
    - postgres_data:/var/lib/postgresql/data
      ports:
    - "5432:5432"

qdrant:
image: qdrant/qdrant:latest
ports:
- "6333:6333"
- "6334:6334"  # gRPC
volumes:
- qdrant_storage:/qdrant/storage
environment:
- QDRANT__SERVICE__GRPC_PORT=6334

redis:
image: redis:alpine
ports:
- "6379:6379"

laravel:
build:
context: ./backend
dockerfile: Dockerfile
ports:
- "8000:8000"
depends_on:
- postgres
- qdrant
- redis
environment:
- DB_CONNECTION=pgsql
- DB_HOST=postgres
- DB_PORT=5432
- DB_DATABASE=laravel
- DB_USERNAME=laravel
- DB_PASSWORD=secret
- QDRANT_HOST=http://qdrant:6333
- REDIS_HOST=redis
- OPENAI_API_KEY=${OPENAI_API_KEY}
volumes:
- ./backend:/var/www/html

horizon:
build:
context: ./backend
dockerfile: Dockerfile
command: php artisan horizon
depends_on:
- laravel
- redis
environment:
- REDIS_HOST=redis
volumes:
- ./backend:/var/www/html
9. План разработки (3 недели)
   Этап	Задачи	Срок
   Неделя 1	Установка стартера (Laravel + Inertia + React), Docker-окружение (PostgreSQL, Qdrant, Redis), LLPhant установка и настройка, модели и миграции	3-4 дня
   Неделя 1-2	RAGService через LLPhant (PdfExtractor, DocumentSplitter, QdrantVectorStore), Job для PDF, Job для голоса, React-админка (2 таба)	4-5 дней
   Неделя 2-3	RAG-чат (QuestionAnswering), история, статус-бар, генератор статей по URL, дашборд	5-7 дней
   Финал	Тестирование (Pest), отладка, деплой, документация	2-3 дня
10. Ключевые преимущества LLPhant в ТЗ
    Что даёт LLPhant	Альтернатива (без LLPhant)
    ✅ Встроенный PdfExtractor	❌ Нужно подключать Smalot\PdfParser отдельно
    ✅ Семантический DocumentSplitter	❌ Писать чанкинг вручную
    ✅ Единый интерфейс для всех этапов RAG	❌ Разрозненные библиотеки
    ✅ QuestionAnswering (поиск + генерация)	❌ Писать пайплайн с нуля
    ✅ Нативный адаптер Qdrant	❌ Писать интеграцию через HTTP-клиент
    ✅ Поддержка нескольких LLM (OpenAI, Anthropic, Mistral)	❌ Привязка к одному провайдеру
    Хочешь, я расширю раздел по гибридному поиску (dense + sparse) с детальным кодом? Или добавлю примеры React-компонентов для двух табов и чата?
