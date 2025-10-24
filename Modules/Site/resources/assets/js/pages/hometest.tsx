import { Head } from '@inertiajs/react';
import PageLayout from '@site/layouts/page-layout';
import HeroSection from './home/hero-section';

export default function Home() {
    return (
        <PageLayout>
            <Head title="Home" />
<<<<<<< HEAD
            <div className="container mx-auto flex min-h-[80vh] flex-col px-5 py-5 bg-background">
                <div className='flex w-full'>
                    <div className='w-1/2 flex-1 h-full min-h-[80vh] px-10 space-y-10 flex flex-col'>
                        <Search />
                        <div className='w-1/2'>
                            <TextAdvantPro size="7xl" weight='bold'>NEW COLLECTION</TextAdvantPro>
                        </div>
                        <div>
                            <img src="/storage/hero/MOM TEX.png" alt="Hero Image" className='w-3/4' />
                            <img src="/storage/hero/MOM MAKES YOUR LIFE WOW.png" alt="Hero Image" className='w-3/4 mt-5' />
                        </div>
                        <div className='flex-1 flex items-center '>
                            <Button size={"large"} rightIcon={<ArrowRight />} className='gap-30'>Button</Button>
                        </div>
                    </div>
                    <div className='w-1/2 px-5 space-y-10'>
                        <HeroImgContainer imagePath="/storage/hero/new_collection/photo.svg" />
                    </div>
                </div>
            </div>
=======
            <HeroSection />
>>>>>>> d6bc4c01937cdf45a638acd8326780a29529c909
        </PageLayout>
    );
}
