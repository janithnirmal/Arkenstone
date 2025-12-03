<?php

namespace App\Http\Controllers;

use Arkenstone\Core\Helpers\ResponseProtocol;
use Illuminate\Http\Request;

class ServiceTestController extends Controller
{

    protected $mockData = [
        [
            "id" => 1,
            "name" => "Service Test",
            "description" => "A test service for testing purposes.",
        ],
        [
            "id" => 2,
            "name" => "Service Test",
            "description" => "A test service for testing purposes.",
        ],
        [
            "id" => 3,
            "name" => "Service Test",
            "description" => "A test service for testing purposes.",
        ],
    ];

    public function index()
    {
        return ResponseProtocol::success($this->mockData, "Service Test Recieved Successfully");
    }
}