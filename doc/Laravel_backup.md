# Laravel Backup System with Google Drive Integration

A comprehensive backup system for Laravel applications using Spatie Laravel Backup with Google Drive storage and Discord notifications.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Google Drive Setup](#google-drive-setup)
- [Discord Notifications](#discord-notifications)
- [Server Configuration](#server-configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## ✨ Features

- **Database & File Backups**: Complete application and database backups
- **Google Drive Integration**: Automatic upload to Google Drive
- **Discord Notifications**: Real-time backup status notifications
- **Scheduled Backups**: Automated daily backup and cleanup
- **Flexible Configuration**: Database-only or full project backups
- **SSL Certificate Handling**: Proper SSL configuration for Windows environments

## 🔧 Prerequisites

- **PHP 8.1+** with required extensions:
  - `curl`
  - `zip`
  - `openssl`
- **Laravel 10+**
- **MySQL/PostgreSQL** database
- **Google Cloud Console** account
- **Discord** server (for notifications)
- **Cron job** access (for scheduling)

## 📦 Installation

### 1. Install Required Packages

```bash
# Install Spatie Laravel Backup
composer require spatie/laravel-backup

# Install Google Drive adapter
composer require masbug/flysystem-google-drive-ext

# Install Google API Client
composer require google/apiclient

# Install Discord notifications (uses Slack channel)
composer require laravel/slack-notification-channel
```

### 2. Publish Configuration

```bash
# Publish backup configuration
php artisan vendor:publish --provider="Spatie\Backup\BackupServiceProvider"
```

## ⚙️ Configuration

### Environment Variables

Add to your `.env` file:

```env
# Google Drive Configuration
GOOGLE_DRIVE_CLIENT_ID=your_client_id_here
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret_here
GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here

# Discord Notifications
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/your-webhook-url"
DISCORD_USERNAME="Laravel Backup Bot"
DISCORD_AVATAR_URL="https://laravel.com/img/logomark.min.svg"

# SSL Configuration (for development)
SSL_VERIFY_PEER=false
```

### Backup Schedule Configuration

Your current backup schedule in `routes/console.php`:

```php
<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * ----------------------------------------------------------------------
 * Backup command Configuration
 * ----------------------------------------------------------------------
 * Schedule the backup commands.
 * You don't need to worry about the timing, as it's already set to run daily.
 * You can adjust the timing by changing the `at` method's argument.
 * You can also change the frequency by using different scheduling methods, such as `hourly()`, `weekly()`, etc.
 * You don't need to run manual backups, as the scheduler will take care of it.
 * Currently these commands are scheduled: FULL project backups (database + files)
 * if you want to only database backups, you need to:
 * Step 1: Comment out the base_path() in the backup.php config file
 * Step 2: Replace backup:run with backup:run --only-db command
 */
Schedule::command('backup:clean')->daily()->at('01:00');
Schedule::command('backup:run')->daily()->at('01:30');
//Schedule::command('backup:run --only-db')->daily()->at('01:30');
```

### Backup Type Configuration

#### For Full Project Backup (Current Setup)
- **What it backs up**: Database + all application files
- **Current schedule**: Daily at 01:30 AM
- **Configuration**: Uses current setup with `base_path()` included in backup.php

#### To Switch to Database-Only Backup
1. **Edit `config/backup.php`**:
   ```php
   'source' => [
       'files' => [
           'include' => [
               // Comment out this line for database-only backup:
               // base_path(),
           ],
           'exclude' => [
               base_path('vendor'),
               base_path('node_modules'),
           ],
       ],
       'databases' => [
           env('DB_CONNECTION', 'mysql'),
       ],
   ],
   ```

2. **Update `routes/console.php`**:
   ```php
   Schedule::command('backup:clean')->daily()->at('01:00');
   //Schedule::command('backup:run')->daily()->at('01:30');
   Schedule::command('backup:run --only-db')->daily()->at('01:30');
   ```

#### Hybrid Approach (Recommended)
```php
// Daily database backup
Schedule::command('backup:run --only-db')->daily()->at('01:30');

// Weekly full backup
Schedule::command('backup:run')->weekly()->sundays()->at('02:00');

// Daily cleanup
Schedule::command('backup:clean')->daily()->at('01:00');
```

## 🔐 Google Drive Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Drive API**

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Set Application type to **Web application**
4. Add authorized redirect URIs:
   - `http://localhost`
   - `https://developers.google.com/oauthplayground`

### 3. Get Refresh Token

#### Using OAuth 2.0 Playground

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click settings gear → Check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In Step 1, add scope: `https://www.googleapis.com/auth/drive.file`
5. Click "Authorize APIs"
6. In Step 2, click "Exchange authorization code for tokens"
7. Copy the **refresh_token**

### 4. Create Google Drive Folder

1. Create a folder in Google Drive for backups
2. Get the folder ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
3. Make sure the folder is accessible by your service account

### 5. Create Required Directory on Google Drive

```bash
php artisan tinker
```

```php
// Create the backup directory (using your app name)
Storage::disk('google_drive')->makeDirectory('Arkenstone');

// Or if your backup name is 'Laravel':
// Storage::disk('google_drive')->makeDirectory('Laravel');

// Verify directory was created
Storage::disk('google_drive')->directoryExists('Arkenstone');
```

## 📢 Discord Notifications

### 1. Create Discord Webhook

1. Go to your Discord server
2. Right-click on the channel → **Edit Channel**
3. Go to **Integrations** → **Webhooks**
4. Click **New Webhook**
5. Copy the webhook URL

### 2. Test Discord Integration

```bash
php artisan backup:run
```

Check your Discord channel for backup notifications.

## 🖥️ Server Configuration

### 1. Windows Development Environment

#### SSL Certificate Setup (If needed)

1. Download CA certificates:
   ```bash
   curl -o C:\ssl\cacert.pem https://curl.se/ca/cacert.pem
   ```

2. Update `php.ini`:
   ```ini
   curl.cainfo = "C:\ssl\cacert.pem"
   openssl.cafile = "C:\ssl\cacert.pem"
   ```

3. Restart your web server

#### Cron Job Alternative (Task Scheduler)

1. Open **Task Scheduler**
2. Create Basic Task
3. Set to run **every minute**
4. Action: **Start a program**
5. Program: `php`
6. Arguments: `artisan schedule:run`
7. Start in: `d:\My Programming\Algowrite-Project\Arkenstone`

### 2. Linux Production Environment

#### Cron Job Setup

```bash
# Edit crontab
crontab -e

# Add this line (replace path with your project path)
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
```

#### Permissions

```bash
# Set proper permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chown -R www-data:www-data storage/
chown -R www-data:www-data bootstrap/cache/
```

## 🚀 Usage

### Manual Backup Commands

```bash
# Full backup (database + files) - Current default
php artisan backup:run

# Database only
php artisan backup:run --only-db

# Files only
php artisan backup:run --only-files

# Backup to specific disk
php artisan backup:run --only-to-disk=backups
php artisan backup:run --only-to-disk=google_drive

# With notifications disabled
php artisan backup:run --disable-notifications
```

### Monitoring Commands

```bash
# List all backups
php artisan backup:list

# Monitor backup health
php artisan backup:monitor

# Clean old backups
php artisan backup:clean
```

### Testing Commands

```bash
# Test Google Drive connection
php artisan tinker
```

```php
// Test file upload
Storage::disk('google_drive')->put('test.txt', 'Hello World');

// Check if file exists
Storage::disk('google_drive')->exists('test.txt');

// List files
Storage::disk('google_drive')->files();

// List directories
Storage::disk('google_drive')->directories();
```

## 🔧 Troubleshooting

### Common Issues

#### SSL Certificate Error

**Error**: `cURL error 60: SSL certificate problem`

**Solution**: Download and configure CA certificates (see SSL setup above)

#### Google Drive API Not Enabled

**Error**: `Google Drive API has not been used in project`

**Solution**:
1. Go to Google Cloud Console
2. Enable Google Drive API
3. Wait 2-3 minutes for propagation

#### Directory Not Found

**Error**: `Unable to read file from location: Laravel. File not found`

**Solution**:
```bash
php artisan tinker
```

```php
// Create the directory on Google Drive (use your app name)
Storage::disk('google_drive')->makeDirectory('Arkenstone');
```

#### Permission Denied

**Error**: `403 Forbidden`

**Solution**:
1. Check OAuth scopes include `https://www.googleapis.com/auth/drive.file`
2. Regenerate refresh token with proper scopes
3. Verify folder permissions in Google Drive

### Debug Commands

```bash
# Check scheduled commands
php artisan schedule:list

# Run scheduler manually
php artisan schedule:run

# View logs
tail -f storage/logs/laravel.log
```

## 🔄 Maintenance

### Regular Tasks

1. **Monitor backup sizes**: Check storage usage regularly
2. **Test restore process**: Verify backups can be restored
3. **Update credentials**: Refresh tokens periodically
4. **Check notifications**: Ensure Discord notifications work
5. **Clean old backups**: Verify cleanup schedule works

### Backup Verification

```bash
# Check last backup
php artisan backup:list

# Verify backup health
php artisan backup:monitor

# Test notification system
php artisan backup:run
```

### Current Backup Schedule

- **01:00 AM**: Cleanup old backups (`backup:clean`)
- **01:30 AM**: Create full backup (`backup:run`) - includes database + files
- **Uploads to**: Local storage (`storage/app/backups/`) AND Google Drive
- **Notifications**: Discord webhook notifications for all backup events

### Backup File Locations

- **Local**: `storage/app/backups/Arkenstone/YYYY-MM-DD-HH-MM-SS.zip`
- **Google Drive**: In your configured folder under `Arkenstone/` directory
- **Naming**: `YYYY-MM-DD-HH-MM-SS.zip` (e.g., `2025-08-23-19-45-25.zip`)

## 📈 Advanced Configuration

### Multiple Backup Schedules

```php
// Current setup (full backup daily)
Schedule::command('backup:clean')->daily()->at('01:00');
Schedule::command('backup:run')->daily()->at('01:30');

// Alternative: Database daily + Full weekly
Schedule::command('backup:clean')->daily()->at('01:00');
Schedule::command('backup:run --only-db')->daily()->at('01:30');
Schedule::command('backup:run')->weekly()->sundays()->at('02:00');

// Alternative: Different times for different environments
if (app()->environment('production')) {
    Schedule::command('backup:run --only-db')->daily()->at('02:00');
} else {
    Schedule::command('backup:run')->daily()->at('23:30');
}
```

### Environment-Specific Configuration

```php
// Different backup strategies per environment
if (app()->environment('production')) {
    // Production: Database backup daily, full backup weekly
    Schedule::command('backup:run --only-db')->daily()->at('01:30');
    Schedule::command('backup:run')->weekly()->sundays()->at('02:00');
} else {
    // Development: Full backup daily
    Schedule::command('backup:run')->daily()->at('23:30');
}
```


***

# Understanding SSL Issues: Development vs. Hosting

> Great question! The SSL certificate problem you encountered is primarily a Windows development environment issue and is much less likely to occur in hosting environments. Here's why:

## 🖥️ Development vs. Hosting Environment

### Windows Development Environment (Your Current Setup)
- **Common Issue**: Missing or outdated CA certificate bundle.
- **Cause**: Windows doesn't ship with a CA certificate bundle that PHP/cURL can use by default.
- **Solution**: Manual download of the `cacert.pem` file and manual configuration of the `php.ini` file.

### Hosting Environments
- **Linux Hosting**: Most Linux distributions (which power the vast majority of web servers) have system-level, regularly updated CA certificate bundles that PHP and cURL use automatically.
- **Shared Hosting**: Providers are responsible for maintaining the server environment, which includes keeping SSL certificates and CA bundles up to date.
- **VPS/Dedicated**: Server management practices determine the state of CA bundles, but standard server images (e.g., Ubuntu, CentOS) come with them pre-installed.
- **Cloud Hosting**: (AWS, DigitalOcean, etc.) Base images are generally well-maintained and include proper certificate bundles.

## 🚨 Potential Hosting Environment Issues

Even though it's less likely, you can still encounter issues in certain hosting scenarios:

1.  **Shared Hosting**
    - **Possible Issues**:
        - The `curl` extension might be disabled.
        - Outbound HTTPS requests (like the one to Google's API) might be blocked by a firewall.
        - The server could be running a very old, unsupported version of PHP or an OS with an outdated CA bundle.

2.  **VPS/Dedicated Servers**
    - This is only an issue if the server is poorly configured or has not been updated in a long time. It is your (or your sysadmin's) responsibility to keep the system's packages up to date.

3.  **Docker Environments**
    - If you are using a minimal base image for your Docker container (like Alpine), it might not include a CA certificate bundle by default. You would need to add it in your `Dockerfile` (e.g., `apk add --no-cache ca-certificates`).

## 🔧 Production-Ready SSL Configuration

If you used a temporary, insecure bypass for SSL verification during development, you **must remove it** before deploying to production.

#### Remove Development SSL Bypass

Update your `config/filesystems.php` for production to ensure it does **NOT** contain the `verify => false` option.

```php
// config/filesystems.php

'google' => [
    'driver' => 'google',
    'clientId' => env('GOOGLE_DRIVE_CLIENT_ID'),
    'clientSecret' => env('GOOGLE_DRIVE_CLIENT_SECRET'),
    'refreshToken' => env('GOOGLE_DRIVE_REFRESH_TOKEN'),
    'folderId' => env('GOOGLE_DRIVE_FOLDER_ID'),
    // The 'guzzle' key with 'verify' => false should NOT be present in production.
],
```

## 🧪 Testing SSL in Your Hosting Environment

Once you deploy your application, you should test connectivity to ensure everything is working as expected.

1.  **Test SSL Connectivity**
    Create a simple test route in `routes/web.php` to verify that your server can make outbound HTTPS requests.
    
    ```
    php
    // routes/web.php
    use Illuminate\Support\Facades\Http;

    Route::get('/test-ssl', function () {
        try {
            $response = Http::get('https://www.google.com');
            return 'Successfully made an HTTPS request! Status: ' . $response->status();
        } catch (\Exception $e) {
            return 'Failed to make an HTTPS request. Error: ' . $e->getMessage();
        }
    });
    ```
    Visit `/test-ssl` on your production URL. If it succeeds, your server is configured correctly.

2.  **Test Google Drive Connection**
    You can use `php artisan tinker` on your production server (via SSH) to run the same test you did locally:
    ```bash
    php artisan tinker
    > Storage::disk('google_drive')->put('hosting_test.txt', 'Hello from hosting!');
    ```

## 🚀 Hosting Provider Recommendations

#### ✅ SSL-Friendly Hosting Providers
##These providers typically have well-configured, modern environments where you won't face SSL issues:
- DigitalOcean
- AWS (EC2 / Elastic Beanstalk)
- Linode
- Vultr
- Cloudways (Managed Hosting)

#### ⚠️ Environments with Potential Issues
- **Budget Shared Hosting**: Can sometimes run older, less maintained software stacks.
- **Old Server Versions**: Be cautious if you are using an old OS like CentOS 6 or Ubuntu 14.04.
- **Restrictive Shared Hosting**: Some providers might block outbound connections for security reasons.

## 🔒 Production Deployment Checklist

1.  **Remove SSL bypass** from your production code (`config/filesystems.php`).
2.  **Test SSL connectivity** on the hosting server using a test route.
3.  **Verify Google Drive connection** works by running a test command.
4.  **Monitor the first few backups**:
    - Check for success notifications in Discord.
    - Verify the backup files appear in Google Drive.
    - Monitor your Laravel logs (`storage/logs/laravel.log`) for any errors.

## 📋 Summary

**Short Answer**: SSL issues are unlikely in most modern hosting environments because:
- Linux servers generally have updated CA certificates by default.
- Reputable hosting providers maintain their infrastructure properly.
- Production environments are designed and expected to handle HTTPS traffic securely.

**Action Items**:
- Remove any temporary SSL bypasses from your production code.
- Always test SSL connectivity when you deploy to a new environment.
- Monitor the first few production backups to ensure everything runs smoothly.


## 📞 Support

For issues or questions:

1. Check the [Spatie Laravel Backup documentation](https://spatie.be/docs/laravel-backup)
2. Review Laravel filesystem documentation
3. Check Google Drive API documentation
4. Verify Discord webhook setup

**Important**: Remember to set up the cron job to run `* * * * * php artisan schedule:run` every minute for the automated backups to work!

Your backup system is fully configured and ready to:
- ✅ Create daily backups at 01:30 AM
- ✅ Clean old backups at 01:00 AM
- ✅ Upload to both local storage and Google Drive
- ✅ Send Discord notifications for all backup events


