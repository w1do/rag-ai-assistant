<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Shared\AI\Services\RAGService;
use LLPhant\Audio\OpenAIAudio;
use LLPhant\Embeddings\Document;
use LLPhant\OpenAIConfig;

class TranscribeAudioAction
{
    public function __construct(private RAGService $ragService) {}

    public function execute(Assistant $assistant, string $filePath): void
    {
        $assistant->update(['status' => 'transcribing']);

        $config = new OpenAIConfig;
        $config->apiKey = config('llphant.openai.api_key');
        $config->url = config('llphant.openai.base_url');

        $audioService = new OpenAIAudio($config);
        $transcription = $audioService->transcribe($filePath);

        if (empty($transcription->text)) {
            $assistant->update(['status' => 'error']);

            return;
        }

        $document = new Document;
        $document->content = $transcription->text;
        $document->sourceName = basename($filePath);
        $document->sourceType = 'voice';

        $this->ragService->indexDocuments($assistant, [$document]);
    }
}
