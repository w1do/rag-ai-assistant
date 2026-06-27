<?php

namespace App\Http\Controllers\Assistant\Api\V1;

use App\Domain\Assistant\Commands\IndexAssistantChunksCommand;
use App\Domain\Assistant\Handlers\IndexAssistantChunksHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\AssistantCallbackRequest;
use Illuminate\Http\JsonResponse;

class AssistantCallbackController extends Controller
{
    /**
     * Обрабатывает входящие данные от клиента для дообучения ассистента.
     */
    public function handle(AssistantCallbackRequest $request, IndexAssistantChunksHandler $handler): JsonResponse
    {
        $command = new IndexAssistantChunksCommand(
            assistantId: $request->integer('assistant_id'),
            sourceName: $request->string('name'),
            chunks: $request->array('chunks'),
        );

        try {
            $knowledge = $handler->handle($command);

            return response()->json([
                'success' => true,
                'message' => 'Данные успешно получены и проиндексированы',
                'assistant_id' => $command->assistantId,
                'knowledge_id' => $knowledge->id,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при индексации данных: '.$e->getMessage(),
            ], 500);
        }
    }
}
