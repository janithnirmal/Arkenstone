<?php

namespace Database\Seeders;

use App\Enum\AdminRoles;
use App\Enum\CompanyRoles;
use App\Enum\Roles;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Super Admin
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superAdmin@example.com',
            'password' => Hash::make('password'),
        ]);
        $superAdmin->assignRole(Roles::SUPER_ADMIN);

        // Admin
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole(Roles::ADMIN);

        // User
        $user = User::create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
        ]);
        $user->assignRole(Roles::USER);

        // Guest
        $guest = User::create([
            'name' => 'Guest',
            'email' => 'guest@example.com',
            'password' => Hash::make('password'),
        ]);
        $guest->assignRole(Roles::GUEST);
    }
}
