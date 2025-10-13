// resources/js/lib/api.js
import axios from 'axios';
import { toast } from 'sonner';
import Config from '../config';

const api = axios.create({
    baseURL: `/api/${Config.apiVersion}`, // Optional if you prefix all endpoints
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export interface ApiOptions {
    data?: any;
    params?: any;
    headers?: any;
    displayError?: boolean;
    displaySuccess?: boolean;
    isMultipart?: boolean;
    isDownload?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}
const request = async (method: string, url: string, options: ApiOptions = {}) => {
    const { data = {}, params = {}, headers = {}, displayError = true, displaySuccess = false, isMultipart = false, onSuccess, onError } = options;

    try {
        const config = {
            method,
            url,
            params,
            data,
            headers: {
                ...headers,
                ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}),
            },
        };

        // add data as params if request is GET
        if (method === 'get') {
            config.params = {
                ...params,
                ...data,
            };
        }

        const res: any = await api(config);
        const { status, message, errors }: { status: string; message?: string; errors?: any } = res.data;
        let responseData = res.data?.data ?? null;

        if (status !== 'success') {
            if (displayError) toast.error(errors || message || 'Something went wrong');
            onError?.(errors);
            throw { message, errors };
        }

        if (displaySuccess && (errors || message)) {
            toast.success(errors || message);
        }

        onSuccess?.(responseData); // Call the onSuccess callback if it exists

        return responseData;
    } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Request failed';
        const errs = err?.response?.data?.errors || {};
        let errStr = '';
        if (errs && errs.length && typeof errs === 'object') {
            errs.forEach((error: any) => {
                errStr += error + '\n';
            });
        }
        if (displayError) toast.error(errStr || msg);
        onError?.(errs); // Call the onError callback if it exists
        throw { message: msg, errors: errs };
    }
};

export const apiGet = (url: string, options?: ApiOptions) => request('get', url, options);
export const apiPost = (url: string, options?: ApiOptions) => request('post', url, options);
export const apiPut = (url: string, options?: ApiOptions) => request('put', url, options);
export const apiDelete = (url: string, options?: ApiOptions) => request('delete', url, options);
