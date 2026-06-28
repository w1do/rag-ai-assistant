<?php

namespace App\Domain\Chat\Queries;

use App\Domain\Assistant\Models\Assistant;

class GetSharedChatInitDataQuery
{
    /**
     * @return array{
     *     welcome_message: string|null,
     *     actions: array|null,
     *     company_name: string|null,
     *     phone: string|null,
     *     description: string|null,
     *     social_networks: array|null
     * }
     */
    public function execute(Assistant $assistant): array
    {
        return [
            'welcome_message' => $assistant->welcome_message,
            'actions' => $assistant->actions,
            'company_name' => $assistant->brand_name,
            'phone' => $assistant->phone,
            'description' => $assistant->description,
            'social_networks' => $assistant->social,
        ];
    }
}
