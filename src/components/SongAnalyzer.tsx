"use client";
import React, { useState } from "react";
import { Music, Brain, Heart, MessageCircle, Loader2 } from "lucide-react";
import type { Song } from "@/lib/types";
import { getSession } from "next-auth/react";

interface SongAnalysis {
    sentiment: "positive" | "negative" | "neutral" | "mixed";
    themes: string[];
    musicalStyle: string;
    lyricalMeaning?: string;
    songStory: string;
    emotionalImpact: string;
}

interface SongAnalyzerProps {
    song: Song;
    artistName: string;
    albumTitle: string;
    className?: string;
}

const SongAnalyzer: React.FC<SongAnalyzerProps> = ({
    song,
    artistName,
    albumTitle,
    className = ""
}) => {
    const [analysis, setAnalysis] = useState<SongAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    const analyzeSong = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/ai/song-analysis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    songTitle: song.title,
                    lyrics: song.lyrics,
                    artistName,
                    albumTitle,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to analyze song");
            }

            const data = await response.json();
            setAnalysis(data.analysis);
            setIsExpanded(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze song");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case "positive": return "bg-green-100 text-green-700";
            case "negative": return "bg-red-100 text-red-700";
            case "mixed": return "bg-yellow-100 text-yellow-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment) {
            case "positive": return "😊";
            case "negative": return "😢";
            case "mixed": return "😐";
            default: return "😶";
        }
    };

    return (
        <div className={`bg-[#272932] rounded-lg shadow-lg p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold text-gray-200">AI Song Analysis</h3>
                </div>

                {!analysis && !loading && (
                    <button
                        onClick={analyzeSong}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                    >
                        Analyze Song
                    </button>
                )}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-[#95c623]" />
                    <span className="ml-2 text-gray-300 text-sm">Analyzing "{song.title}"...</span>
                </div>
            )}

            {error && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded border border-red-200">
                    {error}
                    <button
                        onClick={analyzeSong}
                        className="ml-2 text-red-700 underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {analysis && (
                <div className="space-y-4">
                    {/* Sentiment */}
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(analysis.sentiment)}`}>
                            {getSentimentIcon(analysis.sentiment)} {analysis.sentiment}
                        </span>
                    </div>

                    {/* Themes */}
                    <div>
                        <h4 className="font-medium text-gray-100 mb-2 text-sm">Themes:</h4>
                        <div className="flex flex-wrap gap-1">
                            {analysis.themes.map((theme, index) => (
                                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Musical style */}
                    <div>
                        <h4 className="font-medium tex-gray-100 mb-2 text-sm">Musical Style:</h4>
                        <p className="text-gray-300 text-sm">{analysis.musicalStyle}</p>
                    </div>

                    {/* Song Story */}
                    <div>
                        <h4 className="font-medium text-gray-100 mb-1 text-sm">What It's About:</h4>
                        <p className="text-gray-300 text-sm">{analysis.songStory}</p>
                    </div>

                    {/* Expandable sections */}
                    {isExpanded && (
                        <>
                            {analysis.lyricalMeaning && (
                                <div>
                                    <h4 className="font-medium text-gray-100 mb-1 text-sm">Lyrical Meaning:</h4>
                                    <p className="text-gray-300 text-sm">{analysis.lyricalMeaning}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="font-medium text-gray-100 mb-1 text-sm">Emotional Impact:</h4>
                                <p className="text-gray-300 text-sm">{analysis.emotionalImpact}</p>
                            </div>
                        </>
                    )}

                    {!isExpanded && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="text-purple-600 text-sm hover:text-purple-700 transition-colors">
                                Show more analysis
                            </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SongAnalyzer;