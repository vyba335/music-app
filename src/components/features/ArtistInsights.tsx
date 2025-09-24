"use client";
import React, { useState, useEffect } from "react";
import { Brain, Music, Star, Lightbulb, Heart, Loader2 } from "lucide-react";

interface ArtistInsight {
    musicalDNA: string;
    careerHighlights: string[];
    hiddenGems: string[];
    influences: string[];
    funFacts: string[];
}

interface ArtistInsightsProps {
    artistName: string;
    className?: string;
}

const ArtistInsights: React.FC<ArtistInsightsProps> = ({
    artistName,
    className = "",
}) => {
    const [insights, setInsights] = useState<ArtistInsight | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (artistName) {
            generateInsights();
        }
    }, [artistName]);

    const generateInsights = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/ai/artist-insights", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ artistName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to generate insights"
                );
            }

            const data = await response.json();
            setInsights(data.insights);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to generate insights"
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                className={`bg-[var(--surface-dark)] rounded-lg shadow-lg p-6 ${className}`}
            >
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-500)]" />
                    <span className="ml-2 text-gray-300">
                        Generating AI insights...
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`bg-[var(--surface-dark)] rounded-lg shadow-lg p-6 ${className}`}
            >
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                    {error}
                    <button
                        onClick={generateInsights}
                        className="ml-2 text-red-700 underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!insights) {
        return null;
    }

    return (
        <div
            className={`bg-[var(--surface-dark)] rounded-lg shadow-lg p-6 ${className} overflow-scroll`}
        >
            <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-200">
                    AI Insights: {artistName}
                </h2>
            </div>

            <div className="space-y-6">
                {/* Musical DNA */}
                <div className="bg-[var(--surface-dark)] rounded-lg p-4 border border-[var(--primary-500)]">
                    <div className="flex items-center gap-2 mb-2">
                        <Music className="w-4 h-4 text-purple-600" />
                        <h3 className="font-semibold text-gray-200">
                            Musical DNA
                        </h3>
                    </div>
                    <p className="text-purple-200 text-sm leading-relaxed">
                        {insights.musicalDNA}
                    </p>
                </div>

                {/* Career Highlights */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <h3 className="font-semibold text-gray-200">
                            Career Highlights
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {insights.careerHighlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-yellow-500 text-sm mt-1">
                                    ⭐
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {highlight}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Hidden Gems */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Heart className="w-4 h-4 text-red-500" />
                        <h3 className="font-semibold text-gray-200">
                            Musical Influences
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {insights.influences.map((influence, index) => (
                            <span
                                key={index}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm"
                            >
                                {influence}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Fun Facts */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-green-500" />
                        <h3 className="font-semibold text-gray-200">
                            Fun Facts
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {insights.funFacts.map((fact, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 text-sm mt-1">
                                    🎵
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {fact}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ArtistInsights;
