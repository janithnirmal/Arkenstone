# 🔥 Arkenstone Advanced Audit Logging System

## 📋 Table of Contents

1. Overview
2. Architecture
3. Installation & Setup
4. Configuration
5. Core Components
6. Usage Guide
7. Command Reference
8. Log Levels & Triggers
9. Discord Integration
10. Rate Limiting
11. Performance Monitoring
12. Troubleshooting
13. Best Practices
14. API Reference

---

## Overview

The Arkenstone Advanced Audit Logging System is a comprehensive Laravel-based logging solution that provides real-time monitoring, rate limiting, performance tracking, and Discord notifications. It captures detailed request/response data, monitors system performance, and automatically escalates critical issues.

### ✨ Key Features

- **📊 Comprehensive Request Tracking**: Captures every HTTP request with detailed metadata
- **⚡ Real-time Performance Monitoring**: Tracks response times, memory usage, and system health
- **🚨 Intelligent Alert System**: Automatic escalation based on severity levels
- **🔔 Discord Integration**: Real-time notifications for critical events
- **⏱️ Advanced Rate Limiting**: Multi-window rate limiting with automatic violation detection
- **📁 Organized Log Storage**: Structured file organization by severity level
- **🛠️ Rich Command Suite**: Comprehensive CLI tools for management
- **🔍 Detailed Analytics**: Statistics and insights about system usage

---

## Architecture

### 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST FLOW                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                 AdvancedAuditMiddleware                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ Data Collection │ │ Rate Limiting   │ │ Performance     │   │
│  │ • User Info     │ │ • Multi-window  │ │ • Response Time │   │
│  │ • IP Address    │ │ • Violation     │ │ • Memory Usage  │   │
│  │ • User Agent    │ │   Detection     │ │ • Request Size  │   │
│  │ • Request Data  │ │ • Cache-based   │ │ • Status Codes  │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AuditLogger Service                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ Log Level       │ │ Context         │ │ Channel         │   │
│  │ Determination   │ │ Enhancement     │ │ Routing         │   │
│  │ • Threshold     │ │ • User Context  │ │ • File Logs     │   │
│  │   Analysis      │ │ • System Info   │ │ • Discord       │   │
│  │ • Condition     │ │ • Performance   │ │ • Database      │   │
│  │   Evaluation    │ │   Metrics       │ │   (Optional)    │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ File Logs   │ │ Discord     │ │ Database    │ │ External    │
│ • Organized │ │ • Webhooks  │ │ • Optional  │ │ • APIs      │
│   by Level  │ │ • Rich      │ │ • Analytics │ │ • Metrics   │
│ • Rotation  │ │   Embeds    │ │ • Queries   │ │ • Alerts    │
│ • Search    │ │ • Channels  │ │ • Reports   │ │             │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### 🔧 Component Overview

| Component | Purpose | Location |
|-----------|---------|----------|
| **AdvancedAuditMiddleware** | Request interception & data collection | Middleware |
| **AuditLogger Service** | Log processing & routing | Services |
| **DiscordLogHandler** | Discord notification delivery | Logging |
| **Console Commands** | Management & diagnostics | Commands |
| **Configuration** | System settings & thresholds | audit.php |

---

## Installation & Setup

### 📦 Step 1: Create Required Files

```bash
# Create middleware
php artisan make:middleware AdvancedAuditMiddleware

# Create service directory
mkdir -p app/Services

# Create logging directory  
mkdir -p app/Logging

# Create console commands directory
mkdir -p app/Console/Commands

# Create audit log directories
mkdir -p storage/logs/audit/{emergency,alert,critical,error,warning,info}
```

### 📝 Step 2: Environment Configuration

Add to your .env file:

