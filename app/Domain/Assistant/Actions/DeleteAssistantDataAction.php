<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Infrastructure\AI\VectorStoreManager;

/**
 * Действие для удаления всех данных ассистента из векторного хранилища и локальной БД.
 */
class DeleteAssistantDataAction
{
    public function __construct(
        private VectorStoreManager $vectorStoreManager
    ) {}

    /**
     * Очищает коллекцию в Qdrant и удаляет локальные чанки.
     */
    public function execute(Assistant $assistant): void
    {
        $this->vectorStoreManager->deleteCollectionForAssistant($assistant);
        $assistant->chunks()->delete();
    }
}
