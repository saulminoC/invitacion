<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BabyShowerController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/baby-shower', [BabyShowerController::class, 'getData']);
Route::post('/baby-shower/vote', [BabyShowerController::class, 'castVote']);
Route::post('/baby-shower/message', [BabyShowerController::class, 'postMessage']);
