// resources/js/modules/products/components/shared/Button.tsx

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center rounded-md border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
        primary: 'border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
        danger: 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;