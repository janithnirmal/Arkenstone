<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $users = User::factory(3)->create();
        }

        // Create published blogs
        Blog::factory(15)
            ->published()
            ->for($users->random())
            ->create();

        // Create draft blogs
        Blog::factory(5)
            ->draft()
            ->for($users->random())
            ->create();

        // Create featured blogs
        Blog::factory(3)
            ->published()
            ->featured()
            ->for($users->random())
            ->create();
    }
}
