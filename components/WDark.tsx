"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Import section components
import DarkSection from "./WDarkSections/DarkSection";
import FeatureCard from "./WDarkSections/FeatureCard";
import GraduateCard from "./WDarkSections/GraduateCard";
import ProgramCard from "./WDarkSections/ProgramCard";
import SectionHeader from "./WDarkSections/SectionHeader";
import { getRevealClass } from "../lib/utils.ts";

const tocItems = [
  { id: "film-degree", title: "Film Degree" },
  { id: "ma-creative-practice", title: "MA Creative Practice" },
  { id: "workshops", title: "Schools Workshops" },
  { id: "youtube", title: "YouTube" },
  { id: "contact", title: "Contact" },
];

function WDark() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Set all sections to visible after a delay if they're not already visible
    const timer = setTimeout(() => {
      tocItems.forEach((item) => {
        if (!isVisible[item.id]) {
          setIsVisible((prev) => ({
            ...prev,
            [item.id]: true,
          }));
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <div className="relative">
      <div className="z-0 w-full">
        {/* FILMMAKERS HERO SECTION */}
        <DarkSection backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/a6418dfc13d6914f8892542bb590fac7330b1d8333004297449077a730628d7b?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c">
          <div className="w-full">
            <div className="flex flex-col items-start w-full text-white mb-12">
              <div className="px-4 max-w-full w-full">
                <SectionHeader>WE MAKE FILMMAKERS</SectionHeader>
                <h3 className="mt-11 w-full text-2xl tracking-wider leading-9 uppercase">
                  IF YOU'RE CREATIVE CONSIDER CREATIVE FILMMAKING AS FUTURE.
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-start w-full gap-8">
              <ProgramCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/1634a979f79b6a09ba9d21c8cba01d11cf8088e7ab072b7c67856b58f0f5657d?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                alt="Film Degree"
                title="FILM DEGREE"
                subtitle="3 Year BA (Hons) Creative Filmmaking"
                description="The UK's most innovative and effective creative production BA (Hons). Intensely hands-on and experiential, you learn by doing."
                buttonText="Applications closed"
                buttonLink="#film-degree"
              />

              <ProgramCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/fb03a7c2ed53db227adeedc19fe1e34863465914d2bc010f62bb929583c713d5?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                alt="MA Creative Practice"
                title={
                  <>
                    <span>NEW</span>
                    <span className="font-normal">MA Creative Practice</span>
                  </>
                }
                subtitle="January 2025"
                description="We launched a brand new MA in Creative Practice in January 2024 under our new brand the Make Happen Institute"
                buttonText="More About MAKE HAPPEN"
                buttonLink="#ma-creative-practice"
              />

              <ProgramCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/77ac777cd164cfcbc02b87a1114e03323db16189070450a7f3ae17cd39bd716f?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                alt="Schools Workshops"
                title="Schools Workshops"
                subtitle="Make Happen Workshops"
                description={
                  <>
                    <p className="font-bold">
                      Arrange a visit to your school or institution.
                    </p>
                    <p>
                      Try our fabulous method aimed at getting you started in
                      creative filmmaking!
                    </p>
                  </>
                }
                buttonText="Find out more"
                buttonLink="#workshops"
              />
            </div>
          </div>
        </DarkSection>

        {/* STORYTELLING PHILOSOPHY SECTION */}
        <section className="flex overflow-hidden flex-col items-center w-full bg-white">
          <div className="flex flex-col justify-center p-8 w-full max-w-[1200px]">
            <div className="flex flex-wrap items-start w-full gap-8">
              <FeatureCard
                image="/images/shareYourView.png"
                alt="Get your stories told"
                title="Get your stories told."
                description="Everyone has a story to tell. At Screenology we want you to tell your unique stories or those of other people you care about or want to impact. We're not looking for the next Hollywood hot shot. Just creative people looking to express themselves and make the world a slightly better place."
              />

              <FeatureCard
                image="/images/makeMake.png"
                alt="Learn by making a mess"
                title="LEARN BY MAKING A MESS."
                description="At Screenology our focus is on creating an environment that has you take risks. People succeed in creativity by making a mess of things along the way. Think about how you learned to ride a bike… you fell off a lot probably. At school or college you will have been told there is a right way and a wrong way… at Screenology we acknowledge there is the way you want it and that's what counts. Through practice you will get to where you want to be."
              />

              <FeatureCard
                image="/images/makeDifferent.png"
                alt="Creatives break rules"
                title="CREATIVES BREAK RULES."
                description="By its very definition you can't create something new by doing things the way they have been done before. So you HAVE to be a rule breaker. If you're looking to be a cog in the machine you should go to university or film school. If you want to express yourself and impact the world in a new way, Screenology is your new home."
              />
            </div>
          </div>
        </section>

        {/* STUDENT STORIES SECTION */}
        <DarkSection backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/f9ebc7da65a05f746915cb9e6500528e93f05bfd4cdfe5ee9927d4ce87e550fa?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c">
          <div className="w-full">
            <div className="flex flex-col items-start w-full text-white mb-8">
              <SectionHeader>STUDENT STORIES</SectionHeader>
            </div>

            {/* Video placeholder - in real implementation, this would be an actual video component */}
            <div className="w-full aspect-video bg-black/30 mb-8 overflow-hidden rounded-lg">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4530a506971cec10796ff661f4860f13148eeea9e20faaa75a3ff8c444f06f5?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                width={1111}
                height={600}
                alt="Student stories video"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-end items-center w-full text-white">
              <Link
                href="#youtube"
                className="flex items-center gap-2 text-2xl tracking-wider uppercase hover:text-yellow-300 transition-colors"
              >
                <span>See our YouTube channel for more</span>
                <span className="text-3xl">&gt;&gt;</span>
              </Link>
            </div>
          </div>
        </DarkSection>

        {/* GRADUATES SECTION */}
        <section className="flex overflow-hidden flex-col items-center w-full bg-white">
          <div className="flex flex-col justify-center py-8 px-8 w-full max-w-[1200px]">
            <div className="w-full mb-12">
              <h2 className="text-3xl leading-loose text-black tracking-[3px] px-4">
                Some of our graduates…
              </h2>
            </div>

            <div className="flex flex-wrap items-start w-full gap-8">
              <GraduateCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/b462b65a33170fee2ce0fb8caa34c2cd3ed64c268d3d85594f7d54e15035bfd6?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                alt="Graduate 1"
                description="Whilst at Screenology Liberty focussed on creating ambitious, historical drama productions, with large crews, complex costumes and horses! Since graduating, her production skills have seen her work on productions for Disney + and Paramount +."
              />

              <GraduateCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/9c307e7d48b564b8a087b418f5b535214f1c4ef3ebbde6f93541ccabbfc0e539?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                alt="Graduate 2"
                description="Moving to Vienna, and winning prestigious awards for her documentaries, Yaz managed to land her dream job with leading Natural History Production Company, Terra Mater Studios."
              />

              <GraduateCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/15304fc83eebe055841cefdcfe29de60e395c8fcf675237edb5d98b052f5ce6b?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                alt="Graduate 3"
                description="Since graduating from Screenology, Sian has been working as a visual effects co-ordinator for Framestore. She's worked on productions such as Thor Love & Thunder and an upcoming film by Alex Garland."
              />
            </div>
          </div>
        </section>

        {/* WE MAKE FILMS SECTION */}
        <DarkSection className="bg-black/30">
          <div className="flex flex-wrap gap-10 items-center w-full">
            <div className="grow shrink px-4 min-w-60 md:w-[473px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bbd70f0f3488962629551bc6acc4121ab31d7018d42a3d9a1b736661da58933a?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                width={473}
                height={266}
                className="object-contain w-full"
                alt="We make films"
              />
            </div>
            <div className="grow shrink px-4 text-lg tracking-tight leading-7 text-white min-w-60 md:w-[379px]">
              <div className="w-full">
                <SectionHeader>WE MAKE FILMS</SectionHeader>
                <h3 className="mt-10 text-2xl tracking-wider leading-loose uppercase">
                  A Production Company
                </h3>
                <p className="mt-9 space-y-5">
                  <span className="block">
                    Many of our students and staff work closely with local
                    communities to create exciting fiction films and
                    documentaries.
                  </span>
                  <span className="block mt-5">
                    We are constantly innovating the processes of production.
                    These professional projects also give experience, learning
                    and development opportunities for a diversity of people.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </DarkSection>

        {/* WE MAKE VIDEO SECTION */}
        <section className="flex overflow-hidden flex-col items-center w-full bg-white">
          <div className="flex flex-col justify-center p-8 w-full max-w-[1200px]">
            <div className="flex flex-wrap items-center w-full gap-12">
              <div className="flex-1 shrink px-4 pb-4 text-black basis-0 min-w-60">
                <div className="w-full text-lg tracking-tight leading-7">
                  <SectionHeader>WE MAKE VIDEO</SectionHeader>
                  <div className="mt-11 space-y-5">
                    <p>
                      SCREENOLOGY makes content for a diversity of businesses
                      and organizations. We work fast, lean and
                      effectively…disrupting the whole process of commercial
                      video.
                    </p>
                    <p className="mt-5">
                      We make promo videos, testimonials, social media content,
                      event videos, training films and much much more.
                    </p>
                    <p className="mt-5 leading-loose">
                      Get in touch today for more information.
                    </p>
                  </div>
                </div>
                <div className="mt-9 w-full flex justify-center">
                  <Link
                    href="#contact"
                    className="inline-block px-9 py-4 border-2 border-black text-xs tracking-widest text-center uppercase rounded-full hover:bg-black hover:text-white transition-colors"
                  >
                    Get in touch
                  </Link>
                </div>
              </div>
              <div className="flex-1 shrink px-4 basis-0 min-w-60">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e2eaef2769a016002a6246abe96e47d5030b88a2fd2e8774ecfc0bd03f690df?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                  width={500}
                  height={281}
                  className="object-contain w-full"
                  alt="We make video"
                />
              </div>
            </div>
          </div>
        </section>
        {/* WE MAKE GOOD SECTION */}
        <DarkSection
          id="net"
          className={`bg-gradient-to-b from-film-red-600 via-film-red-500/100 to-film-red-600 dark:to-film-red-700 scroll-reveal ${
            getRevealClass({ id: "cta", isVisible })
          }`}
        >
          <div className="w-full">
            <div className="flex flex-wrap items-start w-full gap-8">
              <div className="grow shrink px-4 min-w-60 md:w-[379px]">
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="w-full max-w-[780px]">
                    <Image
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/2235ac02ea3a93c26358db06c3057272ae6fb45734efbafe5b0e1c18ce1ec43e?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                      width={780}
                      height={650}
                      className="object-contain w-full"
                      alt="We make good"
                    />
                  </div>
                </div>
              </div>
              <div className="grow shrink px-4 pt-16 pb-7 tracking-tight text-white min-w-60 md:w-[567px]">
                <div className="w-full">
                  <SectionHeader>WE MAKE GOOD</SectionHeader>
                  <p className="mt-10 text-lg leading-7">
                    Everything we do at Screenology is about making a
                    difference. If you are changing the world in some way and
                    need film or video to support your project. Please get in
                    touch today.
                  </p>
                  <p className="mt-5 text-lg leading-relaxed">
                    Recent projects include:
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <span className="text-lg">•</span>
                      <span className="text-lg leading-loose">
                        Mentoring BAME students at UWE
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-lg">•</span>
                      <span className="text-lg leading-loose">
                        Filmmaking partnership with Ignite Mentoring
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-lg">•</span>
                      <span className="text-base leading-loose">
                        Content for Mentoring Plus
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-lg">•</span>
                      <span className="text-lg leading-loose">
                        Documentary about Refugee Sounds
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-10 w-full">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/479d09b95b96f83199d4b8d2faab7914a10a1fc8c9d79a87d432828cd4f5f43f?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c"
                width={1200}
                height={240}
                className="object-contain w-full"
                alt="Divider"
              />
            </div>
          </div>
        </DarkSection>
      </div>
    </div>
  );
}

export default WDark;
