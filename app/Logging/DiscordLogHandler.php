<?php

namespace App\Logging;

use Monolog\Logger;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class DiscordLogHandler extends AbstractProcessingHandler
{
    private string $webhookUrl;
    private string $username;
    private string $avatarUrl;
    private int $color;

    public function __construct(array $config = [])
    {
        $level = $this->parseLevel($config['level'] ?? 'debug');
        parent::__construct($level);

        $this->webhookUrl = $config['webhook_url'] ?? env('DISCORD_WEBHOOK_URL');
        $this->username = $config['username'] ?? 'Arkenstone Logger';
        $this->avatarUrl = $config['avatar_url'] ?? '';
        $this->color = $config['color'] ?? 2303786; // Default blue
    }

    protected function write(LogRecord|array $record): void
    {
        // Handle both old and new Monolog formats
        $recordArray = is_array($record) ? $record : $record->toArray();
        $this->sendToDiscord($recordArray);
    }

    private function sendToDiscord(array $record): void
    {
        try {
            if (empty($this->webhookUrl)) {
                error_log("Discord webhook URL not configured");
                return;
            }

            $embed = $this->createEmbed($record);
            
            $payload = [
                'username' => $this->username,
                'avatar_url' => $this->avatarUrl,
                'embeds' => [$embed]
            ];

            $response = Http::timeout(10)->post($this->webhookUrl, $payload);
            
            if (!$response->successful()) {
                error_log("Discord webhook failed with status: " . $response->status());
            }
        } catch (\Exception $e) {
            // Log the error but don't throw to prevent infinite loops
            error_log("Discord webhook exception: " . $e->getMessage());
        }
    }

    private function createEmbed(array $record): array
    {
        $context = $record['context'] ?? [];
        $level = $record['level_name'] ?? 'UNKNOWN';
        $message = $record['message'] ?? 'No message';
        
        // Handle datetime - it might be a Carbon instance or string
        $datetime = $record['datetime'] ?? now();
        if (is_string($datetime)) {
            $timestamp = $datetime;
        } else {
            $timestamp = Carbon::parse($datetime)->toISOString();
        }

        // Create the embed
        $embed = [
            'title' => $this->getEmoji($level) . " {$level} Log",
            'description' => $message,
            'color' => $this->color,
            'timestamp' => $timestamp,
            'footer' => [
                'text' => 'Arkenstone Audit Logger',
                'icon_url' => 'https://laravel.com/img/logomark.min.svg'
            ]
        ];

        // Add fields from context
        $fields = [];

        if (isset($context['user_email']) && !empty($context['user_email'])) {
            $fields[] = [
                'name' => '👤 User Email',
                'value' => $context['user_email'],
                'inline' => true
            ];
        }

        if (isset($context['ip_address']) && !empty($context['ip_address'])) {
            $fields[] = [
                'name' => '🌐 IP Address',
                'value' => $context['ip_address'],
                'inline' => true
            ];
        }

        if (isset($context['url']) && !empty($context['url'])) {
            $fields[] = [
                'name' => '🔗 URL',
                'value' => strlen($context['url']) > 100 ? substr($context['url'], 0, 100) . '...' : $context['url'],
                'inline' => false
            ];
        }

        if (isset($context['audit_type'])) {
            $fields[] = [
                'name' => '📋 Type',
                'value' => $context['audit_type'],
                'inline' => true
            ];
        }

        if (isset($context['environment'])) {
            $fields[] = [
                'name' => '🌍 Environment',
                'value' => strtoupper($context['environment']),
                'inline' => true
            ];
        }

        if(isset($context['user_id'])){
            $fields[] = [
                'name' => '🆔 User ID',
                'value' => $context['user_id'],
                'inline' => true
            ];
        }

        // Add custom fields based on context
        $priorityFields = ['error', 'component', 'affected_users', 'severity', 'downtime_start', 'event'];
        foreach ($priorityFields as $field) {
            if (isset($context[$field]) && !empty($context[$field])) {
                $value = is_array($context[$field]) ? implode(', ', $context[$field]) : $context[$field];
                $fields[] = [
                    'name' => '🔸 ' . ucfirst(str_replace('_', ' ', $field)),
                    'value' => strlen($value) > 100 ? substr($value, 0, 100) . '...' : $value,
                    'inline' => true
                ];
            }
        }

        if (!empty($fields)) {
            $embed['fields'] = array_slice($fields, 0, 10); // Discord limit
        }

        return $embed;
    }

    private function getEmoji(string $level): string
    {
        return match (strtolower($level)) {
            'emergency' => '🚨',
            'alert' => '⚠️',
            'critical' => '🔴',
            'error' => '❌',
            'warning' => '⚠️',
            'notice' => '📢',
            'info' => 'ℹ️',
            'debug' => '🐛',
            default => '📝',
        };
    }

    private function parseLevel($level): int
    {
        return match (strtolower($level)) {
            'emergency' => Logger::EMERGENCY,
            'alert' => Logger::ALERT,
            'critical' => Logger::CRITICAL,
            'error' => Logger::ERROR,
            'warning' => Logger::WARNING,
            'notice' => Logger::NOTICE,
            'info' => Logger::INFO,
            'debug' => Logger::DEBUG,
            default => Logger::DEBUG,
        };
    }
}