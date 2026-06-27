<?php

namespace App\Http\Controllers\Chat;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Commands\AskPublicAssistantCommand;
use App\Domain\Chat\DTO\PublicMessageDTO;
use App\Domain\Chat\Handlers\AskPublicAssistantHandler;
use App\Domain\Chat\Queries\GetPublicChatDataQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\PublicMessageRequest;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

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
    /**
     * Отдаёт standalone-страницу публичного чата ассистента.
     *
     * @OA\Get(
     *     path="/share-chat/{id}",
     *     summary="Публичный чат ассистента",
     *     tags={"Public Chat"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Успешный ответ (Inertia)")
     * )
     */
    public function show(Assistant $assistant, GetPublicChatDataQuery $query): Response
    {
        return Inertia::render('ShareChat', $query->execute($assistant, session()->getId()));
    }

    /**
     * Обрабатывает сообщение пользователя в публичном чате.
     *
     * @OA\Post(
     *     path="/share-chat/{id}/message",
     *     summary="Отправка сообщения в публичный чат",
     *     tags={"Public Chat"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\RequestBody(
     *
     *         @OA\JsonContent(ref="#/components/schemas/PublicMessageRequest")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Ответ ассистента",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="answer", type="string"),
     *             @OA\Property(property="sources", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *
     *     @OA\Response(response=422, description="Ошибка валидации")
     * )
     */
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
