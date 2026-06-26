<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Jobs\GenerateKnowledgeJob;

class AddUrlAction
{
    public function execute(Assistant $assistant, string $url): void
    {
        $knowledge = $assistant->knowledge()->create([
            'type' => 'website',
            'url' => $url,
            'status' => 'pending',
        ]);

        GenerateKnowledgeJob::dispatch($knowledge);
    }
}
