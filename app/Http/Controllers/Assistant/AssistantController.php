<?php

namespace App\Http\Controllers\Assistant;

use App\Domain\Assistant\Actions\AddUrlAction;
use App\Domain\Assistant\Actions\DeleteAssistantAction;
use App\Domain\Assistant\Actions\UploadAudioAction;
use App\Domain\Assistant\Actions\UploadDocumentAction;
use App\Domain\Assistant\Commands\StoreAssistantCommand;
use App\Domain\Assistant\Commands\UpdateAssistantCommand;
use App\Domain\Assistant\DTO\AssistantDTO;
use App\Domain\Assistant\Handlers\StoreAssistantHandler;
use App\Domain\Assistant\Handlers\UpdateAssistantHandler;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Queries\GetAssistantWithDetailsQuery;
use App\Domain\Assistant\Queries\GetUserAssistantsQuery;
use App\Domain\Knowledge\Actions\DeleteKnowledgeAction;
use App\Domain\Knowledge\Models\Knowledge;
use App\Http\Controllers\Controller;
use App\Http\Requests\Assistant\StoreAssistantRequest;
use App\Http\Requests\Assistant\UpdateAssistantRequest;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AssistantController extends Controller
{
    use AuthorizesRequests;

    public function index(GetUserAssistantsQuery $query): Response
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Assistants/Index', [
            'assistants' => $query->execute($user),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Assistants/Create');
    }

    public function store(StoreAssistantRequest $request, StoreAssistantHandler $handler): RedirectResponse
    {
        $dto = AssistantDTO::fromArray($request->validated());

        /** @var User $user */
        $user = Auth::user();

        $handler->handle(new StoreAssistantCommand(
            user: $user,
            dto: $dto
        ));

        return redirect()->route('assistants.index');
    }

    public function show(Assistant $assistant, GetAssistantWithDetailsQuery $query): Response
    {
        $this->authorize('view', $assistant);

        return Inertia::render('Assistants/Show', [
            'assistant' => $query->execute($assistant),
        ]);
    }

    public function edit(Assistant $assistant): Response
    {
        $this->authorize('update', $assistant);

        return Inertia::render('Assistants/Edit', [
            'assistant' => $assistant,
        ]);
    }

    public function update(UpdateAssistantRequest $request, Assistant $assistant, UpdateAssistantHandler $handler): RedirectResponse
    {
        $this->authorize('update', $assistant);

        $dto = AssistantDTO::fromArray($request->validated());

        $handler->handle(new UpdateAssistantCommand(
            assistant: $assistant,
            dto: $dto
        ));

        return redirect()->route('assistants.show', $assistant->id);
    }

    public function destroy(Assistant $assistant, DeleteAssistantAction $action): RedirectResponse
    {
        $this->authorize('delete', $assistant);

        $action->execute($assistant);

        return redirect()->route('assistants.index');
    }

    public function uploadDocument(Request $request, Assistant $assistant, UploadDocumentAction $action): RedirectResponse
    {
        $this->authorize('update', $assistant);

        $request->validate([
            'document' => 'required|file|mimes:pdf,docx,txt|max:10240',
        ]);

        $action->execute($assistant, $request->file('document'));

        return back()->with('status', 'Document uploaded and processing started.');
    }

    public function uploadAudio(Request $request, Assistant $assistant, UploadAudioAction $action): RedirectResponse
    {
        $this->authorize('update', $assistant);

        $request->validate([
            'audio' => 'required|file|mimes:mp3,wav,m4a,webm,ogg|max:25600',
        ]);

        $action->execute($assistant, $request->file('audio'));

        return back()->with('status', 'Audio uploaded and transcription started.');
    }

    public function addUrl(Request $request, Assistant $assistant, AddUrlAction $action): RedirectResponse
    {
        $this->authorize('update', $assistant);

        $request->validate([
            'url' => 'required|url',
        ]);

        $action->execute($assistant, $request->input('url'));

        return back()->with([
            'status' => 'URL added and knowledge generation started.',
            'flash' => [
                'message' => 'URL добавлен и обрабатывается',
            ],
        ]);
    }

    public function destroyKnowledge(Assistant $assistant, Knowledge $knowledge, DeleteKnowledgeAction $action): RedirectResponse
    {
        $this->authorize('update', $assistant);

        if ($knowledge->assistant_id !== $assistant->id) {
            abort(403);
        }

        $action->execute($knowledge);

        return back()->with('status', 'Knowledge item deleted.');
    }
}
