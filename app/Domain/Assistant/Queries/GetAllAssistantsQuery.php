<?php

namespace App\Domain\Assistant\Queries;

use App\Domain\Assistant\Models\Assistant;
use Illuminate\Database\Eloquent\Collection;

/**
 * Query для получения списка всех ассистентов.
 */
class GetAllAssistantsQuery
{
    /**
     * Выполняет запрос и возвращает коллекцию моделей.
     *
     * @return Collection<int, Assistant>
     */
    public function handle(): Collection
    {
        return Assistant::query()
            ->withCount('knowledge')
            ->latest()
            ->get();
    }
}
