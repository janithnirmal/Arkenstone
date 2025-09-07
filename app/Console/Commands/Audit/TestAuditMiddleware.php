<?php

namespace App\Console\Commands\Audit;

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use App\Http\Middleware\AdvancedAuditMiddleware;
use Exception;

class TestAuditMiddleware extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'audit:test-middleware 
                            {--slow : Test slow response scenario}
                            {--error : Test error response scenario}
                            {--rate-limit : Test rate limiting scenario}';

    /**
     * The console command description.
     */
    protected $description = 'Test audit middleware functionality with various scenarios';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🧪 Testing Audit Middleware Functionality...');
        $this->newLine();

        $slow = $this->option('slow');
        $error = $this->option('error');
        $rateLimit = $this->option('rate-limit');

        if ($slow) {
            return $this->testSlowResponse();
        }

        if ($error) {
            return $this->testErrorResponse();
        }

        if ($rateLimit) {
            return $this->testRateLimiting();
        }

        // Run basic test
        return $this->testBasicFunctionality();
    }

    private function testBasicFunctionality(): int
    {
        try {
            $this->line('Testing basic middleware functionality...');

            // Create a mock request
            $request = Request::create('/test-middleware', 'GET', [], [], [], [
                'HTTP_USER_AGENT' => 'Audit-Test-Agent/1.0',
                'REMOTE_ADDR' => '127.0.0.1'
            ]);

            $middleware = new AdvancedAuditMiddleware();

            $response = $middleware->handle($request, function ($req) {
                return response()->json([
                    'test' => 'success',
                    'timestamp' => now()->toISOString()
                ]);
            });

            $this->info('✅ Middleware handles requests successfully!');
            $this->line('Response status: ' . $response->getStatusCode());
            $this->line('Check audit logs for the recorded request');

            return 0;

        } catch (Exception $e) {
            $this->error('❌ Basic middleware test failed: ' . $e->getMessage());
            return 1;
        }
    }

    private function testSlowResponse(): int
    {
        try {
            $this->line('Testing slow response scenario (should trigger warning/critical logs)...');

            $request = Request::create('/test-slow', 'GET');
            $middleware = new AdvancedAuditMiddleware();

            $response = $middleware->handle($request, function ($req) {
                // Simulate slow processing
                sleep(3);
                return response()->json(['test' => 'slow_response']);
            });

            $this->info('✅ Slow response test completed!');
            $this->line('Response status: ' . $response->getStatusCode());
            $this->line('Check warning/critical logs for slow response alerts');

            return 0;

        } catch (Exception $e) {
            $this->error('❌ Slow response test failed: ' . $e->getMessage());
            return 1;
        }
    }

    private function testErrorResponse(): int
    {
        try {
            $this->line('Testing error response scenario...');

            $request = Request::create('/test-error', 'GET');
            $middleware = new AdvancedAuditMiddleware();

            $response = $middleware->handle($request, function ($req) {
                return response()->json(['error' => 'Test error'], 500);
            });

            $this->info('✅ Error response test completed!');
            $this->line('Response status: ' . $response->getStatusCode());
            $this->line('Check error logs for error response recording');

            return 0;

        } catch (Exception $e) {
            $this->error('❌ Error response test failed: ' . $e->getMessage());
            return 1;
        }
    }

    private function testRateLimiting(): int
    {
        try {
            $this->line('Testing rate limiting scenario (simulating multiple requests)...');

            $request = Request::create('/test-rate-limit', 'GET');
            $middleware = new AdvancedAuditMiddleware();

            // Simulate multiple requests
            for ($i = 1; $i <= 5; $i++) {
                $response = $middleware->handle($request, function ($req) use ($i) {
                    return response()->json(['request' => $i]);
                });

                $this->line("Request {$i}: Status " . $response->getStatusCode());
            }

            $this->info('✅ Rate limiting test completed!');
            $this->line('Check critical logs if rate limits were exceeded');
            $this->line('Note: Actual rate limiting depends on configured thresholds');

            return 0;

        } catch (Exception $e) {
            $this->error('❌ Rate limiting test failed: ' . $e->getMessage());
            return 1;
        }
    }
}