<?php

namespace App\Domain\Assistant\Jobs;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Shared\AI\Services\RAGService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use LLPhant\Audio\OpenAIAudio;
use LLPhant\OpenAIConfig;
use LLPhant\Embeddings\Document;

class TranscribeVoiceJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Assistant $assistant,
        public string $filePath
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(RAGService $ragService): void
    {
        $this->assistant->update(['status' => 'transcribing']);

        $config = new OpenAIConfig();
        $config->apiKey = config('llphant.openai.api_key');
        $config->url = config('llphant.openai.base_url');

        $audioService = new OpenAIAudio($config);
        $transcription = $audioService->transcribe($this->filePath);

        if (empty($transcription->text)) {
            $this->assistant->update(['status' => 'error']);
            return;
        }

        $document = new Document();
        $document->content = $transcription->text;
        $document->sourceName = basename($this->filePath);
        $document->sourceType = 'voice';

        $ragService->indexDocuments($this->assistant, [$document]);
    }
}
