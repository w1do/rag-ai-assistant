<?php

namespace App\Domain\Connector\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $connector_id
 * @property string $text
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ConnectorContent extends Model
{
    protected $fillable = [
        'connector_id',
        'text',
        'status',
    ];

    /**
     * @return BelongsTo<Connector, $this>
     */
    public function connector(): BelongsTo
    {
        return $this->belongsTo(Connector::class);
    }
}
