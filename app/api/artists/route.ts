import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { ArtistOid } from "@/lib/types";

async function getArtists(): Promise<ArtistOid[]> {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db.collection("artists").find({}).toArray();
        return JSON.parse(JSON.stringify(artists));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function GET(req: NextRequest) {
    try {
        const artists = await getArtists();
        return NextResponse.json(artists);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch artists" },
            { status: 500 }
        );
    }
}
