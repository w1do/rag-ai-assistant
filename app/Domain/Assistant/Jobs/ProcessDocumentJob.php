<?php

namespace App\Domain\Assistant\Jobs;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Shared\AI\Services\RAGService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use LLPhant\Embeddings\DataReader\FileDataReader;

class ProcessDocumentJob implements ShouldQueue
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
        $this->assistant->update(['status' => 'processing']);

        $reader = new FileDataReader($this->filePath);
        $documents = $reader->getDocuments();

        if (empty($documents)) {
            $this->assistant->update(['status' => 'error']);
            return;
        }

        $ragService->indexDocuments($this->assistant, $documents);
    }
}
