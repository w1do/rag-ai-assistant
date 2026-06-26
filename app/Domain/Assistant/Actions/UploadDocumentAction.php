<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Jobs\ProcessDocumentJob;
use App\Domain\Assistant\Models\Assistant;
use Illuminate\Http\UploadedFile;

class UploadDocumentAction
{
    public function execute(Assistant $assistant, UploadedFile $file): void
    {
        $path = $file->store('documents');

        $knowledge = $assistant->knowledge()->create([
            'type' => 'document',
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'status' => 'pending',
        ]);

        ProcessDocumentJob::dispatch($knowledge);
    }
}
