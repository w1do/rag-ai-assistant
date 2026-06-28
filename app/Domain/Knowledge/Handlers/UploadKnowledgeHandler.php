<?php

namespace App\Domain\Knowledge\Handlers;

use App\Domain\Knowledge\Commands\UploadKnowledgeCommand;
use App\Domain\Knowledge\Jobs\ProcessKnowledgeJob;
use App\Domain\Knowledge\Models\Knowledge;

class UploadKnowledgeHandler
{
    public function handle(UploadKnowledgeCommand $command): Knowledge
    {
        $path = $command->dto->file->store('documents', 'local');

        /** @var Knowledge $knowledge */
        $knowledge = $command->assistant->knowledge()->create([
            'type' => $command->dto->type,
            'name' => $command->dto->file->getClientOriginalName(),
            'path' => $path,
            'status' => 'pending',
        ]);

        ProcessKnowledgeJob::dispatch($knowledge);

        return $knowledge;
    }
}
