import React, { useRef, useEffect, useState } from "react";
import CubeSlider from "../cube-slider/cube-slider";

type HeroImgContainerProps = {
    images?: string[];
    alt?: string;
    className?: string;
};

export default function HeroImgContainer({
    images = [
        "/storage/hero/new_collection/photo.svg"
    ],
    alt = "Overlay",
    className = "",
}: HeroImgContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cubeSize, setCubeSize] = useState(280);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setCubeSize(width * 0.75); // 75% of container width
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
            <div ref={containerRef} className="relative w-full aspect-square max-w-md lg:max-w-xl flex items-center justify-center overflow-hidden">
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 -rotate-45
                               w-[70%] aspect-square z-10"
                />
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-sm -rotate-45
                               w-[60%] aspect-square z-20"
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                    <CubeSlider images={images} size={cubeSize} duration={2500} />
                </div>
            </div>
        </div>
    );
}