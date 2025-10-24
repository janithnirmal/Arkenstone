interface TextBeatriceDeckProps {
    children: React.ReactNode;
    className?: string;
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    color?: string;
}

export default function TextBeatriceDeck({ 
    children, 
    className = '', 
    size = 'base',
    weight = 'normal',
    color = 'text-black'
}: TextBeatriceDeckProps) {
    const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl'
    };

    const weightClasses = {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold'
    };

    return (
        <span 
            className={`${sizeClasses[size]} ${weightClasses[weight]} ${color} ${className}`}
            style={{ fontFamily: 'BeatriceDeckTRIAL' }}
        >
            {children}
        </span>
    );
}