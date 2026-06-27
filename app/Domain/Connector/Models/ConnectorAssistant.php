<?php

namespace App\Domain\Connector\Models;

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $connector_id
 * @property int $assistant_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ConnectorAssistant extends Model
{
    protected $fillable = [
        'connector_id',
        'assistant_id',
    ];

    /**
     * @return BelongsTo<Connector, $this>
     */
    public function connector(): BelongsTo
    {
        return $this->belongsTo(Connector::class);
    }

    /**
     * @return BelongsTo<Assistant, $this>
     */
    public function assistant(): BelongsTo
    {
        return $this->belongsTo(Assistant::class);
    }
}
