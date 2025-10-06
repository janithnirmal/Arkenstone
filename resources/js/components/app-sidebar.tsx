import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Roles } from '@core/enum/Roles';
import usePermission from '@core/hooks/use-permission';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Shield } from 'lucide-react';
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
                            <Link href="/admin/dashboard" prefetch>
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
                href: '/admin/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Admins',
                href: '/admin/admins',
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
