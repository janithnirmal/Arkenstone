import Search from '@site/components/search/search';
import TextAdvantPro from '@site/components/text/text-AdvantPro';
import { Button } from '@site/components/button/default-button';
import { ArrowRight } from 'lucide-react';
import HeroImgContainer from '@site/components/heroImgContainter/hero-img-container';
import CubeSlider from '@site/components/cube-slider/cube-slider';

export default function HeroSection() {
    return (
       <div className='container mx-auto flex flex-col lg:flex-row lg:h-[93vh] lg:max-h-[1080px]'>
            <div className='flex-1 flex flex-col justify-between items-center text-center lg:items-start lg:text-start py-10 px-5 lg:px-0 lg:gap-20 gap-5'>
                <Search />
                <div className="flex flex-col lg:gap-8 gap-2 lg:flex-col-reverse items-center text-center lg:items-start lg:text-start">
{/* 
                    <div className='flex flex-col gap-5'>
                        <span className='text-6xl lg:text-9xl'>MOM TEX</span>
                        <span className='uppercase text-4xl'>Mom makes your life wow</span>
                    </div> */}
                    <div className='flex gap-1 flex-col lg:gap-2 gap-2'>
                        <img src="/storage/hero/MOM TEX.png" alt="Hero Image"  />
                        <img src="/storage/hero/MOM MAKES YOUR LIFE WOW.png" alt="Hero Image"  />
                    </div>

                    <div className='lg:w-1/2'>
                        <TextAdvantPro size="4xl" weight="bold" className="lg:text-6xl text-2xl">NEW COLLECTION</TextAdvantPro>
                    </div>
                </div>
                <div className='flex-1 flex items-center lg:justify-start justify-center'>
                    <Button size={"large"} rightIcon={<ArrowRight />} className='gap-30'>
                        Shop Now
                    </Button>
                </div>
            </div>
            <div className='flex-1 flex'>
                <HeroImgContainer
                    images={[
                        "/storage/hero/new_collection/photo.svg",
                        "/storage/hero/new_collection/photo.svg",
                        "/storage/hero/new_collection/photo.svg",
                        "/storage/hero/new_collection/photo.svg"
                    ]}
                />
            </div>
       </div>
    );
}


// I will delete this later 
//  <div className="container mx-auto flex flex-col lg:flex-row  h-[93vh] max-h-[1080px]">
//             <div className="flex-1 flex flex-col justify-between py-10">
//                 <Search />

//                 <div className='flex flex-col items-center text-center lg:items-start lg:text-start gap-20'>
//                     <h1 className='font-semibold text-2xl lg:text-6xl'>NEW <br /> COLLECTION</h1>
//                     <div className='flex gap-1 flex-col gap-5'>
//                         <span className='text-6xl lg:text-9xl'>MOM TEX</span>
//                         <span className='uppercase text-4xl'>Mom makes your life wow</span>
//                     </div>
//                 </div>

//                 <Button className='w-max' size={'large'}>Shop Now</Button>
//             </div>
//             <div className="flex-1 w-full ">
//                 <HeroImgContainer imagePath="/storage/hero/new_collection/photo.svg" />
//             </div>
//         </div>

{/* <div className="container mx-auto flex lg:min-h-[80vh] flex-col px-5 py-5 bg-white">
            <div className='flex w-full'>
                <div className='lg:w-1/2 flex-1 h-full lg:min-h-[80vh] px-10 space-y-10 flex flex-col'>
                    <Search />
                    <div className='lg:w-1/2'>
                        <TextAdvantPro size="4xl" weight="bold" className="lg:text-7xl">NEW COLLECTION</TextAdvantPro>
                    </div>
                    <div>
                        <img src="/storage/hero/MOM TEX.png" alt="Hero Image" className='lg:w-3/4' />
                        <img src="/storage/hero/MOM MAKES YOUR LIFE WOW.png" alt="Hero Image" className='lg:w-3/4 mt-5' />
                    </div>
                    <div className='flex-1 flex items-center '>
                        <Button size={"large"} rightIcon={<ArrowRight />} className='gap-30'>Button</Button>
                    </div>
                </div>
                <div className='lg:w-1/2 px-5 space-y-10'>
                    <HeroImgContainer imagePath="/storage/hero/new_collection/photo.svg" />
                </div>
            </div>
        </div> */}