import clientPromise from "@/lib/mongodb";
import { GetServerSideProps } from "next";
import type { Artist } from "@/lib/types";
import React from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { ObjectId } from "mongodb";

interface ArtistProps {
    artist: Artist[];
}

const Artist: React.FC<ArtistProps> = ({ artist }) => {
    return (
        <>
            <Header />
            
            <Footer />
        </>
    );
};

export default Artist;