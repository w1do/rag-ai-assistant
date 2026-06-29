<?php

namespace App\Domain\Knowledge\Actions;

use App\Domain\Assistant\Actions\IndexAssistantDocumentsAction;
use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use LLPhant\Embeddings\DataReader\FileDataReader;

/**
 * Действие по обработке и расшифровке загруженных документов.
 * Извлекает текст из файлов и сохраняет его в базе данных.
 */
class ProcessKnowledgeAction
{
    /**
     * @param  IndexAssistantDocumentsAction  $indexAssistantDocumentsAction  Действие для индексации документов
     */
    public function __construct(
        private IndexAssistantDocumentsAction $indexAssistantDocumentsAction
    ) {}

    /**
     * Выполняет извлечение текста, сохранение его в поле content и индексацию в векторном хранилище.
     *
     * @param  Knowledge  $knowledge  Объект знаний для обработки
     */
    public function execute(Knowledge $knowledge): void
    {
        $knowledge->update(['status' => 'processing']);
        $knowledge->assistant->update(['status' => 'processing']);

        try {
            $filePath = Storage::disk('uploads')->path($knowledge->path);

            if (! Storage::disk('uploads')->exists($knowledge->path)) {
                throw new \Exception("Файл не найден по пути: {$filePath}");
            }

            // Проверяем размер файла
            $fileSize = Storage::disk('uploads')->size($knowledge->path);
            if ($fileSize === 0) {
                throw new \Exception('Загруженный файл пуст.');
            }

            $reader = new FileDataReader($filePath);
            $documents = $reader->getDocuments();

            if (empty($documents)) {
                Log::warning("FileDataReader вернул пустой список документов для файла: {$filePath}");
                $knowledge->update([
                    'status' => 'error',
                    'metadata' => array_merge($knowledge->metadata ?? [], ['error' => 'Не удалось извлечь содержимое из файла. Убедитесь, что файл содержит текст и не защищен паролем.']),
                ]);
                $knowledge->assistant->update(['status' => 'ready']);

                return;
            }

            // Сохраняем "расшифровку" - извлеченный текст
            $fullContent = collect($documents)->map(fn ($doc) => $doc->content)->implode("\n\n");

            // Очищаем от лишних пробелов для проверки на пустоту
            $fullContent = trim($fullContent);

            if (empty($fullContent)) {
                Log::warning("FileDataReader вернул пустой контент для файла: {$filePath}");
                $knowledge->update([
                    'status' => 'error',
                    'metadata' => array_merge($knowledge->metadata ?? [], ['error' => 'Не удалось извлечь текст из файла. Убедитесь, что файл содержит текстовый слой (не является простым изображением) и не защищен паролем.']),
                ]);
                $knowledge->assistant->update(['status' => 'ready']);

                return;
            }

            // Пытаемся определить и конвертировать кодировку, если это не UTF-8 (актуально для .txt)
            if (! empty($fullContent) && ! mb_check_encoding($fullContent, 'UTF-8')) {
                $encoding = mb_detect_encoding($fullContent, ['UTF-8', 'Windows-1251', 'ISO-8859-1', 'ASCII'], true);
                if ($encoding && $encoding !== 'UTF-8') {
                    $fullContent = mb_convert_encoding($fullContent, 'UTF-8', $encoding);

                    // Обновляем также объекты Documents для корректной индексации
                    foreach ($documents as $doc) {
                        $doc->content = mb_convert_encoding($doc->content, 'UTF-8', $encoding);
                    }
                }
            }

            // Устанавливаем стабильное имя источника (basename вместо абсолютного пути)
            // Это важно для генерации детерминированных UUID в векторном хранилище
            $sourceName = basename($knowledge->path);
            foreach ($documents as $doc) {
                $doc->sourceName = $sourceName;
            }

            $knowledge->update(['content' => $fullContent]);

            // Индексируем в векторном хранилище
            $this->indexAssistantDocumentsAction->execute($knowledge->assistant, $documents, $knowledge->id);

            $knowledge->update(['status' => 'ready']);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            // Маппинг технических ошибок в понятные пользователю
            if (str_contains($errorMessage, 'Unable to find startxref')) {
                $errorMessage = 'Не удалось прочитать PDF файл. Возможно, он поврежден, зашифрован или имеет неподдерживаемый формат. Попробуйте пересохранить его в формате PDF 1.4+ или как текстовый файл.';
            }

            Log::error("Ошибка при обработке документа знаний (ID: {$knowledge->id}): ".$e->getMessage());

            $knowledge->update([
                'status' => 'error',
                'metadata' => array_merge($knowledge->metadata ?? [], [
                    'error' => $errorMessage,
                    'technical_error' => $e->getMessage(),
                ]),
            ]);
            $knowledge->assistant->update(['status' => 'ready']);
        }
    }
}
