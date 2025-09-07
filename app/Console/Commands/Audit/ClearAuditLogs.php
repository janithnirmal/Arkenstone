<?php

namespace App\Console\Commands\Audit;

use Illuminate\Console\Command;
use Exception;

class ClearAuditLogs extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'audit:clear-logs 
                            {--level= : Clear logs for specific level only}
                            {--confirm : Skip confirmation prompt}
                            {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     */
    protected $description = 'Clear audit log files';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $level = $this->option('level');
        $confirm = $this->option('confirm');
        $dryRun = $this->option('dry-run');

        $auditDirs = [
            'emergency',
            'alert', 
            'critical',
            'error',
            'warning',
            'info'
        ];

        // Filter to specific level if provided
        if ($level) {
            if (!in_array($level, $auditDirs)) {
                $this->error("Invalid log level: {$level}");
                $this->line('Valid levels: ' . implode(', ', $auditDirs));
                return 1;
            }
            $auditDirs = [$level];
        }

        // Show what will be cleared
        $this->info($dryRun ? '🔍 Dry run - showing what would be cleared:' : '🧹 Clearing audit logs...');
        $this->newLine();

        $totalFiles = 0;
        $totalSize = 0;
        $filesToDelete = [];

        foreach ($auditDirs as $dir) {
            $path = storage_path("logs/audit/{$dir}");
            if (is_dir($path)) {
                $files = glob($path . '/*.log');
                $dirSize = 0;
                
                foreach ($files as $file) {
                    $dirSize += filesize($file);
                }
                
                $filesToDelete[$dir] = [
                    'files' => $files,
                    'count' => count($files),
                    'size' => $dirSize
                ];
                
                $totalFiles += count($files);
                $totalSize += $dirSize;

                $this->line("📋 {$dir}: " . count($files) . " files (" . round($dirSize / 1024, 2) . " KB)");
            }
        }

        if ($totalFiles === 0) {
            $this->info('📭 No log files found to clear.');
            return 0;
        }

        $this->newLine();
        $this->line("📊 Total: {$totalFiles} files (" . round($totalSize / 1024, 2) . " KB)");
        $this->newLine();

        if ($dryRun) {
            $this->info('🔍 Dry run completed. Use --confirm to actually delete these files.');
            return 0;
        }

        // Confirmation
        if (!$confirm) {
            if (!$this->confirm('Are you sure you want to delete these log files?')) {
                $this->line('Operation cancelled.');
                return 0;
            }
        }

        // Delete files
        $deletedFiles = 0;
        $errors = [];

        foreach ($filesToDelete as $dir => $data) {
            try {
                foreach ($data['files'] as $file) {
                    if (unlink($file)) {
                        $deletedFiles++;
                    } else {
                        $errors[] = "Failed to delete: {$file}";
                    }
                }
                $this->line("   ✅ Cleared {$dir} logs ({$data['count']} files)");
            } catch (Exception $e) {
                $errors[] = "Error clearing {$dir}: " . $e->getMessage();
                $this->line("   ❌ Failed to clear {$dir} logs");
            }
        }

        $this->newLine();
        if (empty($errors)) {
            $this->info("🎉 Successfully cleared {$deletedFiles} audit log files!");
        } else {
            $this->warn("⚠️  Cleared {$deletedFiles} files with " . count($errors) . " errors:");
            foreach ($errors as $error) {
                $this->line("   - {$error}");
            }
        }

        return empty($errors) ? 0 : 1;
    }
}