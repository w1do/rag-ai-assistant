<?php

namespace App\Domain\Knowledge\Jobs;

use App\Domain\Knowledge\Actions\ProcessKnowledgeAction;
use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessKnowledgeJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Knowledge $knowledge
    ) {}

    public function handle(ProcessKnowledgeAction $action): void
    {
        $action->execute($this->knowledge);
    }
}
