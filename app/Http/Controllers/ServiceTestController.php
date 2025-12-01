<?php

namespace App\Http\Controllers;

use Arkenstone\Core\Helpers\ResponseProtocol;
use Illuminate\Http\Request;

class ServiceTestController extends Controller
{

    protected $mockData = [
        [
            "name" => "Service Test",
            "description" => "A test service for testing purposes.",
        ],
        [
            "name" => "Service Test",
            "description" => "A test service for testing purposes.",
        ],
        [
            "name" => "Service Test",
            "description" => "A test service for testing purposes.",
        ],
    ];

    public function index()
    {
        return ResponseProtocol::success($this->mockData, "Service Test Recieved Successfully");
    }
}