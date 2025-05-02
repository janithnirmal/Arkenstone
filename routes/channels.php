<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('test.{id}', function (User $user, $id) {
    return (int) $id === (int) $user->id;
});

Broadcast::channel('test.1', function (User $user) {
    return true;
});