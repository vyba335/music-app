import type { Artist } from "@/lib/types";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer";
import ArtistClient from "./ArtistClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{
        name: string;
    }>;
}

async function getArtistData(name: string): Promise<Artist | null> {
    try {
        if (!name || typeof name !== "string") {
            return null;
        }

        const artistName = name
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

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
                    <ArtistClient artist={artist} artistName={resolvedParams.name} />
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
