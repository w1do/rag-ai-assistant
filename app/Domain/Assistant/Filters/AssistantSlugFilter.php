<?php

namespace App\Domain\Assistant\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AssistantSlugFilter implements Filter
{
    /**
     * @param  mixed  $value
     */
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->where('slug', $value);
    }
}
