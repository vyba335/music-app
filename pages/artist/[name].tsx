import type { Artist } from "@/lib/types";
import React from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useRouter } from "next/router";
import dataByName from "@/lib/dataHelper";

interface ArtistProps {
    artist: Artist | null;
    error?: string;
}

const Artist: React.FC<ArtistProps> = ({ artist, error }) => {
    const router = useRouter();
    
    const validateAndFormatArtistName = (name: string | string[] | undefined): string | null => {
        if (!name || typeof name !== "string") {
            return null;
        }

        const trimmedName = name.trim();
        if(!trimmedName) {
            return null;
        }

        const formattedName = trimmedName
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => {
                if (!word || word.length === 0) return "";
                return word[0].toUpperCase() + word.slice(1).toLowerCase();
            })
            .filter(word => word.length > 0)
            .join(" ");

            return formattedName || null;
    };

    React.useEffect(() => {
        if (artist && typeof artist !== "object") {
            console.warn("Artist prop should be an object or null");
        }
    }, [artist]);

    const displayName = validateAndFormatArtistName(router.query.name) || "Unknown Artist";

    if (!router.isReady) {
        return (
            <>
                <Header />
                <div>Loading...</div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div>
                    <h1>Error</h1>
                    <p>{error}</p>
                    <button onClick={() => router.back()}>
                        Go Back
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    if (!artist) {
        return (
            <>
                <Header />
                <div>
                    <h1>Artist Not Found</h1>
                    <p>No information available for "{displayName}"</p>
                    <button onClick={() => router.back()}>
                        Go Back
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main>
                <h1>{displayName}</h1>
                <div>
                    {artist.name && <p>Name: {artist.name}</p>}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Artist;

export async function getServerSideProps(context: { params: { name: string } }) {
    try {
        const { name } = context.params;

        if (!name || typeof name !== "string") {
            return {
                props: {
                    artist: null,
                    error: "Invalid artist name"
                }
            };
        }

        const artistName = name
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

        const { default: dataByName } = await import("@/lib/dataHelper");

        if (typeof dataByName !== "function") {
            throw new Error("dataByName is not a function");
        }

        const artistData = await dataByName(artistName);

        if (!artistData) {
            return {
                props: {
                    artist: null,
                    error: `No data found for artist: ${artistName}`
                }
            };
        }

        return {
            props: {
                artist: artistData,
                error: null
            }
        };
    } catch (error) {
        console.error("Error in getServerSideProps", error);
        return {
            props: {
                artist: null,
                error: "An error occurred while fetching artist data"
            }
        };
    }
}

// Alternative: Using getStaticProps with getStaticPaths for static generation
/*
export async function getStaticProps(context: { params: { name: string } }) {
    // Similar logic to getServerSideProps
    // Use this for static generation at build time
}

export async function getStaticPaths() {
    // Return paths for all artists you want to pre-generate
    return {
        paths: [
            { params: { name: 'artist-one' } },
            { params: { name: 'artist-two' } },
        ],
        fallback: 'blocking' // or true/false depending on your needs
    };
}
*/