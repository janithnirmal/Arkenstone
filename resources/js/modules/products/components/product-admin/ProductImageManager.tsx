// resources/js/modules/products/components/product-admin/ProductImageManager.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { productService } from '../../services/productService';
import { Product } from '../../types';

interface Props {
    product: Product;
    onSuccess: () => void; // Callback to refresh the product data
}

// Enhance the File type to include a preview property
interface FileWithPreview extends File {
    preview: string;
}

const ProductImageManager: React.FC<Props> = ({ product, onSuccess }) => {
    const [newFiles, setNewFiles] = useState<FileWithPreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Create previews for the accepted files
        const filesWithPreviews = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setNewFiles(prev => [...prev, ...filesWithPreviews]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    });

    // Cleanup previews to avoid memory leaks
    useEffect(() => {
        return () => newFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }, [newFiles]);

    const removeNewFile = (fileToRemove: FileWithPreview) => {
        setNewFiles(prev => prev.filter(file => file !== fileToRemove));
    };

    const handleUpload = async () => {
        if (newFiles.length === 0) return;
        setIsUploading(true);
        try {
            await productService.uploadProductImages(product.id, newFiles);
            setNewFiles([]); // Clear the new files list
            onSuccess(); // Refresh the parent component's data
        } catch (error) {
            console.error("Failed to upload images", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteExisting = async (imageId: number) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await productService.deleteProductImage(imageId);
                onSuccess(); // Refresh
            } catch (error) {
                console.error("Failed to delete image", error);
            }
        }
    };

    return (
        <div className="space-y-6 pt-4 border-t">
            {/* Dropzone UI */}
            <div
                {...getRootProps()}
                className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
            >
                <input {...getInputProps()} />
                {isDragActive ?
                    <p className="text-blue-600">Drop the files here ...</p> :
                    <p className="text-gray-600">Drag & drop some files here, or click to select files</p>
                }
            </div>

            {/* Preview and Upload Section */}
            {newFiles.length > 0 && (
                <div>
                    <h4 className="font-medium text-gray-800">New Images to Upload</h4>
                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {newFiles.map((file, index) => (
                            <div key={index} className="relative group">
                                <img src={file.preview} alt={`Preview ${file.name}`} className="h-24 w-24 object-cover rounded-md" />
                                <button
                                    onClick={() => removeNewFile(file)}
                                    className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                     <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="btn-primary mt-4 w-full sm:w-auto"
                    >
                        {isUploading ? 'Uploading...' : `Upload ${newFiles.length} Image(s)`}
                    </button>
                </div>
            )}

            {/* Existing Images Section */}
            <div>
                 <h4 className="font-medium text-gray-800">Existing Images</h4>
                 {product.images.length > 0 ? (
                     <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                         {product.images.map(image => (
                             <div key={image.id} className="relative group">
                                 <img src={image.url} alt={`Product image ${image.id}`} className="h-24 w-24 object-cover rounded-md border" />
                                 <button
                                     onClick={() => handleDeleteExisting(image.id)}
                                     className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                 </button>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <p className="text-sm text-gray-500 mt-2">No images have been uploaded for this product yet.</p>
                 )}
            </div>
        </div>
    );
};

export default ProductImageManager;