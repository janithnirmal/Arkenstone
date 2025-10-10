// src/components/form-generator/DynamicFormGenerator.tsx
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { apiPost, apiPut } from '@core/lib/api';
import ProgressBar from './components/progress-bar';
import Step from './components/step';
import { DynamicFormGeneratorOptions } from './types';

export default function DynamicFormGenerator({ options }: { options: DynamicFormGeneratorOptions }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm({
        shouldUnregister: false,
    });
    const {
        handleSubmit,
        trigger,
        formState: { errors },
    } = methods;

    const isLastStep = currentStep === options.steps.length - 1;

    const hasFileUpload = useMemo(
        () => options.steps.some((step) => step.fields.some((field) => 'type' in field && field.type === 'file')),
        [options.steps],
    );

    const handleNext = async () => {
        const currentStepFields = options.steps[currentStep].fields.flatMap((f) => ('isGroup' in f ? f.fields.map((field) => field.name) : [f.name]));
        const isValid = await trigger(currentStepFields);
        if (isValid && !isLastStep) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const formData = new FormData();
        let hasFiles = false;

        for (const key in data) {
            if (data[key] instanceof FileList || data[key] instanceof File) {
                hasFiles = true;
                const files = data[key] instanceof FileList ? Array.from(data[key]) : [data[key]];
                files.forEach((file) => formData.append(key, file));
            } else if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        }

        const isMultipart = hasFileUpload || hasFiles;
        const submitMethod = options.method || (isMultipart ? 'POST' : 'POST');
        const apiCall = submitMethod === 'PUT' ? apiPut : apiPost;

        try {
            const response = await apiCall(options.endpoint, {
                data: isMultipart ? formData : data,
                isMultipart,
                onSuccess: options.onSuccess,
                onError: options.onError,
            });
            console.log('Form submitted successfully:', response);
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`bg-secondary text-secondary-foreground rounded-lg p-4 shadow-md md:p-8 ${options.formClassName || ''}`}>
            {options.title && <h1 className="mb-2 text-2xl font-bold">{options.title}</h1>}
            {options.description && <p className="text-muted-foreground mb-6">{options.description}</p>}

            {options.steps.length > 1 && <ProgressBar totalSteps={options.steps.length} currentStep={currentStep} />}

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Step stepConfig={options.steps[currentStep]} onInteraction={options.onInteraction} />

                    <div className="mt-8 flex justify-between">
                        {currentStep > 0 && (
                            <button type="button" onClick={handlePrevious} className="rounded-md bg-gray-300 px-6 py-2 text-gray-800">
                                Previous
                            </button>
                        )}

                        {!isLastStep && (
                            <button type="button" onClick={handleNext} className="ml-auto rounded-md bg-blue-600 px-6 py-2 text-white">
                                Next
                            </button>
                        )}

                        {isLastStep && (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="ml-auto rounded-md bg-green-600 px-6 py-2 text-white disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Submitting...' : options.submitButtonText || 'Submit'}
                            </button>
                        )}
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
