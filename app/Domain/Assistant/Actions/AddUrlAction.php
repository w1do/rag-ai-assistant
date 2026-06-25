<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Article\Jobs\GenerateArticlesJob;

class AddUrlAction
{
    public function execute(Assistant $assistant, string $url): void
    {
        GenerateArticlesJob::dispatch($assistant, $url);
    }
}
