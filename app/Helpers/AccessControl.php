<?php

namespace App\Helpers;

use App\Enum\Roles;

class AccessControl
{
    public static function isAdmin($user)
    {
        return $user->hasAnyRole([Roles::ADMIN->value, Roles::SUPER_ADMIN->value]);
    }

    public static function isSuperAdmin($user)
    {
        return $user->hasAnyRole([Roles::SUPER_ADMIN->value]);
    }

    public static function isUser($user)
    {
        return $user->hasAnyRole([Roles::USER->value]);
    }

    public static function isGuest($user)
    {
        return $user->hasAnyRole([Roles::GUEST->value]);
    }
}
