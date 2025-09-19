import { NextRequest, NextResponse } from "next/server";
import { performSmartSearch } from "@/lib/ai-services";
import clientPromise from "@/lib/mongodb"
import type { Artist } from "@/lib/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query || typeof query !== "string") {
            return NextResponse.json(
                { error: "Search query is required "},
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

        // Perform smart search
        const searchResult = await performSmartSearch({
            query,
            artists: artistsTyped,
        });

        return NextResponse.json({
            results: searchResult.matches,
            interpretation: searchResult.interpretation,
            filters: searchResult.filters,
            type: searchResult.type,
        });
    } catch (error) {
        console.error("Smart search API error:", error);
        return NextResponse.json(
            {
                error: "Failed to perform search",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "AI Smart Search API is running",
        usage: "POST with { query: string }",
        examples: [
            "sad indie songs from 2000s",
            "upbeat music for working out",
            "music like Taylor Swift but more rock",
            "relaxing acoustic music"
        ]
    });
}