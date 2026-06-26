<?php

namespace App\Domain\Assistant\Jobs;

use App\Domain\Assistant\Actions\TranscribeAudioAction;
use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class TranscribeVoiceJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Knowledge $knowledge
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(TranscribeAudioAction $action): void
    {
        $action->execute($this->knowledge);
    }
}
