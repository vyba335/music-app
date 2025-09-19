"use client";
import React, { useState } from "react";
import { Heart, Zap, Moon, Sun, Music2, Loader2, TreePalm } from "lucide-react";
import { useRouter } from "next/navigation";

interface MoodRecommendation {
    artist: string;
    album?: string;
    songs?: string[];
    reason: string;
}

const MoodDiscovery: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<MoodRecommendation[]>([]);
    const [moodAnalysis, setMoodAnalysis] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const moods = [
        { name: "Happy", icon: Sun, color: "bg-yellow-100 text-yellow-600", description: "Upbeat and cheerful" },
        { name: "Sad", icon: Moon, color: "bg-blue-100 text-blue-600", description: "Melancholic and reflective" },
        { name: "Energetic", icon: Zap, color: "bg-red-100 text-red-600", description: "High energy and pumped up" },
        { name: "Relaxed", icon: TreePalm, color: "bg-green-100 text-green-600", description: "Calm and peaceful" },
        { name: "Romantic", icon: Heart, color: "bg-pink-100 text-pink-600", description: "Love and intimacy" },
        { name: "Nostalgic", icon: Music2, color: "bg-purple-100 text-purple-600", description: "Memories and past times" }
    ];

    const handleMoodSelect = async (mood: string) => {
        setSelectedMood(mood);
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/ai/mood", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ mood: mood.toLowerCase() }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get recommendations");
            }

            const data = await response.json();
            setRecommendations(data.recommendations || []);
            setMoodAnalysis(data.moodAnalysis || "");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get recommendations");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleArtistClick = (artistName: string) => {
        const artistSlug = artistName
            .toLowerCase()
            .replace(/\s+/g, "-");
        router.push(`/artist/${artistSlug}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover Music by Mood</h2>
                <p className="text-gray-600">How are you feeling today? Let AI find the perfect music for your mood.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {moods.map((mood) => {
                    const IconComponent = mood.icon;
                    return (
                        <button
                        key={mood.name}
                        onClick={() => handleMoodSelect(mood.name)}
                        disabled={loading}
                        className={`p-4 rounded-lg border-2 transition-all hover:shadow-md disabled:opacity-50 ${selectedMood === mood.name ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <div className={`p-2 rounded-full ${mood.color}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-medium text-gray-900">{mood.name}</h3>
                                    <p className="text-xs text-gray-500">{mood.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                    <span className="ml-2 text-gray-600">Finding the perfect music for your mood...</span>
                </div>
            )}

            {error && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg boreder border-red-200 mb-4">
                    {error}
                </div>
            )}

            {moodAnalysis && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Mood analysis</h3>
                    <p className="text-purple-700 text-sm">{moodAnalysis}</p>
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Perfect Matches for Your Mood:</h3>
                    {recommendations.map((rec, index) => (
                        <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 hover:text-purple-600 cursor-pointer transition-colors" onClick={() => handleArtistClick(rec.artist)}>
                                        {rec.artist}
                                    </h4>
                                    {rec.album && (
                                        <p className="text-sm text-gray-600 mt-1">Album: {rec.album}</p>
                                    )}
                                    {rec.songs && rec.songs.length > 0 && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Featured songs: {rec.songs.join(", ")}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-700 mt-2">{rec.reason}</p>
                                </div>
                                <Music2 className="w-5 h-5 text-purple-400 ml-4 flex-shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MoodDiscovery;