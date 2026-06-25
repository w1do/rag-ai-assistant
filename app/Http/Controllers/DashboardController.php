<?php

namespace App\Http\Controllers;

use App\Domain\Assistant\Queries\GetDashboardStatsQuery;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(GetDashboardStatsQuery $query): Response
    {
        return Inertia::render('Dashboard', $query->execute(auth()->user()));
    }
}