```env
# Audit System Configuration
AUDIT_MIDDLEWARE_ENABLED=true

# Discord Webhook URLs
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_URL"
DISCORD_EMERGENCY_WEBHOOK_URL="${DISCORD_WEBHOOK_URL}"
DISCORD_ALERT_WEBHOOK_URL="${DISCORD_WEBHOOK_URL}"
DISCORD_CRITICAL_WEBHOOK_URL="${DISCORD_WEBHOOK_URL}"

# Performance Thresholds (optional - defaults will be used if not set)
AUDIT_WARNING_RESPONSE_TIME=2000
AUDIT_CRITICAL_RESPONSE_TIME=5000
AUDIT_ALERT_RESPONSE_TIME=15000
AUDIT_EMERGENCY_RESPONSE_TIME=30000

# Rate Limiting (optional)
AUDIT_RATE_LIMIT_ENABLED=true
```

### ⚙️ Step 3: Register Middleware

Update app.php:

```php
<?php

use App\Http\Middleware\AdvancedAuditMiddleware;
// ... other imports

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        // Register audit middleware globally
        $middleware->append([
            AdvancedAuditMiddleware::class,
        ]);
        
        // Register alias for selective use
        $middleware->alias([
            'audit' => AdvancedAuditMiddleware::class,
        ]);
        
        // ... rest of your middleware configuration
    })
    // ... rest of configuration
```

### 🔧 Step 4: Install Dependencies

```bash
# Install HTTP client for Discord integration
composer require guzzlehttp/guzzle

# Clear caches
php artisan config:clear
php artisan cache:clear
```

---

## Configuration

### 📋 Audit Configuration File

Create audit.php:

```php
<?php

return [
    'middleware' => [
        'enabled' => env('AUDIT_MIDDLEWARE_ENABLED', true),
        
        // Rate limiting windows
        'rate_limits' => [
            ['window_minutes' => 1, 'max_requests' => 60],
            ['window_minutes' => 5, 'max_requests' => 200],
            ['window_minutes' => 15, 'max_requests' => 500],
            ['window_minutes' => 60, 'max_requests' => 1000],
        ],

        // Performance thresholds
        'thresholds' => [
            'warning_response_time_ms' => env('AUDIT_WARNING_RESPONSE_TIME', 2000),
            'critical_response_time_ms' => env('AUDIT_CRITICAL_RESPONSE_TIME', 5000),
            'alert_response_time_ms' => env('AUDIT_ALERT_RESPONSE_TIME', 15000),
            'emergency_response_time_ms' => env('AUDIT_EMERGENCY_RESPONSE_TIME', 30000),
            'warning_memory_mb' => 256,
            'critical_memory_mb' => 512,
            'alert_rate_multiplier' => 5,
            'emergency_rate_multiplier' => 10,
            'critical_error_response_time_ms' => 10000,
        ],

        // Data collection settings
        'collect_query_parameters' => true,
        'collect_request_body' => false,
        'collect_response_body' => false,
        'max_log_size_kb' => 100,

        // Excluded paths
        'excluded_paths' => [
            'health-check',
            'up',
            'metrics',
            '_debugbar',
            'telescope*',
        ],
    ],

    'cache' => [
        'prefix' => 'audit',
        'ttl_minutes' => 60,
    ],
];
```

### 🔔 Logging Configuration

Update logging.php to include audit channels:

