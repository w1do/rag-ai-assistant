<?php

namespace App\Domain\Assistant\Models;

use App\Domain\Chat\Models\ChatHistory;
use App\Domain\Knowledge\Models\Knowledge;
use App\Models\User;
use Database\Factories\Domain\Assistant\Models\AssistantFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assistant extends Model
{
    /** @use HasFactory<AssistantFactory> */
    use HasFactory;

    protected static function newFactory()
    {
        return AssistantFactory::new();
    }

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
        'url',
        'qdrant_id',
        'content',
        'metadata',
    ];

    protected $appends = [
        'articles',
        'articles_count',
    ];

    /**
     * Backward compatibility for 'articles'
     */
    public function getArticlesAttribute()
    {
        return $this->knowledge;
    }

    /**
     * Backward compatibility for 'articles_count'
     */
    public function getArticlesCountAttribute()
    {
        return $this->knowledge_count ?? $this->knowledge()->count();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function chunks(): HasMany
    {
        return $this->hasMany(Chunk::class);
    }

    public function knowledge(): HasMany
    {
        return $this->hasMany(Knowledge::class);
    }

    public function chatHistories(): HasMany
    {
        return $this->hasMany(ChatHistory::class);
    }
}
