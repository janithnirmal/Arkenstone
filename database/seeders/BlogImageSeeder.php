<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Seeder;

class BlogImageSeeder extends Seeder
{
    public function run(): void
    {
        $imageUrls = [
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
        ];

        $blogs = Blog::all();
        $imageIndex = 0;

        foreach ($blogs as $blog) {
            $blog->update([
                'featured_image' => $imageUrls[$imageIndex % count($imageUrls)]
            ]);
            $imageIndex++;
        }

        $this->command->info('Updated ' . $blogs->count() . ' blog records with realistic image URLs.');
    }
}
