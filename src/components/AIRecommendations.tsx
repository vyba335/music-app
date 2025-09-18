"use client";
import React, { useState } from "react";
import { Sparkles, Music, Loader2 } from "lucide-react";
import { useRouter } from "next/router";

interface Recommendation {
    artist: string;
    reason: string;
    confidence: number;
}

interface AIRecommendationsProps {
    className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ className = "" }) => {
    const [preferences, setPreferences] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [explanation, setExplanation] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleGetRecommendations = async () => {
        if (!preferences.trim()) {
            setError("Please describe what kind of music you're looking for");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/ai/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ preferences }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get recommendations");
            }

            const data = await response.json();
            setRecommendations(data.recommendations || []);
            setExplanation(data.explanation || "");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get recommendations. Please try again.");
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

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return "text-green-600 bg-green-100";
        if (confidence >= 60) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                    AI Music Recommendations
                </h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-2">
                        What kind of music are you looking for?
                    </label>
                    <textarea
                        id="preferences"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        placeholder="E.g., 'I want something upbeat for working out' or 'relaxing acoustic music for studying'"
                        className="w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={3}
                    />
                </div>

                <button
                    onClick={handleGetRecommendations}
                    disabled={loading || !preferences.trim()}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Getting recommendations...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Get AI Recommendations
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    {explanation && (
                        <div className="text-gray-600 text-sm p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <strong>AI Analysis:</strong> {explanation}
                        </div>
                    )}

                    {recommendations.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900">Recommended Artists:</h3>
                            {recommendations.map((rec, index) => (
                                <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleArtistClick(rec.artist)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Music className="w-4 h-4 text-purple-500" />
                                            <span className="font-medium text-gray-900 hover:text-purple-600 transition-colors">
                                                {rec.artist}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                                            {rec.confidence}% match
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{rec.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default AIRecommendations;