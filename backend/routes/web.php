<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/test-mail', function () {
    Mail::raw('This is a test email from Laravel', function ($message) {
        $message->to('rohanmakvana90@gmail.com')
            ->subject('Test Email');
    });

    return 'Test email sent!';
});
