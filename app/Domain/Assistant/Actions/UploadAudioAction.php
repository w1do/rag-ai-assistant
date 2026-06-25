<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Jobs\TranscribeVoiceJob;
use Illuminate\Http\UploadedFile;

class UploadAudioAction
{
    public function execute(Assistant $assistant, UploadedFile $file): void
    {
        $path = $file->store('audio');
        TranscribeVoiceJob::dispatch($assistant, storage_path('app/private/' . $path));
    }
}
