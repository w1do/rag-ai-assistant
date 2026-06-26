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
        Schema::table('chunks', function (Blueprint $table) {
            $table->foreignId('knowledge_id')->nullable()->after('assistant_id')->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('chunks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('knowledge_id');
        });
    }
};
