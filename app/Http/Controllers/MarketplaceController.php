<?php

namespace App\Http\Controllers;

use App\Domain\Assistant\Models\Assistant;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    /**
     * Отображает маркетплейс чатов.
     */
    public function index(): Response
    {
        $assistants = Assistant::whereIn('status', ['active', 'ready'])
            ->orWhereNull('status')
            ->latest()
            ->get()
            ->map(function ($assistant) {
                $name = mb_strtolower($assistant->name);
                $desc = mb_strtolower($assistant->description ?? '');

                if (str_contains($name, 'бизнес') || str_contains($desc, 'бизнес') || str_contains($desc, 'автоматизац')) {
                    $assistant->category = 'Бизнес';
                } elseif (str_contains($name, 'rag') || str_contains($desc, 'баз') || str_contains($desc, 'знан')) {
                    $assistant->category = 'RAG';
                } elseif (str_contains($name, 'общени') || str_contains($desc, 'разговор')) {
                    $assistant->category = 'Общение';
                } else {
                    $categories = ['ИИ чаты', 'Общение', 'Бизнес', 'RAG'];
                    $assistant->category = $categories[$assistant->id % count($categories)];
                }

                return $assistant;
            });

        return Inertia::render('Chats/Index', [
            'assistants' => $assistants,
        ]);
    }
}
