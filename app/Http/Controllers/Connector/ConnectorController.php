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

class ConnectorController extends Controller
{
    public function index(
        GetConnectorsListQuery $connectorsQuery,
        GetUserAssistantsQuery $assistantsQuery
    ): Response {
        return Inertia::render('Connectors/Index', [
            'connectors' => $connectorsQuery->execute(),
            'assistants' => $assistantsQuery->execute(auth()->user()),
        ]);
    }

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
