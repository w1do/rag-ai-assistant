<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Knowledge\Jobs\GenerateKnowledgeJob;

/**
 * Действие для добавления URL-адреса в базу знаний ассистента.
 */
class AddUrlAction
{
    /**
     * Создает запись знания типа 'website' и запускает задачу генерации.
     */
    public function execute(Assistant $assistant, string $url): void
    {
        $knowledge = $assistant->knowledge()->create([
            'type' => 'website',
            'url' => $url,
            'status' => 'pending',
        ]);

        GenerateKnowledgeJob::dispatch($knowledge);
    }
}
