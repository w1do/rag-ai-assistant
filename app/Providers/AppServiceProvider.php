<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        if ($this->app->environment('production')) {
            URL::forceHttps();
        }

        Gate::define('viewSwaggerDocs', function ($user) {
            return in_array($user->email, ['uniqdeveloper@yandex.ru']);
        });

        Vite::prefetch(concurrency: 3);
    }
}
