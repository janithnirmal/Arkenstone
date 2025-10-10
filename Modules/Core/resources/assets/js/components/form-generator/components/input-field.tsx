import { Controller, useFormContext } from 'react-hook-form';
import { FieldConfig } from '../types';
import FileUpload from './file-upload';

interface InputFieldProps {
    fieldConfig: FieldConfig;
    onInteraction?: (fieldName: string, eventType: 'click' | 'change', value: any) => void;
}

const InputField: React.FC<InputFieldProps> = ({ fieldConfig, onInteraction }) => {
    const {
        register,
        formState: { errors },
        control,
    } = useFormContext();
    const { name, label, type, placeholder, options, validation, className, wrapperClassName, defaultValue } = fieldConfig;
    const error = errors[name];

    const handleInteraction = (eventType: 'click' | 'change', value: any) => {
        if (onInteraction) {
            onInteraction(name, eventType, value);
        }

        if (fieldConfig.onInteraction) {
            fieldConfig.onInteraction(name, eventType, value);
        }
    };

    const commonProps = {
        id: name,
        className: `w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} ${className || ''}`,
        onClick: (e: React.MouseEvent<HTMLInputElement>) => handleInteraction('click', (e.target as HTMLInputElement).value),
        onChange: (e: React.ChangeEvent<any>) => handleInteraction('change', e.target.value),
    };

    const renderInput = () => {
        switch (type) {
            case 'textarea':
                return <textarea {...register(name, validation)} {...commonProps} placeholder={placeholder} defaultValue={defaultValue}></textarea>;

            case 'select':
                return (
                    <select {...register(name, validation)} {...commonProps} defaultValue={defaultValue}>
                        {placeholder && <option value="">{placeholder}</option>}
                        {options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="flex flex-col space-y-2">
                        {options?.map((opt) => (
                            <label key={opt.value} className="flex items-center space-x-2">
                                <input type="radio" {...register(name, validation)} value={opt.value} defaultChecked={defaultValue === opt.value} />
                                <span>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            {...register(name, validation)}
                            {...commonProps}
                            style={{ width: 'auto' }}
                            defaultChecked={defaultValue}
                        />
                        <label htmlFor={name}>{label}</label>
                    </div>
                );

            case 'file':
                return (
                    <Controller
                        name={name}
                        control={control}
                        rules={validation}
                        defaultValue={defaultValue}
                        render={({ field }) => <FileUpload fieldConfig={fieldConfig} onFileChange={field.onChange} onInteraction={onInteraction} />}
                    />
                );

            default:
                return <input type={type} {...register(name, validation)} {...commonProps} placeholder={placeholder} defaultValue={defaultValue} />;
        }
    };

    return (
        <div className={wrapperClassName || ''}>
            {type !== 'checkbox' && (
                <label htmlFor={name} className="mb-1 block font-medium">
                    {label}
                </label>
            )}
            {renderInput()}
            {error && <p className="mt-1 text-sm text-red-500">{error.message as string}</p>}
        </div>
    );
};

export default InputField;
