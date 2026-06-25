<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Shared\AI\Services\RAGService;
use LLPhant\Embeddings\DataReader\FileDataReader;

class ProcessDocumentAction
{
    public function __construct(private RAGService $ragService) {}

    public function execute(Assistant $assistant, string $filePath): void
    {
        $assistant->update(['status' => 'processing']);

        $reader = new FileDataReader($filePath);
        $documents = $reader->getDocuments();

        if (empty($documents)) {
            $assistant->update(['status' => 'error']);

            return;
        }

        $this->ragService->indexDocuments($assistant, $documents);
    }
}
