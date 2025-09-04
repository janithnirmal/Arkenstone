<?php

namespace App\Http\Controllers;

use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoggerTestController extends Controller
{
    public function test()
    {
        // Example usage of the AuditLogger service
        AuditLogger::info('This is an info log message', ['user_id' => 1]);
        AuditLogger::error('This is an error log message', ['user_id' => 1]);
        AuditLogger::emergency(
            'Helakuru Attack on this server',
            [
                'user_id' => 1,
                'user_email' => "helakuru@gmail.com",
                'country' => "sri lanka",
                'district' => "colombo",
                'city' => "colombo",
            ]
        );
        AuditLogger::notice('This is a notice log message', ['user_id' => 1]);
        AuditLogger::warning('This is a warning log message', ['user_id' => 1]);
        AuditLogger::critical('This is a critical log message', ['user_id' => 1]);
        AuditLogger::alert('This is an alert log message', ['user_id' => 1]);
        AuditLogger::emergencyEvent(
            'Database Down',
            [
                'user_id' => 1,
                'user_email' => "helakuru@gmail.com",
                'country' => "sri lanka",
                'district' => "colombo",
                'city' => "colombo",
            ]
        );

        Log::debug('This is a debug log message', ['user_id' => 1]);

        return response()->json(['message' => 'Logs have been written.']);
    }
}
