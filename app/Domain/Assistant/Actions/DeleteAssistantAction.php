<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;

/**
 * Действие для удаления ассистента и связанных с ним данных.
 */
class DeleteAssistantAction
{
    public function __construct(private DeleteAssistantDataAction $deleteAssistantDataAction) {}

    /**
     * Удаляет ассистента, его знания и данные.
     */
    public function execute(Assistant $assistant): bool
    {
        $this->deleteAssistantDataAction->execute($assistant);

        return $assistant->delete();
    }
}
