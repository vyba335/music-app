import { NextRequest, NextResponse } from "next/server";
import { processChatMessage, generateChatSuggestions } from "@/lib/ai-services";
import clientPromise from "@/lib/mongodb";
import type { Artist, ChatMessage, ChatContext } from "@/lib/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, conversationHistory = [] } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
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

        // Prepare chat context
        const context: ChatContext = {
            messages: conversationHistory,
            artistDatabase: artistsTyped,
        };

        // Process the chat message
        const chatResponse = await processChatMessage(message, context);

        // Add the current exchange to history
        const updatedHistory: ChatMessage[] = [
            ...conversationHistory,
            {
                role: "user",
                content: message,
                timestamp: Date.now(),
            },
            {
                role: "assistant",
                content: chatResponse.message,
                timestamp: Date.now(),
            },
        ];

        return NextResponse.json({
            response: chatResponse.message,
            suggestions: chatResponse.suggestions || [],
            relatedArtists: chatResponse.relatedArtists || [],
            actionType: chatResponse.actionType || "general",
            conversationHistory: updatedHistory,
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            {
                error: "Failed to process chat message",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Get conversation starters
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db
            .collection("artists")
            .find({})
            .toArray();

        const artistsTyped: Artist[] = JSON.parse(JSON.stringify(artists));

        const context: ChatContext = {
            messages: [],
            artistDatabase: artistsTyped,
        };

        const suggestions = await generateChatSuggestions(context);

        return NextResponse.json({
            message: "AI Music Chat Assistant is ready!",
            suggestions,
            availableArtists: artistsTyped.map(a => a.name),
        });
    } catch (error) {
        console.error("Chat GET error:", error);
        return NextResponse.json(
            { error: "Failed to initialize chat" },
            { status: 500 }
        );
    }
}