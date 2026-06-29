<?php

namespace App\Http\Controllers\Chat;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Queries\GetAssistantChatSummaryQuery;
use App\Domain\Chat\Queries\GetChatHistoryQuery;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssistantChatController extends Controller
{
    use AuthorizesRequests;

    /**
     * Отображает страницу истории диалогов ассистента.
     *
     * @OA\Get(
     *     path="/assistants/{assistant}/dialogues",
     *     summary="История диалогов ассистента",
     *     tags={"Chat"},
     *
     *     @OA\Parameter(name="assistant", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Успешный ответ")
     * )
     */
    public function index(Assistant $assistant, GetChatHistoryQuery $query): Response
    {
        $this->authorize('view', $assistant);

        return Inertia::render('Chat/AssistantChat', [
            'assistant' => $assistant,
            'history' => $query->execute($assistant),
        ]);
    }

    /**
     * Возвращает саммари последних диалогов.
     *
     * @OA\Get(
     *     path="/assistants/{assistant}/dialogues/summary",
     *     summary="Саммари диалогов",
     *     tags={"Chat"},
     *
     *     @OA\Parameter(name="assistant", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="JSON с саммари")
     * )
     */
    public function summary(Assistant $assistant, GetAssistantChatSummaryQuery $query): JsonResponse
    {
        $this->authorize('view', $assistant);

        $summary = $query->execute($assistant);

        return response()->json(['summary' => $summary]);
    }
}
