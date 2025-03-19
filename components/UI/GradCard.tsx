import Image from "next/image";
import React from "react";

interface GradProps {
  name?: string;
  image?: string;
  description: string;
  role?: string;
}

const GradCard = ({ grad }: { grad: GradProps }) => {
  return (
    <div className="flex flex-wrap items-start w-full text-lg font-light leading-8 text-neutral-600">
      <div className="flex flex-col flex-1 shrink justify-center p-4 basis-0 min-w-60">
        <div className="w-full">
          <Image
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b462b65a33170fee2ce0fb8caa34c2cd3ed64c268d3d85594f7d54e15035bfd6?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
            className="object-contain w-full aspect-[1.5]"
            alt="Graduate 1"
          />
          <div className="w-full">
            Whilst at Screenology Liberty focussed on <br />
            creating ambitious, historical drama <br />
            productions, with large crews, complex <br />
            costumes and horses! Since graduating, her <br />
            production skills have seen her work on <br />
            productions for Disney + and Paramount +.
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 shrink justify-center p-4 basis-0 min-w-60">
        <div className="w-full">
          <Image
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9c307e7d48b564b8a087b418f5b535214f1c4ef3ebbde6f93541ccabbfc0e539?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
            className="object-contain w-full aspect-[1.5]"
            alt="Graduate 2"
          />
          <div className="w-full">
            Moving to Vienna, and winning prestigious <br />
            awards for her documentaries, Yaz <br />
            managed to land her dream job with <br />
            leading Natural History Production <br />
            Company, Terra Mater Studios.
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 shrink justify-center p-4 basis-0 min-w-60">
        <div className="w-full">
          <Image
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/15304fc83eebe055841cefdcfe29de60e395c8fcf675237edb5d98b052f5ce6b?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
            className="object-contain w-full aspect-[1.5]"
            alt="Graduate 3"
          />
          <div className="w-full">
            {grad.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradCard;
