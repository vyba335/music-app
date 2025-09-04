import clientPromise from "@/lib/mongodb";
import { GetServerSideProps } from "next";
import type { Artist } from "@/lib/types";
import ArtistCard from "@/src/components/ArtistCard";
import React from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import HeroTitle from "@/src/components/HeroTitle";

interface ArtistsProps {
    artists: Artist[];
}

const Homepage: React.FC<ArtistsProps> = ({ artists }) => {
    return (
        <>
            <Header />
            <div>
                <HeroTitle title="Last added artists" subtitle={`For now it's only a sample of ${artists.length}. The limit will be 10.`} />
                <section className="flex flex-wrap gap-2 justify-center p-5">
                    {artists.map((artist) => (
                        <ArtistCard artist={artist} />
                    ))}
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Homepage;

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db.collection("artists").find({}).limit(10).toArray();
        return {
            props: { artists: JSON.parse(JSON.stringify(artists)) },
        };
    } catch (e) {
        console.error(e);
        return { props: { artists: [] } };
    }
};
