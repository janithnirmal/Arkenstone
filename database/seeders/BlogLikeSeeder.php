<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\BlogLike;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogLikeSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $blogs = Blog::published()->get();

        if ($users->isEmpty() || $blogs->isEmpty()) {
            return;
        }

        // Create some sample likes
        foreach ($blogs as $blog) {
            // Randomly like 30-70% of blogs per user
            foreach ($users as $user) {
                if (rand(1, 100) <= 50) { // 50% chance to like
                    BlogLike::create([
                        'blog_id' => $blog->id,
                        'user_id' => $user->id,
                    ]);
                }
            }
        }

        $this->command->info('Created sample blog likes.');
    }
}