```php
'channels' => [
    // ... existing channels

    'audit_emergency' => [
        'driver' => 'single',
        'path' => storage_path('logs/audit/emergency/emergency-' . date('Y-m-d') . '.log'),
        'level' => 'emergency',
        'permission' => 0664,
    ],

    'audit_alert' => [
        'driver' => 'single',
        'path' => storage_path('logs/audit/alert/alert-' . date('Y-m-d') . '.log'),
        'level' => 'alert',
        'permission' => 0664,
    ],

    'audit_critical' => [
        'driver' => 'single',
        'path' => storage_path('logs/audit/critical/critical-' . date('Y-m-d') . '.log'),
        'level' => 'critical',
        'permission' => 0664,
    ],

    'audit_error' => [
        'driver' => 'single',
        'path' => storage_path('logs/audit/error/error-' . date('Y-m-d') . '.log'),
        'level' => 'error',
        'permission' => 0664,
    ],

    'audit_warning' => [
        'driver' => 'single',
        'path' => storage_path('logs/audit/warning/warning-' . date('Y-m-d') . '.log'),
        'level' => 'warning',
        'permission' => 0664,
    ],

    'audit_info' => [
        'driver' => 'single',
        'path' => storage_path('logs/audit/info/info-' . date('Y-m-d') . '.log'),
        'level' => 'info',
        'permission' => 0664,
    ],

    // Discord channels
    'discord_emergency' => [
        'driver' => 'monolog',
        'handler' => App\Logging\DiscordLogHandler::class,
        'level' => 'emergency',
        'with' => [
            'webhook_url' => env('DISCORD_EMERGENCY_WEBHOOK_URL', env('DISCORD_WEBHOOK_URL')),
            'username' => 'Arkenstone Emergency Alert',
            'avatar_url' => 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6a8.png',
            'color' => 15158332, // Red
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
            'color' => 16744448, // Orange
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
            'color' => 10038562, // Dark red
        ],
    ],
],
```

---

## Core Components

### 🛡️ AdvancedAuditMiddleware

**Purpose**: Intercepts all HTTP requests and collects comprehensive audit data.

**Key Features**:
- Request/response timing
- User identification & authentication status
- IP address & geolocation data
- Rate limiting with multiple time windows
- Performance metrics collection
- Automatic log level determination

**Data Collected**:
```php
[
    'timestamp' => '2024-01-15T10:30:45Z',
    'method' => 'GET',
    'url' => 'https://example.com/api/users',
    'user_id' => 123,
    'user_email' => 'user@example.com',
    'ip_address' => '192.168.1.100',
    'user_agent' => 'Mozilla/5.0...',
    'response_time_ms' => 1250.25,
    'status_code' => 200,
    'memory_usage_mb' => 45.6,
    'rate_limit' => [
        'exceeded' => false,
        'current_count' => 15,
        'windows' => [...]
    ]
]
```

### 📊 AuditLogger Service

**Purpose**: Central logging service that processes and routes audit data.

**Features**:
- Intelligent log level determination
- Context enhancement
- Multi-channel routing (files, Discord, database)
- Performance optimization

**Usage**:
```php
use App\Services\AuditLogger;

// Manual logging
AuditLogger::info('User action completed', [
    'user_id' => 123,
    'action' => 'profile_update'
]);

AuditLogger::critical('Database connection failed', [
    'database' => 'users',
    'error' => $exception->getMessage()
]);
```

### 🔔 DiscordLogHandler

**Purpose**: Sends formatted notifications to Discord channels.

**Features**:
- Rich embed formatting
- Color-coded severity levels
- Automatic field organization
- Rate limiting protection

**Discord Message Format**:
```
🚨 EMERGENCY Alert
Database connection critical failure

👤 User: admin@example.com
🌐 IP Address: 192.168.1.100
📋 Type: database_error
🌍 Environment: PRODUCTION
⏱️ Response Time: 15,250ms
```

---

## Usage Guide

### 🚀 Basic Usage

The system works automatically once installed. No additional code is required for basic audit logging.

### 📝 Manual Logging

```php
use App\Services\AuditLogger;

// Simple logging
AuditLogger::info('Operation completed successfully');

// With context
AuditLogger::warning('High memory usage detected', [
    'memory_mb' => 512,
    'threshold' => 256,
    'component' => 'image_processor'
]);

// Emergency notification (triggers Discord)
AuditLogger::emergency('Service outage detected', [
    'service' => 'payment_gateway',
    'last_response' => '2024-01-15 10:25:00',
    'error_count' => 15
]);
```

### 🎯 Selective Middleware Application

```php
// Apply to specific routes
Route::middleware(['audit'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
    Route::post('/api/sensitive', [ApiController::class, 'sensitive']);
});

// Apply to individual routes
Route::get('/critical-endpoint', [Controller::class, 'method'])
    ->middleware('audit');
```

