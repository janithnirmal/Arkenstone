<?php

namespace App\Logging;

use Monolog\Logger;

class CreateDiscordLogger
{
    public function __invoke(array $config)
    {
        $logger = new Logger('discord');
        $logger->pushHandler(new DiscordLogHandler($config));

        return $logger;
    }
}