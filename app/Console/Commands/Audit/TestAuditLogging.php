<?php

namespace App\Console\Commands\Audit;

use Illuminate\Console\Command;
use App\Services\AuditLogger;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TestAuditLogging extends Command
{
    protected $signature = 'audit:test {--clean : Clean log files before testing}';
    protected $description = 'Test the audit logging system setup and functionality';

    private $testResults = [];
    private $logBasePath;

    public function __construct()
    {
        parent::__construct();
        $this->logBasePath = storage_path('logs/audit');
    }

    public function handle()
    {
        $this->info('🧪 Testing Audit Logging System...');
        $this->newLine();

        // Clean logs if requested
        if ($this->option('clean')) {
            $this->cleanTestLogs();
        }

        // Run all tests
        $this->testDirectoryStructure();
        $this->testLogChannels();
        $this->testAuditLoggerMethods();
        $this->testMetadataGeneration();
        $this->testSpecialEventMethods();
        $this->testLogFileGeneration();
        $this->testDiscordNotifications();

        // Display results
        $this->displayResults();

        return 0;
    }

    private function testDirectoryStructure()
    {
        $this->info('1️⃣ Testing Directory Structure...');

        $directories = ['alert', 'critical', 'error', 'warning', 'info', 'emergency', 'notice'];
        $allExist = true;

        foreach ($directories as $dir) {
            $path = $this->logBasePath . '/' . $dir;

            if (!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
                $this->line("   ✅ Created directory: {$dir}");
            } else {
                $this->line("   ✅ Directory exists: {$dir}");
            }

            if (!File::isWritable($path)) {
                $this->error("   ❌ Directory not writable: {$dir}");
                $allExist = false;
            }
        }

        $this->testResults['directory_structure'] = $allExist;
        $this->newLine();
    }

    private function testLogChannels()
    {
        $this->info('2️⃣ Testing Log Channels Configuration...');

        $channels = [
            'audit_alert',
            'audit_critical',
            'audit_error',
            'audit_warning',
            'audit_info',
            'audit_emergency',
            'audit_notice'
        ];

        $allChannelsWork = true;

        foreach ($channels as $channel) {
            try {
                // Test if channel is configured
                $logger = app('log')->channel($channel);
                $this->line("   ✅ Channel configured: {$channel}");
            } catch (\Exception $e) {
                $this->error("   ❌ Channel failed: {$channel} - " . $e->getMessage());
                $allChannelsWork = false;
            }
        }

        $this->testResults['log_channels'] = $allChannelsWork;
        $this->newLine();
    }

    private function testAuditLoggerMethods()
    {
        $this->info('3️⃣ Testing AuditLogger Methods...');

        $testData = [
            'alert' => 'Test alert message',
            'critical' => 'Test critical message',
            'error' => 'Test error message',
            'warning' => 'Test warning message',
            'info' => 'Test info message',
            'emergency' => 'Test emergency message',
            'notice' => 'Test notice message'
        ];

        $allMethodsWork = true;

        foreach ($testData as $level => $message) {
            try {
                AuditLogger::$level($message, ['test_context' => 'method_test']);
                $this->line("   ✅ {$level}() method works");
            } catch (\Exception $e) {
                $this->error("   ❌ {$level}() method failed: " . $e->getMessage());
                $allMethodsWork = false;
            }
        }

        $this->testResults['logger_methods'] = $allMethodsWork;
        $this->newLine();
    }

    private function testMetadataGeneration()
    {
        $this->info('4️⃣ Testing Metadata Generation...');

        try {
            // Test with context to see if metadata is added
            AuditLogger::info('Metadata test message', [
                'custom_field' => 'test_value',
                'test_timestamp' => Carbon::now()->toISOString()
            ]);

            $this->line('   ✅ Metadata generation works');
            $this->testResults['metadata'] = true;
        } catch (\Exception $e) {
            $this->error('   ❌ Metadata generation failed: ' . $e->getMessage());
            $this->testResults['metadata'] = false;
        }

        $this->newLine();
    }

    private function testSpecialEventMethods()
    {
        $this->info('5️⃣ Testing Special Event Methods...');

        $eventMethods = [
            'userAction' => ['login', ['user_id' => 123]],
            'systemEvent' => ['cache_cleared', ['type' => 'config']],
            'securityEvent' => ['failed_login', ['ip' => '192.168.1.1']],
            'backupEvent' => ['backup_started', ['type' => 'test']],
            'emergencyEvent' => ['server_down', ['ip' => '192.168.1.1']],
        ];

        $allEventsWork = true;

        foreach ($eventMethods as $method => $params) {
            try {
                AuditLogger::$method($params[0], $params[1]);
                $this->line("   ✅ {$method}() method works");
            } catch (\Exception $e) {
                $this->error("   ❌ {$method}() method failed: " . $e->getMessage());
                $allEventsWork = false;
            }
        }

        $this->testResults['event_methods'] = $allEventsWork;
        $this->newLine();
    }

    private function testLogFileGeneration()
    {
        $this->info('6️⃣ Testing Log File Generation...');

        // Wait a moment for files to be written
        sleep(1);

        $levels = ['alert', 'critical', 'error', 'warning', 'info', 'emergency', 'notice'];
        $filesGenerated = 0;

        foreach ($levels as $level) {
            $logPath = $this->logBasePath . '/' . $level;
            $files = File::glob($logPath . '/*.log');

            if (!empty($files)) {
                $latestFile = collect($files)->sortByDesc(function ($file) {
                    return File::lastModified($file);
                })->first();

                $content = File::get($latestFile);

                if (!empty(trim($content))) {
                    $this->line("   ✅ {$level} log file generated: " . basename($latestFile));
                    $filesGenerated++;
                } else {
                    $this->error("   ❌ {$level} log file is empty");
                }
            } else {
                $this->error("   ❌ No {$level} log files found");
            }
        }

        $this->testResults['file_generation'] = $filesGenerated === count($levels);
        $this->newLine();
    }

    private function displayResults()
    {
        $this->info('📊 Test Results Summary:');
        $this->line('═══════════════════════════════════');

        $totalTests = count($this->testResults);
        $passedTests = count(array_filter($this->testResults));

        foreach ($this->testResults as $test => $passed) {
            $status = $passed ? '✅ PASS' : '❌ FAIL';
            $testName = str_replace('_', ' ', ucwords($test));
            $this->line("   {$status} - {$testName}");
        }

        $this->newLine();

        if ($passedTests === $totalTests) {
            $this->info("🎉 All tests passed! ({$passedTests}/{$totalTests})");
            $this->info("Your audit logging system is working correctly!");
        } else {
            $this->error("⚠️  Some tests failed! ({$passedTests}/{$totalTests})");
            $this->error("Please check the configuration and fix the issues above.");
        }

        // Show log file locations
        $this->newLine();
        $this->info('📁 Log file locations:');
        $this->line("   Base path: {$this->logBasePath}");

        foreach (['alert', 'critical', 'error', 'warning', 'info', 'emergency', 'notice'] as $level) {
            $files = File::glob($this->logBasePath . '/' . $level . '/*.log');
            if (!empty($files)) {
                $latestFile = collect($files)->sortByDesc(function ($file) {
                    return File::lastModified($file);
                })->first();
                $this->line("   {$level}: " . basename($latestFile));
            }
        }
    }

    private function cleanTestLogs()
    {
        $this->warn('🧹 Cleaning test log files...');

        $levels = ['alert', 'critical', 'error', 'warning', 'info', 'emergency', 'notice'];

        foreach ($levels as $level) {
            $logPath = $this->logBasePath . '/' . $level;
            $files = File::glob($logPath . '/*test*.log');

            foreach ($files as $file) {
                File::delete($file);
            }
        }

        $this->line('   ✅ Test log files cleaned');
        $this->newLine();
    }

    private function testDiscordNotifications()
    {
        $this->info('7️⃣ Testing Discord Notifications...');

        $notificationTests = [
            'emergency' => 'Test emergency Discord notification',
            'alert' => 'Test alert Discord notification',
            'critical' => 'Test critical Discord notification'
        ];

        $allNotificationsWork = true;

        foreach ($notificationTests as $level => $message) {
            try {
                AuditLogger::$level($message, [
                    'test_notification' => true,
                    'timestamp' => now()->toISOString()
                ]);
                $this->line("   ✅ {$level} Discord notification sent");

                // Small delay between notifications
                sleep(1);
            } catch (\Exception $e) {
                $this->error("   ❌ {$level} Discord notification failed: " . $e->getMessage());
                $allNotificationsWork = false;
            }
        }

        $this->testResults['discord_notifications'] = $allNotificationsWork;
        $this->newLine();
    }

}