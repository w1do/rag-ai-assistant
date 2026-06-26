<?php

namespace App\Infrastructure\AI;

use App\Domain\Assistant\Models\Assistant;
use Http\Discovery\Psr18ClientDiscovery;
use LLPhant\Embeddings\VectorStores\Qdrant\QdrantVectorStore;
use Qdrant\Config;
use Qdrant\Http\Transport;
use Qdrant\Qdrant;

class VectorStoreManager
{
    public function getStoreForAssistant(Assistant $assistant): QdrantVectorStore
    {
        $config = new Config(
            config('llphant.qdrant.host'),
            config('llphant.qdrant.port')
        );

        $collectionName = 'assistant_'.$assistant->id;
        $vectorStore = new QdrantVectorStore($config, $collectionName);

        // Determine dimensions based on model (Polza AI: small=1536, large=3072)
        $model = config('llphant.openai.embedding_model', 'text-embedding-3-small');
        $dimensions = str_contains($model, 'large') ? 3072 : 1536;

        // Ensure collection exists
        $vectorStore->createCollectionIfDoesNotExist($collectionName, $dimensions);

        return $vectorStore;
    }

    public function getClient(): Qdrant
    {
        $config = new Config(
            config('llphant.qdrant.host'),
            config('llphant.qdrant.port')
        );

        return new Qdrant(new Transport(Psr18ClientDiscovery::find(), $config));
    }

    public function deleteCollectionForAssistant(Assistant $assistant): void
    {
        $client = $this->getClient();
        try {
            $client->collections('assistant_'.$assistant->id)->delete();
        } catch (\Exception $e) {
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
}
