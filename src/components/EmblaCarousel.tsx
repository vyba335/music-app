import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import type { Album } from "@/lib/types";

type PropType = {
    slides: Array<Album>;
    options?: EmblaOptionsType;
    isCard?: boolean;
    activeNumber?: number;
    handleClick?: any;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options, isCard, activeNumber, handleClick } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);
    let classList =
        "embla-slider-img absolute inset-0 h-full w-full object-cover transition-opacity hover:contrast-100 contrast-75";
    const activeClassList = "absolute inset-0 h-full w-full object-cover transition-opacity contrast-100";
    if (isCard) {
        classList += " group-hover:contrast-70 contrast-50";
    }
    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((album, index) => (
                        <div className="embla__slide" key={album.title}>
                            <div className="embla__slide__number">
                                <img
                                    src={album.cover}
                                    alt={album.title}
                                    className={activeNumber == index ? activeClassList : classList}
                                    onClick={() => handleClick(index)}
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
