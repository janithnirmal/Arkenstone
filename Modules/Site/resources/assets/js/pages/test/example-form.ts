import { DynamicFormGeneratorOptions } from '@core/components/form-generator/types';
import CustomStyledInput from './custom-input';

const userRegistrationFormOptions: DynamicFormGeneratorOptions = {
    // === General Form Configuration ===
    title: 'Advanced User Registration',
    description: 'This is a multi-step form with advanced features and customizations.',
    endpoint: '/site/test',
    method: 'POST',
    submitButtonText: 'Create My Account',
    formClassName: 'shadow-lg max-w-4xl mx-auto',

    // === Event Handlers ===
    onInteraction: (fieldName: string, eventType: string, value: any) => {
        console.log(`Interaction: Field='${fieldName}', Type='${eventType}', Value=`, value);
    },
    onSuccess: (data: any) => {
        alert('Form submitted successfully!');
        console.log('Success data:', data);
    },
    onError: (error: any) => {
        console.error('Submission failed with errors:', error);
    },

    // === Steps Configuration ===
    steps: [
        // --- STEP 1: Basic Information ---
        {
            title: 'Personal Details',
            description: 'Please provide your basic personal information.',
            fields: [
                {
                    type: 'text',
                    name: 'fullName',
                    label: 'Full Name',
                    placeholder: 'e.g., John Doe',
                    defaultValue: 'Jane Doe',
                    validation: {
                        required: 'Full name is required.',
                        minLength: { value: 3, message: 'Name must be at least 3 characters long.' },
                    },
                    wrapperClassName: 'col-span-12 md:col-span-6', // Example of using Tailwind grid
                },
                {
                    type: 'email',
                    name: 'emailAddress',
                    label: 'Email Address',
                    placeholder: 'you@example.com',
                    validation: {
                        required: 'Email is required.',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format.' },
                    },
                    wrapperClassName: 'col-span-12 md:col-span-6',
                },
                {
                    type: 'password',
                    name: 'password',
                    label: 'Password',
                    placeholder: 'Enter a strong password',
                    validation: {
                        required: 'Password is required.',
                        minLength: { value: 8, message: 'Password must be at least 8 characters.' },
                    },
                },
                {
                    type: 'textarea',
                    name: 'bio',
                    label: 'Biography',
                    placeholder: 'Tell us a little about yourself...',
                    className: 'h-32', // Custom class for the input itself
                    validation: {
                        maxLength: { value: 500, message: 'Biography cannot exceed 500 characters.' },
                    },
                },
                {
                    type: 'range',
                    name: 'experience',
                    label: 'Years of Experience',
                    defaultValue: 5,
                    validation: {
                        min: { value: 0, message: 'Experience cannot be negative.' },
                        max: { value: 50, message: 'Maximum 50 years of experience.' },
                    },
                },
            ],
        },

        // --- STEP 2: Preferences and Details ---
        {
            title: 'Preferences & Details',
            description: 'Choose your preferences and provide additional details.',
            fields: [
                {
                    type: 'select',
                    name: 'role',
                    label: 'Primary Role',
                    placeholder: 'Select your role',
                    defaultValue: 'developer',
                    options: [
                        { value: 'developer', label: 'Developer' },
                        { value: 'designer', label: 'Designer' },
                        { value: 'manager', label: 'Project Manager' },
                        { value: 'other', label: 'Other' },
                    ],
                    validation: { required: 'Please select a role.' },
                },
                {
                    type: 'radio',
                    name: 'notificationFrequency',
                    label: 'Notification Frequency',
                    defaultValue: 'weekly',
                    options: [
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                    ],
                },
                // --- Input Group Example ---
                {
                    isGroup: true,
                    label: 'Shipping Address Details',
                    name: 'shippingAddressEnabled', // Name for the toggle checkbox
                    toggleable: true,
                    className: 'bg-background',
                    fields: [
                        {
                            type: 'text',
                            name: 'addressLine1',
                            label: 'Address Line 1',
                            placeholder: '123 Main St',
                        },
                        {
                            type: 'text',
                            name: 'city',
                            label: 'City',
                            placeholder: 'Anytown',
                        },
                    ],
                },
                // --- Custom Component Example ---
                {
                    type: 'text', // The base type, can be used as a fallback
                    name: 'nickname',
                    label: 'Custom Input',
                    placeholder: 'e.g., Johnny',
                    component: CustomStyledInput, // Injecting the custom component
                },
                {
                    type: 'checkbox',
                    name: 'termsAndConditions',
                    label: 'I agree to the Terms and Conditions',
                    validation: {
                        required: 'You must accept the terms and conditions.',
                    },
                },
            ],
        },
        // --- STEP 3: File Uploads ---
        {
            title: 'File Uploads',
            description: 'Upload your profile picture and relevant documents.',
            fields: [
                // --- Async File Upload Example ---
                {
                    type: 'file',
                    name: 'profilePictures',
                    label: 'Profile Pictures (Async Upload)',
                    validation: { required: 'At least one profile picture is required.' },
                    fileConfig: {
                        accept: 'image/png, image/jpeg, image/gif',
                        multiple: true,
                        preview: true,
                        async: false,
                        uploadUrl: '/api/v1/files/upload-image', // API endpoint to handle immediate upload
                        deleteUrl: (fileIdentifier: string) => `/api/v1/files/delete/${fileIdentifier}`, // API to call on removal
                    },
                },
                // --- Sync File Upload Example ---
                {
                    type: 'file',
                    name: 'resume',
                    label: 'Resume (Upload with Form)',
                    fileConfig: {
                        accept: '.pdf,.doc,.docx',
                        multiple: false,
                        preview: true, // For non-image/video, this shows the file name
                        async: false, // The file will be submitted with the main form data
                    },
                },
            ],
        },
    ],
};

