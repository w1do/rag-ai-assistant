<?php

namespace App\Http\Controllers\Chat;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Commands\AskPublicAssistantCommand;
use App\Domain\Chat\DTO\PublicMessageDTO;
use App\Domain\Chat\Handlers\AskPublicAssistantHandler;
use App\Domain\Chat\Queries\GetPublicChatDataQuery;
use App\Domain\Chat\Queries\GetSharedChatInitDataQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\PublicMessageRequest;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use OpenApi\Attributes as OA;

/**
 * Контроллер общедоступного чат-виджета.
 *
 * Обслуживает встраиваемый на сторонние сайты чат: standalone-страницу,
 * которая загружается внутри iframe виджета (`public/widget.js`), и
 * stateless JSON-эндпоинт для общения с ассистентом без авторизации.
 *
 * История переписки не сохраняется в БД (нет привязки к пользователю):
 * контекст беседы передаётся клиентом при каждом запросе.
 */
class PublicChatController extends Controller
{
    #[OA\Get(
        path: '/share-chat/{id}',
        summary: 'Публичный чат ассистента',
        tags: ['Public Chat'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Успешный ответ'),
        ]
    )]
    public function show(Assistant $assistant, GetPublicChatDataQuery $query): Response
    {
        return Inertia::render('ShareChat', $query->execute($assistant, session()->getId()));
    }

    #[OA\Get(
        path: '/share-chat/{id}/init',
        summary: 'Инициализация публичного чата',
        tags: ['Public Chat'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Данные инициализации',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'welcome_message', type: 'string', nullable: true),
                        new OA\Property(property: 'actions', type: 'array', items: new OA\Items(type: 'string'), nullable: true),
                        new OA\Property(property: 'company_name', type: 'string', nullable: true),
                        new OA\Property(property: 'phone', type: 'string', nullable: true),
                        new OA\Property(property: 'description', type: 'string', nullable: true),
                        new OA\Property(property: 'social_networks', type: 'object', nullable: true),
                    ]
                )
            ),
        ]
    )]
    public function init(Assistant $assistant, GetSharedChatInitDataQuery $query): JsonResponse
    {
        return response()->json($query->execute($assistant));
    }

    #[OA\Post(
        path: '/share-chat/{id}/message',
        summary: 'Отправка сообщения в публичный чат',
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(ref: '#/components/schemas/PublicMessageRequest')
        ),
        tags: ['Public Chat'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Ответ ассистента',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'answer', type: 'string'),
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Ошибка валидации'),
        ]
    )]
    public function message(
        PublicMessageRequest $request,
        Assistant $assistant,
        AskPublicAssistantHandler $handler
    ): JsonResponse {
        $dto = PublicMessageDTO::fromArray($request->validated());

        $result = $handler->handle(new AskPublicAssistantCommand(
            $assistant,
            $dto->question,
            session()->getId()
        ));

        return response()->json($result);
    }
}
