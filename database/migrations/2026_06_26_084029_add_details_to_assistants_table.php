<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('assistants', function (Blueprint $table) {
            $table->string('style')->default('business');
            $table->string('brand_name')->nullable();
            $table->string('phone')->nullable();
            $table->jsonb('social')->nullable();
            $table->text('fallback')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assistants', function (Blueprint $table) {
            $table->dropColumn(['style', 'brand_name', 'phone', 'social', 'fallback']);
        });
    }
};
