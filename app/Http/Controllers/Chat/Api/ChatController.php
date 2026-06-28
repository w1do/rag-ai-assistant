<?php

namespace App\Http\Controllers\Chat\Api;

use App\Domain\Assistant\Queries\GetAllAssistantsQuery;
use App\Http\Controllers\Controller;
use App\Http\Resources\AssistantResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class ChatController extends Controller
{
    /**
     * Получает список всех ассистентов (чатов) для лендинга.
     */
    #[OA\Get(
        path: '/api/chats',
        summary: 'Получение списка всех ассистентов (чатов)',
        description: 'Возвращает полную информацию по всем ассистентам для отображения на лендинге',
        tags: ['Chat'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Успешный ответ со списком ассистентов',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/AssistantResource')
                )
            ),
        ]
    )]
    public function index(GetAllAssistantsQuery $query): AnonymousResourceCollection
    {
        return AssistantResource::collection($query->handle());
    }
}
