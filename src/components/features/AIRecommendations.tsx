"use client";
import React, { useState } from "react";
import { Sparkles, Music, TrendingUp, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Badge } from '@/src/components/ui';
import { AIComponentSkeleton, LoadingSpinner, ErrorState } from '@/src/components/ui/LoadingStates';
import { useMusicContext } from '@/src/contexts/MusicContext';
import { useDebounce } from '@/src/hooks/useDebounce';
import { artistNameToSlug } from "@/src/utils/urlUtils";

interface Recommendation {
    artist: string;
    reason: string;
    confidence: number;
}

interface AIRecommendationsProps {
    className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
    className = "",
}) => {
    const [preferences, setPreferences] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>(
        []
    );
    const [explanation, setExplanation] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const { setCurrentArtist, addToSearchHistory } = useMusicContext();

    // Debounce the preferences input
    const debouncedPreferences = useDebounce(preferences, 300);

    // Suggested prompts for better UX
    const suggestedPrompts = [
        "I want upbeat music for working out",
        "Relaxing acoustic songs for studying",
        "High-energy electronic dance music",
        "Melancholic indie rock for rainy days",
        "Uplifting pop songs for motivation",
        "Chill hip-hop for late night vibes",
    ];

    const handleGetRecommendations = async (customPreferences?: string) => {
        const searchPreferences = customPreferences || preferences.trim();

        if (!searchPreferences) {
            setError("Please describe what kind of music you're looking for");
            return;
        }

        setLoading(true);
        setError("");
        addToSearchHistory(`AI: ${searchPreferences}`);

        try {
            const response = await fetch("/api/ai/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ preferences: searchPreferences }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to get recommendations"
                );
            }

            const data = await response.json();
            setRecommendations(data.recommendations || []);
            setExplanation(data.explanation || "");
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to get recommendations. Please try again.";
            setError(errorMessage);
            console.error("AI recommendations error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleArtistClick = async (artistName: string) => {
        try {
            const artistSlug = artistNameToSlug(artistName);

            const response = await fetch("/api/artists");
            if (response.ok) {
                const artists = await response.json();
                const foundArtist = artists.find(
                    (a: any) =>
                        a.name.toLowerCase() === artistName.toLowerCase()
                );
                if (foundArtist) {
                    setCurrentArtist(foundArtist);
                }
            }
            router.push(`/artist/${artistSlug}`);
        } catch (error) {
            console.error("Navigation error:", error);
            // Fallback navigation
            const artistSlug = artistName.toLowerCase().replace(/\s+/g, "-");
            router.push(`/artist/${artistSlug}`);
        }
    };

    const handleSuggestedPromptClick = (prompt: string) => {
        setPreferences(prompt);
        handleGetRecommendations(prompt);
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return "success";
        if (confidence >= 60) return "warning";
        return "danger";
    };

    const getConfidenceIcon = (confidence: number) => {
        if (confidence >= 80) return <Star className="w-4 h-4" />;
        if (confidence >= 60) return <TrendingUp className="w-4 h-4" />;
        return <Music className="w-4 h-4" />;
    };

    if (loading) {
        return <AIComponentSkeleton />;
    }
    return (
        <Card className={`p-6 ${className}`} variant="glass">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold gradient-text">
                        AI Music Recommendations
                    </h2>
                    <p className="text-sm text-gray-400">
                        Discover your next favorite artist with AI
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Input Section */}
                <div className="space-y-4">
                    <Input
                        label="What kind of music are you looking for?"
                        placeholder="E.g., 'I want something upbeat for working out' or 'relaxing acoustic music for studying'"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        disabled={loading}
                        helperText="Be as specific as possible for better recommendations"
                        icon={<Music className="w-4 h-4" />}
                    />

                    {/* Suggested Prompts */}
                    {recommendations.length === 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-300">
                                Try one of these popular searches:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedPrompts.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleSuggestedPromptClick(prompt)
                                        }
                                        disabled={loading}
                                        className="btn-ghost text-xs px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-full transition-all duration-200 hover:border-purple-500"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <Button
                        onClick={() => handleGetRecommendations()}
                        disabled={loading || !preferences.trim()}
                        loading={loading}
                        variant="primary"
                        className="w-full"
                        icon={<Sparkles className="w-4 h-4" />}
                    >
                        Get AI Recommendations
                    </Button>
                </div>

                {/* Error State */}
                {error && (
                    <ErrorState
                        title="Recommendation Failed"
                        message={error}
                        onRetry={() => handleGetRecommendations()}
                    />
                )}

                {/* AI Analysis */}
                {explanation && (
                    <Card className="p-4 bg-blue-900/20 border border-blue-700/30">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-medium text-blue-200 mb-1">
                                    AI Analysis
                                </h4>
                                <p className="text-sm text-blue-100 leading-relaxed">
                                    {explanation}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Results */}
                {recommendations.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">
                                Recommended Artists
                            </h3>
                            <Badge variant="info" size="sm">
                                {recommendations.length} match
                                {recommendations.length !== 1 ? "es" : ""}
                            </Badge>
                        </div>

                        <div className="grid gap-3">
                            {recommendations.map((rec, index) => (
                                <Card
                                    key={index}
                                    interactive
                                    className="p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                                    onClick={() =>
                                        handleArtistClick(rec.artist)
                                    }
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {getConfidenceIcon(
                                                    rec.confidence
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold text-white group-hover:gradient-text transition-all duration-300 truncate">
                                                    {rec.artist}
                                                </h4>
                                                <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                                                    {rec.reason}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                            <Badge
                                                variant={getConfidenceColor(
                                                    rec.confidence
                                                )}
                                                size="sm"
                                                className="font-medium"
                                            >
                                                {rec.confidence}%
                                            </Badge>
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Music className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Clear Results Button */}
                        <div className="pt-4 border-t border-gray-700/50">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setRecommendations([]);
                                    setExplanation("");
                                    setPreferences("");
                                    setError("");
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                Clear Results
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AIRecommendations;
