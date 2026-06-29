<?php

namespace App\Domain\Assistant\Handlers;

use App\Domain\Assistant\Commands\UploadAudioCommand;
use App\Domain\Assistant\Jobs\TranscribeVoiceJob;
use App\Domain\Knowledge\Models\Knowledge;

class UploadAudioHandler
{
    public function handle(UploadAudioCommand $command): Knowledge
    {
        $path = $command->file->store('audio', 'uploads');

        /** @var Knowledge $knowledge */
        $knowledge = $command->assistant->knowledge()->create([
            'type' => 'voice',
            'name' => $command->file->getClientOriginalName(),
            'path' => $path,
            'status' => 'pending',
        ]);

        TranscribeVoiceJob::dispatch($knowledge);

        return $knowledge;
    }
}
