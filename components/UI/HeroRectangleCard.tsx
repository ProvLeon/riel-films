"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const RectangleCard = () => {
  const [images, setImages] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const imageOptions = [
    "/images/hero/hero1.jpg",
    "/images/hero/hero2.jpg",
    "/images/hero/hero3.jpg",
    "/images/hero/hero4.jpg",
    "/images/hero/hero5.jpg",
    "/images/hero/hero6.jpg",
    "/images/hero/hero7.jpg",
    "/images/hero/hero8.jpg",
    "/images/hero/hero9.jpg",
    "/images/hero/hero10.jpg",
    "/images/hero/hero11.jpg",
    "/images/hero/hero12.jpg",
  ];

  // Function to get random image from imageOptions
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageOptions.length);
    return imageOptions[randomIndex];
  };

  // Initialize random images on first render
  useEffect(() => {
    const randomImages = Array(3).fill("").map(() => getRandomImage());
    setImages(randomImages);
  }, []);

  // Handle resize events to make component responsive
  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;

      // Responsive sizing based on viewport width
      if (vw >= 1280) { // xl
        setDimensions({ width: 70, height: 300 });
      } else if (vw >= 1024) { // lg
        setDimensions({ width: 70, height: 250 });
      } else if (vw >= 768) { // md
        setDimensions({ width: 60, height: 200 });
      } else if (vw >= 640) { // sm
        setDimensions({ width: 50, height: 150 });
      } else { // xs
        setDimensions({ width: 40, height: 120 });
      }
    };

    // Set dimensions on mount
    updateDimensions();

    // Add event listener
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute z-10 hidden md:block top-0 right-0 transform translate-y-2/4 translate-x-1/4 sm:-top-[350px] md:-top-[450px] lg:-top-[550px] xl:-top-[695px]"
    >
      <div
        className={`border border-film-red-900 border-8 overflow-hidden bg-white transform -rotate-[40deg] right-0 relative top-0`}
        style={{
          width: `${dimensions.width}%`,
          height: `${dimensions.height}px`,
        }}
      >
        <div className="w-full h-full relative transform rotate-[40deg] -top-16 ">
          <Image
            src={images[0] || "/images/hero/hero1.jpg"}
            alt="Rectangle Card"
            width={1500}
            height={1500}
            className="object-cover w-[200%] h-[200%] mix-blend-multiply"
            style={{ objectPosition: "center" }}
          />
        </div>
      </div>

      <div
        className={`border border-film-red-900 border-8 overflow-hidden bg-white transform -rotate-[40deg] relative sm:-right-[100px] md:-right-[140px] lg:-right-[160px] xl:-right-[190px] sm:bottom-10 md:bottom-15 lg:bottom-20 xl:bottom-20`}
        style={{
          width: `${dimensions.width}%`,
          height: `${dimensions.height}px`,
        }}
      >
        <div className="w-full h-full relative transform rotate-[40deg] sm:-top-[120px] md:-top-[180px] lg:-top-[220px] xl:-top-[250px] sm:-right-[60px] md:-right-[80px] lg:-right-[90px] xl:-right-[100px]">
          <Image
            src={images[1] || "/images/shade.jpg"}
            alt="Rectangle Card"
            width={1500}
            height={1500}
            className="object-cover w-[250%] h-[250%] mix-blend-multiply"
            style={{ objectPosition: "center" }}
          />
        </div>
      </div>

      <div
        className={`border border-film-red-900 border-8 overflow-hidden bg-white transform rotate-[50deg] relative sm:right-[120px] md:right-[160px] lg:right-[200px] xl:right-[240px] sm:bottom-[50px] md:bottom-[70px] lg:bottom-[85px] xl:bottom-[100px]`}
        style={{
          width: `${dimensions.width}%`,
          height: `${dimensions.height}px`,
        }}
      >
        <div className="w-full h-full relative transform -rotate-[50deg] sm:-top-[100px] md:-top-[140px] lg:-top-[170px] xl:-top-[200px] sm:-left-[100px] md:-left-[140px] lg:-left-[170px] xl:-left-[200px]">
          <Image
            src={images[2] || "/images/shade.jpg"}
            alt="Rectangle Card"
            width={1500}
            height={1500}
            className="object-cover w-[250%] h-[250%] mix-blend-multiply"
            style={{ objectPosition: "center" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RectangleCard;
