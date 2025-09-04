import EmblaCarousel from "./EmblaCarousel";
import type { Artist } from "@/lib/types";
import { EmblaOptionsType } from "embla-carousel";
import "../../styles/base.css";
import "../../styles/embla.css";

type ArtistBanner = {
    artist: Artist;
    handleClick?: any;
    activeNumber: number;
};

const ArtistBanner: React.FC<ArtistBanner> = ({ artist, handleClick, activeNumber }) => {
    const OPTIONS: EmblaOptionsType = {
        align: "start",
        dragFree: true,
        loop: true,
        duration: 50,
    };

    return (
        <div className="grid grid-cols-4 grid-rows-2">
            <div className="row-span-2">
                <img
                    alt={artist.name}
                    src={artist.image}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex col-span-3 justify-center items-center">
                {artist.name && <h1 className="text-5xl">{artist.name}</h1>}
            </div>
            <div className="col-span-3 col-start-2 row-start-2 artist-banner">
                <EmblaCarousel slides={artist.albums} options={OPTIONS} handleClick={handleClick} activeNumber={activeNumber} />
            </div>
        </div>
    );
};

export default ArtistBanner;
