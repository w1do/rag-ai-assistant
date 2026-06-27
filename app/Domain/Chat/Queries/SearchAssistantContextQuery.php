<?php

namespace App\Domain\Chat\Queries;

use App\Domain\Assistant\Models\Assistant;
use App\Infrastructure\AI\AIClientFactory;
use App\Infrastructure\AI\VectorStoreManager;
use LLPhant\Embeddings\Document;

class SearchAssistantContextQuery
{
    public function __construct(
        private AIClientFactory $aiClientFactory,
        private VectorStoreManager $vectorStoreManager
    ) {}

    /**
     * Search for relevant context for a question.
     *
     * @return Document[]
     */
    public function execute(Assistant $assistant, string $question, int $limit = 10): array
    {
        $vectorStore = $this->vectorStoreManager->getStoreForAssistant($assistant);
        $embeddingGenerator = $this->aiClientFactory->createEmbeddingGenerator();

        // 1. Семантический поиск
        $embedding = $embeddingGenerator->embedText($question);
        $semanticDocuments = $vectorStore->similaritySearch($embedding, $limit);

        // 2. Полнотекстовый поиск
        $textDocuments = $this->vectorStoreManager->searchByText($assistant, $question, $limit);

        // 3. Объединяем результаты
        return $this->vectorStoreManager->mergeDocuments($semanticDocuments, $textDocuments, $limit);
    }
}
