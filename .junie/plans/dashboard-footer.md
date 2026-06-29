---
sessionId: session-260629-223828-1mlz
---

# Requirements

### Overview & Goals
Публичный чат (`share-chat`) сохраняет историю диалогов только в **кэш** (Redis/file), а не в БД. Из-за этого:
- Дашборд показывает «0 диалогов» (счётчик читает из `chat_histories` в БД)
- Страница «Диалоги» ассистента пуста (тоже читает из БД)

На dev это не заметно, потому что там могут быть тестовые записи в БД или другой кэш-драйвер.

### Scope
**In Scope:**
- Сохранение каждого публичного диалога в таблицу `chat_histories` (без `user_id`, с `session_id`)
- Отображение публичных диалогов на странице «Диалоги» ассистента
- Корректный счётчик «Всего диалогов» на дашборде

**Out of Scope:**
- Изменение логики кэширования контекста беседы (остаётся в кэше для производительности)
- Аутентификация публичных пользователей

# Technical Design

### Root Cause
`AskPublicAssistantHandler` сохраняет историю только в `Cache`, не вызывая `$assistant->chatHistories()->create(...)`. Модель `ChatHistory` имеет `user_id` (nullable или нет — нужно проверить миграцию).

### Proposed Changes

#### 1. Миграция — сделать `user_id` nullable в `chat_histories`
Если `user_id` NOT NULL — добавить миграцию `make_user_id_nullable_in_chat_histories`.

#### 2. `AskPublicAssistantHandler` — сохранять в БД
```php
// После получения ответа:
$command->assistant->chatHistories()->create([
    'user_id'    => null,
    'session_id' => $command->sessionId, // новое поле или использовать существующее
    'question'   => $command->question,
    'answer'     => $result['answer'],
]);
```

#### 3. `GetChatHistoryQuery` — уже читает все `chatHistories`, изменений не требует

#### 4. `GetDashboardStatsQuery` — уже считает все `chat_histories_count`, изменений не требует

### File Structure
- **Изменить**: `app/Domain/Chat/Handlers/AskPublicAssistantHandler.php`
- **Изменить**: `app/Domain/Chat/Models/ChatHistory.php` (добавить `session_id` в `$fillable`)
- **Добавить**: миграция `make_user_id_nullable_in_chat_histories` (если нужно)
- **Добавить**: миграция `add_session_id_to_chat_histories` (опционально, для идентификации сессии)

# Delivery Steps

### ✓ Step 1: Проверить схему и добавить миграции
Схема `chat_histories` проверена, добавлены нужные миграции.

- Проверить через `database-schema` или миграции, является ли `user_id` nullable
- Если NOT NULL — создать миграцию `make_user_id_nullable_in_chat_histories_table`
- Добавить миграцию `add_session_id_to_chat_histories_table` (nullable string) для хранения идентификатора публичной сессии
- Добавить `session_id` в `$fillable` модели `ChatHistory`
- Запустить миграции: `./vendor/bin/sail artisan migrate`

### ✓ Step 2: Сохранять публичные диалоги в БД
`AskPublicAssistantHandler` теперь сохраняет каждый диалог в `chat_histories`.

- В `AskPublicAssistantHandler::handle()` после получения `$result` вызвать `$command->assistant->chatHistories()->create([...])`
- Передавать `user_id => null`, `session_id => $command->sessionId`, `question`, `answer`
- Кэш-логика для контекста беседы остаётся без изменений
- Написать/обновить тест `AskPublicAssistantHandlerTest` проверяющий запись в БД