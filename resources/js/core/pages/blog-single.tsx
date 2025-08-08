import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Confetti } from '@/components/ui/confetti';
import { 
    Calendar, 
    User, 
    Tag, 
    ArrowLeft, 
    Share2, 
    Facebook, 
    Twitter, 
    Linkedin, 
    Copy,
    Clock,
    Eye,
    Heart
} from 'lucide-react';
import { apiGet, apiPost } from '@/core/lib/api';
import { Blog } from '@/types';
import { format } from 'date-fns';

export default function BlogSingle() {
    const { slug } = usePage<{ slug: string }>().props;
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        apiGet(`/blog/${slug}`).then((res) => {
            setBlog(res);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });

        // Fetch related blogs
        apiGet('/blog').then((res) => {
            setRelatedBlogs(res.slice(0, 3));
        });
    }, [slug]);

    // Fetch likes data
    useEffect(() => {
        if (blog) {
            apiGet(`/blog/${blog.id}/likes`).then((res) => {
                setLikeCount(res.likeCount || 0);
                setIsLiked(res.isLiked || false);
            }).catch(() => {
                // Fallback to 0 if API fails
                setLikeCount(0);
                setIsLiked(false);
            });
        }
    }, [blog]);

    function handleLike() {
        if (!blog) return;

        const wasLiked = isLiked;
        
        // Optimistically update UI
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        
        // Show confetti when liking (not when unliking)
        if (!wasLiked) {
            setShowConfetti(true);
        }

        // Send API request
        apiPost(`/blog/${blog.id}/like`, { data: {} })
            .then((res) => {
                // Update with actual server response
                setLikeCount(res.likeCount);
                setIsLiked(res.isLiked);
            })
            .catch(() => {
                // Revert on error
                setIsLiked(wasLiked);
                setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
            });
    }

    function handleShare(type: string) {
        const url = window.location.href;
        const title = blog?.title || '';
        const text = blog?.excerpt || '';

        switch (type) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                // Show a simple alert for now (you could replace with a proper toast)
                alert('Link copied to clipboard!');
                break;
        }
        setShowShareMenu(false);
    }

    function RelatedBlogCard({ blog }: { blog: Blog }) {
        return (
            <Card className="group hover:shadow-lg transition-all duration-300">
                {blog.featured_image && (
                    <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                            src={blog.featured_image} 
                            alt={blog.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                        {blog.tags && blog.tags.slice(0, 1).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {blog.published_at 
                                ? format(new Date(blog.published_at), 'MMM dd')
                                : blog.created_at 
                                    ? format(new Date(blog.created_at), 'MMM dd')
                                    : 'No date'
                            }
                        </div>
                        <Link href={`/blog/${blog.slug}`}>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                                Read
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <>
                <Head title="Loading..." />
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-96 bg-gray-200 rounded mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </>
        );
    }

    if (!blog) {
        return (
            <>
                <Head title="Blog Not Found" />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
                    <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
                    <Link href="/blog">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Blog
                        </Button>
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={blog.title} />
            <Confetti 
                isActive={showConfetti} 
                onComplete={() => setShowConfetti(false)} 
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/blog">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Blog
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article className="prose prose-lg max-w-none">
                            {/* Header */}
                            <header className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    {blog.tags && blog.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                                {blog.excerpt && (
                                    <p className="text-xl text-gray-600 mb-6">{blog.excerpt}</p>
                                )}
                                
                                {/* Author and Meta Info */}
                                <div className="flex items-center justify-between border-t border-b py-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${blog.user?.name}&background=random`} />
                                            <AvatarFallback>{blog.user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">{blog.user?.name || 'Unknown Author'}</div>
                                            <div className="text-sm text-gray-500">
                                                {blog.published_at 
                                                    ? format(new Date(blog.published_at), 'MMMM dd, yyyy')
                                                    : blog.created_at 
                                                        ? format(new Date(blog.created_at), 'MMMM dd, yyyy')
                                                        : 'No date'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="h-4 w-4" />
                                            {Math.ceil(blog.content.split(' ').length / 200)} min read
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Eye className="h-4 w-4" />
                                            {Math.floor(Math.random() * 1000) + 100} views
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* Featured Image */}
                            {blog.featured_image && (
                                <div className="mb-8">
                                    <img 
                                        src={blog.featured_image} 
                                        alt={blog.title}
                                        className="w-full h-96 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="mb-8">
                                <div 
                                    className="prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ 
                                        __html: blog.content.replace(/\n/g, '<br>') 
                                    }}
                                />
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center justify-between border-t pt-6">
                                <div className="flex items-center gap-4">
                                                                         <Button 
                                         variant={isLiked ? "default" : "outline"} 
                                         size="sm"
                                         onClick={handleLike}
                                         className={`transition-all duration-300 ${isLiked ? 'scale-110 shadow-lg' : ''}`}
                                     >
                                         <Heart 
                                             className={`h-4 w-4 mr-2 transition-all duration-300 ${
                                                 isLiked ? 'fill-current text-red-500 scale-125' : ''
                                             }`} 
                                         />
                                         {likeCount}
                                     </Button>
                                </div>
                                <div className="relative">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                    {showShareMenu && (
                                        <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-2 z-10">
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleShare('facebook')}
                                                >
                                                    <Facebook className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleShare('twitter')}
                                                >
                                                    <Twitter className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleShare('linkedin')}
                                                >
                                                    <Linkedin className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleShare('copy')}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Author Card */}
                            <Card>
                                <CardHeader>
                                    <h3 className="font-semibold">About the Author</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${blog.user?.name}&background=random`} />
                                            <AvatarFallback>{blog.user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">{blog.user?.name || 'Unknown Author'}</div>
                                            <div className="text-sm text-gray-500">Blog Contributor</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Related Articles */}
                            {relatedBlogs.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <h3 className="font-semibold">Related Articles</h3>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {relatedBlogs.map((relatedBlog) => (
                                            <RelatedBlogCard key={relatedBlog.id} blog={relatedBlog} />
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            Tags
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {blog.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
