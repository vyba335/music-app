"use client";
import type { Artist } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import ArtistInsights from "@/src/components/ArtistInsights";
import MusicChatBot from "@/src/components/MusicChatBot";
import { useRouter, useSearchParams } from "next/navigation";
import AlbumCarousel from "../AlbumCarousel";

interface ArtistClientProps {
    artist: Artist;
    artistName: string;
}

const ArtistClient: React.FC<ArtistClientProps> = ({ artist, artistName }) => {
    const [activeAlbumIndex, setActiveAlbumIndex] = useState<number | null>(
        null
    );
    const [showInsights, setShowInsights] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const albumParam = searchParams.get("album");
        const insightsParam = searchParams.get("insights");

        if (albumParam) {
            const albumIndex = parseInt(albumParam);
            if (
                !isNaN(albumIndex) &&
                albumIndex >= 0 &&
                albumIndex < artist.albums.length
            ) {
                setActiveAlbumIndex(albumIndex);
            }
        }

        if (insightsParam === "true") {
            setShowInsights(true);
        }
    }, [searchParams, artist.albums.length]);

    const handleAlbumClick = (index: number) => {
        setActiveAlbumIndex(index);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("album", index.toString());
        router.replace(`/artist/${artistName}?${newSearchParams.toString()}`);
    };

    const toggleInsights = () => {
        setShowInsights(!showInsights);
        const newSearchParams = new URLSearchParams(searchParams);
        if (!showInsights) {
            newSearchParams.set("insights", "true");
        } else {
            newSearchParams.delete("insights");
        }
        router.replace(`/artist/${artistName}?${newSearchParams.toString()}`);
    };

    useEffect(() => {
        if (artist && typeof artist !== "object") {
            console.warn("Artist prop should be an object or null");
        }
    }, [artist]);

    return (
        <div className="relative">
            {/* Floating Insights Button */}
            <button
                onClick={toggleInsights}
                className="fixed top-20 right-4 z-50 bg-[#95c623] text-white p-3 rounded-full shadow-lg hover:bg-purple-700 hover:cursor-pointer transition-colors"
                title={showInsights ? "Hide AI Insights" : "Show AI Insights"}
            >
                <Sparkles className="w-4 h-4" />
            </button>

            {/* AI Insights Overlay */}
            {showInsights && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-[#95c623] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={toggleInsights}
                            className="absolute top-6 right-8 text-white hover:text-[#95c623] text-2xl font-bold z-10"
                        >
                            ×
                        </button>
                        <div className="p-6">
                            <ArtistInsights artistName={artist.name} />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <AlbumCarousel
                artistData={artist}
                activeAlbumIndex={activeAlbumIndex}
            />

            {/* AI Chat Assistant */}
            <MusicChatBot />
        </div>
    );
};

export default ArtistClient;
