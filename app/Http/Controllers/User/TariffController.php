<?php

namespace App\Http\Controllers\User;

use App\Domain\Billing\Queries\GetPlansQuery;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Moffhub\Billing\Models\Feature;
use OpenApi\Attributes as OA;

class TariffController extends Controller
{
    #[OA\Get(
        path: '/tariffs',
        summary: 'Страница выбора тарифных планов',
        tags: ['Billing'],
        responses: [
            new OA\Response(response: 200, description: 'Успешный ответ с данными планов и текущей подписки'),
        ]
    )]
    public function index(Request $request, GetPlansQuery $query): Response
    {
        $user = $request->user();
        $currentPlanSlug = null;

        if ($user) {
            $activeSubscription = $user->subscriptions()->active()->latest()->first();
            $currentPlanSlug = $activeSubscription?->plan?->slug;
        }

        return Inertia::render('Tariffs', [
            'plans' => $query->execute(),
            'features' => Feature::all(),
            'currentPlanSlug' => $currentPlanSlug,
        ]);
    }
}
