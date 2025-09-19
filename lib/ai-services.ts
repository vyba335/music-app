import { openai } from "./openai";
import type { Artist } from "./types";

// Helper function to clean JSON responses from OpenAI
function cleanJsonResponse(response: string): string {
    let cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();

    return cleaned;
}

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
    const artistList = request.artists?.map((a) => a.name).join(", ") || "";

    const prompt = `You are a music recommendation expert. Based on the user's preferences and available artists, provide personalized music recommendations.
    
    User preferences: ${request.preferences}
    ${request.mood ? `User mood: ${request.mood}` : ""}

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
                    content:
                        "You are a helpful music recommendation assistant. Always respond with valid JSON. Only recommend artists from the provided list.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 800,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        const cleanedResponse = cleanJsonResponse(response);
        return JSON.parse(cleanedResponse);
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
                    content:
                        "You are a music analyst assistant. Always respond with valid JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 300,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        const cleanedResponse = cleanJsonResponse(response);
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Preference analysis error:", error);
        return {
            mood: "neutral",
            genres: [],
            energy: "medium",
            keywords: [],
        };
    }
}

export interface SmartSearchRequest {
    query: string;
    artists: Artist[];
}

export interface SmartSearchResult {
    type: "artist" | "song" | "album" | "mood";
    matches: any[];
    interpretation: string;
    filters: {
        mood?: string;
        genre?: string;
        energy?: string;
        year?: string;
    };
}

export async function performSmartSearch(
    request: SmartSearchRequest
): Promise<SmartSearchResult> {
    const prompt = `You are a smart music search assistant. Analyze this search query and find the best matches from the available music database.

Search Query: "${request.query}"

Available Artists: ${request.artists
        .map(
            (a) =>
                `${a.name} (${a.nationality}, albums: ${a.albums
                    .map((al) => al.title)
                    .join(", ")})`
        )
        .join("; ")}

Your task:
1. Interpret what the user is looking for
2. Identify any mood, genre, energy level, or time period mentioned
3. Find the best matches from available artists/albums/songs
4. Explain your interpretation

Examples of queries you should handle:
- "sad indie songs from 2000s" → Look for melancholic indie tracks from that era
- "upbeat pop for working out" → High energy pop songs
- "music like Ed Sheeran but more rock" → Artists similar to Ed Sheeran with rock elements
- "relaxing acoustic guitar music" → Acoustic, mellow tracks

Respond in JSON format:
{
  "type": "artist|song|album|mood",
  "matches": [
    {
      "name": "Match Name",
      "type": "artist|song|album", 
      "reason": "Why this matches",
      "confidence": 90
    }
  ],
  "interpretation": "What you understood from the query",
  "filters": {
    "mood": "detected mood",
    "genre": "detected genre",
    "energy": "low|medium|high",
    "year": "detected time period"
  }
}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a music search expert. Always respond with valid JSON. Only suggest items from the provided database.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.5,
            max_tokens: 1000,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        const cleanedResponse = cleanJsonResponse(response);
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Smart search error:", error);
        throw new Error("Failed to perform smart search");
    }
}

