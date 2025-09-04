<?php

namespace App\Console\Commands\Audit;

use Illuminate\Console\Command;
use Exception;

class AdvanceAuditMiddlewareTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'audit:check-middleware';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check audit middleware registration and configuration';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🔍 Checking Audit Middleware Registration...');
        $this->newLine();

        // Check if class exists
        $classExists = class_exists('App\Http\Middleware\AdvancedAuditMiddleware');
        $this->line('✅ Middleware class exists: ' . ($classExists ? 'YES' : 'NO'));

        // Check config file exists
        $configExists = config('audit') !== null;
        $this->line('✅ Audit config exists: ' . ($configExists ? 'YES' : 'NO'));

        // Check config enabled
        $configEnabled = config('audit.middleware.enabled', false);
        $this->line('✅ Config enabled: ' . ($configEnabled ? 'YES' : 'NO'));

        // Check aliases (Laravel 11 compatible way)
        try {
            $router = app('router');
            $aliases = $router->getMiddleware();
            $auditAlias = isset($aliases['audit']);
            $this->line('✅ Audit alias registered: ' . ($auditAlias ? 'YES' : 'NO'));

            if ($auditAlias) {
                $this->line('   Alias points to: ' . $aliases['audit']);
            }
        } catch (Exception $e) {
            $this->line('⚠️  Could not check middleware aliases: ' . $e->getMessage());
        }

        // Check if middleware file exists
        $middlewareFile = app_path('Http/Middleware/AdvancedAuditMiddleware.php');
        $middlewareFileExists = file_exists($middlewareFile);
        $this->line('✅ Middleware file exists: ' . ($middlewareFileExists ? 'YES' : 'NO'));

        // Check bootstrap/app.php configuration
        $appFile = base_path('bootstrap/app.php');
        $appContent = file_get_contents($appFile);
        $hasMiddlewareConfig = str_contains($appContent, 'AdvancedAuditMiddleware');
        $this->line('✅ Middleware in bootstrap/app.php: ' . ($hasMiddlewareConfig ? 'YES' : 'NO'));

        // Check if audit directories exist
        $auditDirs = [
            'emergency' => storage_path('logs/audit/emergency'),
            'alert' => storage_path('logs/audit/alert'),
            'critical' => storage_path('logs/audit/critical'),
            'error' => storage_path('logs/audit/error'),
            'warning' => storage_path('logs/audit/warning'),
            'info' => storage_path('logs/audit/info'),
        ];

        $this->newLine();
        $this->line('📁 Audit Log Directories:');
        $allDirsOk = $this->checkAuditDirectories($auditDirs);

        // Check Discord configuration
        $this->checkDiscordConfiguration();

        // Check rate limiting configuration
        $this->checkRateLimitingConfiguration();

        // Test middleware instantiation
        $this->newLine();
        $this->line('🧪 Testing Middleware Instantiation:');
        $middlewareInstantiable = $this->testMiddlewareInstantiation();

        $this->newLine();

        $allGood = $classExists && $configExists && $configEnabled && $middlewareFileExists && $hasMiddlewareConfig && $allDirsOk && $middlewareInstantiable;

        if ($allGood) {
            $this->displaySuccessMessage();
        } else {
            $this->displayErrorMessage($classExists, $configExists, $configEnabled, $middlewareFileExists, $hasMiddlewareConfig, $allDirsOk);
        }

        return 0;
    }

    /**
     * Check audit directories
     */
    private function checkAuditDirectories(array $auditDirs): bool
    {
        $allDirsOk = true;
        foreach ($auditDirs as $level => $path) {
            $exists = is_dir($path);
            $writable = $exists ? is_writable($path) : false;

            if (!$exists) {
                try {
                    mkdir($path, 0755, true);
                    $exists = true;
                    $writable = is_writable($path);
                    $status = 'CREATED';
                } catch (Exception $e) {
                    $status = 'CREATION FAILED';
                    $allDirsOk = false;
                }
            } else {
                $status = $writable ? 'EXISTS & WRITABLE' : 'EXISTS BUT NOT WRITABLE';
                if (!$writable) {
                    $allDirsOk = false;
                }
            }

            $icon = $exists && $writable ? '✅' : '❌';
            $this->line("   {$icon} {$level}: {$status}");
        }
        return $allDirsOk;
    }

    /**
     * Check Discord configuration
     */
    private function checkDiscordConfiguration(): void
    {
        $this->newLine();
        $this->line('🔔 Discord Configuration:');
        $webhookUrl = env('DISCORD_WEBHOOK_URL');
        $emergencyUrl = env('DISCORD_EMERGENCY_WEBHOOK_URL');
        $alertUrl = env('DISCORD_ALERT_WEBHOOK_URL');
        $criticalUrl = env('DISCORD_CRITICAL_WEBHOOK_URL');

        $this->line('   Main webhook URL: ' . ($webhookUrl ? 'CONFIGURED' : 'NOT CONFIGURED'));
        $this->line('   Emergency webhook: ' . ($emergencyUrl ? 'CONFIGURED' : 'FALLBACK TO MAIN'));
        $this->line('   Alert webhook: ' . ($alertUrl ? 'CONFIGURED' : 'FALLBACK TO MAIN'));
        $this->line('   Critical webhook: ' . ($criticalUrl ? 'CONFIGURED' : 'FALLBACK TO MAIN'));

        if ($webhookUrl) {
            $this->line('   Webhook URL: ' . substr($webhookUrl, 0, 50) . '...');
        }
    }

    /**
     * Check rate limiting configuration
     */
    private function checkRateLimitingConfiguration(): void
    {
        $this->newLine();
        $this->line('⏱️  Rate Limiting Configuration:');
        $rateLimits = config('audit.middleware.rate_limits', []);
        if (!empty($rateLimits)) {
            foreach ($rateLimits as $index => $limit) {
                $this->line("   Window {$index}: {$limit['max_requests']} requests per {$limit['window_minutes']} minutes");
            }
        } else {
            $this->line('   ❌ No rate limits configured');
        }
    }

    /**
     * Test middleware instantiation
     */
    private function testMiddlewareInstantiation(): bool
    {
        try {
            $middleware = new \App\Http\Middleware\AdvancedAuditMiddleware();
            $this->line('   ✅ Middleware can be instantiated');
            return true;
        } catch (Exception $e) {
            $this->line('   ❌ Middleware instantiation failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Display success message
     */
    private function displaySuccessMessage(): void
    {
        $this->info('🎉 Audit middleware is properly configured!');
        $this->newLine();
        $this->line('🧪 Test it by running:');
        $this->line('   curl http://localhost/test-audit-middleware');
        $this->line('   php artisan audit:test-logging');
        $this->line('   tail -f storage/logs/audit/info/info-*.log');
    }

    /**
     * Display error message
     */
    private function displayErrorMessage(bool $classExists, bool $configExists, bool $configEnabled, bool $middlewareFileExists, bool $hasMiddlewareConfig, bool $allDirsOk): void
    {
        $this->error('❌ Audit middleware has configuration issues.');
        $this->newLine();
        $this->line('🔧 Next steps:');
        if (!$classExists) {
            $this->line('   - Create the AdvancedAuditMiddleware class');
        }
        if (!$configExists) {
            $this->line('   - Create config/audit.php file');
        }
        if (!$configEnabled) {
            $this->line('   - Enable middleware in config');
        }
        if (!$middlewareFileExists) {
            $this->line('   - Create the middleware file');
        }
        if (!$hasMiddlewareConfig) {
            $this->line('   - Add middleware to bootstrap/app.php');
        }
        if (!$allDirsOk) {
            $this->line('   - Fix directory permissions');
        }
    }
}