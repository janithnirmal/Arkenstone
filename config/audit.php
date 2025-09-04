<?php

return [
    // Enable/disable audit middleware
    'middleware' => [
        'enabled' => env('AUDIT_MIDDLEWARE_ENABLED', true),

        // Exclude certain routes from audit logging
        'excluded_paths' => [
            'health-check',
            'up', // Laravel health check route
            'metrics',
            '_debugbar',
            'telescope*', // If using Laravel Telescope
        ],

        // Rate limiting configurations
        'rate_limits' => [
            [
                'window_minutes' => 1,
                'max_requests' => 60,
            ],
            [
                'window_minutes' => 5,
                'max_requests' => 200,
            ],
            [
                'window_minutes' => 15,
                'max_requests' => 500,
            ],
            [
                'window_minutes' => 60,
                'max_requests' => 1000,
            ],
        ],

        // Threshold configurations for log levels
        'thresholds' => [
            // Response time thresholds (in milliseconds)
            'warning_response_time_ms' => 2000,
            'critical_response_time_ms' => 5000,
            'alert_response_time_ms' => 15000,
            'emergency_response_time_ms' => 30000,

            // Memory usage thresholds (in MB)
            'warning_memory_mb' => 256,
            'critical_memory_mb' => 512,

            // Rate limit multipliers
            'alert_rate_multiplier' => 5,
            'emergency_rate_multiplier' => 10,

            // Error response time thresholds
            'critical_error_response_time_ms' => 10000,
        ],

        // Include/exclude certain data
        'collect_query_parameters' => true,
        'collect_request_body' => false, // Set to true if needed
        'collect_response_body' => false, // Set to true if needed
        'max_log_size_kb' => 100,
    ],

    // Cache settings
    'cache' => [
        'prefix' => 'audit',
        'ttl_minutes' => 60,
    ],
];