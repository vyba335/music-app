import EmblaCarousel from "./EmblaCarousel";
import type { Artist } from "@/lib/types";
import { EmblaOptionsType } from "embla-carousel";
import "../../styles/base.css";
import "../../styles/embla.css";
import { useRouter } from "next/router";

type ArtistCard = {
    artist: Artist;
};

const ArtistCard: React.FC<ArtistCard> = ({ artist }) => {
    const router = useRouter();
    const OPTIONS: EmblaOptionsType = {
        align: "start",
        dragFree: true,
        loop: true,
    };
    const urlName = artist.name.replaceAll(" ", "-").toLowerCase();

    return (
                <div
                    className="group relative flex bg-black w-[450px] h-[550px]"
                    key={artist.name}
                    onClick={() => router.push(`/artist/${urlName}`)}
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
                                {artist.nationality} | {" "}
                                {artist.birthday}.
                            </p>
                        </div>
                        <section className="mt-4">
                            <EmblaCarousel
                                slides={artist.albums}
                                options={OPTIONS}
                            />
                        </section>
                    </div>
                </div>
    );
};

export default ArtistCard;