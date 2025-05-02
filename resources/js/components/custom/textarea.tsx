import { cn } from '@/lib/utils';
import { Textarea as DefaultTextarea } from '@headlessui/react';

export default function Textarea({ children, className, rows = 3, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <DefaultTextarea {...props} rows={rows} className={cn('border-border border-1 border-muted-foreground rounded-md p-1', className)}>
            {children}
        </DefaultTextarea>
    );
}
