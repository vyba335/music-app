import { NextRequest, NextResponse } from "next/server";
import { generateMoodRecommendations } from "@/lib/ai-services";
import clientPromise from "@/lib/mongodb"
import type { Artist } from "@/lib/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { mood } = body;

        if (!mood || typeof mood !== "string") {
            return NextResponse.json(
                { error: "Mood is required" },
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

        // Generate mood-based recommendations
        const moodResults = await generateMoodRecommendations(mood, artistsTyped);

        return NextResponse.json({
            recommendations: moodResults.recommendations,
            moodAnalysis: moodResults.moodAnalysis,
            mood,
        });
    } catch (error) {
        console.error("Mood recommendation API error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate mood recommendations",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "AI Mood Recommendations API is running",
        usage: "POST with { mood: string }",
        examples: [
            "happy",
            "sad",
            "energetic",
            "relaxed",
            "romantic",
            "nostalgic"
        ]
    });
}