interface TextAdvantProProps {
    children: React.ReactNode;
    className?: string;
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    color?: string;
}

export default function TextAdvantPro({ 
    children, 
    className = '', 
    size = 'base',
    weight = 'normal',
    color = 'text-black'
}: TextAdvantProProps) {
    const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
        '7xl': 'text-7xl',
        '8xl': 'text-8xl'
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
            style={{ fontFamily: 'AdventPro' }}
        >
            {children}
        </span>
    );
}