### 🔍 Log Analysis

```php
// Search logs by date range
$logs = collect(file(storage_path('logs/audit/info/info-2024-01-15.log')))
    ->map(fn($line) => json_decode($line, true))
    ->filter(fn($log) => $log['user_id'] === 123);

// Analyze performance trends
$slowRequests = collect($logs)
    ->filter(fn($log) => $log['response_time_ms'] > 2000)
    ->groupBy('path')
    ->map(fn($group) => [
        'count' => $group->count(),
        'avg_time' => $group->avg('response_time_ms')
    ]);
```

---

## Command Reference

### 🔍 System Diagnostics

```bash
# Check middleware configuration
php artisan audit:check-middleware

# Test logging system
php artisan audit:test-logging

# Test specific log level
php artisan audit:test-logging --level=critical

# Test middleware functionality
php artisan audit:test-middleware

# Test slow response scenario
php artisan audit:test-middleware --slow

# Test error response scenario  
php artisan audit:test-middleware --error

# Test rate limiting
php artisan audit:test-middleware --rate-limit
```

### 📊 Statistics & Analytics

```bash
# Show comprehensive statistics
php artisan audit:show-stats

# Show detailed file information
php artisan audit:show-stats --detailed

# Show stats for specific level
php artisan audit:show-stats --level=error

# Export stats as JSON
php artisan audit:show-stats --json > audit-stats.json
```

### 🧹 Log Management

```bash
# Preview what would be deleted (dry run)
php artisan audit:clear-logs --dry-run

# Clear all logs with confirmation
php artisan audit:clear-logs

# Clear logs without confirmation
php artisan audit:clear-logs --confirm

# Clear specific log level
php artisan audit:clear-logs --level=info --confirm

# Clear critical logs only
php artisan audit:clear-logs --level=critical --dry-run
```

### 📋 Command Options Summary

| Command | Options | Description |
|---------|---------|-------------|
| `audit:check-middleware` | None | Comprehensive system check |
| `audit:test-logging` | `--level=LEVEL` | Test specific or all log levels |
| `audit:test-middleware` | `--slow`, `--error`, `--rate-limit` | Test middleware scenarios |
| `audit:show-stats` | `--level=LEVEL`, `--detailed`, `--json` | Display statistics |
| `audit:clear-logs` | `--level=LEVEL`, `--confirm`, `--dry-run` | Manage log files |

---

## Log Levels & Triggers

### 🚨 Emergency Level

**Triggers**:
- Rate limit violations > 1000 requests/window
- Response times > 30 seconds
- Critical system errors with high response times
- Service outages

**Discord**: ✅ Immediate notification  
**File**: emergency

### ⚠️ Alert Level

**Triggers**:
- Rate limit violations > 250 requests/window
- Response times > 15 seconds
- Multiple server errors (500, 502, 503)
- Security breaches

**Discord**: ✅ Immediate notification  
**File**: alert

### 🔴 Critical Level

**Triggers**:
- Any rate limit violation
- Response times > 5 seconds
- Memory usage > 512MB
- Authentication failures on admin routes
- Database connection failures

**Discord**: ✅ Immediate notification  
**File**: critical

### ❌ Error Level

**Triggers**:
- HTTP status codes 400-599
- Application exceptions
- Failed operations

**Discord**: ❌ No notification  
**File**: error

### ⚠️ Warning Level

**Triggers**:
- Response times > 2 seconds
- Memory usage > 256MB
- Performance degradation

**Discord**: ❌ No notification  
**File**: warning

### ℹ️ Info Level

**Triggers**:
- All normal requests
- Successful operations
- General application events

**Discord**: ❌ No notification  
**File**: info

---

## Discord Integration

### 🔧 Setup Discord Webhook

1. **Create Discord Webhook**:
   - Go to your Discord server
   - Navigate to channel settings
   - Go to Integrations → Webhooks
   - Click "New Webhook"
   - Copy the webhook URL

