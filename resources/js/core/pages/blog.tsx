import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiGet } from '@/core/lib/api';
import type { Blog } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Search, Star, Tag, User, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Blog() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        apiGet('/blog')
            .then((res) => {
                setBlogs(res);
                setFilteredBlogs(res);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = blogs;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    blog.content.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Filter by tag
        if (selectedTag) {
            filtered = filtered.filter((blog) => blog.tags?.includes(selectedTag));
        }

        setFilteredBlogs(filtered);
    }, [blogs, searchTerm, selectedTag]);

    // Get all unique tags
    const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags || [])));

    // Get featured blogs
    const featuredBlogs = blogs.filter((blog) => blog.featured).slice(0, 3);

    function BlogCard({ blog, isFeatured = false }: { blog: Blog; isFeatured?: boolean }) {
        return (
            <Card className={`group transition-all duration-300 hover:shadow-lg ${isFeatured ? 'border-2 border-yellow-200' : ''}`}>
                {blog.featured_image && (
                    <div className="relative overflow-hidden rounded-t-lg">
                        <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {blog.featured && (
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-yellow-500 text-white">
                                    <Star className="mr-1 h-3 w-3" />
                                    Featured
                                </Badge>
                            </div>
                        )}
                    </div>
                )}
                <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center gap-2">
                        {blog.tags &&
                            blog.tags.slice(0, 2).map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="hover:bg-primary cursor-pointer text-xs hover:text-white"
                                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                    </div>
                    <h3 className="group-hover:text-primary line-clamp-2 text-xl font-semibold transition-colors">{blog.title}</h3>
                </CardHeader>
                <CardContent className="pt-0">
                    {blog.excerpt && <p className="mb-4 line-clamp-3 text-gray-600">{blog.excerpt}</p>}
                                         <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                         <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1">
                                 <User className="h-4 w-4" />
                                 {blog.user?.name || 'Unknown'}
                             </div>
                             <div className="flex items-center gap-1">
                                 <Calendar className="h-4 w-4" />
                                 {blog.published_at 
                                     ? format(new Date(blog.published_at), 'MMM dd, yyyy')
                                     : blog.created_at 
                                         ? format(new Date(blog.created_at), 'MMM dd, yyyy')
                                         : 'No date'
                                 }
                             </div>
                             <div className="flex items-center gap-1">
                                 <Heart className={`h-4 w-4 ${blog.is_liked ? 'fill-current text-red-500' : ''}`} />
                                 {blog.likes_count || 0}
                             </div>
                         </div>
                     </div>
                    <Link href={`/blog/${blog.slug}`}>
                        <Button className="group-hover:bg-primary w-full transition-colors group-hover:text-white">
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Head title="Blog" />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="mb-4 text-4xl font-bold md:text-6xl">Our Blog</h1>
                    <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
                        Discover insights, tips, and stories from our team. Stay updated with the latest trends and best practices.
                    </p>
                    <div className="mx-auto max-w-md">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-blue-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Featured Blogs */}
                {featuredBlogs.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                            <Star className="h-6 w-6 text-yellow-500" />
                            Featured Articles
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredBlogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} isFeatured={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags Filter */}
                {allTags.length > 0 && (
                    <div className="mb-8">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <Tag className="h-5 w-5" />
                            Filter by Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant={selectedTag === null ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setSelectedTag(null)}
                            >
                                All
                            </Badge>
                            {allTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant={selectedTag === tag ? 'default' : 'outline'}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Blogs */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">All Articles</h2>
                        <div className="text-sm text-gray-500">
                            {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} found
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <div className="h-48 rounded-t-lg bg-gray-200"></div>
                                    <CardHeader>
                                        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                                        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
                                        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="mb-4 text-gray-400">
                                <Search className="mx-auto h-16 w-16" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">No articles found</h3>
                            <p className="text-gray-500">
                                {searchTerm || selectedTag
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No blog articles have been published yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredBlogs.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
