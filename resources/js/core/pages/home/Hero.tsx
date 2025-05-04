
import Button from '@/components/custom/button';
import { Link } from '@inertiajs/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Hero() {
    const slides = [
        {
            image: 'https://picsum.photos/seed/1231/1000/600',
            title: 'Summer Vibes',
            description: 'Get ready for the sunniest season with our latest collection.',
            button: 'Shop Summer',
            url: '/shop',
        },
        {
            image: 'https://picsum.photos/seed/1232/1000/600',
            title: 'New Arrivals',
            description: 'Discover the freshest styles to upgrade your wardrobe.',
            button: 'Explore Now',
            url: '/shop',
        },
        {
            image: 'https://picsum.photos/seed/1233/1000/600',
            title: 'Trendy Essentials',
            description: 'Elevate your everyday look with our must-have pieces.',
            button: 'Shop Essentials',
            url: '/shop',
        },
        {
            image: 'https://picsum.photos/seed/1234/1000/600',
            title: 'Sale Alert',
            description: "Don't miss out on our limited-time offers and discounts.",
            button: 'Shop Sale',
            url: '/shop',
        },
    ];

    return (
        <section className="bg-muted h-[90vh] w-full">
            <div className="h-full w-full">
                <Swiper
                    className="h-full w-full"
                    modules={[Autoplay]}
                    grabCursor={false}
                    centeredSlides={true}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        waitForTransition: true,
                    }}
                    loop={true}
                    slidesPerView={1}
                    spaceBetween={0}
                    navigation={false}
                    pagination={false}
                    scrollbar={false}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative flex h-full w-full">
                                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}></div>
                                <div className="absolute top-0 left-0 h-full w-full bg-black/50"></div>
                                <div className="absolute flex flex-col items-center justify-center h-full w-full">
                                    <h1 className="lg:text-4xl text-lg font-bold text-white">{slide.title}</h1>
                                    <p className="lg:text-xl text-sm text-center text-white">{slide.description}</p>
                                    <Link href={slide.url}>
                                        <Button variant="secondary" className="mt-4 rounded-full">{slide.button}</Button>
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
