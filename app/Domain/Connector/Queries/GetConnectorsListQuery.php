<?php

namespace App\Domain\Connector\Queries;

use App\Domain\Connector\Models\Connector;
use Illuminate\Database\Eloquent\Collection;

class GetConnectorsListQuery
{
    /**
     * @return Collection<int, Connector>
     */
    public function execute(): Collection
    {
        return Connector::with('assistants')->get();
    }
}
