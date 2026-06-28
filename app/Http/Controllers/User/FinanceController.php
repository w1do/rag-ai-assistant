<?php

namespace App\Http\Controllers\User;

use App\Domain\Billing\Queries\GetFinanceHistoryQuery;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    public function index(Request $request, GetFinanceHistoryQuery $query): Response
    {
        return Inertia::render('Finance', [
            'payments' => $query->execute($request->user()),
        ]);
    }
}