2. **Configure Environment**:
   ```env
   DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"
   ```

3. **Test Configuration**:
   ```bash
   php artisan audit:test-logging --level=emergency
   ```

### 🎨 Message Formatting

Discord notifications include:

**Header**: Severity level with emoji and color coding  
**Description**: Primary log message  
**Fields**: Contextual information (user, IP, timing, etc.)  
**Footer**: Timestamp and system identifier  

**Color Coding**:
- 🚨 Emergency: Red (#E74C3C)
- ⚠️ Alert: Orange (#FF8C00)  
- 🔴 Critical: Dark Red (#992D22)

### 📊 Discord Channel Organization

**Recommended Setup**:
```
#audit-emergency    # Emergency & Alert notifications
#audit-critical     # Critical issues  
#audit-monitoring   # General monitoring (optional)
```

**Webhook Configuration**:
```env
DISCORD_EMERGENCY_WEBHOOK_URL="https://discord.com/api/webhooks/emergency-channel"
DISCORD_ALERT_WEBHOOK_URL="https://discord.com/api/webhooks/emergency-channel" 
DISCORD_CRITICAL_WEBHOOK_URL="https://discord.com/api/webhooks/critical-channel"
```

---

## Rate Limiting

### ⏱️ Multi-Window Rate Limiting

The system implements sophisticated rate limiting with multiple time windows:

| Window | Default Limit | Purpose |
|--------|---------------|---------|
| 1 minute | 60 requests | Burst protection |
| 5 minutes | 200 requests | Short-term abuse |
| 15 minutes | 500 requests | Medium-term monitoring |
| 60 minutes | 1000 requests | Long-term usage |

### 🎯 Rate Limit Identification

Rate limits are applied per:
- **Authenticated users**: `user:{user_id}`
- **Anonymous users**: `ip:{ip_address}`

### 🚨 Violation Handling

**When limits are exceeded**:
1. **Critical Log**: Immediate logging to critical level
2. **Context Recording**: Full request context captured
3. **Discord Notification**: If threshold multipliers exceeded
4. **Cache Tracking**: Violation counts stored in cache

**Threshold Multipliers**:
- **Alert**: 5x normal limit (triggers Discord alert)
- **Emergency**: 10x normal limit (triggers Discord emergency)

### ⚙️ Configuration

```php
// config/audit.php
'rate_limits' => [
    ['window_minutes' => 1, 'max_requests' => 60],
    ['window_minutes' => 5, 'max_requests' => 200],
    ['window_minutes' => 15, 'max_requests' => 500],
    ['window_minutes' => 60, 'max_requests' => 1000],
],

'thresholds' => [
    'alert_rate_multiplier' => 5,        // 5x = Alert
    'emergency_rate_multiplier' => 10,   // 10x = Emergency
],
```

---

## Performance Monitoring

### 📊 Metrics Collected

| Metric | Description | Thresholds |
|--------|-------------|------------|
| **Response Time** | Request processing duration | Warning: 2s, Critical: 5s, Alert: 15s, Emergency: 30s |
| **Memory Usage** | Peak memory consumption | Warning: 256MB, Critical: 512MB |
| **Request Size** | Incoming request payload size | Logged for analysis |
| **Response Size** | Outgoing response size | Logged for analysis |
| **Status Codes** | HTTP response codes | Error: 4xx/5xx |

### 🎯 Performance Categories

**Response Time Categories**:
- `fast`: < 100ms
- `normal`: 100ms - 500ms  
- `slow`: 500ms - 1s
- `very_slow`: 1s - 5s
- `critical`: > 5s

**Memory Usage Categories**:
- `low`: < 64MB
- `normal`: 64MB - 128MB
- `high`: 128MB - 256MB  
- `very_high`: 256MB - 512MB
- `critical`: > 512MB

### 📈 Performance Analysis

```bash
# View performance statistics
php artisan audit:show-stats --detailed

# Analyze slow requests
grep "very_slow\|critical" storage/logs/audit/warning/*.log

# Memory usage analysis  
grep "memory_usage_category.*high" storage/logs/audit/info/*.log

# Response time trends
grep "response_time_ms" storage/logs/audit/info/*.log | \
  jq '.response_time_ms' | \
  sort -n | \
  tail -20
```

---

## Troubleshooting

### 🔧 Common Issues

#### Middleware Not Working

**Symptoms**: No logs being generated  
**Diagnosis**:
```bash
php artisan audit:check-middleware
```

**Solutions**:
1. **Check Registration**: Ensure middleware is in app.php
2. **Clear Cache**: `php artisan config:clear`
3. **Verify Class**: Ensure `AdvancedAuditMiddleware` exists
4. **Check Permissions**: Verify log directory permissions

#### Discord Notifications Not Sending

**Symptoms**: Logs generated but no Discord messages  
**Diagnosis**:
```bash
php artisan audit:test-logging --level=emergency
```

**Solutions**:
1. **Check Webhook URL**: Verify `DISCORD_WEBHOOK_URL` in .env
2. **Test Webhook**: Send test message directly
3. **Check Network**: Ensure outbound HTTPS allowed
4. **Review Logs**: Check laravel.log for errors

#### Log Files Not Created

**Symptoms**: Commands work but files missing  
**Solutions**:
1. **Create Directories**: 
   ```bash
   mkdir -p storage/logs/audit/{emergency,alert,critical,error,warning,info}
   ```
2. **Fix Permissions**:
   ```bash
   chmod -R 755 storage/logs/audit/
   chown -R www-data:www-data storage/logs/audit/
   ```

#### High Memory Usage

**Symptoms**: Critical memory alerts  
**Solutions**:
1. **Optimize Data Collection**: Disable request/response body collection
2. **Implement Log Rotation**: Use Laravel's log rotation
3. **Database Logging**: Move to database for large datasets

### 🔍 Debugging Tools

#### Enable Debug Mode

```php
// Temporarily in AdvancedAuditMiddleware
private function debugLog($message, $data = []) {
    error_log("[AUDIT DEBUG] {$message}: " . json_encode($data));
}
```

#### Test Webhook Directly

```bash
curl -X POST "YOUR_DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message from Arkenstone"}'
```

#### Monitor System Resources

```bash
# Watch log creation
watch -n 1 'ls -la storage/logs/audit/*/ | tail -10'

# Monitor memory usage
watch -n 1 'ps aux | grep php | head -5'

# Check disk space
df -h storage/logs/
```

### 📋 Health Check Checklist

- [ ] Middleware registered in app.php
- [ ] Configuration file audit.php exists
- [ ] Log directories exist and writable
- [ ] Discord webhook URL configured
- [ ] Cache system working (Redis/file)
- [ ] No errors in laravel.log
- [ ] Commands execute successfully
- [ ] Test notifications sent to Discord

---

## Best Practices

### 🛡️ Security Considerations

1. **Sensitive Data Protection**:
   ```php
   // Exclude sensitive parameters
   'excluded_parameters' => [
       'password',
       'api_key', 
       'token',
       'credit_card'
   ],
   ```

2. **Log Access Control**:
   ```bash
   # Restrict log file access
   chmod 600 storage/logs/audit/*/*.log
   
   # Use dedicated log user
   chown audit-user:audit-group storage/logs/audit/
   ```

3. **Discord Webhook Security**:
   - Use environment variables for webhook URLs
   - Rotate webhook URLs periodically
   - Restrict webhook permissions in Discord

### 📊 Performance Optimization

1. **Selective Data Collection**:
   ```php
   // config/audit.php
   'collect_request_body' => false,     // Disable for high traffic
   'collect_response_body' => false,    // Disable for large responses
   'max_log_size_kb' => 50,            // Limit log entry size
   ```

2. **Cache Optimization**:
   ```php
   // Use Redis for better performance
   'cache_driver' => 'redis',
   
   // Optimize TTL for rate limiting
   'rate_limit_ttl' => 3600, // 1 hour
   ```

3. **Log Rotation**:
   ```php
   // config/logging.php
   'daily' => [
       'driver' => 'daily',
       'days' => 14,
       'path' => storage_path('logs/audit/info/info.log'),
   ],
   ```

### 🔄 Maintenance Procedures

1. **Daily Tasks**:
   ```bash
   # Monitor log sizes
   php artisan audit:show-stats
   
   # Check for errors
   grep "ERROR\|CRITICAL" storage/logs/laravel.log
   ```

2. **Weekly Tasks**:
   ```bash
   # Archive old logs
   tar -czf "audit-logs-$(date +%Y%m%d).tar.gz" storage/logs/audit/
   
   # Clean old logs
   php artisan audit:clear-logs --level=info --confirm
   ```

3. **Monthly Tasks**:
   ```bash
   # System health check
   php artisan audit:check-middleware
   
   # Performance analysis
   php artisan audit:show-stats --detailed --json > monthly-report.json
   ```

### 📈 Monitoring & Alerting

1. **Set Up External Monitoring**:
   - Monitor Discord webhook delivery
   - Track log file sizes
   - Monitor application performance

2. **Create Custom Dashboards**:
   ```php
   // Example: Create performance dashboard
   Route::get('/admin/audit-dashboard', function() {
       $stats = app(AuditStatsService::class)->generateDashboard();
       return view('admin.audit-dashboard', compact('stats'));
   });
   ```

3. **Automated Reports**:
   ```php
   // Schedule daily reports
   $schedule->call(function () {
       $report = app(AuditReportService::class)->generateDailyReport();
       Mail::to('admin@example.com')->send(new DailyAuditReport($report));
   })->daily();
   ```

---

## API Reference

### 🔧 AuditLogger Methods

```php
use App\Services\AuditLogger;

// Log levels (in order of severity)
AuditLogger::emergency(string $message, array $context = []);
AuditLogger::alert(string $message, array $context = []);
AuditLogger::critical(string $message, array $context = []);
AuditLogger::error(string $message, array $context = []);
AuditLogger::warning(string $message, array $context = []);
AuditLogger::notice(string $message, array $context = []);
AuditLogger::info(string $message, array $context = []);
AuditLogger::debug(string $message, array $context = []);
```

### 📊 Context Structure

```php
$context = [
    // User information
    'user_id' => 123,
    'user_email' => 'user@example.com',
    'user_name' => 'John Doe',
    
    // Request information  
    'ip_address' => '192.168.1.100',
    'user_agent' => 'Mozilla/5.0...',
    'method' => 'POST',
    'url' => 'https://example.com/api/endpoint',
    
    // Performance metrics
    'response_time_ms' => 1250.5,
    'memory_usage_mb' => 45.6,
    'status_code' => 200,
    
    // Business context
    'audit_type' => 'user_action',
    'component' => 'user_management',
    'action' => 'profile_update',
    'resource_id' => 456,
    
    // Custom fields
    'environment' => 'production',
    'version' => '1.0.0',
    'correlation_id' => 'abc-123-def',
];
```

### 🎯 Configuration Options

```php
// config/audit.php
return [
    'middleware' => [
        'enabled' => true,
        
        // Rate limiting
        'rate_limits' => [
            ['window_minutes' => 1, 'max_requests' => 60],
            // ... more windows
        ],
        
        // Performance thresholds (milliseconds)
        'thresholds' => [
            'warning_response_time_ms' => 2000,
            'critical_response_time_ms' => 5000,
            'alert_response_time_ms' => 15000,
            'emergency_response_time_ms' => 30000,
            'warning_memory_mb' => 256,
            'critical_memory_mb' => 512,
            'alert_rate_multiplier' => 5,
            'emergency_rate_multiplier' => 10,
        ],
        
        // Data collection
        'collect_query_parameters' => true,
        'collect_request_body' => false,
        'collect_response_body' => false,
        'max_log_size_kb' => 100,
        
        // Exclusions
        'excluded_paths' => [
            'health-check',
            'up',
            'metrics',
            '_debugbar',
        ],
        
        'excluded_parameters' => [
            'password',
            'api_key',
            'token',
        ],
    ],
    
    'discord' => [
        'enabled' => true,
        'timeout_seconds' => 10,
        'retry_attempts' => 3,
    ],
    
    'cache' => [
        'prefix' => 'audit',
        'ttl_minutes' => 60,
    ],
];
```

### 🔍 Advanced Usage Examples

#### Custom Audit Events

```php
// Track business-specific events
AuditLogger::info('Order processed', [
    'audit_type' => 'business_event',
    'event_name' => 'order_processed',
    'order_id' => $order->id,
    'customer_id' => $order->customer_id,
    'amount' => $order->total,
    'payment_method' => $order->payment_method,
    'processing_time_ms' => $processingTime,
]);

// Track security events
AuditLogger::alert('Suspicious login attempt', [
    'audit_type' => 'security_event',
    'event_name' => 'suspicious_login',
    'ip_address' => $request->ip(),
    'user_agent' => $request->userAgent(),
    'failed_attempts' => $failedAttempts,
    'location' => $geoLocation,
]);

// Track system events
AuditLogger::critical('Database connection lost', [
    'audit_type' => 'system_event',
    'event_name' => 'database_connection_lost',
    'database' => 'primary',
    'last_successful_query' => $lastQuery,
    'error_message' => $exception->getMessage(),
    'recovery_action' => 'failover_initiated',
]);
```

#### Performance Monitoring

```php
// Track API endpoint performance
$startTime = microtime(true);
$result = $this->processApiRequest($request);
$duration = (microtime(true) - $startTime) * 1000;

AuditLogger::info('API request processed', [
    'audit_type' => 'performance_monitoring',
    'endpoint' => $request->path(),
    'method' => $request->method(),
    'response_time_ms' => round($duration, 2),
    'memory_usage_mb' => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
    'cache_hits' => $cacheStats['hits'],
    'cache_misses' => $cacheStats['misses'],
    'database_queries' => DB::getQueryLog()->count(),
]);
```

#### User Activity Tracking

```php
// Track user actions with full context
AuditLogger::info('User profile updated', [
    'audit_type' => 'user_activity',
    'action' => 'profile_update',
    'user_id' => auth()->id(),
    'user_email' => auth()->user()->email,
    'fields_changed' => $changedFields,
    'old_values' => $oldValues,
    'new_values' => $newValues,
    'ip_address' => request()->ip(),
    'user_agent' => request()->userAgent(),
    'session_id' => session()->getId(),
]);
```

---

## 📚 Conclusion

The Arkenstone Advanced Audit Logging System provides enterprise-grade logging capabilities with comprehensive monitoring, intelligent alerting, and detailed analytics. This system enables proactive monitoring of your Laravel application's health, performance, and security.

### 🎯 Key Benefits

- **🔍 Complete Visibility**: Every request is tracked with detailed context
- **⚡ Real-time Alerts**: Immediate notifications for critical issues
- **📊 Performance Insights**: Detailed metrics and analytics
- **🛡️ Security Monitoring**: Advanced threat detection and response
- **🔧 Easy Management**: Comprehensive CLI tools for administration

### 📞 Support & Maintenance

For support, issues, or feature requests:
1. Check the troubleshooting section
2. Run diagnostic commands
3. Review log files for errors
4. Test individual components

### 🔄 Updates & Roadmap

**Planned Features**:
- Database logging support
- Real-time dashboard
- Advanced analytics
- Machine learning anomaly detection
- Export capabilities
- API endpoints for external integrations

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Compatibility**: Laravel 11+  
**License**: MIT  

---

*This documentation is maintained as part of the Arkenstone project. For the latest updates and additional resources, please refer to the project repository.*