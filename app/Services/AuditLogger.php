<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AuditLogger
{
    /**
     * Log an alert level message
     */
    public static function alert(string $message, array $context = []): void
    {
        $context = self::addMetadata($context, 'alert');
        Log::channel('audit_alert')->alert($message, $context);
    }

    /**
     * Log a critical level message
     */
    public static function critical(string $message, array $context = []): void
    {
        $context = self::addMetadata($context, 'critical');
        Log::channel('audit_critical')->critical($message, $context);
    }

    /**
     * Log an error level message
     */
    public static function error(string $message, array $context = []): void
    {
        $context = self::addMetadata($context, 'error');
        Log::channel('audit_error')->error($message, $context);
    }

    /**
     * Log a warning level message
     */
    public static function warning(string $message, array $context = []): void
    {
        $context = self::addMetadata($context, 'warning');
        Log::channel('audit_warning')->warning($message, $context);
    }

    /**
     * Log an info level message
     */
    public static function info(string $message, array $context = []): void
    {
        $context = self::addMetadata($context, 'info');
        Log::channel('audit_info')->info($message, $context);
    }
    /**
     * Log an emergency level message
     */
    public static function emergency(string $message, array $context = []): void
    {
        $context = self::addMetadata($context, 'emergency');
        Log::channel('audit_emergency')->emergency($message, $context);
    }

    /**
     * Log a notice level message
     */
    public static function notice(string $message, array $context = []): void
    {
        $context = self::addMetadata($context, 'notice');
        Log::channel('audit_notice')->notice($message, $context);
    }

    /**
     * Log to all audit channels (for important events)
     */
    public static function audit(string $level, string $message, array $context = []): void
    {
        $context = self::addMetadata($context, $level);

        switch (strtolower($level)) {
            case 'alert':
                self::alert($message, $context);
                break;
            case 'critical':
                self::critical($message, $context);
                break;
            case 'error':
                self::error($message, $context);
                break;
            case 'warning':
                self::warning($message, $context);
                break;
            case 'emergency':
                self::emergency($message, $context);
                break;
            case 'notice':
                self::notice($message, $context);
                break;
            case 'info':
            default:
                self::info($message, $context);
                break;
        }
    }

    /**
     * Add metadata to log context
     */
    private static function addMetadata(array $context, string $level): array
    {
        return array_merge($context, [
            'timestamp' => Carbon::now(env('APP_TIMEZONE', 'Asia/Colombo'))->format('Y/n/j g:i a'),
            'level' => strtoupper($level),
            'user_id' => $context['user_id'] ?? Auth::id(),
            'user_email' => $context['user_email'] ?? Auth::user()?->email,
            'user_agent' => $context['user_agent'] ?? request()?->userAgent(),
            'ip_address' => $context['ip_address'] ?? request()?->ip(),
            'url' => $context['url'] ?? request()?->fullUrl(),
            'method' => $context['method'] ?? request()?->method(),
            'session_id' => $context['session_id'] ?? session()->getId(),
            'server_name' => $context['server_name'] ?? env('APP_NAME', 'Arkenstone'),
            'environment' => $context['environment'] ?? env('APP_ENV', 'production'),
        ]);
    }

    /**
     * Log user actions for audit trail
     */
    public static function userAction(string $action, array $details = []): void
    {
        $message = "User Action: {$action}";
        $context = array_merge($details, [
            'action' => $action,
            'audit_type' => 'user_action',
        ]);

        self::info($message, $context);
    }

    /**
     * Log system events
     */
    public static function systemEvent(string $event, array $details = []): void
    {
        $message = "System Event: {$event}";
        $context = array_merge($details, [
            'event' => $event,
            'audit_type' => 'system_event',
        ]);

        self::info($message, $context);
    }

    /**
     * Log security events
     */
    public static function securityEvent(string $event, array $details = []): void
    {
        $message = "Security Event: {$event}";
        $context = array_merge($details, [
            'event' => $event,
            'audit_type' => 'security_event',
        ]);

        self::warning($message, $context);
    }

    /**
     * Log backup events
     */
    public static function backupEvent(string $event, array $details = []): void
    {
        $message = "Backup Event: {$event}";
        $context = array_merge($details, [
            'event' => $event,
            'audit_type' => 'backup_event',
        ]);

        self::info($message, $context);
    }


    /**
     * Log emergency system events (highest priority) - SENDS DISCORD NOTIFICATION
     */
    public static function emergencyEvent(string $event, array $details = []): void
    {
        $message = "🚨 EMERGENCY: {$event}";
        $context = array_merge($details, [
            'event' => $event,
            'audit_type' => 'emergency_event',
            'priority' => 'HIGHEST',
        ]);

        self::emergency($message, $context);
    }

        /**
     * Log critical security events - SENDS DISCORD NOTIFICATION
     */
    public static function criticalSecurityEvent(string $event, array $details = []): void
    {
        $message = "🔴 CRITICAL SECURITY: {$event}";
        $context = array_merge($details, [
            'event' => $event,
            'audit_type' => 'critical_security_event',
            'priority' => 'CRITICAL',
        ]);

        self::critical($message, $context);
    }

    /**
     * Log system failure alerts - SENDS DISCORD NOTIFICATION
     */
    public static function systemFailureAlert(string $component, array $details = []): void
    {
        $message = "⚠️ SYSTEM FAILURE: {$component}";
        $context = array_merge($details, [
            'component' => $component,
            'audit_type' => 'system_failure',
            'priority' => 'ALERT',
        ]);

        self::alert($message, $context);
    }
}