<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;

class UpdateAssistantAction
{
    /**
     * @param  array{name: string, description?: ?string, style?: string, brand_name?: ?string, phone?: ?string, social?: ?array, fallback?: ?string, system?: ?string}  $data
     */
    public function execute(Assistant $assistant, array $data): bool
    {
        return $assistant->update($data);
    }
}
