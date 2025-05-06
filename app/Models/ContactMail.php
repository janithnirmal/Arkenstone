<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMail extends Model
{
    /** @use HasFactory<\Database\Factories\ContactMailFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'mobile',
        'message',
        'get_updates',
    ];  
}
