import Image from "next/image";
import React from "react";

interface FeatureCardProps {
  image: string;
  alt: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  alt,
  title,
  description,
}) => {
  return (
    <div className="flex-1 shrink px-4 pb-4 basis-0 min-w-60">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="max-w-full w-[344px]">
          <Image
            src={image}
            width={344}
            height={344}
            className="object-contain w-full aspect-square"
            alt={alt}
          />
        </div>
      </div>
      <div className="mt-9 w-full">
        <h3 className="w-full text-2xl tracking-wider leading-loose text-black uppercase">
          {title}
        </h3>
        <p className="mt-9 w-full text-lg tracking-tight leading-7 text-neutral-800">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
