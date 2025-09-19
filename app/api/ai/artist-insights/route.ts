import { NextRequest, NextResponse } from "next/server";
import { generateArtistInsights } from "@/lib/ai-services";
import clientPromise from "@/lib/mongodb";
import type { Artist } from "@/lib/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { artistName } = body;

        if (!artistName || typeof artistName !== "string") {
            return NextResponse.json(
                { error: "Artist name is required" },
                { status: 400 }
            );
        }

        // Get artist from database
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artist = await db
            .collection("artists")
            .findOne({ name: artistName });

        if (!artist) {
            return NextResponse.json(
                { error: "Artist not found" },
                { status: 404 }
            );
        }

        const artistTyped: Artist = JSON.parse(JSON.stringify(artist));

        // Generate insights
        const insights = await generateArtistInsights(artistTyped);

        return NextResponse.json({
            artist: artistName,
            insights
        });
    } catch (error) {
        console.error("Artist insights API error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate artist insights",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "AI Artist Insights API is running",
        usage: "POST with { artistName: string }",
    });
}