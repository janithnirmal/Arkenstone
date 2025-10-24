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
        <div className={`relative overflow-visible flex ${className}`}>
            <div className="w-full flex h-full items-center justify-center  relative flex bg-red-500">
                {/* <div className="relative flex justify-center items-center bg-orange-500">
                    <div
                        className="absolute w-70 h-70 aspect-square bg-gray-300 -rotate-45"
                    />
                    <div
                        className=" absolute -rotate-45 w-50 h-50 aspect-square bg-white border-gray-200 shadow-xm"
                    />
                </div> */}
                {/* <img
                    src={imagePath}
                    alt={alt}
                    className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5/6 aspect-square z-20 object-cover"
                /> */}
            </div>
        </div>
    );
}