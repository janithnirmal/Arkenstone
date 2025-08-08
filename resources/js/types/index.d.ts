import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    roles?: Role[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface AdminUser extends User {}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    status: 'draft' | 'published';
    published_at?: string;
    user_id: number;
    meta_title?: string;
    meta_description?: string;
    tags?: string[];
    featured: boolean;
    created_at?: string;
    updated_at?: string;
    user?: User;
    likes_count?: number;
    is_liked?: boolean;
}

export interface Role {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}