<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Commands\AddUrlCommand;
use App\Domain\Knowledge\Jobs\GenerateKnowledgeJob;
use App\Domain\Knowledge\Models\Knowledge;

class AddUrlHandler
{
    public function handle(AddUrlCommand $command): Knowledge
    {
        /** @var Knowledge $knowledge */
        $knowledge = $command->assistant->knowledge()->create([
            'type' => 'website',
            'url' => $command->url,
            'status' => 'pending',
        ]);

        GenerateKnowledgeJob::dispatch($knowledge);

        return $knowledge;
    }
}
