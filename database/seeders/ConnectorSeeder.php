<?php

namespace Database\Seeders;

use App\Domain\Connector\Models\Connector;
use Illuminate\Database\Seeder;

class ConnectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Connector::truncate();

        Connector::create([
            'name' => 'VK',
            'description' => 'Постинг в сообщества и на стену ВКонтакте',
            'icon' => 'vk',
            'status' => 'active',
        ]);

        Connector::create([
            'name' => 'Telegram',
            'description' => 'Постинг в каналы и группы Telegram',
            'icon' => 'telegram',
            'status' => 'soon',
        ]);

        Connector::create([
            'name' => 'MAX',
            'description' => 'Интеграция с платформой MAX',
            'icon' => 'max',
            'status' => 'active',
        ]);

        Connector::create([
            'name' => 'VC.ru',
            'description' => 'Публикация статей на VC.ru',
            'icon' => 'vc',
            'status' => 'soon',
        ]);
    }
}
