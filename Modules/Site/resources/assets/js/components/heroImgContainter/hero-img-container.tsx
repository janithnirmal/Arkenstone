import React from "react";

type HeroImgContainerProps = {
    imagePath?: string;
    alt?: string;
    className?: string;
};

export default function HeroImgContainer({
    imagePath = "/storage/hero/new_collection/photo.svg",
    alt = "Overlay",
    className = "",
}: HeroImgContainerProps) {
    return (
        <div className={`relative flex h-full items-center justify-center overflow-visible ${className}`}>
            <div
                role="img"
                aria-label="ash square rotated"
                className="w-3/4 aspect-square bg-gray-300 transform rotate-45 origin-center"
            />
            <div
                role="img"
                aria-label="white square"
                className="absolute w-3/5 aspect-square bg-white border border-gray-200 z-10 shadow-xm transform -rotate-45 origin-center"
            />
            <img
                src={imagePath}
                alt={alt}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5/6 aspect-square z-20 object-cover"
            />
        </div>
    );
}