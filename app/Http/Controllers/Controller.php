<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    description: 'Документация API для системы BotSync RAG (Retrieval-Augmented Generation), обучение систем на данных для автоматизации чат ботов',
    title: 'BotSync (RAG API)',
    contact: new OA\Contact(email: 'uniqdeveloper@yandex.ru')
)]
#[OA\Server(
    url: 'http://localhost',
    description: 'Локальный сервер'
)]
abstract class Controller
{
    //
}
