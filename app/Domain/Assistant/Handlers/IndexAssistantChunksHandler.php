<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Actions\IndexAssistantDocumentsAction;
use App\Domain\Assistant\Commands\IndexAssistantChunksCommand;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Models\Knowledge;
use LLPhant\Embeddings\Document;

/**
 * Обработчик команды индексации чанков.
 */
readonly class IndexAssistantChunksHandler
{
    public function __construct(
        private IndexAssistantDocumentsAction $indexAssistantDocumentsAction
    ) {}

    /**
     * Выполняет обработку и индексацию чанков.
     */
    public function handle(IndexAssistantChunksCommand $command): Knowledge
    {
        $assistant = Assistant::findOrFail($command->assistantId);

        // Создаем или обновляем запись в Knowledge (знаниях)
        $knowledge = Knowledge::updateOrCreate(
            [
                'assistant_id' => $assistant->id,
                'type' => 'api',
                'name' => $command->sourceName,
            ],
            [
                'status' => 'processing',
                'metadata' => [
                    'source' => 'callback_api',
                    'updated_at' => now()->toDateTimeString(),
                ],
            ]
        );

        $documents = [];
        foreach ($command->chunks as $chunkData) {
            $lines = [];
            foreach ($chunkData as $key => $value) {
                $val = is_array($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : (string) $value;
                $lines[] = "{$key}: {$val}";
            }

            $document = new Document;
            $document->content = implode("\n", $lines);
            $document->sourceName = $command->sourceName;
            $document->sourceType = 'api';
            $documents[] = $document;
        }

        try {
            // Запускаем индексацию документов через существующий экшн
            $this->indexAssistantDocumentsAction->execute($assistant, $documents, $knowledge->id);

            $knowledge->refresh();
            $knowledge->update(['status' => 'ready']);
        } catch (\Exception $e) {
            $knowledge->update([
                'status' => 'error',
                'metadata' => array_merge($knowledge->metadata ?? [], [
                    'error' => $e->getMessage(),
                    'trace' => mb_substr($e->getTraceAsString(), 0, 1000),
                ]),
            ]);
            throw $e;
        }

        return $knowledge;
    }
}
