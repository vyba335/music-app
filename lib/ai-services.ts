import { openai } from "./openai";
import type { Artist } from "./types";

export interface RecommendationRequest {
    preferences: string;
    mood?: string;
    artists?: Artist[];
}

export interface RecommendationResponse {
    recommendations: {
        artist: string;
        reason: string;
        confidence: number;
    }[];
    explanation: string;
}

 export async function generateRecommendations(
    request: RecommendationRequest
 ): Promise<RecommendationResponse> {
    const artistList = request.artists?.map(a => a.name).join(", ") || "";

    const prompt = `You are a music recommendation expert. Based on the user's preferences and available artists, provide personalized music recommendations.
    
    User preferences: ${request.preferences}
    ${request.mood ? `User mood: ${request.mood}` : ''}

    Available artists in database: ${artistList}

    Please provide 3-5 recommendations from the available artists. For each recommendation, explain why it matches their preferences and give a confidence score (0-100).

    Important: Only recommend artists from the available list. If none match perfectly, recommend the closest matches and explain the reasoning.

    Respon in JSON format: 
    {
        "recommendations": [
            {
                "artist": "Artist Name",
                "reason": "Brief explanation why this matches",
                "confidence": 85
            }
        ],
        "explanation": "Overall explanation of the recommendation strategy"
    }`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful music recommendation assistant. Always respond with valid JSON. Only recommend artists from the provided list."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 800,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        return JSON.parse(response);
    } catch (error) {
        console.error("AI recommendation error:", error);
        throw new Error("Failed to generate recommendations");
    }
 }

 export async function analyzeUserPreferences(input: string): Promise<{
    mood: string;
    genres: string[];
    energy: "low" | "medium" | "high";
    keywords: string[];
 }> {
    const prompt = `Analyze this music preference inpout and extract key information:
    
    Input: "${input}"

    Extract and return:
    1. Mood/emotion (happy, sad, energetic, calm, etc.)
    2. Potential genres mentioned or implied
    3. Energy level (low/medium/high)
    4. Key descriptive words

    Respon in JSON format:
    {
        "mood": "detected mood",
        "genres": ["genre1", "genre2"],
        "energy": "low|medium|high",
        "keywords": ["keyword1", "keyword2"]
    }`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a music analyst assistant. Always respond with valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 300,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        return JSON.parse(response);
    } catch (error) {
        console.error("Preference analysis error:", error);
        return {
            mood: "neutral",
            genres: [],
            energy: "medium",
            keywords: []
        };
    }
 }