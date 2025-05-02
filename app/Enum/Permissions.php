<?php

namespace App\Enum;

enum Permissions: string
{
    case VIEW_USER = "view_user";
    case MANAGE_USER = "manage_user";
    case VIEW_ADMIN = "view_admin";
    case MANAGE_ADMIN = "manage_admin";
    case PLACE_ORDER = "place_order";
    case VIEW_ORDER = "view_order";
    case MANAGE_ORDER = "manage_order";
}