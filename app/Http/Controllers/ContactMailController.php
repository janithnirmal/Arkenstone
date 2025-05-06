<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseProtocol;
use App\Mail\ContactMail as MailContactMail;
use App\Models\ContactMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactMailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|string|max:15',
            'message' => 'required|string|max:512',
            'get_updates' => 'nullable|boolean',
        ]);

        $contactMail = ContactMail::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'message' => $request->message,
            'get_updates' => $request->get_updates,
        ]);

        Log::info("The contact mail is: " . $contactMail);

        try {
            Mail::to(config('mail.from.address'))->send(new MailContactMail($contactMail));
        } catch (\Exception $e) {
            return ResponseProtocol::error($e->getMessage());
        }

        return ResponseProtocol::success(null, 'Contact mail sent successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactMail $contactMail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactMail $contactMail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactMail $contactMail)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactMail $contactMail)
    {
        //
    }
}
