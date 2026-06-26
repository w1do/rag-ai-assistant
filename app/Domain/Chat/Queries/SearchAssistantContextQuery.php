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
    public function execute(Assistant $assistant, string $question, int $limit = 4): array
    {
        $embedding = $this->aiClientFactory->createEmbeddingGenerator()->embedText($question);
        $vectorStore = $this->vectorStoreManager->getStoreForAssistant($assistant);

        return $vectorStore->similaritySearch($embedding, $limit);
    }
}
