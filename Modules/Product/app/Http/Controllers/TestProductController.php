<?php

namespace Modules\Product\Http\Controllers;

use App\Helpers\ResponseProtocol;
use Illuminate\Routing\Controller;
use Modules\Analytics\Services\AnalyticsService;

class TestProductController extends Controller
{

    public function __construct(protected AnalyticsService $analytics)
    {

    }

    public function index()
    {
        $this->analytics->recordSystemEvent("test_button_clicked");
        return ResponseProtocol::success("test working");
    }

}