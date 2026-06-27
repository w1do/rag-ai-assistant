<?php

namespace App\Http\Controllers\Assistant;

use App\Domain\Assistant\Queries\GetMarketplaceAssistantsQuery;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    /**
     * Отображает маркетплейс чатов.
     *
     * @OA\Get(
     *     path="/chats",
     *     summary="Отображает маркетплейс чатов",
     *     tags={"Assistant"},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Список ассистентов для маркетплейса",
     *
     *         @OA\JsonContent(
     *             type="array",
     *
     *             @OA\Items(ref="#/components/schemas/AssistantMarketplaceData")
     *         )
     *     )
     * )
     */
    public function index(GetMarketplaceAssistantsQuery $query): Response
    {
        return Inertia::render('Chats/Index', [
            'assistants' => $query->handle(),
        ]);
    }
}
