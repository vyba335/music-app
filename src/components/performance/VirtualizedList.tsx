"use client";
import React, { useState, useMemo, useCallback } from "react";
import { FixedSizeList as List, VariableSizeList } from "react-window";
import type { Artist } from "@/lib/types";
import { ArtistCard } from "@/src/components/features/ArtistCard";
import { ArtistCardSkeleton } from "@/src/components/ui/LoadingStates";

interface VirtualizedArtistListProps {
    artists: Artist[];
    itemHeight?: number;
    height: number;
    loading?: boolean;
    onArtistClick?: (artist: Artist) => void;
    className?: string;
}

export const VirtualizedArtistList: React.FC<VirtualizedArtistListProps> = ({
    artists,
    itemHeight = 200,
    height,
    loading = false,
    onArtistClick,
    className = "",
}) => {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const handleImageLoad = useCallback((artistId: string) => {
        setLoadedImages((prev) => new Set([...prev, artistId]));
    }, []);

    const ArtistRow = useCallback(
        ({ index, style }: { index: number; style: React.CSSProperties }) => {
            const artist = artists[index];

            if (!artist) {
                return (
                    <div style={style}>
                        <ArtistCardSkeleton />
                    </div>
                );
            }

            return (
                <div style={style} className="px-2 py-2">
                    <ArtistCard
                        artist={artist}
                        onImageLoad={() => handleImageLoad(artist._id)}
                    />
                </div>
            );
        },
        [artists, handleImageLoad]
    );

    const itemCount = loading ? artists.length + 5 : artists.length;

    if (artists.length === 0 && !loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                <p>No artists found</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <List
                height={height}
                itemCount={itemCount}
                itemSize={itemHeight}
                itemData={artists}
                overscanCount={5}
                className="scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800"
            >
                {ArtistRow}
            </List>
        </div>
    );
};
