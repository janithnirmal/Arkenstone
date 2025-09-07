<?php

use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\SyslogUdpHandler;
use Monolog\Processor\PsrLogMessageProcessor;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that is utilized to write
    | messages to your logs. The value provided here should match one of
    | the channels present in the list of "channels" configured below.
    |
    */

    'default' => env('LOG_CHANNEL', 'stack'),

    /*
    |--------------------------------------------------------------------------
    | Deprecations Log Channel
    |--------------------------------------------------------------------------
    |
    | This option controls the log channel that should be used to log warnings
    | regarding deprecated PHP and library features. This allows you to get
    | your application ready for upcoming major versions of dependencies.
    |
    */

    'deprecations' => [
        'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
        'trace' => env('LOG_DEPRECATIONS_TRACE', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Laravel
    | utilizes the Monolog PHP logging library, which includes a variety
    | of powerful log handlers and formatters that you're free to use.
    |
    | Available drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "monolog", "custom", "stack"
    |
    */

    'channels' => [

        'stack' => [
            'driver' => 'stack',
            'channels' => explode(',', env('LOG_STACK', 'single')),
            'ignore_exceptions' => false,
        ],

        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'days' => env('LOG_DAILY_DAYS', 14),
            'replace_placeholders' => true,
        ],

        'slack' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            'username' => env('LOG_SLACK_USERNAME', 'Laravel Log'),
            'emoji' => env('LOG_SLACK_EMOJI', ':boom:'),
            'level' => env('LOG_LEVEL', 'critical'),
            'replace_placeholders' => true,
        ],

        'papertrail' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => env('LOG_PAPERTRAIL_HANDLER', SyslogUdpHandler::class),
            'handler_with' => [
                'host' => env('PAPERTRAIL_URL'),
                'port' => env('PAPERTRAIL_PORT'),
                'connectionString' => 'tls://' . env('PAPERTRAIL_URL') . ':' . env('PAPERTRAIL_PORT'),
            ],
            'processors' => [PsrLogMessageProcessor::class],
        ],

        'stderr' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => StreamHandler::class,
            'formatter' => env('LOG_STDERR_FORMATTER'),
            'with' => [
                'stream' => 'php://stderr',
            ],
            'processors' => [PsrLogMessageProcessor::class],
        ],

        'syslog' => [
            'driver' => 'syslog',
            'level' => env('LOG_LEVEL', 'debug'),
            'facility' => env('LOG_SYSLOG_FACILITY', LOG_USER),
            'replace_placeholders' => true,
        ],

        'errorlog' => [
            'driver' => 'errorlog',
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'null' => [
            'driver' => 'monolog',
            'handler' => NullHandler::class,
        ],

        'emergency' => [
            'path' => storage_path('logs/laravel.log'),
        ],

        /*
        |---------------------------------------------------------------------------------
        | File-only channels for other log levels
        |---------------------------------------------------------------------------------
        */

        'audit_error' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit/error/error.log'),
            'level' => 'error',
            'days' => 30,
            'replace_placeholders' => true,
        ],

        'audit_warning' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit/warning/warning.log'),
            'level' => 'warning',
            'days' => 30,
            'replace_placeholders' => true,
        ],

        'audit_info' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit/info/info.log'),
            'level' => 'info',
            'days' => 30,
            'replace_placeholders' => true,
        ],

        'audit_notice' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit/notice/notice.log'),
            'level' => 'notice',
            'days' => 30,
            'replace_placeholders' => true,
        ],

        /*
        |---------------------------------------------------------------------------------
        | Custom Audit Logging Channels with Discord notifications
        |---------------------------------------------------------------------------------
        */

        'audit_emergency' => [
            'driver' => 'stack',
            'channels' => ['audit_emergency_file', 'discord_emergency'],
            'ignore_exceptions' => false,
        ],

        'audit_alert' => [
            'driver' => 'stack',
            'channels' => ['audit_alert_file', 'discord_alert'],
            'ignore_exceptions' => false,
        ],

        'audit_critical' => [
            'driver' => 'stack',
            'channels' => ['audit_critical_file', 'discord_critical'],
            'ignore_exceptions' => false,
        ],

        /*
         |---------------------------------------------------------------------------------
         | File channels for high-priority logs
         |---------------------------------------------------------------------------------
        */
        'audit_emergency_file' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit/emergency/emergency.log'),
            'level' => 'emergency',
            'days' => 60,
            'replace_placeholders' => true,
        ],

        'audit_alert_file' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit/alert/alert.log'),
            'level' => 'alert',
            'days' => 30,
            'replace_placeholders' => true,
        ],

        'audit_critical_file' => [
            'driver' => 'daily',
            'path' => storage_path('logs/audit/critical/critical.log'),
            'level' => 'critical',
            'days' => 30,
            'replace_placeholders' => true,
        ],

        /*
         |---------------------------------------------------------------------------------
         | Discord channels for high-priority notifications
         |---------------------------------------------------------------------------------
         */

        'discord_emergency' => [
            'driver' => 'monolog',
            'handler' => App\Logging\DiscordLogHandler::class,
            'level' => 'emergency',
            'with' => [
                'webhook_url' => env('DISCORD_EMERGENCY_WEBHOOK_URL', env('DISCORD_WEBHOOK_URL')),
                'username' => 'Arkenstone Emergency Alert',
                'avatar_url' => 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6a8.png',
                'color' => 15158332, // Red color
            ],
        ],

        'discord_alert' => [
            'driver' => 'monolog',
            'handler' => App\Logging\DiscordLogHandler::class,
            'level' => 'alert',
            'with' => [
                'webhook_url' => env('DISCORD_ALERT_WEBHOOK_URL', env('DISCORD_WEBHOOK_URL')),
                'username' => 'Arkenstone Alert',
                'avatar_url' => 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26a0.png',
                'color' => 16744448, // Orange color
            ],
        ],

        'discord_critical' => [
            'driver' => 'monolog',
            'handler' => App\Logging\DiscordLogHandler::class,
            'level' => 'critical',
            'with' => [
                'webhook_url' => env('DISCORD_CRITICAL_WEBHOOK_URL', env('DISCORD_WEBHOOK_URL')),
                'username' => 'Arkenstone Critical',
                'avatar_url' => 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f534.png',
                'color' => 10038562, // Dark red color
            ],
        ],

        /*
         |---------------------------------------------------------------------------------
         | Stack channel for audit logs (logs to all audit channels)
         |---------------------------------------------------------------------------------
         */
        'audit_stack' => [
            'driver' => 'stack',
            'channels' => ['audit_alert', 'audit_critical', 'audit_error', 'audit_warning', 'audit_info', 'audit_emergency', 'audit_notice'],
            'ignore_exceptions' => false,
        ],

    ],

];
