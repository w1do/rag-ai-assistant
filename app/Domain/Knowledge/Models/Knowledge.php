<?php

namespace App\Domain\Knowledge\Models;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Models\Chunk;
use Database\Factories\Domain\Knowledge\Models\KnowledgeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $assistant_id
 * @property string $type
 * @property string $name
 * @property string|null $url
 * @property string|null $path
 * @property string|null $content
 * @property string $status
 * @property array|null $metadata
 * @property-read Assistant $assistant
 */
class Knowledge extends Model
{
    /** @use HasFactory<KnowledgeFactory> */
    use HasFactory;

    protected $table = 'knowledge';

    protected $fillable = [
        'assistant_id',
        'type',
        'name',
        'url',
        'path',
        'content',
        'status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function assistant(): BelongsTo
    {
        return $this->belongsTo(Assistant::class);
    }

    public function chunks(): HasMany
    {
        return $this->hasMany(Chunk::class);
    }
}
