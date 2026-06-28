<?php

namespace App\Domain\Billing\Queries;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Moffhub\Billing\Models\Payment;

class GetFinanceHistoryQuery
{
    public function execute(User $user): LengthAwarePaginator
    {
        return Payment::query()
            ->where('billable_type', $user->getMorphClass())
            ->where('billable_id', $user->id)
            ->latest()
            ->paginate(15);
    }
}
