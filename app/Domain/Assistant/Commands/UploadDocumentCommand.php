<?php

namespace App\Domain\Assistant\Commands;

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Http\UploadedFile;

readonly class UploadDocumentCommand
{
    public function __construct(
        public Assistant $assistant,
        public UploadedFile $file
    ) {}
}
