import { cn } from '@/lib/utils';
import { Appearance, useAppearance } from '@core/hooks/use-appearance';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({
    className = '',
    removeSystem = false,
    hasText = true,
    ...props
}: HTMLAttributes<HTMLDivElement> & { hasText?: boolean; removeSystem?: boolean }) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
    ];

    if (!removeSystem) {
        tabs.push({ value: 'system', icon: Monitor, label: 'System' });
    }

    return (
        <div className={cn('inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex cursor-pointer items-center rounded-md px-3.5 py-1.5 transition-colors',
                        appearance === value ? 'hidden' : 'text-foreground hover:text-foreground/60',
                    )}
                >
                    <Icon className="-ml-1 h-4 w-4" />
                    {hasText && <span className="ml-1.5 text-sm">{label}</span>}
                </button>
            ))}
        </div>
    );
}
