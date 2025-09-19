import { NextRequest, NextResponse } from "next/server";
import { analyzeSong } from "@/lib/ai-services";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { songTitle, lyrics, artistName, albumTitle } = body;

        if(!songTitle || !artistName || !albumTitle) {
            return NextResponse.json(
                { error: "Song title, artist name, and album title are required." },
                { status: 400 }
            );
        }

        // Analyze song
        const analysis = await analyzeSong(
            { title: songTitle, lyrics },
            artistName,
            albumTitle
        );

        return NextResponse.json({
            song: songTitle,
            artist: artistName,
            album: albumTitle,
            analysis,
        });
    } catch (error) {
        console.error("Song analysis API error:", error);
        return NextResponse.json(
            {
                error: "Failed to analyze song",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "AI Song Analysis API is running",
        usage: "POST with { songTitle: string, artistName: string, albumTitle: string, lyrics?: string }",
    });
}