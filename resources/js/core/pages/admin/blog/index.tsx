import AppLayout from '@/core/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag } from 'lucide-react';
import { apiGet, apiDelete } from '@/core/lib/api';
import { Blog } from '@/types';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function BlogIndex() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blog',
            href: '/admin/blog',
        }
    ];

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    function fetchBlogs() {
        setIsLoading(true);
        apiGet('/admin/blog').then((res) => {
            setBlogs(res);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        fetchBlogs();
    }, [isRefreshing]);

    function handleRefresh() {
        setIsRefreshing(!isRefreshing);
    }

    function handleDelete(blogId: number) {
        if (confirm('Are you sure you want to delete this blog?')) {
            apiDelete(`/admin/blog/${blogId}`).then(() => {
                handleRefresh();
            });
        }
    }

    function getStatusBadge(status: string) {
        return status === 'published' ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
        ) : (
            <Badge variant="secondary">Draft</Badge>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Management" />
            <div className="flex flex-col gap-4 p-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Blog Management</h1>
                    <Link href="/admin/blog/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Blog
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-2 px-3">
                <Card>
                    <CardHeader>
                        <CardTitle>All Blogs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No blogs found. Create your first blog post!
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {blogs.map((blog) => (
                                    <div key={blog.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                                                    {blog.featured && (
                                                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                            Featured
                                                        </Badge>
                                                    )}
                                                    {getStatusBadge(blog.status)}
                                                </div>
                                                {blog.excerpt && (
                                                    <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
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
                                                    {blog.tags && blog.tags.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Tag className="h-4 w-4" />
                                                            {blog.tags.slice(0, 2).join(', ')}
                                                            {blog.tags.length > 2 && ` +${blog.tags.length - 2}`}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Link href={`/blog/${blog.slug}`} target="_blank">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/blog/${blog.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
