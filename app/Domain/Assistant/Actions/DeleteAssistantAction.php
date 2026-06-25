<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Shared\AI\Services\RAGService;

class DeleteAssistantAction
{
    public function __construct(private RAGService $ragService) {}

    public function execute(Assistant $assistant): bool
    {
        $this->ragService->deleteAssistantData($assistant);

        return $assistant->delete();
    }
}
