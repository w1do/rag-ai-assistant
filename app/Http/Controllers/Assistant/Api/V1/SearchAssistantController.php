<?php

namespace App\Http\Controllers\Assistant\Api\V1;

use App\Domain\Assistant\Queries\SearchAssistantsQuery;
use App\Http\Controllers\Controller;
use App\Http\Resources\AssistantResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class SearchAssistantController extends Controller
{
    #[OA\Get(
        path: '/api/v1/assistants/search',
        operationId: 'searchAssistants',
        description: 'Позволяет искать ассистентов по ID, имени, слагу и статусу с поддержкой сортировки и пагинации.',
        summary: 'Поиск ассистентов',
        tags: ['Assistant'],
        parameters: [
            new OA\Parameter(
                name: 'filter[id]',
                description: 'Фильтр по ID ассистента',
                in: 'query',
                schema: new OA\Schema(type: 'integer')
            ),
            new OA\Parameter(
                name: 'filter[name]',
                description: 'Фильтр по имени (частичное совпадение)',
                in: 'query',
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'filter[slug]',
                description: 'Фильтр по слагу (точное совпадение)',
                in: 'query',
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'filter[status]',
                description: 'Фильтр по статусу',
                in: 'query',
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'sort',
                description: 'Сортировка (например, -created_at, name)',
                in: 'query',
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'page',
                description: 'Номер страницы',
                in: 'query',
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Список ассистентов',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(ref: '#/components/schemas/AssistantResource')
                        ),
                        new OA\Property(
                            property: 'links',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'first', type: 'string'),
                                new OA\Property(property: 'last', type: 'string'),
                                new OA\Property(property: 'prev', type: 'string', nullable: true),
                                new OA\Property(property: 'next', type: 'string', nullable: true),
                            ]
                        ),
                        new OA\Property(
                            property: 'meta',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'current_page', type: 'integer'),
                                new OA\Property(property: 'from', type: 'integer'),
                                new OA\Property(property: 'last_page', type: 'integer'),
                                new OA\Property(property: 'path', type: 'string'),
                                new OA\Property(property: 'per_page', type: 'integer'),
                                new OA\Property(property: 'to', type: 'integer'),
                                new OA\Property(property: 'total', type: 'integer'),
                            ]
                        ),
                    ]
                )
            ),
        ]
    )]
    public function __invoke(SearchAssistantsQuery $query): AnonymousResourceCollection
    {
        return AssistantResource::collection($query->execute());
    }
}
