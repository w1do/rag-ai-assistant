<?php

namespace App\Http\Controllers\Assistant\Api\V1;

use App\Domain\Assistant\Commands\IndexAssistantChunksCommand;
use App\Domain\Assistant\Handlers\IndexAssistantChunksHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\AssistantCallbackRequest;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class AssistantCallbackController extends Controller
{
    #[OA\Post(
        path: '/api/v1/callback',
        operationId: 'assistantCallback',
        description: 'Этот эндпоинт позволяет отправлять подготовленные данные (вопросы и ответы) напрямую для индексации в базе знаний ассистента.',
        summary: 'Дообучение ассистента',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['assistant_id', 'name', 'chunks'],
                properties: [
                    new OA\Property(property: 'assistant_id', description: 'ID ассистента в системе', type: 'integer', example: 1),
                    new OA\Property(property: 'name', description: 'Название источника знаний', type: 'string', example: 'FAQ по пиццерии'),
                    new OA\Property(
                        property: 'chunks',
                        description: 'Массив объектов с произвольными данными (например, пары вопрос-ответ)',
                        type: 'array',
                        items: new OA\Items(
                            type: 'object',
                            example: ['question' => 'Какую пиццу вы готовите?', 'answer' => 'Мы готовим большую и тонкую пиццу на дровах.']
                        )
                    ),
                ]
            )
        ),
        tags: ['Обучение ассистента на JSON'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Данные успешно получены и проиндексированы',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Данные успешно получены и проиндексированы'),
                        new OA\Property(property: 'assistant_id', type: 'integer', example: 1),
                        new OA\Property(property: 'knowledge_id', type: 'integer', example: 42),
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Ошибка валидации',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'The assistant id field is required.'),
                        new OA\Property(
                            property: 'errors',
                            properties: [
                                new OA\Property(
                                    property: 'assistant_id',
                                    type: 'array',
                                    items: new OA\Items(type: 'string', example: 'The assistant id field is required.')
                                ),
                            ],
                            type: 'object'
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 500,
                description: 'Внутренняя ошибка сервера',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Ошибка при индексации данных: [Текст ошибки]'),
                    ]
                )
            ),
        ]
    )]
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
