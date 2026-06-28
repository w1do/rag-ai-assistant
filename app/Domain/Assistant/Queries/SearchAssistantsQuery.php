<?php

namespace App\Domain\Assistant\Queries;

use App\Domain\Assistant\Filters\AssistantIdFilter;
use App\Domain\Assistant\Filters\AssistantNameFilter;
use App\Domain\Assistant\Filters\AssistantSlugFilter;
use App\Domain\Assistant\Filters\AssistantStatusFilter;
use App\Domain\Assistant\Models\Assistant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class SearchAssistantsQuery
{
    public function execute(): LengthAwarePaginator
    {
        return QueryBuilder::for(Assistant::class)
            ->allowedFilters(
                AllowedFilter::custom('id', new AssistantIdFilter),
                AllowedFilter::custom('name', new AssistantNameFilter),
                AllowedFilter::custom('slug', new AssistantSlugFilter),
                AllowedFilter::custom('status', new AssistantStatusFilter),
            )
            ->defaultSort('-created_at')
            ->allowedSorts('name', 'created_at')
            ->paginate()
            ->appends(request()->query());
    }
}
