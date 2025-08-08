<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseProtocol;
use App\Models\Blog;
use App\Models\BlogLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * Display a listing of blogs for admin panel
     */
    public function index()
    {
        $blogs = Blog::with('user')->orderBy('created_at', 'desc')->get();
        return ResponseProtocol::success($blogs, 'Blogs fetched successfully');
    }

    /**
     * Display a listing of published blogs for frontend
     */
    public function publicIndex()
    {
        $blogs = Blog::published()
            ->with('user')
            ->orderBy('published_at', 'desc')
            ->get();
        
        // Add likes count and user like status for each blog
        foreach ($blogs as $blog) {
            $blog->likes_count = $blog->likes()->count();
            $blog->is_liked = false;
            
            if (auth()->check()) {
                $blog->is_liked = $blog->likes()->where('user_id', auth()->id())->exists();
            }
        }
        
        return ResponseProtocol::success($blogs, 'Blogs fetched successfully');
    }

    /**
     * Show the form for creating a new blog
     */
    public function create(): Response
    {
        return Inertia::render('admin/blog/create');
    }

    /**
     * Store a newly created blog in storage
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
        ]);

        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $counter = 1;

        // Ensure unique slug
        while (Blog::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $blog = Blog::create([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'excerpt' => $request->excerpt,
            'featured_image' => $request->featured_image,
            'status' => $request->status,
            'published_at' => $request->status === 'published' ? ($request->published_at ?? now()) : null,
            'user_id' => Auth::id(),
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'tags' => $request->tags,
            'featured' => $request->featured ?? false,
        ]);

        return ResponseProtocol::success($blog->load('user'), 'Blog created successfully');
    }

    /**
     * Display the specified blog for admin
     */
    public function show(Blog $blog)
    {
        return ResponseProtocol::success($blog->load('user'), 'Blog fetched successfully');
    }

    /**
     * Display the specified blog for public
     */
    public function publicShow($slug)
    {
        $blog = Blog::published()->where('slug', $slug)->with('user')->first();
        
        if (!$blog) {
            return ResponseProtocol::error('Blog not found', 404);
        }

        // Add likes count and user like status
        $blog->likes_count = $blog->likes()->count();
        $blog->is_liked = false;
        
        if (auth()->check()) {
            $blog->is_liked = $blog->likes()->where('user_id', auth()->id())->exists();
        }

        return ResponseProtocol::success($blog, 'Blog fetched successfully');
    }

    /**
     * Show the form for editing the specified blog
     */
    public function edit(Blog $blog): Response
    {
        return Inertia::render('admin/blog/edit', [
            'blog' => $blog->load('user')
        ]);
    }

    /**
     * Update the specified blog in storage
     */
    public function update(Request $request, Blog $blog)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
        ]);

        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $counter = 1;

        // Ensure unique slug (excluding current blog)
        while (Blog::where('slug', $slug)->where('id', '!=', $blog->id)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $blog->update([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'excerpt' => $request->excerpt,
            'featured_image' => $request->featured_image,
            'status' => $request->status,
            'published_at' => $request->status === 'published' ? ($request->published_at ?? now()) : null,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'tags' => $request->tags,
            'featured' => $request->featured ?? false,
        ]);

        return ResponseProtocol::success($blog->load('user'), 'Blog updated successfully');
    }

    /**
     * Remove the specified blog from storage
     */
    public function destroy(Blog $blog)
    {
        $blog->delete();
        return ResponseProtocol::success('Blog deleted successfully');
    }

    public function toggleLike(Blog $blog)
    {
        $user = auth()->user();
        
        if (!$user) {
            return ResponseProtocol::error('User not authenticated', 401);
        }

        $existingLike = $blog->likes()->where('user_id', $user->id)->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $action = 'unliked';
        } else {
            // Like
            $blog->likes()->create(['user_id' => $user->id]);
            $action = 'liked';
        }

        $likeCount = $blog->likes()->count();
        $isLiked = $blog->likes()->where('user_id', $user->id)->exists();

        return ResponseProtocol::success("Blog {$action} successfully", [
            'likeCount' => $likeCount,
            'isLiked' => $isLiked,
            'action' => $action
        ]);
    }

    public function getLikes(Blog $blog)
    {
        $likeCount = $blog->likes()->count();
        $isLiked = false;

        if (auth()->check()) {
            $isLiked = $blog->likes()->where('user_id', auth()->id())->exists();
        }

        return ResponseProtocol::success('Likes retrieved successfully', [
            'likeCount' => $likeCount,
            'isLiked' => $isLiked
        ]);
    }
}
