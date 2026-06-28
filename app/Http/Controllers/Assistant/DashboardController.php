<?php

namespace App\Http\Controllers\Assistant;

use App\Domain\Assistant\Queries\GetDashboardStatsQuery;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use OpenApi\Attributes as OA;

class DashboardController extends Controller
{
    #[OA\Get(
        path: '/dashboard',
        summary: 'Главная страница панели управления',
        tags: ['Dashboard'],
        responses: [
            new OA\Response(response: 200, description: 'Успешный ответ'),
        ]
    )]
    public function index(GetDashboardStatsQuery $query): Response
    {
        return Inertia::render('Dashboard', $query->execute(auth()->user()));
    }
}
