<?php

namespace App\Domain\Connector\Models;

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $icon
 * @property string $status
 * @property array|null $settings
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Connector extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'status',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    /**
     * @return BelongsToMany<Assistant, $this>
     */
    public function assistants(): BelongsToMany
    {
        return $this->belongsToMany(Assistant::class, 'connector_assistants');
    }

    /**
     * @return HasMany<ConnectorContent, $this>
     */
    public function contents(): HasMany
    {
        return $this->hasMany(ConnectorContent::class);
    }
}
