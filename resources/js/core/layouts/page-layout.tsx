import { Toaster } from '@/components/ui/sonner';
import PageLayoutTemplate from '@/core/layouts/page/page-header-layout';
import type { PropsWithChildren } from 'react';
import { HeaderItemProps } from '../components/page/header';

const headerItems: HeaderItemProps[] = [
    {
        name: 'Home',
        href: '/home',
    },
    {
        name: 'About',
        href: '/about',
    },
    {
        name: 'Contact',
        href: '/contact',
    },
];

export default ({ children }: PropsWithChildren) => (
    <PageLayoutTemplate headerItems={headerItems}>
        {children}
        <Toaster />
    </PageLayoutTemplate>
);
