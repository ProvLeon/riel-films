import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProgramCardProps {
  image: string;
  alt: string;
  title: React.ReactNode;
  subtitle: string;
  description: React.ReactNode;
  buttonText: string;
  buttonLink?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  image,
  alt,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink = "#",
}) => {
  return (
    <div className="flex-1 shrink p-4 basis-0 min-w-60">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="max-w-full w-[344px]">
          <Image
            src={image}
            width={344}
            height={280}
            className="object-contain w-full"
            alt={alt}
          />
        </div>
      </div>
      <div className="mt-9 w-full text-lg tracking-tight text-white">
        <div className="text-2xl tracking-wider leading-none uppercase">
          {title}
        </div>
        <div className="mt-9 font-bold leading-loose">
          {subtitle}
        </div>
        <div className="mt-5 leading-7 space-y-3">
          {description}
        </div>
      </div>
      <div className="mt-9 w-full">
        <Link
          href={buttonLink}
          className="block px-9 py-5 bg-film-red-300 text-2xl text-center text-black uppercase tracking-[2.5px] shadow-[0px_2px_0px_rgba(186,70,68,1)] hover:bg-film-red-400 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;
