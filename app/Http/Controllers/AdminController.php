<?php

namespace App\Http\Controllers;

use App\Enum\Roles;
use App\Helpers\ResponseProtocol;
use App\Mail\AdminInviteEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admins = User::role(['admin', 'super_admin'])->with('roles')->get();
        return ResponseProtocol::success($admins, 'Admins fetched successfully');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|in:' . implode(',', array_map(fn($role) => $role->value, Roles::cases())),
        ]);

        $tempPassword = Str::random(10);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($tempPassword),
        ]);

        $user->assignRole($request->role);

        // send invite email
        Mail::to($request->email)->send(new AdminInviteEmail($request->name, $tempPassword, $request->email));

        return ResponseProtocol::success($user, 'Admin created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $request->id,
            'role' => 'string|in:' . implode(',', array_map(fn($role) => $role->value, Roles::cases())),
        ]);

        $user = User::find($request->id);
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('role')) {
            $user->syncRoles($request->role);
        }
        $user->save();

        return ResponseProtocol::success($user, 'Admin updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->id);
        $user->delete();
        return ResponseProtocol::success($user, 'Admin deleted successfully');
    }
}
