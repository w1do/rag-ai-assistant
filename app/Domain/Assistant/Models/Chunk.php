<?php

namespace App\Domain\Assistant\Models;

use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chunk extends Model
{
    protected $fillable = [
        'assistant_id',
        'knowledge_id',
        'qdrant_id',
        'content',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function assistant(): BelongsTo
    {
        return $this->belongsTo(Assistant::class);
    }

    public function knowledge(): BelongsTo
    {
        return $this->belongsTo(Knowledge::class);
    }
}
