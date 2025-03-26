import { notFound } from "next/navigation";
import { prismaAccelerate as prisma } from "@/lib/db";

export default async function FilmsServerTest({ params }: { params: { slug: string } }) {
  console.log("Server component received slug:", params.slug);

  try {
    // Directly query the database
    const film = await prisma.film.findUnique({
      where: { slug: params.slug },
    });

    if (!film) {
      return <div>Film not found in database: {params.slug}</div>;
    }

    return (
      <div style={{ padding: "20px" }}>
        <h1>Server Component Test</h1>
        <p>Slug: {params.slug}</p>
        <p>Film found: {film.title}</p>
        <pre>{JSON.stringify(film, null, 2)}</pre>
      </div>
    );
  } catch (error: any) {
    return (
      <div>
        <h1>Server Error:</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}
