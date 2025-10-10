import { FieldConfig, GroupConfig, StepConfig } from '../types';
import InputField from './input-field';
import InputGroup from './input-group';

interface StepProps {
    stepConfig: StepConfig;
    onInteraction?: (fieldName: string, eventType: 'click' | 'change', value: any) => void;
}

const Step: React.FC<StepProps> = ({ stepConfig, onInteraction }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold">{stepConfig.title}</h2>
            {stepConfig.description && <p className="mb-4 text-sm text-gray-500">{stepConfig.description}</p>}

            <div className="space-y-6">
                {stepConfig.fields.map((item, index) => {
                    if ('isGroup' in item) {
                        return <InputGroup key={index} groupConfig={item as GroupConfig} onInteraction={onInteraction} />;
                    }

                    if (item.component) {
                        const CustomComponent = item.component;
                        return <CustomComponent key={index} fieldConfig={item} onInteraction={onInteraction} />;
                    } else {
                        return item.component ? 'test' : <InputField key={index} fieldConfig={item as FieldConfig} onInteraction={onInteraction} />;
                    }
                })}
            </div>
        </div>
    );
};

export default Step;
