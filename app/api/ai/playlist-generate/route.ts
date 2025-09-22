import { NextRequest, NextResponse } from "next/server";
import { generatePlaylist } from "@/lib/ai-services";
import clientPromise from "@/lib/mongodb";
import type { Artist } from "@/lib/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { prompt } = body;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { error: "Playlist prompt is required" },
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

        // Generate playlist
        const playlist = await generatePlaylist(prompt, artistsTyped);

        return NextResponse.json({ playlist });
    } catch (error) {
        console.error("Playlist generation API error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate playlist",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "AI Playlist Generator API is running",
        usage: "POST with { prompt: string }",
        examples: [
            "Road trip playlist with classic rock hits",
            "Study session with ambient electronic music",
            "Workout motivation with high-energy songs"
        ]
    });
}