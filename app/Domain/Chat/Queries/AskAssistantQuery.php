<?php

namespace App\Domain\Chat\Queries;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Models\ChatHistory;
use App\Infrastructure\AI\AIClientFactory;
use App\Infrastructure\AI\VectorStoreManager;
use Illuminate\Support\Collection;
use LLPhant\Chat\Message;
use LLPhant\Embeddings\Document;
use LLPhant\Query\SemanticSearch\QuestionAnswering;

class AskAssistantQuery
{
    public function __construct(
        private AIClientFactory $aiClientFactory,
        private VectorStoreManager $vectorStoreManager
    ) {}

    /**
     * Ask a question and get an answer with sources.
     *
     * @param  Collection<int, ChatHistory>  $history
     * @return array{answer: string, sources: Document[]}
     */
    public function execute(Assistant $assistant, string $question, Collection $history = new Collection): array
    {
        $qa = new QuestionAnswering(
            $this->vectorStoreManager->getStoreForAssistant($assistant),
            $this->aiClientFactory->createEmbeddingGenerator(),
            $this->aiClientFactory->createChatClient()
        );

        $messages = [];
        foreach ($history as $record) {
            $messages[] = Message::user($record->question);
            $messages[] = Message::assistant($record->answer);
        }
        $messages[] = Message::user($question);

        $answer = $qa->answerQuestionFromChat($messages, stream: false);

        return [
            'answer' => $answer,
            'sources' => $qa->getRetrievedDocuments(),
        ];
    }
}
