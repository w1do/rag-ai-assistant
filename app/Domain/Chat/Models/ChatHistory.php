<?php

namespace App\Domain\Chat\Models;

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatHistory extends Model
{
    protected $fillable = [
        'assistant_id',
        'user_id',
        'question',
        'answer',
        'sources',
    ];

    protected $casts = [
        'sources' => 'array',
    ];

    public function assistant(): BelongsTo
    {
        return $this->belongsTo(Assistant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
