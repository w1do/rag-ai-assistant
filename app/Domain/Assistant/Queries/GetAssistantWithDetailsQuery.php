<?php

namespace App\Domain\Assistant\Queries;

use App\Domain\Assistant\Models\Assistant;

class GetAssistantWithDetailsQuery
{
    public function execute(Assistant $assistant): Assistant
    {
        return $assistant->load(['chunks', 'articles']);
    }
}
