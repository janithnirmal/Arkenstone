import AppLogo from '@/components/app-logo';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@@/core/hooks/use-mobile';
import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import React, { PropsWithChildren, createContext, useState } from 'react';
import PageSidebar from './sidebar';
type PageHeaderContextType = {
    isOpen: boolean;
    items?: HeaderItemProps[];
    setIsOpen: (isOpen: boolean) => void;
};

export const PageHeaderContext = createContext<PageHeaderContextType>({ isOpen: false, setIsOpen: () => {} });

const items: HeaderItemProps[] = [
    {
        name: 'Home',
        href: '/home',
    },
    {
        name: 'Shop',
        href: '/shop',
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

// Header component
export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();

    return (
        <PageHeaderContext.Provider value={{ isOpen, items, setIsOpen }}>
            <header className="bg-secondary flex w-full flex-col">
                <PageSidebar />
                <div className="container mx-auto flex w-full items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-1">
                        {isMobile && <button onClick={() => setIsOpen(!isOpen)}>{!isOpen && <Menu className="cursor-pointer" />}</button>}
                        <Header.Logo />
                    </div>
                    <div className="flex items-center gap-1">
                        {!isMobile && <Header.Nav>{items?.map((item) => <Header.Item key={item.name} {...item} />)}</Header.Nav>}
                        <AppearanceToggleTab
                            removeSystem={true}
                            hasText={false}
                            className="text-secondary dark:text-secondary bg-transparent dark:bg-transparent"
                        />
                    </div>
                </div>
            </header>
        </PageHeaderContext.Provider>
    );
}

// Item interface
export interface HeaderItemProps {
    name: string;
    icon?: React.ReactNode;
    href: string;
    className?: string;
}

// Header Item component
Header.Item = function HeaderItem({ name, icon, href, className }: HeaderItemProps) {
    return (
        <Link href={href} className={cn('hover:text-accent-foreground flex items-center gap-2 hover:underline', className)}>
            {icon}
            {name}
        </Link>
    );
};

// Nav component for grouping items
Header.Nav = function HeaderNav({
    children,
    orientation = 'horizontal',
    className,
}: PropsWithChildren<{ orientation?: 'horizontal' | 'vertical'; className?: string }>) {
    return <nav className={cn('flex gap-4 px-2', orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col', className)}>{children}</nav>;
};

// Logo component
Header.Logo = function HeaderLogo({ classNameIcon, classNameText }: { classNameIcon?: string; classNameText?: string }) {
    const isMobile = useIsMobile();
    return (
        <Link href="/">
            <AppLogo text={!isMobile} classNameIcon={cn('text-4xl', classNameIcon)} classNameText={cn('text-xl', classNameText)} />
        </Link>
    );
};

export default Header;
