import clientPromise from "@/lib/mongodb";
import type { Artist } from "@/lib/types";
import ArtistCard from "@/src/components/ArtistCard";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer";
import HeroTitle from "@/src/components/HeroTitle";
import AIRecommendations from "@/src/components/AIRecommendations";
import MoodDiscovery from "@/src/components/MoodDiscovery";
import ArtistComparison from "@/src/components/ArtistComparison";
import MusicChatBot from "@/src/components/MusicChatBot";

async function getArtists(): Promise<Artist[]> {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db
            .collection("artists")
            .find({})
            .limit(10)
            .toArray();
        const numberOfArtists = await db
            .collection("artists")
            .countDocuments();
        return JSON.parse(JSON.stringify(artists));
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function getArtistCount(): Promise<number> {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const numberOfArtists = await db
            .collection("artists")
            .countDocuments();
        return numberOfArtists;
    } catch (e) {
        console.error(e);
        return 0;
    }
}

export default async function Homepage() {
    const artists = await getArtists();
    const artistNames = artists.map(artist => artist.name);
    const numberOfArtists = await getArtistCount();

    return (
        <>
            <Header />
            <div>
                <HeroTitle
                    title="Discover Your Next Favorite Artist"
                    subtitle={`AI-powered music recommendations and mood-based discovery from our collection of ${numberOfArtists} artists.`}
                />

                {/* AI Recommendations Section */}
                <section className="max-w-4xl mx-auto px-5 py-8">
                    <AIRecommendations className="mb-8" />
                </section>

                {/* Mood Discovery Section */ }
                <section className="max-w-4xl mx-auto px-5 pb-8">
                    <MoodDiscovery />
                </section>

                {/* Artist Comparison Section */}
                <section className="max-w-4xl mx-auto px-5 pb-8">
                    <ArtistComparison availableArtists={artistNames} />
                </section>

                <HeroTitle
                    title="Featured Artists"
                    subtitle={`Explore our curated collection. ${numberOfArtists} currently in db`}
                />
                <section className="flex flex-wrap gap-2 justify-center p-5">
                    {artists.map((artist) => (
                        <ArtistCard key={artist._id} artist={artist} />
                    ))}
                </section>
            </div>
            <Footer />

            {/* AI Chat Assistant - Available on all pages */}
            <MusicChatBot />
        </>
    );
}
