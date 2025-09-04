import config from '@/core/config';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useContext } from 'react';
import Header, { PageHeaderContext } from './header';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Sidebar() {
    const { isOpen, items, setIsOpen } = useContext(PageHeaderContext);
    return (
        <aside
            className={cn(
                'bg-secondary fixed z-20 flex h-screen w-full flex-col p-3 shadow-2xl transition-all duration-300 md:w-64',
                isOpen ? 'flex' : 'hidden',
            )}
        >
            <div className="flex h-max items-center justify-between">
                <AppLogoIcon className="text-2xl" />
                <button onClick={() => setIsOpen(!isOpen)}>
                    <X className="cursor-pointer" />
                </button>
            </div>
            <hr className="border-muted my-2 border-1" />
            <Header.Nav className="h-full gap-2 py-5" orientation="vertical">
                {items?.map((item) => <Header.Item key={item.name} {...item} className="hover:text-secondary-foreground/70" />)}
            </Header.Nav>
            <hr className="border-muted my-2 border-1" />
            <div className="flex h-max flex-col items-center justify-between">
                <p className="text-center text-xs">
                    <a href={config.appAuthorUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {config.appAuthor}
                    </a>{' '}
                    All rights reserved {new Date().getFullYear()}
                </p>
                <p className="mt-1 text-center text-xs">v{config.appVersion}</p>
            </div>
        </aside>
    );
}
