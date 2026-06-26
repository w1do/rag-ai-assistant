<?php

namespace App\Http\Controllers;

use App\Domain\Assistant\Models\Assistant;
use App\Domain\Chat\Models\ChatHistory;
use App\Domain\Chat\Queries\AskAssistantQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
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
     * Страница рендерится без авторизационного layout и предназначена для
     * загрузки внутри iframe встраиваемого виджета.
     *
     * @param  Assistant  $assistant  Ассистент, чей публичный чат открывается.
     * @return Response Inertia-ответ со страницей `ShareChat`.
     */
    public function show(Assistant $assistant): Response
    {
        $history = Cache::get($this->getHistoryKey($assistant), []);

        return Inertia::render('ShareChat', [
            'assistant' => [
                'id' => $assistant->id,
                'name' => $assistant->name,
                'brand_name' => $assistant->brand_name,
                'description' => $assistant->description,
                'welcome_message' => $assistant->welcome_message,
                'actions' => $assistant->actions,
            ],
            'initialMessages' => $history,
            'csrfToken' => csrf_token(),
        ]);
    }

    /**
     * Обрабатывает сообщение пользователя и возвращает ответ ассистента.
     *
     * Эндпоинт stateless: предыдущие реплики беседы передаются клиентом в
     * поле `history` и используются только для формирования контекста запроса.
     *
     * @param  Request  $request  HTTP-запрос с полями `question` и `history`.
     * @param  Assistant  $assistant  Ассистент, которому адресован вопрос.
     * @param  AskAssistantQuery  $query  Сервис генерации ответа на основе базы знаний.
     * @return JsonResponse Ответ ассистента и список использованных источников.
     */
    public function message(Request $request, Assistant $assistant, AskAssistantQuery $query): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Переданы некорректные данные.',
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $validated = $validator->validated();

        $historyKey = $this->getHistoryKey($assistant);
        $cachedHistory = Cache::get($historyKey, []);

        $historyCollection = $this->buildHistory($cachedHistory);

        $result = $query->execute($assistant, $validated['question'], $historyCollection);

        $sources = collect($result['sources'])->map(fn ($doc) => [
            'content' => $doc->content,
            'sourceName' => $doc->sourceName,
            'sourceType' => $doc->sourceType,
        ])->values()->all();

        // Сохраняем историю в кэш
        $cachedHistory[] = [
            'question' => $validated['question'],
            'answer' => $result['answer'],
            'sources' => $sources,
        ];

        // Ограничиваем историю последними 20 сообщениями
        $cachedHistory = array_slice($cachedHistory, -20);

        Cache::put($historyKey, $cachedHistory, now()->addDay());

        return response()->json([
            'answer' => $result['answer'],
            'sources' => $sources,
        ]);
    }

    /**
     * Возвращает уникальный ключ для хранения истории гостя в кэше.
     */
    private function getHistoryKey(Assistant $assistant): string
    {
        return "guest_chat_history:{$assistant->id}:".session()->getId();
    }

    /**
     * Преобразует переданные клиентом реплики в коллекцию `ChatHistory`.
     *
     * Модели создаются в памяти (без сохранения в БД) исключительно для
     * передачи контекста беседы в {@see AskAssistantQuery::execute()}.
     *
     * @param  array<int, array{question: string, answer: string}>  $messages  Реплики беседы.
     * @return Collection<int, ChatHistory> Коллекция несохранённых записей истории.
     */
    private function buildHistory(array $messages): Collection
    {
        return collect($messages)
            ->take(-10)
            ->map(fn (array $message): ChatHistory => new ChatHistory([
                'question' => $message['question'],
                'answer' => $message['answer'],
            ]));
    }
}
