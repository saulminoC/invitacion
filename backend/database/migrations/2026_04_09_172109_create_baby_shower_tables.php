<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('baby_votes', function (Blueprint $table) {
            $table->id();
            $table->integer('nino')->default(0);
            $table->integer('nina')->default(0);
            $table->timestamps();
        });

        Schema::create('baby_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('message');
            $table->timestamps();
        });

        // ¡Esto hace el trabajo de Tinker automáticamente!
        DB::table('baby_votes')->insert(['nino' => 0, 'nina' => 0]);
    }

    public function down()
    {
        Schema::dropIfExists('baby_messages');
        Schema::dropIfExists('baby_votes');
    }
};
