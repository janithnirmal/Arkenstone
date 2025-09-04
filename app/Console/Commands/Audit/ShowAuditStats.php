<?php

namespace App\Console\Commands\Audit;

use Illuminate\Console\Command;
use Carbon\Carbon;

class ShowAuditStats extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'audit:show-stats 
                            {--level= : Show stats for specific level only}
                            {--detailed : Show detailed file information}
                            {--json : Output in JSON format}';

    /**
     * The console command description.
     */
    protected $description = 'Show audit log statistics and information';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $level = $this->option('level');
        $detailed = $this->option('detailed');
        $json = $this->option('json');

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

        $stats = $this->collectStats($auditDirs, $detailed);

        if ($json) {
            $this->line(json_encode($stats, JSON_PRETTY_PRINT));
            return 0;
        }

        $this->displayStats($stats, $detailed);
        return 0;
    }

    private function collectStats(array $auditDirs, bool $detailed): array
    {
        $stats = [
            'summary' => [
                'total_files' => 0,
                'total_size' => 0,
                'total_lines' => 0,
                'oldest_file' => null,
                'newest_file' => null,
            ],
            'levels' => []
        ];

        foreach ($auditDirs as $dir) {
            $path = storage_path("logs/audit/{$dir}");
            $levelStats = [
                'files' => 0,
                'size' => 0,
                'lines' => 0,
                'oldest_file' => null,
                'newest_file' => null,
                'file_details' => []
            ];

            if (is_dir($path)) {
                $files = glob($path . '/*.log');
                $levelStats['files'] = count($files);

                foreach ($files as $file) {
                    $fileSize = filesize($file);
                    $fileLines = $this->countLines($file);
                    $fileTime = filemtime($file);

                    $levelStats['size'] += $fileSize;
                    $levelStats['lines'] += $fileLines;

                    // Track oldest and newest files
                    if ($levelStats['oldest_file'] === null || $fileTime < filemtime($levelStats['oldest_file'])) {
                        $levelStats['oldest_file'] = $file;
                    }
                    if ($levelStats['newest_file'] === null || $fileTime > filemtime($levelStats['newest_file'])) {
                        $levelStats['newest_file'] = $file;
                    }

                    if ($detailed) {
                        $levelStats['file_details'][] = [
                            'name' => basename($file),
                            'size' => $fileSize,
                            'lines' => $fileLines,
                            'modified' => Carbon::createFromTimestamp($fileTime)->format('Y-m-d H:i:s'),
                        ];
                    }
                }

                // Update summary
                $stats['summary']['total_files'] += $levelStats['files'];
                $stats['summary']['total_size'] += $levelStats['size'];
                $stats['summary']['total_lines'] += $levelStats['lines'];

                if (
                    $levelStats['oldest_file'] &&
                    ($stats['summary']['oldest_file'] === null ||
                        filemtime($levelStats['oldest_file']) < filemtime($stats['summary']['oldest_file']))
                ) {
                    $stats['summary']['oldest_file'] = $levelStats['oldest_file'];
                }

                if (
                    $levelStats['newest_file'] &&
                    ($stats['summary']['newest_file'] === null ||
                        filemtime($levelStats['newest_file']) > filemtime($stats['summary']['newest_file']))
                ) {
                    $stats['summary']['newest_file'] = $levelStats['newest_file'];
                }
            }

            $stats['levels'][$dir] = $levelStats;
        }

        return $stats;
    }

    private function countLines(string $file): int
    {
        try {
            return count(file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES));
        } catch (\Exception $e) {
            return 0;
        }
    }

    private function displayStats(array $stats, bool $detailed): void
    {
        $this->info('📊 Audit Log Statistics');
        $this->newLine();

        // Summary
        $summary = $stats['summary'];
        $this->line('📈 Summary:');
        $this->line('   Total Files: ' . number_format($summary['total_files']));
        $this->line('   Total Size: ' . $this->formatBytes($summary['total_size']));
        $this->line('   Total Lines: ' . number_format($summary['total_lines']));

        if ($summary['oldest_file']) {
            $oldestTime = Carbon::createFromTimestamp(filemtime($summary['oldest_file']));
            $this->line('   Oldest Log: ' . $oldestTime->format('Y-m-d H:i:s') . ' (' . $oldestTime->diffForHumans() . ')');
        }

        if ($summary['newest_file']) {
            $newestTime = Carbon::createFromTimestamp(filemtime($summary['newest_file']));
            $this->line('   Newest Log: ' . $newestTime->format('Y-m-d H:i:s') . ' (' . $newestTime->diffForHumans() . ')');
        }

        $this->newLine();

        // Level details
        foreach ($stats['levels'] as $level => $levelStats) {
            $icon = $this->getLevelIcon($level);
            $this->line("{$icon} {$level}:");
            $this->line("   Files: " . number_format($levelStats['files']));
            $this->line("   Size: " . $this->formatBytes($levelStats['size']));
            $this->line("   Lines: " . number_format($levelStats['lines']));

            if ($detailed && !empty($levelStats['file_details'])) {
                $this->line("   File Details:");
                foreach ($levelStats['file_details'] as $fileDetail) {
                    $this->line("     - {$fileDetail['name']}: {$this->formatBytes($fileDetail['size'])}, {$fileDetail['lines']} lines, {$fileDetail['modified']}");
                }
            }

            $this->newLine();
        }
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return round($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return round($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' B';
        }
    }

    private function getLevelIcon(string $level): string
    {
        return match ($level) {
            'emergency' => '🚨',
            'alert' => '⚠️',
            'critical' => '🔴',
            'error' => '❌',
            'warning' => '⚠️',
            'info' => 'ℹ️',
            default => '📋'
        };
    }
}