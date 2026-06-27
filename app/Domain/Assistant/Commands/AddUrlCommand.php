<?php

namespace App\Domain\Assistant\Commands;

use App\Domain\Assistant\Models\Assistant;

readonly class AddUrlCommand
{
    public function __construct(
        public Assistant $assistant,
        public string $url
    ) {}
}
