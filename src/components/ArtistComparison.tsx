"use client";
import React, { useState, useEffect } from "react";
import { GitCompare, Loader2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface ComparisonResult {
    compatibility: number;
    similarities: string[];
    differences: string[];
    recommendation: string;
    analysis: string;
}

interface ArtistComparisonProps {
    availableArtists: string[];
    className?: string;
}

const ArtistComparison: React.FC<ArtistComparisonProps> = ({
    availableArtists,
    className = ""
}) => {
    const [artist1, setArtist1] = useState("");
    const [artist2, setArtist2] = useState("");
    const [comparison, setComparison] = useState<ComparisonResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCompare = async () => {
        if (!artist1 || !artist2) {
            setError("Please select both artists to compare");
            return;
        }

        if (artist1 === artist2) {
            setError("Please select two different artists");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/ai/artist-comparison", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ artist1, artist2 }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to compare artists");
            }

            const data = await response.json();
            setComparison(data.comparison);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to compare artists");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCompatibilityColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-100";
        if (score >= 60) return "text-yellow-600 bg-yellow-100";
        if (score >= 40) return "text-orange-600 bg-orange-100";
        return "text-red-600 bg-red-100";
    };

    const getCompatibilityIcon = (score: number) => {
        if (score >= 60) return <TrendingUp className="w-4 h-4" />;
        return <TrendingDown className="w-4 h-4" />;
    };

    return (
        <div className={`bg-[#272932] rounded-lg shadow-lg p-6 ${className}`}>
            <div className="flex items-center gap-2 mb-6">
                <GitCompare className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-100">
                    Artist Compatibility Matcher
                </h2>
            </div>

            <div className="space-y-4">
                {/* Artist Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            First Artist
                        </label>
                        <select
                            title="Artist 1"
                            value={artist1}
                            onChange={(e) => setArtist1(e.target.value)}
                            className="w-full p-2 border bg-gray-900 border-[#95c623] rounded focus:ring-2 focus:ring-[#95c623] focus:border-transparent cursor-pointer"
                            suppressHydrationWarning
                        >
                            <option value="">Select an artist...</option>
                            {availableArtists.map(artist => (
                                <option key={artist} value={artist}>{artist}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <div className="text-2xl text-gray-200">VS</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Second Artist
                        </label>
                        <select
                            title="Artist 2"
                            value={artist2}
                            onChange={(e) => setArtist2(e.target.value)}
                            className="w-full p-2 border bg-gray-900 border-[#95c623] rounded focus:ring-2 focus:ring-[#95c623] focus:border-transparent cursor-pointer"
                            suppressHydrationWarning
                        >
                            <option value="">Select an artist...</option>
                            {availableArtists.filter(artist => artist !== artist1).map(artist => (
                                <option key={artist} value={artist}>{artist}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleCompare}
                    disabled={loading || !artist1 || !artist2}
                    className="w-full bg-[#95c623] text-white px-4 py-2 rounded-lg hover:bg-[#5e7d16] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Comparing artists...
                        </>
                    ) : (
                        <>
                            <GitCompare className="w-4 h-4" />
                            Compare Artists
                        </>
                    )}
                </button>

                {error && (
                    <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {comparison && (
                    <div className="space-y-6 mt-6">
                        {/* Compatibility Score */}
                        <div className="text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getCompatibilityColor(comparison.compatibility)}`}>
                                {getCompatibilityIcon(comparison.compatibility)}
                                <span className="font-semibold">
                                    {comparison.compatibility}% Compatible
                                </span>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">AI Analysis</h3>
                            <p className="text-blue-800 text-sm">{comparison.analysis}</p>
                        </div>

                        {/* Similarities */}
                        <div>
                            <h3 className="font-semibold text-gray-100 mb-3 flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                Similarities
                            </h3>
                            <ul className="space-y-2">
                                {comparison.similarities.map((similarity, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-green-500 text-sm mt-1">•</span>
                                        <span className="text-gray-300 text-sm">{similarity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Differences */}
                        <div>
                            <h3 className="font-semibold text-gray-100 mb-3 flex items-center gap-2">
                                <span className="text-red-500">✗</span>
                                Key Differences
                            </h3>
                            <ul className="space-y-2">
                                {comparison.differences.map((difference, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-red-500 text-sm mt-1">•</span>
                                        <span className="text-gray-300 text-sm">{difference}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" />
                                Recommendation
                            </h3>
                            <p className="text-purple-800 text-sm">{comparison.recommendation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtistComparison;