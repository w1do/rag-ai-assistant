<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;

class DeleteAssistantAction
{
    public function execute(Assistant $assistant): bool
    {
        return $assistant->delete();
    }
}
