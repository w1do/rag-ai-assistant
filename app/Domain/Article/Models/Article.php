<?php

namespace App\Domain\Article\Models;

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Article extends Model
{
    protected $fillable = [
        'assistant_id',
        'url',
        'title',
        'content',
        'status',
    ];

    public function assistant(): BelongsTo
    {
        return $this->belongsTo(Assistant::class);
    }
}
