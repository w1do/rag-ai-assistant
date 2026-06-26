<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Knowledge\Models\Knowledge;
use LLPhant\Audio\OpenAIAudio;
use LLPhant\Embeddings\Document;
use LLPhant\OpenAIConfig;

/**
 * Действие по транскрибации аудиофайлов.
 */
class TranscribeAudioAction
{
    /**
     * @param  IndexAssistantDocumentsAction  $indexAssistantDocumentsAction  Действие для индексации документов
     */
    public function __construct(private IndexAssistantDocumentsAction $indexAssistantDocumentsAction) {}

    /**
     * Выполняет транскрибацию аудио и индексацию полученного текста.
     *
     * @param  Knowledge  $knowledge  Объект знаний, представляющий аудиофайл
     */
    public function execute(Knowledge $knowledge): void
    {
        $knowledge->update(['status' => 'processing']);
        $knowledge->assistant->update(['status' => 'processing']);

        $config = new OpenAIConfig;
        $config->apiKey = config('llphant.openai.api_key');
        $config->url = config('llphant.openai.base_url');

        $audioService = new OpenAIAudio($config);
        $filePath = storage_path('app/private/'.$knowledge->path);
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
