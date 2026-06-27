<?php

namespace App\Http\Controllers\Chat;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Commands\AskAssistantCommand;
use App\Domain\Chat\Handlers\AskAssistantHandler;
use App\Domain\Chat\Queries\GetChatHistoryQuery;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    use AuthorizesRequests;

    /**
     * Отображает страницу чата с ассистентом.
     *
     * @OA\Get(
     *     path="/assistants/{id}/chat",
     *     summary="Страница чата",
     *     tags={"Chat"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Успешный ответ")
     * )
     */
    public function index(Assistant $assistant, GetChatHistoryQuery $query): Response
    {
        $this->authorize('view', $assistant);

        return Inertia::render('Assistants/Chat', [
            'assistant' => $assistant,
            'history' => $query->execute($assistant),
        ]);
    }

    /**
     * Отправляет сообщение ассистенту.
     *
     * @OA\Post(
     *     path="/assistants/{id}/chat",
     *     summary="Отправка сообщения",
     *     tags={"Chat"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\RequestBody(
     *
     *         @OA\JsonContent(
     *             required={"question"},
     *
     *             @OA\Property(property="question", type="string", example="Как дела?")
     *         )
     *     ),
     *
     *     @OA\Response(response=302, description="Перенаправление обратно")
     * )
     */
    public function store(Request $request, Assistant $assistant, AskAssistantHandler $handler): RedirectResponse
    {
        $this->authorize('view', $assistant);

        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        /** @var User $user */
        $user = Auth::user();

        $handler->handle(new AskAssistantCommand($assistant, $user, $request->input('question')));

        return back();
    }
}
