<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;

class UpdateAssistantAction
{
    /**
     * @param  array{name: string, description: ?string}  $data
     */
    public function execute(Assistant $assistant, array $data): bool
    {
        return $assistant->update($data);
    }
}
