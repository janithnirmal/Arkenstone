// resources/js/modules/products/components/shared/ImageCarousel.tsx

import React, { useState } from 'react';
import { Swiper as SwiperClass } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// Import required Swiper modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ProductImage } from '../../types';

interface Props {
    images: ProductImage[];
    productName: string;
}

const ImageCarousel: React.FC<Props> = ({ images, productName }) => {
    // State to hold the thumbnail Swiper instance
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    if (!images || images.length === 0) {
        return <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg flex items-center justify-center"><p>No Image Available</p></div>;
    }

    return (
        <div>
            {/* Main Image Swiper */}
            <Swiper
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2 h-96 w-full rounded-lg bg-gray-100"
            >
                {images.map(image => (
                    <SwiperSlide key={`main-${image.id}`}>
                        <img src={image.url} alt={productName} className="h-full w-full object-contain" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnail Gallery Swiper */}
            <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper mt-4 h-24"
            >
                {images.map(image => (
                    <SwiperSlide key={`thumb-${image.id}`} className="cursor-pointer rounded-lg overflow-hidden opacity-50 hover:opacity-100 swiper-slide-thumb-active:opacity-100">
                         <img src={image.url} alt={`Thumbnail for ${productName}`} className="h-full w-full object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageCarousel;