import { NextRequest, NextResponse } from "next/server";
import { generateArtistComparison } from "@/lib/ai-services";
import clientPromise from "@/lib/mongodb";
import type { Artist } from "@/lib/types";

export async function POST(request: NextRequest)  {
    try {
        const body = await request.json();
        const { artist1, artist2 } = body;

        if (!artist1 || !artist2 || typeof artist1 !== 'string' || typeof artist2 !== 'string') {
            return NextResponse.json(
                { error: 'Two artist names are required' },
                { status: 400 }
      );
    }

        // Get artists from database
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db
            .collection("artists")
            .find({})
            .toArray();

        const artistsTyped: Artist[] = JSON.parse(JSON.stringify(artists));

        // Check if both artists exist
        const foundArtist1 = artistsTyped.find(a => a.name === artist1);
        const foundArtist2 = artistsTyped.find(a => a.name === artist2);

        if (!foundArtist1 || !foundArtist2) {
            return NextResponse.json(
                { error: "One or both artists not found in database" },
                { status: 404 }
            );
        }

        // Generate comparison
        const comparison = await generateArtistComparison(artist1, artist2, artistsTyped);

        return NextResponse.json({
            artist1,
            artist2,
            comparison
        });
    } catch (error) {
        console.error("Artist comparison API error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate artist comparison",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "AI Artist Comparison API is running",
        usage: "POST with { artist1: string, artist2: string }"
    });
}