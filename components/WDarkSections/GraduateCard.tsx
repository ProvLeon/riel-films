import Image from "next/image";
import React from "react";

interface GraduateCardProps {
  image: string;
  alt: string;
  description: string;
}

const GraduateCard: React.FC<GraduateCardProps> = ({
  image,
  alt,
  description,
}) => {
  return (
    <div className="flex flex-col flex-1 shrink justify-center p-4 basis-0 min-w-60">
      <div className="w-full">
        <Image
          src={image}
          width={400}
          height={267}
          className="object-contain w-full aspect-[1.5]"
          alt={alt}
        />
        <p className="w-full mt-6 text-lg font-light leading-8 text-neutral-600">
          {description}
        </p>
      </div>
    </div>
  );
};

export default GraduateCard;
