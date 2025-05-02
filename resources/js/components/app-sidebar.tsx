import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Roles } from '@/enum/Roles';
import usePermission from '@/hooks/use-permission';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Building, FolderClosed, LayoutGrid, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = []; // #TODO: Add footer nav items

export function AppSidebar() {
    const { hasAnyRole } = usePermission();

    const companySidebarItems = CompanySidebarItems();

    const [mainNavItems, setMainNavItems] = useState<NavItem[]>([]);

    useEffect(() => {
        setMainNavItems(companySidebarItems);
    }, [companySidebarItems]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export function CompanySidebarItems() {
    const { hasAnyRole } = usePermission();

    const [mainNavItems, setMainNavItems] = useState<NavItem[]>([]);

    useEffect(() => {
        const items = [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Admins',
                href: '/admins',
                icon: Shield,
            },
        ];

        if (hasAnyRole([Roles.SUPER_ADMIN, Roles.ADMIN])) {
            items.push(
                ...[
                    // {
                    //     title: 'Users',
                    //     href: '/users',
                    //     icon: Users,
                    // },
                ],
            );
        }

        setMainNavItems(items);
    }, []);

    return mainNavItems;
}
