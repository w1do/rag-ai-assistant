<?php

namespace App\Domain\Shared\AI\Services;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Models\Chunk;
use LLPhant\Embeddings\Document;
use LLPhant\Embeddings\DocumentSplitter\DocumentSplitter;
use LLPhant\Embeddings\EmbeddingGenerator\OpenAI\OpenAIEmbeddingGenerator;
use LLPhant\Embeddings\VectorStores\Qdrant\QdrantVectorStore;
use LLPhant\Chat\OpenAIChat;
use LLPhant\OpenAIConfig;
use LLPhant\Query\SemanticSearch\QuestionAnswering;
use Qdrant\Config;

class RAGService
{
    private OpenAIEmbeddingGenerator $embeddingGenerator;
    private OpenAIChat $chat;

    public function __construct()
    {
        $config = new OpenAIConfig();
        $config->apiKey = config('llphant.openai.api_key');
        $config->url = config('llphant.openai.base_url');

        $this->embeddingGenerator = new OpenAIEmbeddingGenerator($config);
        $this->chat = new OpenAIChat($config);
    }

    /**
     * Index documents for an assistant.
     *
     * @param Assistant $assistant
     * @param Document[] $documents
     */
    public function indexDocuments(Assistant $assistant, array $documents): void
    {
        $allEmbeddedDocuments = [];

        foreach ($documents as $document) {
            // Split document into chunks
            $splitDocuments = DocumentSplitter::splitDocument($document, 1000);

            // Generate embeddings
            $embeddedDocuments = $this->embeddingGenerator->embedDocuments($splitDocuments);
            $allEmbeddedDocuments = array_merge($allEmbeddedDocuments, $embeddedDocuments);
        }

        // Store in Qdrant
        $vectorStore = $this->getVectorStore($assistant);
        $vectorStore->addDocuments($allEmbeddedDocuments);

        // Save chunks to database for metadata and easy lookup
        foreach ($allEmbeddedDocuments as $doc) {
            $assistant->chunks()->create([
                'content' => $doc->content,
                'qdrant_id' => $doc->id ?? null,
                'metadata' => [
                    'sourceName' => $doc->sourceName,
                    'hash' => $doc->hash,
                    'sourceType' => $doc->sourceType,
                ],
            ]);
        }

        $assistant->update(['status' => 'ready']);
    }

    /**
     * Search for relevant context for a question.
     *
     * @param Assistant $assistant
     * @param string $question
     * @param int $limit
     * @return Document[]
     */
    public function search(Assistant $assistant, string $question, int $limit = 4): array
    {
        $embedding = $this->embeddingGenerator->embedText($question);
        $vectorStore = $this->getVectorStore($assistant);

        return $vectorStore->similaritySearch($embedding, $limit);
    }

    /**
     * Ask a question and get an answer with sources.
     *
     * @param Assistant $assistant
     * @param string $question
     * @return array{answer: string, sources: Document[]}
     */
    public function ask(Assistant $assistant, string $question): array
    {
        $qa = new QuestionAnswering(
            $this->getVectorStore($assistant),
            $this->embeddingGenerator,
            $this->chat
        );

        $answer = $qa->answerQuestion($question);

        return [
            'answer' => $answer,
            'sources' => $qa->getRetrievedDocuments(),
        ];
    }

    private function getVectorStore(Assistant $assistant): QdrantVectorStore
    {
        $config = new Config(
            config('llphant.qdrant.host'),
            config('llphant.qdrant.port')
        );

        $collectionName = 'assistant_' . $assistant->id;
        $vectorStore = new QdrantVectorStore($config, $collectionName);

        // Ensure collection exists
        $vectorStore->createCollectionIfDoesNotExist($collectionName, 1536); // 1536 is OpenAI embedding length

        return $vectorStore;
    }
}
