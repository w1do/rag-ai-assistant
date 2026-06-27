<?php

namespace App\Http\Controllers\Chat;

use App\Domain\Assistant\Models\Assistant;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;

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
    public function index(Assistant $assistant): RedirectResponse
    {
        return redirect()->route('share-chat.show', $assistant);
    }
}
