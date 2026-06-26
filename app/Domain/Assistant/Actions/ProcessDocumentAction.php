<?php

namespace App\Domain\Assistant\Actions;

use App\Domain\Knowledge\Models\Knowledge;
use LLPhant\Embeddings\DataReader\FileDataReader;

/**
 * Действие по обработке загруженных документов.
 */
class ProcessDocumentAction
{
    /**
     * @param  IndexAssistantDocumentsAction  $indexAssistantDocumentsAction  Действие для индексации документов
     */
    public function __construct(private IndexAssistantDocumentsAction $indexAssistantDocumentsAction) {}

    /**
     * Выполняет обработку и индексацию документа.
     *
     * @param  Knowledge  $knowledge  Объект знаний, представляющий документ
     */
    public function execute(Knowledge $knowledge): void
    {
        $knowledge->update(['status' => 'processing']);
        $knowledge->assistant->update(['status' => 'processing']);

        $filePath = storage_path('app/private/'.$knowledge->path);
        $reader = new FileDataReader($filePath);
        $documents = $reader->getDocuments();

        if (empty($documents)) {
            $knowledge->update(['status' => 'error']);
            $knowledge->assistant->update(['status' => 'ready']);

            return;
        }

        $this->indexAssistantDocumentsAction->execute($knowledge->assistant, $documents, $knowledge->id);

        $knowledge->update(['status' => 'ready']);
    }
}
