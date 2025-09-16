"use client";
import EmblaCarousel from "./EmblaCarousel";
import type { Artist } from "@/lib/types";
import { EmblaOptionsType } from "embla-carousel";
import "../../styles/base.css";
import "../../styles/embla.css";
import { useRouter } from "next/navigation";

type ArtistCardProps = {
    artist: Artist;
};

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
    const router = useRouter();

    const OPTIONS: EmblaOptionsType = {
        align: "start",
        dragFree: true,
        loop: true,
    };

    const handleAlbumClick = (albumIndex: number) => {
        const artistSlug = artist.name
            .toLowerCase()
            .replace(/\s+/g, "-");

        router.push(`/artist/${artistSlug}?album=${albumIndex}`);
    };

    const handleArtistClick = () => {
        const artistSlug = artist.name
            .toLowerCase()
            .replace(/\s+/g, "-");
        
        router.push(`/artist/${artistSlug}`);
    };

    return (
        <div
            className="group relative flex bg-black w-[450px] h-[550px] cursor-pointer"
            key={artist.name}
            onClick={handleArtistClick}
        >
            <img
                alt={artist.name}
                src={artist.image}
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-80"
            />
            <div className="absolute bottom-0 w-full p-4 sm:p-4 lg:p-8">
                <p className="text-xl font-bold text-white sm:text-2xl">
                    {artist.name}
                </p>
                <div className="mt-1">
                    <p className="text-sm text-white">
                        {artist.nationality} | {artist.birthday}.
                    </p>
                </div>
                <section className="mt-4" onClick={(e) => e.stopPropagation()}>
                    <EmblaCarousel
                        slides={artist.albums}
                        handleClick={handleAlbumClick}
                        options={OPTIONS}
                        isCard={true}
                    />
                </section>
            </div>
        </div>
    );
};

export default ArtistCard;
