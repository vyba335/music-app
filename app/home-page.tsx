import clientPromise from "@/lib/mongodb";
import type { Artist } from "@/lib/types";
import { ArtistCard } from "@/src/components/features/ArtistCard";
import Header from "@/src/components/features/Header/Header";
import Footer from "@/src/components/features/Footer";
import HeroTitle from "@/src/components/features/HeroTitle";
import AIRecommendations from "@/src/components/features/AIRecommendations";
import MoodDiscovery from "@/src/components/features/MoodDiscovery";
import ArtistComparison from "@/src/components/features/ArtistComparison";
import PlaylistGenerator from "@/src/components/features/PlaylistGenerator";
import SmartDashboard from "@/src/components/features/SmartDashboard";
import AdvancedSearch from "@/src/components/features/AdvancedSearch";
import PerformanceMonitor from "@/src/components/features/PerformanceMonitor";
import MusicChatBot from "@/src/components/features/MusicChatBot";
import {
    ArtistCardSkeleton,
    DashboardSkeleton,
} from "@/src/components/features/LoadingStates";
import { Suspense } from "react";

async function getArtists(): Promise<Artist[]> {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db
            .collection("artists")
            .find({})
            .limit(12)
            .toArray();
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
        const numberOfArtists = await db.collection("artists").countDocuments();
        return numberOfArtists;
    } catch (e) {
        console.error(e);
        return 0;
    }
}

export default async function Homepage() {
    const artists = await getArtists();
    const artistNames = artists.map((artist) => artist.name);
    const numberOfArtists = await getArtistCount();

    return (
        <>
            <Header />
            <div>
                <HeroTitle
                    title="Discover Your Next Favorite Artist"
                    subtitle={`AI-powered music recommendations and mood-based discovery from our collection of ${numberOfArtists} artists.`}
                />

                {/* Smart Dashboard Section */}
                <section className="max-w-6xl mx-auto px-5 py-8">
                    <Suspense fallback={<DashboardSkeleton />}>
                        <SmartDashboard />
                    </Suspense>
                </section>

                {/* AI Features Grid */}
                <section className="max-w-6xl mx-auto px-5 pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Colum */}
                        <div className="space-y-8">
                            <AIRecommendations />
                            <MoodDiscovery />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <PlaylistGenerator />
                            <ArtistComparison availableArtists={artistNames} />
                        </div>
                    </div>
                </section>

                {/* Advanced Search Section */}
                {/* <section className="max-w-6xl mx-auto px-5 pb-8">
                    <AdvancedSearch />
                </section> */}

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
            <PerformanceMonitor />

            {/* AI Chat Assistant - Available on all pages */}
            <MusicChatBot />
        </>
    );
}
