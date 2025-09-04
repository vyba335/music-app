import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import type { Album } from "@/lib/types";

type PropType = {
    slides: Array<Album>;
    options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((album) => (
                        <div className="embla__slide" key={album.title}>
                            <div className="embla__slide__number">
                                <img
                                    src={album.cover}
                                    alt={album.title}
                                    className="absolute inset-0 h-full w-full object-cover contrast-50 transition-opacity hover:contrast-100 group-hover:contrast-70"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EmblaCarousel;
