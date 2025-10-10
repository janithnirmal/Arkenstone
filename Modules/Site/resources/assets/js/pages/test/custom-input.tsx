import { FieldConfig } from '@core/components/form-generator/types';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

// The props for your custom component will be the fieldConfig itself
// This gives you full access to the configuration within your component
const CustomStyledInput = ({ fieldConfig }: { fieldConfig: FieldConfig }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const { name, label, validation, placeholder } = fieldConfig;
    const error = errors[name];

    return (
        <div className="bg-red-500">
            <label htmlFor={name} className="mb-1 block font-bold text-purple-700">
                {label} (Custom)
            </label>
            <input
                id={name}
                type="text"
                {...register(name, validation)}
                placeholder={placeholder}
                className={`w-full rounded-lg border-2 p-3 transition-all ${error ? 'border-red-500 bg-red-50' : 'border-purple-300 focus:border-purple-500 focus:ring-purple-500'} bg-purple-50 text-purple-900 placeholder-purple-300`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error.message as ReactNode}</p>}
        </div>
    );
};

export default CustomStyledInput;
