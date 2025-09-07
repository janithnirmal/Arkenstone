<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Services\AuditLogger;

class AdvancedAuditMiddleware
{
    private array $config;
    private float $startTime;

    public function __construct()
    {
        $this->config = config('audit.middleware', []);
        $this->startTime = microtime(true);
    }

    public function handle(Request $request, Closure $next)
    {
        $this->startTime = microtime(true);
        
        // Collect request data
        $auditData = $this->collectRequestData($request);
        
        // Check rate limiting before processing
        $rateLimitResult = $this->checkRateLimit($auditData);
        
        // Process the request
        $response = $next($request);
        
        // Calculate response time
        $responseTime = $this->calculateResponseTime();
        
        // Collect response data
        $auditData = $this->collectResponseData($auditData, $response, $responseTime);
        
        // Log the audit data
        $this->logAuditData($auditData, $rateLimitResult);
        
        return $response;
    }

    /**
     * Collect comprehensive request data
     */
    private function collectRequestData(Request $request): array
    {
        $user = Auth::user();
        
        return [
            // Basic request data
            'timestamp' => Carbon::now()->toISOString(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'path' => $request->path(),
            'route_name' => $request->route()?->getName(),
            'route_parameters' => $request->route()?->parameters(),
            
            // User data
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'user_name' => $user?->name,
            'authenticated' => Auth::check(),
            
            // Request metadata
            'ip_address' => $this->getClientIP($request),
            'user_agent' => $request->userAgent(),
            'referer' => $request->header('referer'),
            'session_id' => session()->getId(),
            
            // Request details
            'query_parameters' => $request->query(),
            'has_file_uploads' => $request->hasFile('*'),
            'content_type' => $request->header('content-type'),
            'accept' => $request->header('accept'),
            'request_size' => strlen($request->getContent()),
            
            // Timing
            'request_start_time' => $this->startTime,
            
            // Security headers
            'x_forwarded_for' => $request->header('x-forwarded-for'),
            'x_real_ip' => $request->header('x-real-ip'),
            'origin' => $request->header('origin'),
            
            // Rate limiting data
            'request_count' => 0,
            'rate_limit_exceeded' => false,
            'rate_limit_window' => null,
        ];
    }

    /**
     * Collect response data
     */
    private function collectResponseData(array $auditData, $response, float $responseTime): array
    {
        return array_merge($auditData, [
            'response_time_ms' => round($responseTime * 1000, 2),
            'response_time_category' => $this->categorizeResponseTime($responseTime),
            'status_code' => $response->getStatusCode(),
            'status_category' => $this->categorizeStatusCode($response->getStatusCode()),
            'response_size' => strlen($response->getContent()),
            'memory_usage_mb' => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
            'memory_usage_category' => $this->categorizeMemoryUsage(memory_get_peak_usage(true)),
        ]);
    }

    /**
     * Advanced rate limiting with multiple windows
     */
    private function checkRateLimit(array $auditData): array
    {
        $limits = $this->config['rate_limits'] ?? [];
        $identifier = $this->getRateLimitIdentifier($auditData);
        $result = [
            'exceeded' => false,
            'windows' => [],
            'max_count' => 0,
            'current_count' => 0,
            'reset_time' => null,
        ];

        foreach ($limits as $limitConfig) {
            $window = $limitConfig['window_minutes'];
            $maxRequests = $limitConfig['max_requests'];
            $cacheKey = "audit_rate_limit:{$identifier}:{$window}";
            
            // Get current count
            $currentCount = Cache::get($cacheKey, 0);
            $newCount = $currentCount + 1;
            
            // Store updated count
            Cache::put($cacheKey, $newCount, now()->addMinutes($window));
            
            $windowResult = [
                'window_minutes' => $window,
                'max_requests' => $maxRequests,
                'current_count' => $newCount,
                'exceeded' => $newCount > $maxRequests,
                'reset_time' => now()->addMinutes($window)->toISOString(),
            ];
            
            $result['windows'][] = $windowResult;
            
            if ($newCount > $maxRequests) {
                $result['exceeded'] = true;
                if ($newCount > $result['max_count']) {
                    $result['max_count'] = $newCount;
                    $result['current_count'] = $newCount;
                    $result['reset_time'] = $windowResult['reset_time'];
                }
            }
        }

        return $result;
    }

    /**
     * Log audit data with appropriate log levels
     */
    private function logAuditData(array $auditData, array $rateLimitResult): void
    {
        // Add rate limit data to audit data
        $auditData['rate_limit'] = $rateLimitResult;
        
        // Determine log level and message
        $logLevel = $this->determineLogLevel($auditData, $rateLimitResult);
        $message = $this->buildLogMessage($auditData, $rateLimitResult);
        
        // Log based on severity
        switch ($logLevel) {
            case 'emergency':
                AuditLogger::emergency($message, $auditData);
                break;
            case 'alert':
                AuditLogger::alert($message, $auditData);
                break;
            case 'critical':
                AuditLogger::critical($message, $auditData);
                break;
            case 'error':
                AuditLogger::error($message, $auditData);
                break;
            case 'warning':
                AuditLogger::warning($message, $auditData);
                break;
            case 'info':
            default:
                AuditLogger::info($message, $auditData);
                break;
        }

        // Log to request-specific channel for analytics
        AuditLogger::info('Request processed', array_merge($auditData, [
            'audit_type' => 'request_response',
            'log_category' => 'performance_monitoring'
        ]));
    }

    /**
     * Determine appropriate log level based on conditions
     */
    private function determineLogLevel(array $auditData, array $rateLimitResult): string
    {
        $thresholds = $this->config['thresholds'] ?? [];
        
        // Emergency conditions
        if ($this->isEmergencyCondition($auditData, $rateLimitResult, $thresholds)) {
            return 'emergency';
        }
        
        // Alert conditions
        if ($this->isAlertCondition($auditData, $rateLimitResult, $thresholds)) {
            return 'alert';
        }
        
        // Critical conditions
        if ($this->isCriticalCondition($auditData, $rateLimitResult, $thresholds)) {
            return 'critical';
        }
        
        // Error conditions
        if ($this->isErrorCondition($auditData)) {
            return 'error';
        }
        
        // Warning conditions
        if ($this->isWarningCondition($auditData, $thresholds)) {
            return 'warning';
        }
        
        return 'info';
    }

    /**
     * Check if emergency conditions are met
     */
    private function isEmergencyCondition(array $auditData, array $rateLimitResult, array $thresholds): bool
    {
        // Extremely high rate limit violations
        if ($rateLimitResult['exceeded'] && $rateLimitResult['current_count'] > ($thresholds['emergency_rate_multiplier'] ?? 10) * 100) {
            return true;
        }
        
        // Extremely slow response times
        if ($auditData['response_time_ms'] > ($thresholds['emergency_response_time_ms'] ?? 30000)) {
            return true;
        }
        
        // Critical system errors
        if (in_array($auditData['status_code'], [500, 502, 503, 504]) && 
            $auditData['response_time_ms'] > ($thresholds['critical_error_response_time_ms'] ?? 10000)) {
            return true;
        }
        
        return false;
    }

    /**
     * Check if alert conditions are met
     */
    private function isAlertCondition(array $auditData, array $rateLimitResult, array $thresholds): bool
    {
        // High rate limit violations
        if ($rateLimitResult['exceeded'] && $rateLimitResult['current_count'] > ($thresholds['alert_rate_multiplier'] ?? 5) * 50) {
            return true;
        }
        
        // Very slow response times
        if ($auditData['response_time_ms'] > ($thresholds['alert_response_time_ms'] ?? 15000)) {
            return true;
        }
        
        // Multiple server errors
        if (in_array($auditData['status_code'], [500, 502, 503])) {
            return true;
        }
        
        return false;
    }

    /**
     * Check if critical conditions are met
     */
    private function isCriticalCondition(array $auditData, array $rateLimitResult, array $thresholds): bool
    {
        // Rate limit exceeded
        if ($rateLimitResult['exceeded']) {
            return true;
        }
        
        // Slow response times
        if ($auditData['response_time_ms'] > ($thresholds['critical_response_time_ms'] ?? 5000)) {
            return true;
        }
        
        // High memory usage
        if ($auditData['memory_usage_mb'] > ($thresholds['critical_memory_mb'] ?? 512)) {
            return true;
        }
        
        // Authentication failures
        if ($auditData['status_code'] === 401 && str_contains($auditData['path'], 'admin')) {
            return true;
        }
        
        return false;
    }

    /**
     * Check if error conditions are met
     */
    private function isErrorCondition(array $auditData): bool
    {
        return $auditData['status_code'] >= 400;
    }

    /**
     * Check if warning conditions are met
     */
    private function isWarningCondition(array $auditData, array $thresholds): bool
    {
        // Moderately slow response times
        if ($auditData['response_time_ms'] > ($thresholds['warning_response_time_ms'] ?? 2000)) {
            return true;
        }
        
        // High memory usage
        if ($auditData['memory_usage_mb'] > ($thresholds['warning_memory_mb'] ?? 256)) {
            return true;
        }
        
        return false;
    }

    /**
     * Build descriptive log message
     */
    private function buildLogMessage(array $auditData, array $rateLimitResult): string
    {
        $components = [];
        
        if ($rateLimitResult['exceeded']) {
            $components[] = "Rate limit exceeded ({$rateLimitResult['current_count']} requests)";
        }
        
        if ($auditData['response_time_ms'] > 1000) {
            $components[] = "Slow response ({$auditData['response_time_ms']}ms)";
        }
        
        if ($auditData['status_code'] >= 400) {
            $components[] = "HTTP {$auditData['status_code']}";
        }
        
        if ($auditData['memory_usage_mb'] > 100) {
            $components[] = "High memory ({$auditData['memory_usage_mb']}MB)";
        }
        
        $baseMessage = "{$auditData['method']} {$auditData['path']}";
        
        if (!empty($components)) {
            return $baseMessage . " - " . implode(", ", $components);
        }
        
        return $baseMessage;
    }

    /**
     * Helper methods
     */
    private function getClientIP(Request $request): string
    {
        $ipHeaders = [
            'HTTP_CF_CONNECTING_IP',     // Cloudflare
            'HTTP_CLIENT_IP',            // Proxy
            'HTTP_X_FORWARDED_FOR',      // Load balancer/proxy
            'HTTP_X_FORWARDED',          // Proxy
            'HTTP_X_CLUSTER_CLIENT_IP',  // Cluster
            'HTTP_FORWARDED_FOR',        // Proxy
            'HTTP_FORWARDED',            // Proxy
            'REMOTE_ADDR'                // Standard
        ];

        foreach ($ipHeaders as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                return trim($ips[0]);
            }
        }

        return $request->ip();
    }

    private function getRateLimitIdentifier(array $auditData): string
    {
        // Use user ID if authenticated, otherwise IP address
        return $auditData['user_id'] ? "user:{$auditData['user_id']}" : "ip:{$auditData['ip_address']}";
    }

    private function calculateResponseTime(): float
    {
        return microtime(true) - $this->startTime;
    }

    private function categorizeResponseTime(float $responseTime): string
    {
        $ms = $responseTime * 1000;
        
        if ($ms < 100) return 'fast';
        if ($ms < 500) return 'normal';
        if ($ms < 1000) return 'slow';
        if ($ms < 5000) return 'very_slow';
        return 'critical';
    }

    private function categorizeStatusCode(int $statusCode): string
    {
        if ($statusCode < 300) return 'success';
        if ($statusCode < 400) return 'redirect';
        if ($statusCode < 500) return 'client_error';
        return 'server_error';
    }

    private function categorizeMemoryUsage(int $bytes): string
    {
        $mb = $bytes / 1024 / 1024;
        
        if ($mb < 64) return 'low';
        if ($mb < 128) return 'normal';
        if ($mb < 256) return 'high';
        if ($mb < 512) return 'very_high';
        return 'critical';
    }
}
