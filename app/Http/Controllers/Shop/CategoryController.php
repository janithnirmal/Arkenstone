<?php

namespace App\Http\Controllers\Shop;

use App\Helpers\ResponseProtocol;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends \App\Http\Controllers\Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $DEFAULT_FETCH_MESSAGE = "Category fetched successfully";

        $request->validate([
            'id' => 'nullable|integer',
            'slug' => 'nullable|string',
            'name' => 'nullable|string',
            'query' => 'nullable|string',
        ]);

        // load by id
        $id = $request->get('id');
        if ($id) {
            $category = Category::find($id);
            return ResponseProtocol::success($category, $DEFAULT_FETCH_MESSAGE);
        }

        // load by slug
        $slug = $request->get('slug');
        if ($slug) {
            $category = Category::where('slug', $slug)->first();
            return ResponseProtocol::success($category, $DEFAULT_FETCH_MESSAGE);
        }

        // load by name
        $name = $request->get('name');
        if ($name) {
            $category = Category::where('name', $name)->first();
            return ResponseProtocol::success($category, $DEFAULT_FETCH_MESSAGE);
        }


        $query = $request->get('query');
        $categories = [];
        if ($query) {
            // load by query
            $categories = Category::where('name', 'like', '%' . $query . '%')->get();
        } else {
            // load all if none selected
            $categories = Category::get();
        }

        $fetchedCount = $categories->count();
        $DEFAULT_FETCH_MESSAGE = ($fetchedCount > 0) ? "$fetchedCount " . (($fetchedCount == 1) ? "Category" : "Categories") . " fetched successfully" : "No categories found";
        return ResponseProtocol::success($categories, $DEFAULT_FETCH_MESSAGE);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {


    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name',
            'slug' => 'nullable|string|unique:categories,slug',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);


        // validate image 
        if (!$request->hasFile('image')) {
            return ResponseProtocol::error("Image is required");
        }

        $slug = $validated['slug'] ?? Str::slug($validated['name']);

        try {
            $imagePath = 'storage/images/products/FarmFreshEgg.png';

            // save image to storage if provided
            if ($request->hasFile('image')) {
                $imageFile = $request->file('image');
                $fileName = $slug . '.' . $imageFile->extension();
                $imageFile = Storage::disk('categories')->putFileAs('/', $imageFile, $fileName);
                $imagePath = "storage/images/categories/$imageFile";
            }

            // save category in DB
            $category = new Category();
            $category->name = $validated['name'];
            $category->slug = $slug;
            $category->image = $imagePath; // set image path or null
            $category->save();
            return ResponseProtocol::success($category, "Category created successfully");
        } catch (\Throwable $th) {
            return ResponseProtocol::error($th->getMessage(), "Failed to create category", 201);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:categories,id',
            'name' => 'nullable|string|unique:categories,name',
            'slug' => 'nullable|string|unique:categories,slug',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $category = Category::find($validated['id']);

        if ($request->has('name')) {
            $category->name = $request->name;
        }

        if ($request->has('slug')) {
            $category->slug = $request->slug;
        }

        if ($request->hasFile('image')) {
            // delete old image
            $oldImage = $category->image; // ex: storage/images/categories/slug.jpg
            $fileName = basename($oldImage);
            if (Storage::disk('categories')->delete($fileName)) {
                Log::info("Old image deleted successfully");
            }

            // save new image
            $imageFile = $request->file('image');
            $fileName = $category->slug . '.' . $imageFile->extension();
            $imageFile = Storage::disk('categories')->putFileAs('/', $imageFile, $fileName);
            $category->image = "storage/images/categories/$imageFile";
        }

        $category->save(); // save changes

        return ResponseProtocol::success($category, "Category updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:categories,id',
        ]);

        $category = Category::find($validated['id']);

        try {
            // delete images
            Storage::disk('categories')->delete($category->image);

            // delete category
            $category->delete();
            return ResponseProtocol::success($category, "Category deleted successfully");
        } catch (\Throwable $th) {
            return ResponseProtocol::error($th->getMessage(), "Failed to delete category");
        }
    }
}
