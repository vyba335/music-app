import clientPromise from "@/lib/mongodb";
import { GetServerSideProps } from "next";
import type { Artist } from "@/lib/types";
import React from "react";
import EmblaCarousel from "@/src/components/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "../styles/base.css";
import "../styles/embla.css";

interface ArtistsProps {
    artists: Artist[];
}

const Artists: React.FC<ArtistsProps> = ({ artists }) => {
    const OPTIONS: EmblaOptionsType = {
        align: "start",
        dragFree: true,
        loop: true,
    };
    const SLIDE_COUNT = 5;
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
    return (
        <div>
            <section className="bg-white lg:grid dark:bg-gray-900">
                <div className="mx-auto w-screen max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                    <div className="mx-auto max-w-prose text-center">
                        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
                            Last added artists
                        </h1>

                        <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
                            For now it's only sample of 2
                        </p>
                    </div>
                </div>
            </section>
            <section className="flex flex-wrap gap-2">
                {artists.map((artist) => (
                    <div
                        className="group relative flex bg-black w-[450px] h-[550px]"
                        key={artist.name}
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
                                    Born: {artist.nationality}, birthday:{" "}
                                    {artist.birthday}.
                                </p>
                            </div>
                            <section className="mt-4">
                                <EmblaCarousel slides={artist.albums} options={OPTIONS} />
                                {/* {artist.albums.map((album) => (
                                    <div
                                        className="relative min-w-24"
                                        key={album.title}
                                    >
                                        <img
                                            src={album.cover}
                                            alt={album.title}
                                            className="absolute inset-0 h-full w-full object-cover contrast-50 transition-opacity group-hover:contrast-100"
                                        />
                                    </div>
                                ))} */}
                            </section>
                        </div>
                    </div>
                ))}
                
            </section>

            {/* <ul>
                {artists.map((artist) => (
                    <li key={artist._id}>
                        <h2>{artist.name}</h2>
                        <img src={artist.image} alt={artist.name} className="w-64" />
                        <h3>{artist.birthday}</h3>
                        <h3>{artist.nationality}</h3>
                        <ul className="flex">
                        {artist.albums.map((album) => (
                            <li className="flex-1">
                                <h2>{album.title}</h2>
                                <img src={album.cover} alt={album.title} className="w-24" />
                                <h3>{album.released}</h3>
                            </li>
                        ))}
                        </ul>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default Artists;

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db.collection("artists").find({}).toArray();
        return {
            props: { artists: JSON.parse(JSON.stringify(artists)) },
        };
    } catch (e) {
        console.error(e);
        return { props: { artists: [] } };
    }
};
