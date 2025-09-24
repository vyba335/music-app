import type { Artist } from "@/lib/types";
import Header from "@/src/components/features/Header/Header";
import Footer from "@/src/components/features/Footer";
import ArtistClient from "./ArtistClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { slugToArtistName } from "@/src/utils/urlUtils";

interface PageProps {
    params: Promise<{
        name: string;
    }>;
}

async function getArtistData(slug: string): Promise<Artist | null> {
    try {
        if (!slug || typeof slug !== "string") {
            return null;
        }

        const artistName = slugToArtistName(slug);

        const { default: dataByName } = await import("@/lib/dataHelper");

        if (typeof dataByName !== "function") {
            throw new Error("dataByname is not a function");
        }

        const artistData = await dataByName(artistName);
        return artistData || null;
    } catch (error) {
        console.error("Error fetching artist data:", error);
        return null;
    }
}

export default async function ArtistPage({ params }: PageProps) {
    const resolvedParams = await params;
    const artist = await getArtistData(resolvedParams.name);

    if (!artist) {
        notFound();
    }

    return (
        <>
            <Header />
            <main>
                <Suspense fallback={<div>Loading artist...</div>}>
                    <ArtistClient artist={artist} artistSlug={resolvedParams.name} />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}

export async function generateMetadata({ params }: PageProps) {
    const resolvedParams = await params;
    const artist = await getArtistData(resolvedParams.name);

    if (!artist) {
        return {
            title: "Artist Not Found",
        };
    }

    return {
        title: `${artist.name} - Music App`,
        description: `Discover ${artist.name}'s music, albums and tracks.`,
    };
}
