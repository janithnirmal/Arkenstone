<?php

namespace Database\Seeders;

use App\Enum\Roles;
use App\Enum\Permissions;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // define permissions
        $permissions = [];

        $guestPermissions = array_merge($permissions, []);

        $userPermissions = array_merge($guestPermissions, [Permissions::VIEW_USER, Permissions::PLACE_ORDER]);

        $adminPermissions = array_merge($userPermissions, [Permissions::MANAGE_USER, Permissions::MANAGE_ORDER]);

        $superAdminPermissions = array_merge($adminPermissions, [Permissions::MANAGE_ADMIN]);

        $allPermissions = array_merge($superAdminPermissions, []); // any other permissions

        // Create Permissions
        foreach ($allPermissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Roles
        $roles = [
            Roles::SUPER_ADMIN,
            Roles::ADMIN,
            Roles::USER,
            Roles::GUEST,
        ];

        // Create Roles
        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        // Assign Permissions to Roles
        // Guest
        $guestRole = Role::where('name', $roles[3])->first();
        $guestRole->syncPermissions($guestPermissions);
        Log::info("Guest Permissions: ", [count($guestRole->permissions->toArray())]);

        // User
        $userRole = Role::where('name', $roles[2])->first();
        $userRole->syncPermissions($userPermissions);
        Log::info("User Permissions: ", [count($userRole->permissions->toArray())]);

        //  Admin
        $adminRole = Role::where('name', $roles[1])->first();
        $adminRole->syncPermissions($adminPermissions);
        Log::info("Admin Permissions: ", [count($adminRole->permissions->toArray())]);

        // Super Admin
        $superAdminRole = Role::where('name', $roles[0])->first();
        $superAdminRole->syncPermissions($superAdminPermissions);
        Log::info("Super Admin Permissions: ", [count($superAdminRole->permissions->toArray())]);
    }
}
