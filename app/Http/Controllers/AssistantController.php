<?php

namespace App\Http\Controllers;

use App\Domain\Assistant\Actions\AddUrlAction;
use App\Domain\Assistant\Actions\DeleteAssistantAction;
use App\Domain\Assistant\Actions\StoreAssistantAction;
use App\Domain\Assistant\Actions\UpdateAssistantAction;
use App\Domain\Assistant\Actions\UploadAudioAction;
use App\Domain\Assistant\Actions\UploadDocumentAction;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Queries\GetAssistantWithDetailsQuery;
use App\Domain\Assistant\Queries\GetUserAssistantsQuery;
use App\Domain\Knowledge\Actions\DeleteKnowledgeAction;
use App\Domain\Knowledge\Models\Knowledge;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssistantController extends Controller
{
    use AuthorizesRequests;

    public function index(GetUserAssistantsQuery $query): Response
    {
        return Inertia::render('Assistants/Index', [
            'assistants' => $query->execute(auth()->user()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Assistants/Create');
    }

    public function store(Request $request, StoreAssistantAction $action): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $action->execute(auth()->user(), $validated);

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

    public function update(Request $request, Assistant $assistant, UpdateAssistantAction $action): RedirectResponse
    {
        $this->authorize('update', $assistant);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $action->execute($assistant, $validated);

        return redirect()->route('assistants.index');
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

        $action->execute($assistant, $request->url);

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
