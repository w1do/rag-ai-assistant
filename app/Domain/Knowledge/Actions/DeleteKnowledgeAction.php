<?php

namespace App\Domain\Knowledge\Actions;

use App\Domain\Knowledge\Models\Knowledge;
use App\Infrastructure\AI\VectorStoreManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Класс для удаления знаний (сайтов, документов) и связанных с ними данных.
 * Удаляет записи из локальной БД, файлы из хранилища и точки из Qdrant.
 */
class DeleteKnowledgeAction
{
    public function __construct(private VectorStoreManager $vectorStoreManager) {}

    /**
     * Выполняет удаление объекта знаний.
     *
     * @param  Knowledge  $knowledge  Объект знаний для удаления.
     *
     * @example
     * $action->execute($knowledge);
     */
    public function execute(Knowledge $knowledge): void
    {
        DB::transaction(function () use ($knowledge) {
            $assistant = $knowledge->assistant;

            // Get all Qdrant IDs associated with this knowledge via chunks
            $qdrantIds = $assistant->chunks()
                ->where('knowledge_id', $knowledge->id)
                ->whereNotNull('qdrant_id')
                ->pluck('qdrant_id')
                ->toArray();

            // Delete points from Qdrant
            if (! empty($qdrantIds)) {
                $this->vectorStoreManager->deletePoints($assistant, $qdrantIds);
            }

            // Delete file if it exists
            if ($knowledge->path) {
                Storage::disk('uploads')->delete($knowledge->path);
            }

            $knowledge->delete();
        });
    }
}
