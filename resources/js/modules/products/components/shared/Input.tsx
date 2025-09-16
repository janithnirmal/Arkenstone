// resources/js/modules/products/components/shared/Input.tsx

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    // We can add custom props like `error` in the future
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
    const baseStyles = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100';
    const combinedClasses = `${baseStyles} ${className}`;

    return <input ref={ref} className={combinedClasses} {...props} />;
});

Input.displayName = 'Input'; // for better debugging

export default Input;