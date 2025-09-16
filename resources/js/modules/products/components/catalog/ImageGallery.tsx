// resources/js/modules/products/components/catalog/ImageGallery.tsx

import React from 'react';
import { ProductImage } from '../../types';

interface Props {
    images: ProductImage[];
    productName: string;
    selectedImage: ProductImage | null;
    onSelectImage: (image: ProductImage) => void;
}

const ImageGallery: React.FC<Props> = ({ images, productName, selectedImage, onSelectImage }) => {
    if (!images || images.length === 0) {
        return <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg flex items-center justify-center"><p>No Image</p></div>;
    }

    return (
        <div>
            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={selectedImage?.url || 'https://via.placeholder.com/600'}
                    alt={productName}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            {/* Thumbnail Grid */}
            <div className="mt-4 grid grid-cols-5 gap-4">
                {images.map(image => (
                    <button
                        key={image.id}
                        onClick={() => onSelectImage(image)}
                        className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden transition-all duration-150
                            ${selectedImage?.id === image.id ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:opacity-80'}`}
                    >
                        <img src={image.url} alt={`Thumbnail for ${productName}`} className="h-full w-full object-cover object-center" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;