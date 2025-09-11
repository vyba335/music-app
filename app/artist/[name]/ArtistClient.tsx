"use client";
import type { Artist } from "@/lib/types";
import React from "react";
import ArtistBanner from "@/src/components/ArtistBanner";
import TrackList from "@/src/components/TrackList";
import { useRouter, useSearchParams } from "next/navigation";
import AlbumCarousel from "../AlbumCarousel";

interface ArtistClientProps {
    artist: Artist;
    artistName: string;
}

const ArtistClient: React.FC<ArtistClientProps> = ({ artist, artistName }) => {
    const [activeAlbumIndex, setActiveAlbumIndex] = React.useState<number | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    React.useEffect(() => {
        const albumParam = searchParams.get("album");
        if (albumParam) {
            const albumIndex = parseInt(albumParam);
            if (!isNaN(albumIndex) && albumIndex >= 0 && albumIndex < artist.albums.length) {
                setActiveAlbumIndex(albumIndex);
            }
        }
    }, [searchParams, artist.albums.length])

    const handleAlbumClick = (index: number) => {
        setActiveAlbumIndex(index);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("album", index.toString());
        router.replace(`/artist/${artistName}?${newSearchParams.toString()}`);
    }

    React.useEffect(() => {
        if (artist && typeof artist !== "object") {
            console.warn("Artist prop should be an object or null");
        }
    }, [artist]);

    return (
        <>
            {/* <ArtistBanner
                artist={artist}
                handleClick={handleAlbumClick}
                activeAlbumIndex={activeAlbumIndex}
            />
            <TrackList album={artist.albums[activeAlbumIndex]} /> */}
            <AlbumCarousel artistData={artist} activeAlbumIndex={activeAlbumIndex} />
        </>
    );
};

export default ArtistClient;