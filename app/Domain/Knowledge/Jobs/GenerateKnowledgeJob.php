<?php

namespace App\Domain\Knowledge\Jobs;

use App\Domain\Knowledge\Actions\GenerateKnowledgeAction;
use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateKnowledgeJob implements ShouldQueue
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
    public function handle(GenerateKnowledgeAction $action): void
    {
        $action->execute($this->knowledge);
    }
}
