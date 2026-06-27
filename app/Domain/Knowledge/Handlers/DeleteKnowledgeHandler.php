<?php

namespace App\Domain\Knowledge\Handlers;

use App\Domain\Knowledge\Commands\DeleteKnowledgeCommand;
use App\Infrastructure\AI\VectorStoreManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DeleteKnowledgeHandler
{
    public function __construct(private VectorStoreManager $vectorStoreManager) {}

    public function handle(DeleteKnowledgeCommand $command): void
    {
        DB::transaction(function () use ($command) {
            $knowledge = $command->knowledge;
            $assistant = $knowledge->assistant;

            // Get all Qdrant IDs associated with this knowledge via chunks
            $qdrantIds = $assistant->chunks()
                ->where('knowledge_id', $knowledge->id)
                ->whereNotNull('qdrant_id')
                ->pluck('qdrant_id')
                ->toArray();

            // Delete points from Qdrant
            if (! empty($qdrantIds)) {
                $this->vectorStoreManager->deletePoints($assistant, $qdrantIds);
            }

            // Delete file if it exists
            if ($knowledge->path) {
                Storage::delete($knowledge->path);
            }

            $knowledge->delete();
        });
    }
}