export default userRegistrationFormOptions;

const test = [
    // --- STEP 1: Basic Information ---
    {
        title: 'Personal Details',
        description: 'Please provide your basic personal information.',
        fields: [
            {
                type: 'text',
                name: 'fullName',
                label: 'Full Name',
                placeholder: 'e.g., John Doe',
                defaultValue: 'Jane Doe',
                validation: {
                    required: 'Full name is required.',
                    minLength: { value: 3, message: 'Name must be at least 3 characters long.' },
                },
                wrapperClassName: 'col-span-12 md:col-span-6', // Example of using Tailwind grid
            },
            {
                type: 'email',
                name: 'emailAddress',
                label: 'Email Address',
                placeholder: 'you@example.com',
                validation: {
                    required: 'Email is required.',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format.' },
                },
                wrapperClassName: 'col-span-12 md:col-span-6',
            },
            {
                type: 'password',
                name: 'password',
                label: 'Password',
                placeholder: 'Enter a strong password',
                validation: {
                    required: 'Password is required.',
                    minLength: { value: 8, message: 'Password must be at least 8 characters.' },
                },
            },
            {
                type: 'textarea',
                name: 'bio',
                label: 'Biography',
                placeholder: 'Tell us a little about yourself...',
                className: 'h-32', // Custom class for the input itself
                validation: {
                    maxLength: { value: 500, message: 'Biography cannot exceed 500 characters.' },
                },
            },
            {
                type: 'range',
                name: 'experience',
                label: 'Years of Experience',
                defaultValue: 5,
                validation: {
                    min: { value: 0, message: 'Experience cannot be negative.' },
                    max: { value: 50, message: 'Maximum 50 years of experience.' },
                },
            },
        ],
    },

    // --- STEP 2: Preferences and Details ---
    {
        title: 'Preferences & Details',
        description: 'Choose your preferences and provide additional details.',
        fields: [
            {
                type: 'select',
                name: 'role',
                label: 'Primary Role',
                placeholder: 'Select your role',
                defaultValue: 'developer',
                options: [
                    { value: 'developer', label: 'Developer' },
                    { value: 'designer', label: 'Designer' },
                    { value: 'manager', label: 'Project Manager' },
                    { value: 'other', label: 'Other' },
                ],
                validation: { required: 'Please select a role.' },
            },
            {
                type: 'radio',
                name: 'notificationFrequency',
                label: 'Notification Frequency',
                defaultValue: 'weekly',
                options: [
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                ],
            },
            // --- Input Group Example ---
            {
                isGroup: true,
                label: 'Shipping Address Details',
                name: 'shippingAddressEnabled', // Name for the toggle checkbox
                toggleable: true,
                className: 'bg-background',
                fields: [
                    {
                        type: 'text',
                        name: 'addressLine1',
                        label: 'Address Line 1',
                        placeholder: '123 Main St',
                    },
                    {
                        type: 'text',
                        name: 'city',
                        label: 'City',
                        placeholder: 'Anytown',
                    },
                ],
            },
            // --- Custom Component Example ---
            {
                type: 'text', // The base type, can be used as a fallback
                name: 'nickname',
                label: 'Custom Input',
                placeholder: 'e.g., Johnny',
                component: CustomStyledInput, // Injecting the custom component
            },
            {
                type: 'checkbox',
                name: 'termsAndConditions',
                label: 'I agree to the Terms and Conditions',
                validation: {
                    required: 'You must accept the terms and conditions.',
                },
            },
        ],
    },
    // --- STEP 3: File Uploads ---
    {
        title: 'File Uploads',
        description: 'Upload your profile picture and relevant documents.',
        fields: [
            // --- Async File Upload Example ---
            {
                type: 'file',
                name: 'profilePictures',
                label: 'Profile Pictures (Async Upload)',
                validation: { required: 'At least one profile picture is required.' },
                fileConfig: {
                    accept: 'image/png, image/jpeg, image/gif',
                    multiple: true,
                    preview: true,
                    async: false,
                    uploadUrl: '/api/v1/files/upload-image', // API endpoint to handle immediate upload
                    deleteUrl: (fileIdentifier: string) => `/api/v1/files/delete/${fileIdentifier}`, // API to call on removal
                },
            },
            // --- Sync File Upload Example ---
            {
                type: 'file',
                name: 'resume',
                label: 'Resume (Upload with Form)',
                fileConfig: {
                    accept: '.pdf,.doc,.docx',
                    multiple: false,
                    preview: true, // For non-image/video, this shows the file name
                    async: false, // The file will be submitted with the main form data
                },
            },
        ],
    },
];
