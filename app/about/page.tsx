import HeroRectangleCard from "@/components/UI/HeroRectangleCard";


const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-film-black-950">
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 text-film-black-900 dark:text-white">
            About Riel Films
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-3xl">
            <p>
              At Riel Films, we are dedicated to creating unforgettable
              cinematic experiences that entertain and inspire audiences
              worldwide. With a steadfast commitment to authenticity and a
              vision to become the premier platform for authentic African
              narratives, we offer a diverse portfolio of films that showcase
              the richness and diversity of African storytelling.
            </p>
            <p>
              Our mission is to produce captivating and thought-provoking
              cinematic experiences that celebrate the rich tapestry of African
              storytelling. We are dedicated to showcasing authentic narratives
              that entertain, inspire, and resonate with audiences worldwide,
              fostering cultural appreciation and understanding.
            </p>
            <p>
              Through our unwavering dedication to quality and our passion for
              sharing African culture with the world, we stand as the most
              authentic and reliable destination for captivating African
              narratives in the film industry market.
            </p>
          </div>
          <div className="relative">
            <HeroRectangleCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
