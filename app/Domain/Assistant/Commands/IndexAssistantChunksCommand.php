<?php

namespace App\Domain\Assistant\Commands;

/**
 * Команда для индексации произвольных чанков данных ассистента.
 */
class IndexAssistantChunksCommand
{
    /**
     * @param  int  $assistantId  ID ассистента
     * @param  string  $sourceName  Название источника
     * @param  array<int, array<string, mixed>>  $chunks  Массив произвольных данных
     */
    public function __construct(
        public readonly int $assistantId,
        public readonly string $sourceName,
        public readonly array $chunks,
    ) {}
}
