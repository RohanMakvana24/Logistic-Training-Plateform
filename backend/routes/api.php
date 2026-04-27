<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
| ===================== Auth Endpoints ============== |
*/

Route::prefix("auth")->group(function () {
    Route::post('/login-api', [AuthController::class, 'LoginController']);
    Route::post('/logout-api', [AuthController::class, 'LogoutController'])
        ->middleware('auth:sanctum');
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/login-fresher/{user}', [AuthController::class, 'loginFresher'])
        ->name('login-fresher')
        ->middleware('signed');
});

/*
    | ===================== Admin Endpoints ============== |
    */
Route::prefix("admin")->group(function () {
    /*
        | ===================== User Endpoints ============== |
        */
    Route::prefix('user')->group(function () {
        Route::post('/check-whatsapp', [UserController::class, 'checkWhatsapp']);
        Route::post('/create-user', [UserController::class, 'createUser']);
        Route::get('/fetch-users', [UserController::class, 'fetchUsers']);
        Route::get('/fetch-user/{id}', [UserController::class, 'fetchUser']);
        Route::get("/resent-fresher-login/{id}", [UserController::class, 'resentFresherLoginNotification']);
    });
});
