import { Button as DefaultButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Button({
    children,
    variant,
    className,
    size,
    ...props
}: React.ComponentProps<'button'> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'selected-primary' | 'selected-secondary' | 'text' | 'text-secondary' | 'destructive';
    size?: 'sm' | 'lg' | 'icon' | 'default';
}) {
    let classes = 'cursor-pointer rounded-full';

    if (variant === undefined) {
        variant = 'primary';
    }

    switch (variant) {
        case 'primary':
            classes = cn('text-primary-foreground hover:bg-primary/90', classes);
            break;
        case 'text':
            classes = cn('text-foreground border-none bg-transparent shadow-none hover:bg-transparent hover:underline', classes);
            break;
        case 'text-secondary':
            classes = cn('text-muted-foreground border-none bg-transparent shadow-none hover:bg-transparent hover:underline', classes);
            break;
        case 'secondary':
            classes = cn('text-secondary-foreground hover:bg-secondary/90 bg-accent', classes);
            break;
        case 'outline':
            classes = cn('text-secondary-foreground hover:bg-secondary/90 border-muted-foreground border border-2 bg-transparent', classes);
            break;
        case 'selected-primary':
            classes = cn('text-accent border-accent hover:bg-transperant hover:border-accent/30 border border-2 bg-transparent', classes);
            break;
        case 'selected-secondary':
            classes = cn('text-accent-foreground border-accent hover:bg-transperant hover:border-accent/30 border border-2 bg-transparent', classes);
            break;
        case 'destructive':
            classes = cn('text-destructive-foreground hover:bg-destructive/80 bg-destructive', classes);
            break;
        default:
            classes = cn('bg-primary text-primary-foreground hover:bg-primary/90', classes);
            break;
    }

    if (className !== undefined) {
        classes = `${classes} ${className}`;
    }

    return (
        <DefaultButton size={size} {...props} className={classes}>
            {children}
        </DefaultButton>
    );
}
