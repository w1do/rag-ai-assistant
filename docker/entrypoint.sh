#!/bin/sh
set -e

# Run migrations
php artisan migrate --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Docs
php artisan l5-swagger:generate --ansi --no-interaction || true

# Create storage link if not exists
php artisan storage:link --ansi --no-interaction || true

# Execute the main command
exec "$@"
