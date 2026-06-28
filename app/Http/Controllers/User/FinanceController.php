<?php

namespace App\Http\Controllers\User;

use App\Domain\Billing\Queries\GetFinanceHistoryQuery;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use OpenApi\Attributes as OA;

class FinanceController extends Controller
{
    #[OA\Get(
        path: '/finance',
        summary: 'Страница истории финансовых операций',
        tags: ['Billing'],
        responses: [
            new OA\Response(response: 200, description: 'Успешный ответ с историей платежей'),
        ]
    )]
    public function index(Request $request, GetFinanceHistoryQuery $query): Response
    {
        return Inertia::render('Finance', [
            'payments' => $query->execute($request->user()),
        ]);
    }
}
