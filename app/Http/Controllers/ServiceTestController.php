<?php

namespace App\Http\Controllers;

use Arkenstone\Core\Helpers\ResponseProtocol;
use Illuminate\Http\Request;

class ServiceTestController extends Controller
{
    protected $file;
    protected $mockData;

    public function __construct()
    {
        $this->file = base_path('app/Http/Controllers/example-data.json');
        $this->mockData = json_decode(file_get_contents($this->file), true) ?? [];
    }

    protected function save()
    {
        file_put_contents($this->file, json_encode($this->mockData, JSON_PRETTY_PRINT));
    }

    // READ ALL
    public function index()
    {
        return ResponseProtocol::success($this->mockData, "Fetched successfully");
    }

    // READ ONE
    public function show($id)
    {
        if (!isset($this->mockData[$id])) {
            return ResponseProtocol::failed("Not found", 404);
        }
        return ResponseProtocol::success($this->mockData[$id], "Fetched successfully");
    }

    // CREATE
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'required|string|max:255',
        ]);

        $newId = count($this->mockData);
        $validated['id'] = $newId;

        $this->mockData[$newId] = $validated;
        $this->save();

        return ResponseProtocol::success($validated, "Created successfully");
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        if (!isset($this->mockData[$id])) {
            return ResponseProtocol::failed("Not found", 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'required|string|max:255',
        ]);

        $this->mockData[$id] = array_merge($this->mockData[$id], $validated);
        $this->save();

        return ResponseProtocol::success($this->mockData[$id], "Updated successfully");
    }

    // DELETE
    public function destroy($id)
    {
        if (!isset($this->mockData[$id])) {
            return ResponseProtocol::failed("Not found", 404);
        }

        unset($this->mockData[$id]);
        // reindex to avoid gaps
        $this->mockData = array_values($this->mockData);
        $this->save();

        return ResponseProtocol::success([], "Deleted successfully");
    }
}
