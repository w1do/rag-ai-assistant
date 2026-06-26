# Конфигурация Qdrant

Документация по настройке и исправлению проблем с подключением к Qdrant.

## Описание проблемы
При использовании Qdrant с включенной авторизацией (API Key) возникала ошибка `401 Unauthorized` (`Qdrant\Exception\InvalidArgumentException`), так как API-ключ не передавался в клиент Qdrant, несмотря на его наличие в переменных окружения.

## Решение
1. В файл конфигурации `config/llphant.php` добавлено поле `api_key` для секции `qdrant`.
2. В классе `App\Infrastructure\AI\VectorStoreManager` реализована передача API-ключа при создании экземпляра `Qdrant\Config`.
3. Добавлена поддержка переменной окружения `QDRANT_API_KEY`.

## Настройка
Для корректной работы необходимо указать следующие переменные в `.env`:

```env
QDRANT_HOST=qdrant
QDRANT_PORT=6333
QDRANT_API_KEY=ваш_ключ_авторизации
```

## Технические детали
- **Клиент**: `hkulekci/qdrant`
- **Класс менеджера**: `App\Infrastructure\AI\VectorStoreManager`
- **Конфигурация**: `config/llphant.php`

Ключ устанавливается через метод `setApiKey()` объекта `Qdrant\Config` перед созданием транспорта.
