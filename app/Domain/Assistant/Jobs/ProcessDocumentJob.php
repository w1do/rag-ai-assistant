<?php

namespace App\Domain\Assistant\Jobs;

use App\Domain\Assistant\Actions\ProcessDocumentAction;
use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessDocumentJob implements ShouldQueue
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
    public function handle(ProcessDocumentAction $action): void
    {
        $action->execute($this->knowledge);
    }
}
