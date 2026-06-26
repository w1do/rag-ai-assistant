<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Shared\AI\Services\DocumentProcessor;
use App\Infrastructure\AI\AIClientFactory;
use App\Infrastructure\AI\VectorStoreManager;
use Illuminate\Support\Facades\Log;
use LLPhant\Embeddings\Document;
use LLPhant\Embeddings\DocumentUtils;

/**
 * Класс для индексации документов ассистента в векторном хранилище.
 */
class IndexAssistantDocumentsAction
{
    /**
     * @param  AIClientFactory  $aiClientFactory  Фабрика для создания клиентов ИИ
     * @param  VectorStoreManager  $vectorStoreManager  Менеджер векторного хранилища
     * @param  DocumentProcessor  $documentProcessor  Процессор для обработки документов
     */
    public function __construct(
        private AIClientFactory $aiClientFactory,
        private VectorStoreManager $vectorStoreManager,
        private DocumentProcessor $documentProcessor
    ) {}

    /**
     * Индексирует документы для указанного ассистента.
     *
     * @param  Assistant  $assistant  Ассистент, для которого выполняется индексация
     * @param  Document[]  $documents  Массив документов для индексации
     * @param  int|null  $knowledgeId  ID записи знаний, если применимо
     *
     * @example
     * $action->execute($assistant, [$document], 123);
     */
    public function execute(Assistant $assistant, array $documents, ?int $knowledgeId = null): void
    {
        $allEmbeddedDocuments = [];
        $embeddingGenerator = $this->aiClientFactory->createEmbeddingGenerator();

        foreach ($documents as $document) {
            $splitDocuments = $this->documentProcessor->process($document);

            $embeddedDocuments = retry(3, function () use ($embeddingGenerator, $splitDocuments) {
                return $embeddingGenerator->embedDocuments($splitDocuments);
            }, 1000);

            $allEmbeddedDocuments = array_merge($allEmbeddedDocuments, $embeddedDocuments);
        }

        if (empty($allEmbeddedDocuments)) {
            Log::warning("No documents were embedded for assistant ID: {$assistant->id}");

            return;
        }

        $vectorStore = $this->vectorStoreManager->getStoreForAssistant($assistant);

        retry(3, function () use ($vectorStore, $allEmbeddedDocuments) {
            $vectorStore->addDocuments($allEmbeddedDocuments);
        }, 1000);

        Log::info('Successfully indexed '.count($allEmbeddedDocuments)." chunks for assistant ID: {$assistant->id}");

        if ($knowledgeId) {
            $assistant->chunks()->where('knowledge_id', $knowledgeId)->delete();
        }

        foreach ($allEmbeddedDocuments as $doc) {
            $qdrantId = $doc->id ?? DocumentUtils::formatUUIDFromUniqueId(DocumentUtils::getUniqueId($doc));

            $assistant->chunks()->create([
                'knowledge_id' => $knowledgeId,
                'content' => $doc->content,
                'qdrant_id' => $qdrantId,
                'metadata' => [
                    'sourceName' => $doc->sourceName,
                    'hash' => $doc->hash,
                    'sourceType' => $doc->sourceType,
                    'knowledge_id' => $knowledgeId,
                ],
            ]);
        }

        $assistant->update(['status' => 'ready']);
    }
}