export async function generateMoodRecommendations(
    mood: string,
    artists: Artist[]
): Promise<{
    recommendations: Array<{
        artist: string;
        album?: string;
        songs?: string[];
        reason: string;
    }>;
    moodAnalysis: string;
}> {
    const prompt = `You are a mood-based music recommendation expert. Based on the user's mood and available music, suggest the best matches.

Current User Mood: ${mood}

Available Artists: ${artists
        .map(
            (a) =>
                `${a.name} - Albums: ${a.albums
                    .map((al) => `"${al.title}" (${al.released})`)
                    .join(", ")}`
        )
        .join("; ")}

Provide recommendations that match this mood. Consider:
- Song titles that suggest certain emotions
- Artist styles that fit the mood
- Album themes and release periods
- Musical genres that typically evoke this mood

Respond in JSON format:
{
  "recommendations": [
    {
      "artist": "Artist Name",
      "album": "Album Name (if specific album fits best)",
      "songs": ["Song1", "Song2"],
      "reason": "Why this fits the mood"
    }
  ],
  "moodAnalysis": "Brief analysis of the mood and why these recommendations work"
}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a music mood expert. Always respond with valid JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.6,
            max_tokens: 800,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        const cleanedResponse = cleanJsonResponse(response);
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Mood recommendation error:", error);
        throw new Error("Failed to generate mood recommendations");
    }
}

export interface ArtistInsight {
    musicalDNA: string;
    careerHighlights: string[];
    hiddenGems: string[];
    influences: string[];
    funFacts: string[];
}

export interface SongAnalysis {
    sentiment: "positive" | "negative" | "neutral" | "mixed";
    themes: string[];
    musicalStyle: string;
    lyricalMeaning?: string;
    songStory: string;
    emotionalImpact: string;
}

export async function generateArtistInsights(
    artist: Artist
): Promise<ArtistInsight> {
    const albumInfo = artist.albums
        .map(
            (album) =>
                `"${album.title}" (${album.released}) - ${album.songs.length} tracks`
        )
        .join(", ");

    const prompt = `You are a music journalist and analyst. Create comprehensive insight about this artist based on their discography and career.
    
    Artist: ${artist.name}
    Nationality: ${artist.nationality}
    Career Start: ${artist.birthday}
    Albums: ${albumInfo}

    Create engaging insights covering:
    1. Musical DNA - A unique description of their artistic identity
    2. Career Highlights - Key moments and achievements
    3. Hidden Gems - Lesser-known tracks worth discovering
    4. Influences - Who shaped their sound
    5. Fun Facts - Interesting trivia about the artist

    Make it informative but engaging, like content for music fans.

    Respond in JSON format only:
    {
        "musicalDNA": "A unique paragraph describing their artistic essence",
        "careerHighlights": ["Achievement 1", "Achievement 2", "Achievement 3"],
        "hiddenGems": ["Song/Album 1", "Song/Album 2", "Song/Album 3"],
        "influences": ["Influence 1", "Influence 2", "Influence 3"],
        "funFacts": ["Fact 1", "Fact 2", "Fact 3"]
    }`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a music expert and journalist. Create engaging, factual content about artists. Always respond with valid JSON only, no markdown.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        const cleanedResponse = cleanJsonResponse(response);
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Artist insights generation error:", error);
        throw new Error("Failed to generate artist insights");
    }
}

export async function analyzeSong(
    song: { title: string; lyrics?: string },
    artist: string,
    album: string
): Promise<SongAnalysis> {
    const lyricsInfo =
        song.lyrics && song.lyrics !== "fě"
            ? `Lyrics ${song.lyrics.substring(0, 500)}...`
            : "No lyrics available";

    const prompt = `Analyze this song in depth, considering its context and available information.

Song: "${song.title}"
Artist: ${artist}
Album: ${album}
${lyricsInfo}

Provide a comprehensive analysis covering:
1. Sentiment (positive/negative/neutral/mixed)
2. Main themes and topics
3. Musical style description
4. Lyrical meaning (if lyrics available)
5. A compelling "song story" - what the song is about
6. Emotional impact on listeners

Be insightful but accessible to general music fans.

Respond in JSON format only:
{
  "sentiment": "positive|negative|neutral|mixed",
  "themes": ["theme1", "theme2", "theme3"],
  "musicalStyle": "Description of musical style",
  "lyricalMeaning": "Interpretation of lyrics (if available)",
  "songStory": "What this song is about - compelling narrative",
  "emotionalImpact": "How this song affects listeners"
}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a music analyst and critic. Provide thoughtful, engaging analysis. Always respond with valid JSON only, no markdown.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.6,
            max_tokens: 800,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        const cleanedResponse = cleanJsonResponse(response);
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Song analysis error:", error);
        throw new Error("Failed to analyze song");
    }
}

export async function generateArtistComparison(
    artist1: string,
    artist2: string,
    availableArtists: Artist[]
): Promise<{
    compatibility: number;
    similarities: string[];
    differences: string[];
    recommendation: string;
    analysis: string;
}> {
    const artist1Data = availableArtists.find(a => a.name === artist1);
    const artist2Data = availableArtists.find(a => a.name === artist2);

    const prompt = `Compare these two artists and analyze their musical compatibility and relationship.
    
    Artist 1: ${artist1}
    ${artist1Data ? `Albums: ${artist1Data.albums.map(a => a.title).join(", ")}` : ""}

    Artist 2: ${artist2}
    ${artist2Data ? `Albums: ${artist2Data.albums.map(a => a.title).join(", ")}` : ""}

    Provide:
    1. Compatibility score (0-100)
    2. Key similarities between them
    3. Key differences
    4. Recommendation for fans of one who might like the other
    5. Overall analysis of their relationship

    Respond in JSON format only:
    {
        "compatibility": 85,
        "similarities": ["similarity1", "similarity2", "similarity3"],
        "differences": ["difference1", "difference2", "difference3"],
        "recommendation": "If you like X, you'll love Y because...",
        "analysis": "Overall analysis paragraph"
    }`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a music expert specializing in artist relationships and recommendations. Always respond with valid JSON only, no markdown."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.6,
            max_tokens: 700
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        const cleanedResponse = cleanJsonResponse(response);
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Artist comparison error:", error);
        throw new Error("Failed to generate artist comparison");
    }
}