<?php

namespace App\Infrastructure\AI;

use App\Domain\Assistant\Models\Assistant;
use Http\Discovery\Psr18ClientDiscovery;
use LLPhant\Embeddings\Document;
use LLPhant\Embeddings\VectorStores\Qdrant\QdrantVectorStore;
use Qdrant\Config;
use Qdrant\Http\Transport;
use Qdrant\Models\Filter\Condition\FullTextMatch;
use Qdrant\Models\Filter\Filter;
use Qdrant\Models\Request\CreateIndex;
use Qdrant\Qdrant;

/**
 * Менеджер для работы с векторным хранилищем Qdrant.
 */
class VectorStoreManager
{
    /**
     * Возвращает объект хранилища для конкретного ассистента.
     *
     * @param  Assistant  $assistant  Объект ассистента.
     * @return QdrantVectorStore Хранилище для ассистента.
     */
    public function getStoreForAssistant(Assistant $assistant): QdrantVectorStore
    {
        $config = $this->createConfig();

        $collectionName = 'assistant_'.$assistant->id;
        $vectorStore = new QdrantVectorStore($config, $collectionName);

        // Determine dimensions based on model (Polza AI: small=1536, large=3072)
        $model = config('llphant.openai.embedding_model', 'text-embedding-3-small');
        $dimensions = str_contains($model, 'large') ? 3072 : 1536;

        // Ensure collection exists
        $vectorStore->createCollectionIfDoesNotExist($collectionName, $dimensions);

        // Гарантируем наличие полнотекстового индекса для гибридного поиска
        $this->ensureFullTextIndex($assistant);

        return $vectorStore;
    }

    /**
     * Создает полнотекстовый индекс для поля content в коллекции ассистента.
     */
    public function ensureFullTextIndex(Assistant $assistant): void
    {
        $client = $this->getClient();
        $collectionName = 'assistant_'.$assistant->id;

        try {
            $client->collections($collectionName)->index()->create(
                new CreateIndex('content', [
                    'type' => 'text',
                    'tokenizer' => 'word',
                    'min_token_len' => 2,
                    'lowercase' => true,
                ])
            );
        } catch (\Throwable $e) {
            // Индекс уже существует или возникла ошибка, которую мы игнорируем
        }
    }

    /**
     * Создает и возвращает клиент Qdrant.
     *
     * @return Qdrant Клиент Qdrant.
     */
    public function getClient(): Qdrant
    {
        $config = $this->createConfig();

        return new Qdrant(new Transport(Psr18ClientDiscovery::find(), $config));
    }

    /**
     * Создает конфигурацию для клиента Qdrant.
     *
     * @return Config Конфигурация Qdrant.
     */
    private function createConfig(): Config
    {
        $config = new Config(
            config('llphant.qdrant.host'),
            (int) config('llphant.qdrant.port')
        );

        if ($apiKey = config('llphant.qdrant.api_key')) {
            $config->setApiKey($apiKey);
        }

        return $config;
    }

    /**
     * Удаляет коллекцию, связанную с ассистентом.
     *
     * @param  Assistant  $assistant  Объект ассистента.
     */
    public function deleteCollectionForAssistant(Assistant $assistant): void
    {
        $client = $this->getClient();
        try {
            $client->collections('assistant_'.$assistant->id)->delete();
        } catch (\Throwable $e) {
            // Collection may not exist
        }
    }

    /**
     * Удаляет конкретные точки из коллекции Qdrant.
     *
     * @param  Assistant  $assistant  Ассистент, чью коллекцию нужно изменить.
     * @param  array<string>  $ids  Массив UUID идентификаторов точек для удаления.
     */
    public function deletePoints(Assistant $assistant, array $ids): void
    {
        if (empty($ids)) {
            return;
        }

        $client = $this->getClient();

        $client->collections('assistant_'.$assistant->id)->points()->delete($ids);
    }

    /**
     * Выполняет полнотекстовый поиск документов без использования векторов.
     *
     * @return Document[]
     */
    public function searchByText(Assistant $assistant, string $query, int $limit = 5): array
    {
        $client = $this->getClient();
        $collectionName = 'assistant_'.$assistant->id;

        $filter = new Filter;
        $filter->addMust(new FullTextMatch('content', $query));

        try {
            $response = $client->collections($collectionName)->points()->scroll([
                'filter' => $filter->toArray(),
                'limit' => $limit,
                'with_payload' => true,
            ]);

            $results = $response->__toArray()['result']['points'] ?? [];

            $documents = [];
            foreach ($results as $point) {
                $doc = new Document;
                $doc->id = $point['id'];
                $doc->content = $point['payload']['content'] ?? '';
                $doc->hash = $point['payload']['hash'] ?? '';
                $doc->sourceName = $point['payload']['sourceName'] ?? '';
                $doc->sourceType = $point['payload']['sourceType'] ?? '';
                $documents[] = $doc;
            }

            return $documents;
        } catch (\Throwable $e) {
            return [];
        }
    }

    /**
     * Объединяет результаты семантического и полнотекстового поиска.
     *
     * @param  Document[]  $semanticDocs
     * @param  Document[]  $textDocs
     * @return Document[]
     */
    public function mergeDocuments(array $semanticDocs, array $textDocs, int $limit): array
    {
        $merged = [];
        $ids = [];

        // Текстовые совпадения часто приоритетнее для специфических терминов
        foreach ($textDocs as $doc) {
            if (! in_array($doc->id, $ids)) {
                $merged[] = $doc;
                $ids[] = $doc->id;
            }
        }

        foreach ($semanticDocs as $doc) {
            if (! in_array($doc->id, $ids)) {
                $merged[] = $doc;
                $ids[] = $doc->id;
            }
        }

        return array_slice($merged, 0, $limit);
    }
}
