<?php

namespace Modules\Analytics\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Modules\Analytics\Facades\Analytics;
use Modules\Analytics\Helpers\AnalyticsStorage;
use Modules\Core\Facades\ResponseProtocol;

class AnalyticsController extends Controller
{
    protected $storage;

    public function __construct(AnalyticsStorage $storage)
    {
        $this->storage = $storage;
    }

    /**
     * Endpoint for the frontend to send tracking data.
     */
    public function track(Request $request)
    {
        $validated = $request->validate([
            'event_key' => 'required|string|max:100',
            'type' => 'required|string|in:system,user',
            'payload' => 'sometimes|array',
        ]);

        $eventKey = $validated['event_key'];
        $payload = $validated['payload'] ?? [];

        if ($validated['type'] == 'user' && Auth::check()) {
            Log::info("Tracking as a user...");
            Analytics::recordUserEvent(Auth::user()->id, $eventKey, $payload);
        } else {
            Log::info("Tracking as system...");
            Analytics::recordSystemEvent($eventKey, $payload);
        }

        return ResponseProtocol::success(null, 'Event tracked.');
    }

    /**
     * Endpoint for the frontend to query pre-processed analytics data.
     */
    public function query(Request $request)
    {
        $validated = $request->validate([
            'queries' => 'required|array',
            'queries.*.key' => 'required|string',
            'queries.*.type' => 'required|string|in:system,user',
            'user_id' => 'required_if:queries.*.type,user|integer|exists:users,id',
        ]);

        $results = [];
        $userId = $validated['user_id'] ?? null;

        foreach ($validated['queries'] as $query) {
            $path = $query['type'] === 'system'
                ? 'system/processed'
                : "user/{$userId}/processed";

            $data = $this->storage->getProcessedData($path, $query['key']);
            if ($data !== null) {
                $results[$query['key']] = $data;
            }
        }

        return ResponseProtocol::success($results, 'Analytics data fetched.');
    }
}