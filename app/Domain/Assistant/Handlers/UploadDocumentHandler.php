<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Commands\UploadDocumentCommand;
use App\Domain\Assistant\Jobs\ProcessDocumentJob;
use App\Domain\Knowledge\Models\Knowledge;

class UploadDocumentHandler
{
    public function handle(UploadDocumentCommand $command): Knowledge
    {
        $path = $command->file->store('documents');

        /** @var Knowledge $knowledge */
        $knowledge = $command->assistant->knowledge()->create([
            'type' => 'document',
            'name' => $command->file->getClientOriginalName(),
            'path' => $path,
            'status' => 'pending',
        ]);

        ProcessDocumentJob::dispatch($knowledge);

        return $knowledge;
    }
}
