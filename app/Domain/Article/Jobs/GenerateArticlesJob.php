<?php

namespace App\Domain\Article\Jobs;

use App\Domain\Article\Actions\GenerateArticleAction;
use App\Domain\Assistant\Models\Assistant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateArticlesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Assistant $assistant,
        public string $url
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(GenerateArticleAction $action): void
    {
        $action->execute($this->assistant, $this->url);
    }
}
