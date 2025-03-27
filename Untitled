import Link from "next/link";
import { Button } from "@/components/UI/Button";
import Image from "next/image";
import HeroRectangleCard from "@/components/UI/HeroRectangleCard";

// interface BannerProps {
//   title: string;
//   subtitle: string;
//   primaryCta: {
//     text: string;
//     href: string;
//   };
//   secondaryCta: {
//     text: string;
//     href: string;
//   };
//   backgroundImage: string;
//   programInfo?: {
//     duration: string;
//     credits: string;
//     location: string;
//     startDate: string;
//   };
// }

const details = {
  title: "Empowering African Voices, Sharing Global Stories",
  subtitle:
    "Riel Films is dedicated to creating unforgettable cinematic experiences that entertain and inspire audiences worldwide.",
  primaryCta: { text: "Explore Our Films", href: "/films" },
  secondaryCta: { text: "About Us", href: "/about" },
  backgroundImage: "/images/shade.png",
  programInfo: {
    duration: "Authentic African Cinema",
    credits: "Award-winning Productions",
    location: "Ghana, West Africa",
    startDate: "Established 2022",
  },
};

const HeroSection = () => {
  return (
    <section className="relative w-full mt-2">
      {/* Hero image with responsive sizing */}
      <div className="relative w-full aspect-video md:aspect-[2.37] h-auto md:h-[80vh] max-h-[700px]">
        <Image
          src={details.backgroundImage}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
          alt={details.title}
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-film-warmWhite-300/20 to-film-black-900/50 dark:from-film-black-950/90 dark:to-film-black-950/60">
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
              {details.title}
            </h1>
            <p className="text-white text-lg md:text-xl mb-6 max-w-xl drop-shadow-md">
              {details.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">
                <Link href={details.primaryCta.href}>
                  {details.primaryCta.text}
                </Link>
              </Button>
              <Button variant="outline">
                <Link href={details.secondaryCta.href}>
                  {details.secondaryCta.text}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative top-4 md:-top-[500px]  lg:-right-[100px] md:-right-[300px]">
        <HeroRectangleCard />
      </div>
    </section>
  );
};

export default HeroSection;
