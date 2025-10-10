# Dynamic Form Generator for React

A fully dynamic, modular, and highly configurable form generator for modern React applications. Built with TypeScript, Tailwind CSS, and powered by React Hook Form for robust state management and validation.

This component allows you to generate complex, multi-step forms from a single configuration object, complete with automatic API handling, advanced validation, and extensive customization options.

## Table of Contents

1.  [Key Features](#key-features)
2.  [Installation & Setup](#installation--setup)
    - [Dependencies](#dependencies)
    - [File Structure](#file-structure)
3.  [Basic Usage](#basic-usage)
4.  [The `options` Prop: The Core of Configuration](#the-options-prop-the-core-of-configuration)
    - [Top-Level Configuration](#top-level-configuration)
    - [Step Configuration (`StepConfig`)](#step-configuration-stepconfig)
    - [Field Configuration (`FieldConfig`)](#field-configuration-fieldconfig)
    - [Input Group Configuration (`GroupConfig`)](#input-group-configuration-groupconfig)
5.  [Advanced Features](#advanced-features)
    - [File Uploads (`FileUploadConfig`)](#file-uploads-fileuploadconfig)
    - [Injecting Custom Components](#injecting-custom-components)
    - [Validation](#validation)
6.  [API Integration](#api-integration)
7.  [Full Example](#full-example)

## Key Features

- **100% Configurable:** Define your entire form, including steps, fields, validation, and API endpoints, in a single TypeScript/JavaScript object.
- **Multi-Step Forms:** Easily create wizard-style forms with a progress bar and navigation.
- **Rich Input Support:** Out-of-the-box support for `text`, `textarea`, `email`, `password`, `select`, `radio`, `checkbox`, `range`, and `file` inputs.
- **Advanced File Uploads:** Includes sync/async uploads, file type validation, image/video previews, and remote file deletion.
- **Automatic API Handling:** Integrates seamlessly with your API, automatically setting `multipart/form-data` for file uploads and handling success/error states.
- **Powerful Validation:** Built-in, per-field validation powered by `react-hook-form`, with support for custom error messages.
- **Extensible & Customizable:** Replace default inputs with your own custom components for unique behaviors and fully control the styling with Tailwind CSS utility classes.
- **Input Grouping:** Group related fields together with optional toggle functionality.
- **Interaction Tracking:** A built-in observer logs user interactions like clicks and input changes.

## Installation & Setup

### Dependencies

You will need the provided API handler (`api.ts`) integrated into your project (Custom API Handlers developed by Arkenstone).

## Basic Usage

Import the `DynamicFormGenerator` and pass it your configuration `options` object.

```tsx
// src/pages/MyFormPage.tsx
import DynamicFormGenerator from '../components/form-generator/DynamicFormGenerator';
import { DynamicFormGeneratorOptions } from '../components/form-generator/types';

const myFormOptions: DynamicFormGeneratorOptions = {
    endpoint: '/api/v1/contact',
    title: 'Contact Us',
    steps: [
        {
            title: 'Your Information',
            fields: [
                {
                    type: 'text',
                    name: 'fullName',
                    label: 'Full Name',
                    validation: { required: 'Please enter your name.' },
                },
                {
                    type: 'email',
                    name: 'email',
                    label: 'Email Address',
                    validation: { required: 'An email is required.' },
                },
            ],
        },
    ],
};

const MyFormPage = () => {
    return (
        <div className="container mx-auto py-10">
            <DynamicFormGenerator options={myFormOptions} />
        </div>
    );
};

export default MyFormPage;
```

## The `options` Prop: The Core of Configuration

The `options` prop (`DynamicFormGeneratorOptions`) is a single object that defines everything about your form.

### Top-Level Configuration

| Property           | Type                                    | Description                                                                                              |
| ------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `endpoint`         | `string`                                | **Required.** The API endpoint where the form data will be submitted.                                    |
| `title`            | `string`                                | The main title of the form, displayed at the top.                                                        |
| `description`      | `string`                                | A subtitle or description displayed below the title.                                                     |
| `method`           | `'POST'` \| `'PUT'`                     | The HTTP method for submission. Defaults to `POST`. Automatically becomes `POST` if files are detected.  |
| `submitButtonText` | `string`                                | Custom text for the final submit button. Defaults to "Submit".                                           |
| `formClassName`    | `string`                                | Tailwind CSS classes to apply to the main form container `div`.                                          |
| `onInteraction`    | `(fieldName, eventType, value) => void` | Callback function that fires on any field `click` or `change` event. Useful for analytics.               |
| `onSuccess`        | `(data) => void`                        | Callback function that fires after a successful API submission. Receives the data from the API response. |
| `onError`          | `(error) => void`                       | Callback function that fires if the API submission fails. Receives the error object.                     |
| `steps`            | `StepConfig[]`                          | **Required.** An array of step objects. A form must have at least one step.                              |

### Step Configuration (`StepConfig`)

Each object in the `steps` array defines a page or section of your form.

| Property      | Type                             | Description                                                                   |
| ------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| `title`       | `string`                         | **Required.** The title of the step, displayed above the fields.              |
| `description` | `string`                         | An optional description for the step.                                         |
| `fields`      | `(FieldConfig \| GroupConfig)[]` | **Required.** An array of field or group configuration objects for this step. |

### Field Configuration (`FieldConfig`)

This object defines a single input field.

| Property           | Type                                 | Description                                                                                                                                           |
| ------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`             | `string`                             | **Required.** The type of input. Supported: `text`, `textarea`, `select`, `radio`, `checkbox`, `range`, `file`, `email`, `password`, `number`, `url`. |
| `name`             | `string`                             | **Required.** A unique identifier for the field. This will be the key in the final form data object.                                                  |
| `label`            | `string`                             | **Required.** The user-facing label for the input.                                                                                                    |
| `placeholder`      | `string`                             | Placeholder text for text-based inputs and the default "empty" option for selects.                                                                    |
| `defaultValue`     | `any`                                | A default value to pre-populate the field.                                                                                                            |
| `options`          | `{ value: string; label: string }[]` | An array of options, used for `select` and `radio` inputs.                                                                                            |
| `validation`       | `RegisterOptions`                    | A validation object from `react-hook-form`. See the [Validation](#validation) section.                                                                |
| `component`        | `React.ComponentType<any>`           | A custom React component to render instead of the default input. See [Injecting Custom Components](#injecting-custom-components).                     |
| `className`        | `string`                             | Tailwind CSS classes to apply directly to the `<input>`, `<select>`, or `<textarea>` element.                                                         |
| `wrapperClassName` | `string`                             | Tailwind CSS classes to apply to the `div` that wraps the label, input, and error message. Useful for grid layouts.                                   |
| `fileConfig`       | `FileUploadConfig`                   | A configuration object for fields where `type` is `'file'`. See the [File Uploads](#file-uploads-fileuploadconfig) section.                           |

### Input Group Configuration (`GroupConfig`)

This object allows you to group multiple fields under a common heading.

| Property     | Type            | Description                                                                                 |
| ------------ | --------------- | ------------------------------------------------------------------------------------------- |
| `isGroup`    | `true`          | **Required.** A flag to identify this object as a group.                                    |
| `label`      | `string`        | **Required.** The title of the group.                                                       |
| `name`       | `string`        | **Required.** The name for the toggle checkbox in the form state (if `toggleable` is true). |
| `toggleable` | `boolean`       | If `true`, a checkbox is added to enable/disable all fields within the group.               |
| `fields`     | `FieldConfig[]` | **Required.** An array of `FieldConfig` objects to be rendered inside the group.            |
| `className`  | `string`        | Tailwind CSS classes to apply to the group's container `div`.                               |

## Advanced Features

### File Uploads (`FileUploadConfig`)

For fields with `type: 'file'`, you must provide a `fileConfig` object.

| Property    | Type                     | Description                                                                                                                                                                  |
| ----------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accept`    | `string`                 | A string of accepted file types (MIME types), e.g., `'image/png, image/jpeg'`.                                                                                               |
| `multiple`  | `boolean`                | If `true`, the user can select multiple files.                                                                                                                               |
| `preview`   | `boolean`                | If `true`, previews will be shown for selected files. Works visually for images/videos and shows the filename for other types.                                               |
| `async`     | `boolean`                | **Key property.** If `true`, files are uploaded immediately upon selection to the `uploadUrl`. If `false`, files are bundled and sent with the main form submission.         |
| `uploadUrl` | `string`                 | The API endpoint to handle immediate file uploads when `async` is `true`. The API should return a JSON object with a URL identifier (e.g., `{ "url": "path/to/file.png" }`). |
| `deleteUrl` | `(id: string) => string` | A function that returns the API endpoint to call when a user removes an `async`-uploaded file. It receives the file's URL or identifier as an argument.                      |

### Injecting Custom Components

You can replace any default input with your own custom component by providing it to the `component` property. Your custom component will receive the entire `fieldConfig` object as a prop.

```tsx
// src/components/MyCustomInput.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

// The component receives the entire field config as a prop
const MyCustomInput = ({ fieldConfig }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const { name, label, validation } = fieldConfig;
    const error = errors[name];

    return (
        <div>
            <label className="font-bold text-blue-600">{label}</label>
            <input {...register(name, validation)} className="border-2 border-blue-200 p-2" />
            {error && <p className="text-red-500">{error.message}</p>}
        </div>
    );
};

// In your form options:
const field: FieldConfig = {
    type: 'text', // Base type
    name: 'customField',
    label: 'My Custom Field',
    component: MyCustomInput, // Inject the component
};
```

### Validation

The `validation` property accepts a `react-hook-form` `RegisterOptions` object. For full details, please refer to the [official react-hook-form documentation](https://react-hook-form.com/api/useform/register).

Here are the most common validation rules:

```ts
validation: {
    required: 'This field is mandatory.', // Can be a boolean or a string for the error message
    minLength: {
        value: 8,
        message: 'Password must be at least 8 characters long.'
    },
    maxLength: {
        value: 50,
        message: 'Cannot exceed 50 characters.'
    },
    pattern: {
        value: /^\S+@\S+$/i,
        message: 'Invalid email format.'
    },
    min: {
        value: 18,
        message: 'You must be at least 18 years old.'
    },
    max: {
        value: 99,
        message: 'Age must be less than 100.'
    }
}
```

## API Integration

- **Submission:** The form automatically handles the `POST` or `PUT` request to the specified `endpoint`.
- **Multipart Handling:** If any `file` input is detected (especially a sync upload), the form will automatically set the `Content-Type` header to `multipart/form-data` and construct a `FormData` object.
- **Callbacks:** Use the `onSuccess` and `onError` callbacks to handle the API response without needing to manage the API call yourself. The component uses the provided API handler which should be configured to display toast notifications or other global error messages.

## Full Example

This example demonstrates a complex, three-step form showcasing most of the generator's features.

```tsx
import { DynamicFormGeneratorOptions } from '../components/form-generator/types';
import CustomStyledInput from '../components/form-generator/examples/CustomStyledInput'; // A custom component you created

export const userRegistrationFormOptions: DynamicFormGeneratorOptions = {
    title: 'Advanced User Registration',
    description: 'A multi-step form with advanced features.',
    endpoint: '/api/v1/users/register',
    submitButtonText: 'Create My Account',
    onSuccess: (data) => alert('Form submitted successfully!'),
    steps: [
        // --- STEP 1: Personal Details ---
        {
            title: 'Personal Details',
            fields: [
                {
                    type: 'text',
                    name: 'fullName',
                    label: 'Full Name',
                    validation: { required: 'Full name is required.' },
                },
                {
                    type: 'email',
                    name: 'emailAddress',
                    label: 'Email Address',
                    validation: { required: 'Email is required.', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format.' } },
                },
            ],
        },
        // --- STEP 2: Preferences & Grouping ---
        {
            title: 'Preferences & Details',
            fields: [
                {
                    type: 'select',
                    name: 'role',
                    label: 'Primary Role',
                    options: [
                        { value: 'developer', label: 'Developer' },
                        { value: 'designer', label: 'Designer' },
                    ],
                    validation: { required: 'Please select a role.' },
                },
                {
                    isGroup: true,
                    label: 'Shipping Address (Optional)',
                    name: 'shippingAddressEnabled',
                    toggleable: true,
                    fields: [
                        { type: 'text', name: 'addressLine1', label: 'Address Line 1' },
                        { type: 'text', name: 'city', label: 'City' },
                    ],
                },
            ],
        },
        // --- STEP 3: File Uploads ---
        {
            title: 'File Uploads',
            fields: [
                {
                    type: 'file',
                    name: 'profilePicture',
                    label: 'Profile Picture (Async Upload)',
                    fileConfig: {
                        accept: 'image/png, image/jpeg',
                        multiple: false,
                        preview: true,
                        async: true,
                        uploadUrl: '/api/v1/files/upload-image',
                        deleteUrl: (fileId) => `/api/v1/files/delete/${fileId}`,
                    },
                },
            ],
        },
    ],
};
```
