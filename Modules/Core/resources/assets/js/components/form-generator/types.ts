import { ComponentType } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type FieldValue = any;

export interface FieldConfig {
    type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'range' | 'file' | 'email' | 'password' | 'number' | 'url';
    name: string;
    label: string;
    placeholder?: string;
    defaultValue?: FieldValue;
    options?: { value: string | number; label: string }[];
    validation?: RegisterOptions;
    component?: ComponentType<any>;
    className?: string;
    wrapperClassName?: string;
    fileConfig?: FileUploadConfig;
    onInteraction?: (fieldName: string, eventType: 'click' | 'change', value: any) => void;
}

export interface FileUploadConfig {
    accept: string;
    multiple: boolean;
    preview: boolean;
    async: boolean;
    url?: string;
    uploadUrl?: string;
    deleteUrl?: string;
    formKey?: string;
    formUploadKey?: string;
    formDeleteKey?: string;
}

export interface GroupConfig {
    isGroup: true;
    label: string;
    toggleable: boolean;
    name: string; // The name for the toggle checkbox
    fields: FieldConfig[];
    className?: string;
}

export interface StepConfig {
    title: string;
    description?: string;
    fields: (FieldConfig | GroupConfig)[];
}

export interface DynamicFormGeneratorOptions {
    endpoint: string;
    method?: 'POST' | 'PUT';
    title?: string;
    description?: string;
    steps: StepConfig[];
    submitButtonText?: string;
    onInteraction?: (fieldName: string, eventType: 'click' | 'change', value: any) => void;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    formClassName?: string;
}
