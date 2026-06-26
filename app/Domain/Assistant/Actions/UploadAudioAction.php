<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Jobs\TranscribeVoiceJob;
use App\Domain\Assistant\Models\Assistant;
use Illuminate\Http\UploadedFile;

/**
 * Действие для загрузки аудиофайла и запуска процесса транскрибации.
 */
class UploadAudioAction
{
    /**
     * Сохраняет файл в хранилище и создает запись знания типа 'voice'.
     */
    public function execute(Assistant $assistant, UploadedFile $file): void
    {
        $path = $file->store('audio');

        $knowledge = $assistant->knowledge()->create([
            'type' => 'voice',
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'status' => 'pending',
        ]);

        TranscribeVoiceJob::dispatch($knowledge);
    }
}
