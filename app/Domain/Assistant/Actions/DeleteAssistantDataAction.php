<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Infrastructure\AI\VectorStoreManager;

class DeleteAssistantDataAction
{
    public function __construct(
        private VectorStoreManager $vectorStoreManager
    ) {}

    public function execute(Assistant $assistant): void
    {
        $this->vectorStoreManager->deleteCollectionForAssistant($assistant);
        $assistant->chunks()->delete();
    }
}
