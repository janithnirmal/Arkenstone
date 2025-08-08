import AppLayout from '@/core/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Textarea from '@/components/custom/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, ArrowLeft } from 'lucide-react';
import { apiPut } from '@/core/lib/api';
import { Blog } from '@/types';

export default function BlogEdit() {
    const { blog } = usePage<{ blog: Blog }>().props;
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blog',
            href: '/admin/blog',
        },
        {
            title: 'Edit',
            href: `/admin/blog/${blog.id}/edit`,
        }
    ];

    const [formData, setFormData] = useState({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        featured_image: blog.featured_image || '',
        status: blog.status || 'draft',
        published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : '',
        meta_title: blog.meta_title || '',
        meta_description: blog.meta_description || '',
        tags: blog.tags || [] as string[],
        featured: blog.featured || false,
    });

    const [newTag, setNewTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleInputChange(field: string, value: any) {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleAddTag() {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    }

    function handleRemoveTag(tagToRemove: string) {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const submitData = {
            ...formData,
            published_at: formData.status === 'published' ? (formData.published_at || new Date().toISOString()) : null,
        };

        apiPut(`/admin/blog/${blog.id}`, { data: submitData })
            .then(() => {
                router.visit('/admin/blog');
            })
            .catch(() => {
                setIsSubmitting(false);
            });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Blog - ${blog.title}`} />
            <div className="flex flex-col gap-4 p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.visit('/admin/blog')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold">Edit Blog</h1>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 px-3 pb-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Blog Content</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="Enter blog title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="content">Content *</Label>
                                        <Textarea
                                            id="content"
                                            value={formData.content}
                                            onChange={(e) => handleInputChange('content', e.target.value)}
                                            placeholder="Write your blog content here..."
                                            rows={15}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="excerpt">Excerpt</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={formData.excerpt}
                                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                                            placeholder="Brief summary of the blog post..."
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publishing</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {formData.status === 'published' && (
                                        <div>
                                            <Label htmlFor="published_at">Publish Date</Label>
                                            <Input
                                                id="published_at"
                                                type="datetime-local"
                                                value={formData.published_at}
                                                onChange={(e) => handleInputChange('published_at', e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="featured"
                                            checked={formData.featured}
                                            onCheckedChange={(checked) => handleInputChange('featured', checked)}
                                        />
                                        <Label htmlFor="featured">Featured Post</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO & Metadata</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="featured_image">Featured Image URL</Label>
                                        <Input
                                            id="featured_image"
                                            value={formData.featured_image}
                                            onChange={(e) => handleInputChange('featured_image', e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="meta_title">Meta Title</Label>
                                        <Input
                                            id="meta_title"
                                            value={formData.meta_title}
                                            onChange={(e) => handleInputChange('meta_title', e.target.value)}
                                            placeholder="SEO title for search engines"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="meta_description">Meta Description</Label>
                                        <Textarea
                                            id="meta_description"
                                            value={formData.meta_description}
                                            onChange={(e) => handleInputChange('meta_description', e.target.value)}
                                            placeholder="SEO description for search engines"
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Add a tag"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        />
                                        <Button type="button" onClick={handleAddTag} size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-1 hover:text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.visit('/admin/blog')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? 'Saving...' : 'Update Blog'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
