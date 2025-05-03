import { cn } from '@/lib/utils';
import { ClassNameValue } from 'tailwind-merge';

export default function AppLogoIcon({ className }: { className?: ClassNameValue }) {
    return (
        <>
            {/* <img src="https://esg.ceygenic.co/storage/images/branding/icon.png" alt="logo" className="aspect-auto h-full" /> */}
            <span className={cn('animate-pulse text-7xl', className)}>💎</span>
        </>
    );
}
