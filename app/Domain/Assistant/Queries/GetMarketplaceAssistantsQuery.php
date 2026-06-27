<?php

namespace App\Domain\Assistant\Queries;

use App\Domain\Assistant\DTO\AssistantMarketplaceData;
use App\Domain\Assistant\Models\Assistant;
use Illuminate\Support\Collection;

/**
 * Query для получения списка ассистентов для маркетплейса.
 */
class GetMarketplaceAssistantsQuery
{
    /**
     * Выполняет запрос и возвращает коллекцию DTO.
     *
     * @return Collection<int, AssistantMarketplaceData>
     */
    public function handle(): Collection
    {
        return Assistant::query()
            ->where(function ($query) {
                $query->whereIn('status', ['active', 'ready'])
                    ->orWhereNull('status');
            })
            ->latest()
            ->get()
            ->map(function (Assistant $assistant) {
                $category = $this->determineCategory($assistant);

                return AssistantMarketplaceData::fromModel($assistant, $category);
            });
    }

    /**
     * Определяет категорию ассистента на основе имени и описания.
     */
    private function determineCategory(Assistant $assistant): string
    {
        $name = mb_strtolower($assistant->name);
        $desc = mb_strtolower($assistant->description ?? '');

        if (str_contains($name, 'бизнес') || str_contains($desc, 'бизнес') || str_contains($desc, 'автоматизац')) {
            return 'Бизнес';
        }

        if (str_contains($name, 'rag') || str_contains($desc, 'баз') || str_contains($desc, 'знан')) {
            return 'RAG';
        }

        if (str_contains($name, 'общени') || str_contains($desc, 'разговор')) {
            return 'Общение';
        }

        $categories = ['ИИ чаты', 'Общение', 'Бизнес', 'RAG'];

        return $categories[$assistant->id % count($categories)];
    }
}
