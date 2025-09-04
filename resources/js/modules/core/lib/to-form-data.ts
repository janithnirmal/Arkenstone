/**
 * Converts a plain JavaScript object into a FormData object.
 * This is essential for sending multipart/form-data requests (i.e., with file uploads).
 * It correctly handles nested arrays by appending `[]` to the key name.
 *
 * @param obj - The object to convert.
 * @returns A FormData instance representing the object.
 */
export const toFormData = (obj: Record<string, any>): FormData => {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
        // Skip null or undefined values
        if (value === null || value === undefined) {
            return;
        }

        // If the value is an array, append each item individually.
        // This creates keys like `categories[]`, `images[]`, etc., which PHP expects.
        if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(`${key}[]`, item);
            });
        } else {
            // Otherwise, just append the plain value.
            formData.append(key, value);
        }
    });

    return formData;
};
