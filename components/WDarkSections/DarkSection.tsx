import Image from "next/image";
import React from "react";

interface DarkSectionProps {
  backgroundImage?: string;
  children: React.ReactNode;
  className?: string;
}

const DarkSection: React.FC<DarkSectionProps> = ({
  backgroundImage,
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex overflow-hidden relative flex-col items-center w-full ${className}`}
    >
      {backgroundImage && (
        <div className="flex overflow-hidden absolute inset-0 z-0 flex-col w-full">
          <Image
            src={backgroundImage}
            fill
            className="object-cover opacity-50"
            alt="Background"
          />
        </div>
      )}
      <div className="flex z-0 flex-col justify-center self-center px-4 md:px-8 py-14 w-full max-w-[1200px] relative">
        {children}
      </div>
    </div>
  );
};

export default DarkSection;
