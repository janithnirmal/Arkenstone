import React, { useEffect, useState } from "react";

type CubeSliderProps = {
    images?: string[];
    size?: number;
    duration?: number;
};

const CubeSlider = ({ images = [], size = 200, duration = 3000 }: CubeSliderProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev - 90);
    }, duration);
    return () => clearInterval(interval);
  }, [duration]);

  const translateZ = size/2.7;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ 
        width: size, 
        height: size,
        perspective: '1000px'
      }}
    >
      <div
        className="absolute w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${images[0]})`,
            transform: `translateZ(${translateZ}px)`,
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Right */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${images[1 % images.length]})`,
            transform: `rotateY(90deg) translateZ(${translateZ}px)`,
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Back */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${images[2 % images.length]})`,
            transform: `rotateY(180deg) translateZ(${translateZ}px)`,
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Left */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${images[3 % images.length]})`,
            transform: `rotateY(270deg) translateZ(${translateZ}px)`,
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  );
};

export default CubeSlider;
