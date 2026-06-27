---
name: feature-laravel-ddd
description: "Реализация функционала в стиле DDD + CQRS + CARS с использованием лучших практик Laravel"
---

При реализации любой фичи, правки или задачи следуй этой архитектуре и правилам.

### 🏗 Архитектурные слои

1. **Http Layer (`app/Http`)**:
   - **Controllers**: Тонкие. Только вызывают Actions или Queries.
   - **Requests**: Вся валидация данных (`php artisan make:request`).
   - **Resources**: Форматирование API ответов (`php artisan make:resource`).

2. **Domain Layer (`app/Domain/{DomainName}`)**:
   - **Actions**: Простые классы для изменения состояния (Create/Update/Delete). Метод `execute()`.
   - **Queries**: Классы для получения данных. Метод `execute()`.
   - **Commands**: DTO для передачи данных в Handlers.
   - **Handlers**: Сложная бизнес-логика, обрабатывающая Commands. Метод `handle()`.
   - **Models**: Eloquent модели, специфичные для домена.
   - **Enums**: Перечисления для типизации.

3. **Infrastructure Layer (`app/Infrastructure`)**:
   - Реализации интерфейсов, работа с внешними API, векторными хранилищами.

---

### 📝 Примеры и структура кода

#### Action (Изменение состояния)
```php
namespace App\Domain\Assistant\Actions;

class StoreAssistantAction {
    public function execute(User $user, array $data): Assistant {
        return $user->assistants()->create($data);
    }
}
```

#### Query (Получение данных)
```php
namespace App\Domain\Assistant\Queries;

class GetUserAssistantsQuery {
    public function execute(User $user): Collection {
        return $user->assistants()->latest()->get();
    }
}
```

#### Command & Handler (Сложная логика)
```php
// Command
class IndexChunksCommand {
    public function __construct(public int $id, public array $chunks) {}
}

// Handler
class IndexChunksHandler {
    public function handle(IndexChunksCommand $command): void {
        // Логика...
    }
}
```

---

### ✅ Лучшие практики

1. **Database**:
   - Всегда используй `with()` для предотвращения N+1.
   - Выбирай только нужные колонки (`select()`).
   - Используй `FormRequest` для валидации: `$request->validated()`.

2. **Security**:
   - Проверяй права через Policies: `$this->authorize('update', $assistant)`.
   - Настрой `$fillable` или `$guarded` в моделях.

3. **Testing (Pest)**:
   - Создавай тесты для каждой фичи: `php artisan make:test --pest NameTest`.
   - Используй фабрики: `Assistant::factory()->create()`.

4. **Инструменты**:
   - Используй `./vendor/bin/sail` для команд: `./vendor/bin/sail artisan ...`, `./vendor/bin/sail test`.
   - Перед завершением запусти Pint: `./vendor/bin/sail bin pint --dirty`.

---

### 📚 Документирование
При создании нового функционала обновляй или создавай документацию в папке `/docs`. Вызывай `/docs` для контекста.
