import { useFormContext, useWatch } from 'react-hook-form';
import { GroupConfig } from '../types';
import InputField from './input-field';

interface InputGroupProps {
    groupConfig: GroupConfig;
    onInteraction?: (fieldName: string, eventType: 'click' | 'change', value: any) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({ groupConfig, onInteraction }) => {
    const { register, control } = useFormContext();
    const isEnabled = useWatch({ control, name: groupConfig.name });

    return (
        <div className={`rounded-md border border-foreground p-4 ${groupConfig.className || ''}`}>
            {groupConfig.toggleable ? (
                <label className="mb-4 flex items-center space-x-2 font-semibold">
                    <input type="checkbox" {...register(groupConfig.name)} />
                    <span>{groupConfig.label}</span>
                </label>
            ) : (
                <h3 className="mb-4 font-semibold">{groupConfig.label}</h3>
            )}

            <hr className="mb-4" />

            <div className={`space-y-4 ${groupConfig.toggleable && !isEnabled ? 'pointer-events-none opacity-50' : ''}`}>
                {groupConfig.fields.map((field, index) => {
                    if (field.component) {
                        const CustomComponent = field.component;
                        return <CustomComponent key={index} fieldConfig={field} />;
                    } else {
                        return <InputField key={index} fieldConfig={field} onInteraction={onInteraction} />;
                    }
                })}
            </div>
        </div>
    );
};

export default InputGroup;
