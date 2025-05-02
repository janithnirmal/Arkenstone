<?php

namespace App\Enum;
enum Roles: string
{
    case ADMIN = "admin";
    case SUPER_ADMIN = "super_admin";
    case USER = "user";
    case GUEST = "guest";
}