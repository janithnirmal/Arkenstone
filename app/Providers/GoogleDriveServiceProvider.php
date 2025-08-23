<?php

namespace App\Providers;

use Google\Client;
use Google\Service\Drive;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use Masbug\Flysystem\GoogleDriveAdapter;

class GoogleDriveServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            Storage::extend('google', function ($app, $config) {
                $client = new Client();
                $client->setClientId($config['clientId']);
                $client->setClientSecret($config['clientSecret']);
                $client->refreshToken($config['refreshToken']);

                // More comprehensive SSL bypass for development
                if (env('APP_ENV') === 'local' || env('SSL_VERIFY_PEER', 'true') === 'false') {
                    $httpClient = new \GuzzleHttp\Client([
                        'verify' => false,
                        'curl' => [
                            CURLOPT_SSL_VERIFYPEER => false,
                            CURLOPT_SSL_VERIFYHOST => false,
                        ],
                    ]);
                    $client->setHttpClient($httpClient);
                }

                $service = new Drive($client); // This now refers to Google\Service\Drive
                $adapter = new GoogleDriveAdapter($service, $config['folderId']);
                $filesystem = new Filesystem($adapter);

                return new FilesystemAdapter($filesystem, $adapter, $config);
            });
        } catch (\Exception $e) {
            Log::error('Error setting up Google Drive filesystem', [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'message' => $e->getMessage()
            ]);

            // Re-throw for debugging
            throw $e;
        }
    }
}
