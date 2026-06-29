<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Knowledge\Models\Knowledge;
use App\Infrastructure\AI\AIClientFactory;
use Illuminate\Support\Facades\Storage;
use LLPhant\Embeddings\Document;

/**
 * Действие по транскрибации аудиофайлов.
 */
class TranscribeAudioAction
{
    /**
     * @param  IndexAssistantDocumentsAction  $indexAssistantDocumentsAction  Действие для индексации документов
     * @param  AIClientFactory  $aiClientFactory  Фабрика для создания клиентов ИИ
     */
    public function __construct(
        private IndexAssistantDocumentsAction $indexAssistantDocumentsAction,
        private AIClientFactory $aiClientFactory
    ) {}

    /**
     * Выполняет транскрибацию аудио и индексацию полученного текста.
     *
     * @param  Knowledge  $knowledge  Объект знаний, представляющий аудиофайл
     */
    public function execute(Knowledge $knowledge): void
    {
        $knowledge->update(['status' => 'processing']);
        $knowledge->assistant->update(['status' => 'processing']);

        $audioService = $this->aiClientFactory->createAudioTranscriber();
        $filePath = Storage::disk('uploads')->path($knowledge->path);
        $transcription = $audioService->transcribe($filePath);

        if (empty($transcription->text)) {
            $knowledge->update(['status' => 'error']);
            $knowledge->assistant->update(['status' => 'ready']);

            return;
        }

        $knowledge->update([
            'content' => $transcription->text,
        ]);

        $document = new Document;
        $document->content = $transcription->text;
        $document->sourceName = $knowledge->name;
        $document->sourceType = 'voice';
        $document->hash = hash('sha256', $transcription->text);

        $this->indexAssistantDocumentsAction->execute($knowledge->assistant, [$document], $knowledge->id);

        $knowledge->update(['status' => 'ready']);
    }
}
