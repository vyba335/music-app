import { NextRequest, NextResponse } from "next/server";
import {
    generateRecommendations,
    analyzeUserPreferences,
} from "@/lib/ai-services";
import clientPromise from "@/lib/mongodb";
import type { Artist } from "@/lib/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { preferences, mood } = body;

        if (!preferences || typeof preferences !== "string") {
            return NextResponse.json(
                { error: "Preferences are required" },
                { status: 400 }
            );
        }

        // Get artists from database
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db.collection("artists").find({}).toArray();

        const artistsTyped: Artist[] = JSON.parse(JSON.stringify(artists));

        // Analyze user preferences
        const analysis = await analyzeUserPreferences(preferences);

        // Generate recommendations
        const recommendations = await generateRecommendations({
            preferences,
            mood: mood || analysis.mood,
            artists: artistsTyped,
        });

        return NextResponse.json({
            recommendations: recommendations.recommendations,
            explanation: recommendations.explanation,
            analysis,
        });
    } catch (error) {
        console.error("Recommendation API error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate recommendations",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// Optional: GET method for testing
export async function GET() {
    return NextResponse.json({
        message: "AI Recommendation API is running",
        usage: "POST with { preferences: string, mood?: string }",
        example: {
            preferences: "I want upbeat music for working out",
            mood: "energetic"
        }
    });
}
