import { cn } from '@/lib/utils';
import { ClassNameValue } from 'tailwind-merge';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo({
    classNameIcon,
    classNameText,
    text,
}: {
    classNameIcon?: ClassNameValue;
    classNameText?: ClassNameValue;
    text?: boolean;
}) {
    return (
        <>
            <div className="flex items-center gap-1">
                <div className="text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-md">
                    <AppLogoIcon className={cn('fill-accent dark:fill-accent', classNameIcon)} />
                </div>
                {text && (
                    <div className="grid flex-1 text-left text-sm">
                        <span className={cn('truncate leading-none font-semibold', classNameText)}>Arkenstone</span>
                    </div>
                )}
            </div>
        </>
    );
}
