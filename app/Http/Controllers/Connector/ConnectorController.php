<?php

namespace App\Http\Controllers\Connector;

use App\Domain\Assistant\Queries\GetUserAssistantsQuery;
use App\Domain\Connector\Commands\AttachAssistantCommand;
use App\Domain\Connector\Handlers\AttachAssistantHandler;
use App\Domain\Connector\Queries\GetConnectorsListQuery;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use OpenApi\Attributes as OA;

class ConnectorController extends Controller
{
    #[OA\Get(
        path: '/connectors',
        summary: 'Список доступных коннекторов',
        tags: ['Connectors'],
        responses: [
            new OA\Response(response: 200, description: 'Успешный ответ'),
        ]
    )]
    public function index(
        GetConnectorsListQuery $connectorsQuery,
        GetUserAssistantsQuery $assistantsQuery
    ): Response {
        return Inertia::render('Connectors/Index', [
            'connectors' => $connectorsQuery->execute(),
            'assistants' => $assistantsQuery->execute(auth()->user()),
        ]);
    }

    #[OA\Post(
        path: '/connectors/attach-assistant',
        summary: 'Подключение ассистента к коннектору',
        tags: ['Connectors'],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                required: ['connector_id', 'assistant_id'],
                properties: [
                    new OA\Property(property: 'connector_id', type: 'integer'),
                    new OA\Property(property: 'assistant_id', type: 'integer'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 302, description: 'Перенаправление обратно'),
        ]
    )]
    public function attachAssistant(
        Request $request,
        AttachAssistantHandler $handler
    ): RedirectResponse {
        $validated = $request->validate([
            'connector_id' => 'required|exists:connectors,id',
            'assistant_id' => 'required|exists:assistants,id',
        ]);

        $handler->handle(new AttachAssistantCommand(
            connectorId: $validated['connector_id'],
            assistantId: $validated['assistant_id']
        ));

        return back()->with('success', 'Ассистент успешно подключен к коннектору.');
    }
}
