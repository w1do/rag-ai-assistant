---
name: feature-laravel-ddd
description: "Реализация функционала в стиле DDD + CQRS + CARS с использованием лучших практик Laravel и обязательной проверкой качества"
---

При реализации любой фичи, правки или задачи следуй этой архитектуре и правилам. Всегда обращайся к инструкциям в `.agents/skills` для получения актуальных паттернов.

### 📚 Инструкции и навыки (Skills)
Перед началом работы обязательно изучи соответствующие навыки в директории `.agents/skills/`:
- **Refactoring & DDD**: `.agents/skills/refactoring-ddd`
- **Laravel Best Practices**: `.agents/skills/laravel-best-practices`
- **Тестирование**: `.agents/skills/pest-testing`

### 🚀 Работа через Laravel Sail (Обязательно)
Все команды должны выполняться строго внутри Docker-контейнеров через Laravel Sail. Использование локальных PHP, Composer или Artisan напрямую в хост-системе запрещено.

**Примеры использования:**
- **Artisan**: `./vendor/bin/sail artisan make:controller ...`
- **Composer**: `./vendor/bin/sail composer require ...`
- **Тесты**: `./vendor/bin/sail test --compact`
- **Статический анализ**: `./vendor/bin/sail phpstan analyse`
- **Форматирование**: `./vendor/bin/sail pint --dirty`
- **Shell**: `./vendor/bin/sail shell` (для входа внутрь контейнера)

### 🏗 Архитектурные слои (согласно DDD)

1. **Http Layer (`app/Http`)**:
   - **Controllers**: Тонкие. Только вызывают Actions или Handlers.
   - **Requests**: Вся валидация данных (`php artisan make:request`). Используй DTO для передачи данных дальше.
   - **Resources**: Форматирование API ответов (`php artisan make:resource`).

2. **Domain Layer (`app/Domain/{DomainName}`)**:
   - **Actions**: Простые классы для изменения состояния или выполнения одной бизнес-задачи.
   - **Commands**: DTO для передачи данных в Handlers.
   - **Handlers**: Сложная бизнес-логика, обрабатывающая Commands.
   - **Models**: Eloquent модели.
   - **Queries**: Специализированные классы для получения данных (Read models).

3. **Infrastructure Layer (`app/Infrastructure`)**:
   - Реализации интерфейсов, внешние API, системные сервисы.

---

### ✅ Обязательный Pipeline (перед сабмитом)

Каждое изменение должно пройти следующие проверки:

1. **Статический анализ (Larastan)**:
   - Выполни: `./vendor/bin/sail phpstan analyse` (или соответствующую команду проекта).
   - Исправь все ошибки типизации.

2. **Форматирование (Pint)**:
   - Выполни: `./vendor/bin/sail pint --dirty` для исправления стиля кода.

3. **Тестирование (Pest)**:
   - Напиши тесты для нового функционала.
   - Запусти: `./vendor/bin/sail artisan test --pest --compact`. Все тесты должны быть зелеными.

4. **Документация (Swagger & Markdown)**:
   - Если затронуты API эндпоинты, обнови `public/swagger.json`.
   - Обнови или создай документацию в `/docs`.

---

### 📝 Примеры кода

Используй современные возможности PHP 8.5 (Constructor Property Promotion, Readonly, Enums) и паттерны из `.agents/skills`.

#### Command & Handler
```php
// app/Domain/Assistant/Commands/IndexChunksCommand.php
readonly class IndexChunksCommand {
    public function __construct(public int $id, public array $chunks) {}
}

// app/Domain/Assistant/Handlers/IndexAssistantChunksHandler.php
class IndexAssistantChunksHandler {
    public function handle(IndexChunksCommand $command): void {
        // Бизнес-логика...
    }
}
```
