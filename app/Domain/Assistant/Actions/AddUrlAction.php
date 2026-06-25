<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Article\Jobs\GenerateArticlesJob;
use App\Domain\Assistant\Models\Assistant;

class AddUrlAction
{
    public function execute(Assistant $assistant, string $url): void
    {
        $assistant->articles()->create([
            'url' => $url,
            'status' => 'pending',
        ]);

        GenerateArticlesJob::dispatch($assistant, $url);
    }
}
