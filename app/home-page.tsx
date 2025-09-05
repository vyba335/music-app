import clientPromise from "@/lib/mongodb";
import type { Artist } from "@/lib/types";
import ArtistCard from "@/src/components/ArtistCard";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer";
import HeroTitle from "@/src/components/HeroTitle";

async function getArtists(): Promise<Artist[]> {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db
            .collection("artists")
            .find({})
            .limit(10)
            .toArray();
        return JSON.parse(JSON.stringify(artists));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function Homepage() {
    const artists = await getArtists();

    return (
        <>
            <Header />
            <div>
                <HeroTitle
                    title="Last added artists"
                    subtitle={`For now it's only a sample of ${artists.length}. The limit will be 10.`}
                />
                <section className="flex flex-wrap gap-2 justify-center p-5">
                    {artists.map((artist) => (
                        <ArtistCard key={artist._id} artist={artist} />
                    ))}
                </section>
            </div>
            <Footer />
        </>
    );
}