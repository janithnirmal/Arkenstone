import ProductCard from '@/core/components/shop/product-card/simple-card';
import { apiGet } from '@/core/lib/api';
import { Product } from '@/core/types';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type ProductCarousalOptions = {
    category_id?: number;
    category_ids?: number[];
    search?: string;
};

export default function ProductCarousal({ options }: { options: ProductCarousalOptions }) {
    const [products, setProducts] = useState<Product[]>([]);

    const data = {
        category_id: options.category_id,
        category_ids: options.category_ids ?? [],
        search: options.search ?? '',
    };

    useEffect(() => {
        apiGet('/product', {
            data,
        }).then((res) => {
            setProducts(res);
        });
    }, []);

    return (
        <div className="h-max w-full pt-5">
            <Swiper
                modules={[Autoplay]}
                // effect={'coverflow'}
                // coverflowEffect={{
                //     rotate: 0,
                //     stretch: 0,
                //     depth: 400,
                //     modifier: 0.5,
                //     slideShadows: false,
                // }}
                grabCursor={true}
                centeredSlides={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    waitForTransition: true,
                }}
                loop={true}
                slidesPerView={'auto'}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="h-full basis-1/1 md:basis-1/2 lg:basis-1/3">
                        <div className="w-max mx-auto">
                            <ProductCard data={product} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
