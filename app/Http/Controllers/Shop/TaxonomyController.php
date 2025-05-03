<?php

namespace App\Http\Controllers;

use App\Helper\Response;
use App\Models\Taxonomy;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TaxonomyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'id' => 'integer|exists:taxonomies,id',
            'name' => 'string|exists:taxonomies,name',
            'slug' => 'string|exists:taxonomies,slug',
            'product_id' => 'integer|exists:products,id',
        ]);

        // Fetch a taxonomy by id
        if ($request->has('id')) {
            $taxonomy = Taxonomy::find($request->id);
            return Response::success($taxonomy, 'Successfully fetched taxonomy by id');
        }

        // Fetch a taxonomy by name
        if ($request->has('name')) {
            $taxonomy = Taxonomy::where('name', $request->name)->first();
            return Response::success($taxonomy, 'Successfully fetched taxonomy by name');
        }

        // Fetch a taxonomy by slug
        if ($request->has('slug')) {
            $taxonomy = Taxonomy::where('slug', $request->slug)->first();
            return Response::success($taxonomy, 'Successfully fetched taxonomy by slug');
        }

        // Fetch a taxonomy by product id
        if ($request->has('product_id')) {
            $taxonomies = Taxonomy::whereHas('products', function ($query) use ($request) {
                $query->where('products.id', $request->product_id);
            })->get();
            return Response::success($taxonomies, 'Successfully fetched taxonomy by product id');
        }

        // Fetch all taxonomies
        $taxonomies = Taxonomy::all();
        return Response::success($taxonomies, 'Successfully fetched all taxonomies');
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
            'name' => 'required|string|max:255|unique:taxonomies,name',
            'slug' => 'string|max:255|unique:taxonomies,slug',
        ]);

        $slug = $request->slug ?? Str::slug($request->name);

        $taxonomy = Taxonomy::create([
            'name' => $request->name,
            'slug' => $slug,
        ]);
        return Response::success($taxonomy, 'Successfully created taxonomy', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Taxonomy $taxonomy)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Taxonomy $taxonomy)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|string|exists:taxonomies,id',
            'name' => 'string|max:255|unique:taxonomies,name',
            'slug' => 'string|max:255|unique:taxonomies,slug',
        ]);

        $taxonomy = Taxonomy::find($request->id);

        if ($request->has('name')) {
            $taxonomy->name = $request->name;
        }

        if ($request->has('slug')) {
            $taxonomy->slug = $request->slug;
        }

        $taxonomy->save();
        return Response::success($taxonomy, 'Successfully updated taxonomy', 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|string|exists:taxonomies,id',
        ]);

        $taxonomy = Taxonomy::find($request->id);
        $taxonomy->delete();
        return Response::success($taxonomy, 'Successfully deleted taxonomy', 201);
    }
}
