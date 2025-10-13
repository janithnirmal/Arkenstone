import { useState } from 'react';

import { apiDelete, apiPost } from '@core/lib/api';
import { FieldConfig } from '../types';

interface FileUploadProps {
    fieldConfig: FieldConfig;
    onFileChange: (files: File[] | string[] | File | string | null) => void;
    onInteraction?: (fieldName: string, eventType: 'click' | 'change', value: any) => void;
}

interface FilePreview {
    id: string;
    url: string;
    name: string;
    type: 'image' | 'video' | 'other';
    isUploaded: boolean;
    fileObject?: File;
}

const FileUpload: React.FC<FileUploadProps> = ({ fieldConfig, onFileChange, onInteraction }) => {
    const { name, fileConfig } = fieldConfig;
    const [previews, setPreviews] = useState<FilePreview[]>([]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        if (fileConfig?.async && fileConfig.uploadUrl) {
            // Async upload logic
            const uploadedUrls: string[] = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append(fileConfig.formKey ?? 'file', file);
                try {
                    const response = await apiPost(fileConfig.uploadUrl, { data: formData, isMultipart: true });
                    uploadedUrls.push(response.url); // Assuming API returns { url: '...' }
                    console.log(response);

                    setPreviews((prev) => [
                        ...prev,
                        {
                            id: response.url,
                            url: response.url,
                            name: file.name,
                            type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'other',
                            isUploaded: true,
                        },
                    ]);
                } catch (error) {
                    console.error('Async upload failed', error);
                }
            }
            onFileChange(fileConfig.multiple ? uploadedUrls : uploadedUrls[0]);
        } else {
            // Sync (normal) upload logic
            const newPreviews = files.map((file) => ({
                id: URL.createObjectURL(file),
                url: URL.createObjectURL(file),
                name: file.name,
                type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'other',
                isUploaded: false,
                fileObject: file,
            }));
            setPreviews(fileConfig?.multiple ? ([...previews, ...newPreviews] as FilePreview[]) : (newPreviews as FilePreview[]));
            const fileObjects = newPreviews.map((p) => p.fileObject).filter(Boolean) as File[];
            onFileChange(fileConfig?.multiple ? fileObjects : fileObjects[0]);
        }
    };

    const handleRemove = async (idToRemove: string) => {
        const fileToRemove = previews.find((p) => p.id === idToRemove);
        if (!fileToRemove) return;

        if (fileToRemove.isUploaded && fileConfig?.async && fileConfig.deleteUrl) {
            try {
                await apiDelete(fileConfig.deleteUrl);
            } catch (error) {
                console.error('Failed to delete remote file', error);
            }
        }

        const updatedPreviews = previews.filter((p) => p.id !== idToRemove);
        setPreviews(updatedPreviews);

        // Update form state
        if (fileConfig?.async) {
            const remainingUrls = updatedPreviews.map((p) => p.url);
            onFileChange(fileConfig.multiple ? remainingUrls : remainingUrls[0] || null);
        } else {
            const remainingFiles = updatedPreviews.map((p) => p.fileObject).filter(Boolean) as File[];
            onFileChange(fileConfig?.multiple ? remainingFiles : remainingFiles[0] || null);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept={fileConfig?.accept}
                multiple={fileConfig?.multiple}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {fileConfig?.preview && previews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {previews.map((p) => (
                        <div key={p.id} className="group relative">
                            {p.type === 'image' && (
                                <img src={p.url} alt={p.name} className="bg-background/50 h-64 w-full rounded-md object-contain shadow-lg" />
                            )}
                            {p.type === 'video' && <video src={p.url} className="h-24 w-full rounded-md object-cover" controls />}
                            {p.type === 'other' && (
                                <div className="flex h-24 w-full items-center justify-center rounded-md bg-gray-100 p-2">
                                    <p className="truncate text-center text-xs">{p.name}</p>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemove(p.id)}
                                className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
