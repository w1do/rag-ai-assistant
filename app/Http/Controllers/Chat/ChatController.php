<?php

namespace App\Http\Controllers\Chat;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Actions\AskAssistantAction;
use App\Domain\Chat\Queries\GetChatHistoryQuery;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    use AuthorizesRequests;

    public function index(Assistant $assistant, GetChatHistoryQuery $query): Response
    {
        $this->authorize('view', $assistant);

        return Inertia::render('Assistants/Chat', [
            'assistant' => $assistant,
            'history' => $query->execute($assistant),
        ]);
    }

    public function store(Request $request, Assistant $assistant, AskAssistantAction $action): RedirectResponse
    {
        $this->authorize('view', $assistant);

        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $action->execute($assistant, auth()->user(), $request->question);

        return back();
    }
}
