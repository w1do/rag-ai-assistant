<?php

namespace App\Http\Controllers\Assistant;

use App\Domain\Assistant\Commands\AddUrlCommand;
use App\Domain\Assistant\Commands\DeleteAssistantCommand;
use App\Domain\Assistant\Commands\StoreAssistantCommand;
use App\Domain\Assistant\Commands\UpdateAssistantCommand;
use App\Domain\Assistant\Commands\UploadAudioCommand;
use App\Domain\Assistant\Commands\UploadDocumentCommand;
use App\Domain\Assistant\DTO\AssistantDTO;
use App\Domain\Assistant\Handlers\AddUrlHandler;
use App\Domain\Assistant\Handlers\DeleteAssistantHandler;
use App\Domain\Assistant\Handlers\StoreAssistantHandler;
use App\Domain\Assistant\Handlers\UpdateAssistantHandler;
use App\Domain\Assistant\Handlers\UploadAudioHandler;
use App\Domain\Assistant\Handlers\UploadDocumentHandler;
use App\Domain\Assistant\Models\Assistant;
use App\Domain\Assistant\Queries\GetAssistantWithDetailsQuery;
use App\Domain\Assistant\Queries\GetUserAssistantsQuery;
use App\Domain\Knowledge\Commands\DeleteKnowledgeCommand;
use App\Domain\Knowledge\Handlers\DeleteKnowledgeHandler;
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

    /**
     * Отображает список ассистентов пользователя.
     *
     * @OA\Get(
     *     path="/assistants",
     *     summary="Список ассистентов пользователя",
     *     tags={"Assistant"},
     *
     *     @OA\Response(response=200, description="Успешный ответ")
     * )
     */
    public function index(GetUserAssistantsQuery $query): Response
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Assistants/Index', [
            'assistants' => $query->execute($user),
        ]);
    }

    /**
     * Отображает страницу создания ассистента.
     *
     * @OA\Get(
     *     path="/assistants/create",
     *     summary="Страница создания ассистента",
     *     tags={"Assistant"},
     *
     *     @OA\Response(response=200, description="Успешный ответ")
     * )
     */
    public function create(): Response
    {
        return Inertia::render('Assistants/Create');
    }

    /**
     * Создает нового ассистента.
     *
     * @OA\Post(
     *     path="/assistants",
     *     summary="Создание ассистента",
     *     tags={"Assistant"},
     *
     *     @OA\RequestBody(ref="#/components/schemas/StoreAssistantRequest"),
     *
     *     @OA\Response(response=302, description="Перенаправление на список ассистентов")
     * )
     */
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

    /**
     * Отображает информацию об ассистенте.
     *
     * @OA\Get(
     *     path="/assistants/{id}",
     *     summary="Детали ассистента",
     *     tags={"Assistant"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Успешный ответ")
     * )
     */
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

    /**
     * Обновляет данные ассистента.
     *
     * @OA\Put(
     *     path="/assistants/{id}",
     *     summary="Обновление ассистента",
     *     tags={"Assistant"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\RequestBody(ref="#/components/schemas/UpdateAssistantRequest"),
     *
     *     @OA\Response(response=302, description="Перенаправление на детали ассистента")
     * )
     */
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

    /**
     * Удаляет ассистента.
     *
     * @OA\Delete(
     *     path="/assistants/{id}",
     *     summary="Удаление ассистента",
     *     tags={"Assistant"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=302, description="Перенаправление на список ассистентов")
     * )
     */
    public function destroy(Assistant $assistant, DeleteAssistantHandler $handler): RedirectResponse
    {
        $this->authorize('delete', $assistant);

        $handler->handle(new DeleteAssistantCommand($assistant));

        return redirect()->route('assistants.index');
    }

    /**
     * Загружает документ для ассистента.
     *
     * @OA\Post(
     *     path="/assistants/{id}/documents",
     *     summary="Загрузка документа",
     *     tags={"Assistant"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\RequestBody(
     *
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *
     *             @OA\Schema(
     *
     *                 @OA\Property(property="document", type="string", format="binary")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(response=302, description="Успешная загрузка")
     * )
     */
    public function uploadDocument(Request $request, Assistant $assistant, UploadDocumentHandler $handler): RedirectResponse
    {
        $this->authorize('update', $assistant);

        $request->validate([
            'document' => 'required|file|mimes:pdf,docx,txt|max:10240',
        ]);

        $handler->handle(new UploadDocumentCommand($assistant, $request->file('document')));

        return back()->with('status', 'Document uploaded and processing started.');
    }

    /**
     * Загружает аудио для ассистента.
     *
     * @OA\Post(
     *     path="/assistants/{id}/audio",
     *     summary="Загрузка аудио",
     *     tags={"Assistant"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\RequestBody(
     *
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *
     *             @OA\Schema(
     *
     *                 @OA\Property(property="audio", type="string", format="binary")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(response=302, description="Успешная загрузка")
     * )
     */
    public function uploadAudio(Request $request, Assistant $assistant, UploadAudioHandler $handler): RedirectResponse
    {
        $this->authorize('update', $assistant);

        $request->validate([
            'audio' => 'required|file|mimes:mp3,wav,m4a,webm,ogg|max:25600',
        ]);

        $handler->handle(new UploadAudioCommand($assistant, $request->file('audio')));

        return back()->with('status', 'Audio uploaded and transcription started.');
    }

    /**
     * Добавляет URL для ассистента.
     *
     * @OA\Post(
     *     path="/assistants/{id}/urls",
     *     summary="Добавление URL",
     *     tags={"Assistant"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\RequestBody(
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="url", type="string", format="url", example="https://example.com")
     *         )
     *     ),
     *
     *     @OA\Response(response=302, description="Успешное добавление")
     * )
     */
    public function addUrl(Request $request, Assistant $assistant, AddUrlHandler $handler): RedirectResponse
    {
        $this->authorize('update', $assistant);

        $request->validate([
            'url' => 'required|url',
        ]);

        $handler->handle(new AddUrlCommand($assistant, $request->input('url')));

        return back()->with([
            'status' => 'URL added and knowledge generation started.',
            'flash' => [
                'message' => 'URL добавлен и обрабатывается',
            ],
        ]);
    }

    /**
     * Удаляет запись из базы знаний.
     *
     * @OA\Delete(
     *     path="/assistants/{id}/knowledge/{knowledge_id}",
     *     summary="Удаление знания",
     *     tags={"Assistant"},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="knowledge_id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=302, description="Успешное удаление")
     * )
     */
    public function destroyKnowledge(Assistant $assistant, Knowledge $knowledge, DeleteKnowledgeHandler $handler): RedirectResponse
    {
        $this->authorize('update', $assistant);

        if ($knowledge->assistant_id !== $assistant->id) {
            abort(403);
        }

        $handler->handle(new DeleteKnowledgeCommand($knowledge));

        return back()->with('status', 'Knowledge item deleted.');
    }
}
