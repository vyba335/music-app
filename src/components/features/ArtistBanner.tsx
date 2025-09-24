import EmblaCarousel from "./EmblaCarousel";
import type { Artist } from "@/lib/types";
import { EmblaOptionsType } from "embla-carousel";
import "../../styles/base.css";
import "../../styles/embla.css";

type ArtistBannerProps = {
    artist: Artist;
    handleClick: (index: number) => void;
    activeAlbumIndex: number;
};

const ArtistBanner: React.FC<ArtistBannerProps> = ({ artist, handleClick, activeAlbumIndex }) => {
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
                <EmblaCarousel slides={artist.albums} options={OPTIONS} handleClick={handleClick} activeNumber={activeAlbumIndex} />
            </div>
        </div>
    );
};

export default ArtistBanner;
