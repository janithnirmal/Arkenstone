<?php

namespace App\Http\Controllers;

use App\Events\FormNodeUpdated;
use App\Events\MessageRecivedEvent;
use App\Events\TestEventTriggered;
use App\Helpers\ResponseProtocol;
use App\Mail\TestMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Reverb;
use Laravel\Reverb\Pulse\Recorders\ReverbMessages;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user2 = $request->user();

        Log::info("User 2: ", [$user2]);

        return ResponseProtocol::success(null, "WOw 🧪", 201);
    }

    public function roleTest()
    {
        $user = Auth::user();


        if ($user->can('manage_user')) {
            return ResponseProtocol::success("Successful : Can manage admin");
        }

        return ResponseProtocol::error("Unauthorized : Cannot manage admin");
    }

    public function testEvent(Request $request)
    {

        $request->validate([
            'message' => 'required|string',
        ]);

        event(new FormNodeUpdated($request->message));
        return ResponseProtocol::success(null, "Event triggered");
    }

    public function mailTest()
    {
        Mail::to('kasunmadushan195@gmail.com')->send(new TestMail());
        return ResponseProtocol::success(null, "Mail sent");
    }
}
