"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, Clock, Heart, Zap, User, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { read } from "fs";

interface DashboardData {
    todaysMood: string;
    recommendedArtists: Array<{
        name: string;
        reason: string;
        confidence: number;
    }>;
    trendingGenres: string[];
    recentActivity: Array<{
        type: string;
        artist: string;
        timestamp: string;
    }>;
    personalizedInsights: string[];
}

const SmartDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Simulate loading dashboard data
            // In a real app, this would come from AI service
            const mockData: DashboardData = {
                todaysMood: "Energetic",
                recommendedArtists: [
                    { name: "Linkin Park", reason: "Perfect for your energetic mood today", confidence: 92 },
                    { name: "Green Day", reason: "Based on your recent rock preferences", confidence: 87 },
                    { name: "Radical Something", reason: "Indie vibes matching your taste", confidence: 84 }
                ],
                trendingGenres: ["Electronic", "Indie Rock", "Alternative", "Pop"],
                recentActivity: [
                    { type: "listened", artist: "Arctic Monkeys", timestamp: "2 hours ago" },
                    { type: "searched", artist: "Taylor Swift", timestamp: "1 day ago" },
                    { type: "analyzed", artist: "Radiohead", timestamp: "2 days ago" }
                ],
                personalizedInsights: [
                    "You've been exploring more electronic music lately",
                    "Your taste leans towards indie and alternative genres",
                    "You prefer artists with lyrical depth and unique sound"
                ]
            };

            setTimeout(() => {
                setDashboardData(mockData);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            setLoading(false);
        }
    };

    const handleArtistClick = (artistName: string) => {
        const artistSlug = artistName.toLowerCase().replace(/\s+/g, "-");
        router.push(`/artist/${artistSlug}`);
    };

    if (loading) {
        return (
            <div className="bg-[#272932] rounded-lg shadow-lg p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboardData) return null;

    return (
        <div className="bg-[#272932] rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-[#95c623]" />
                <h2 className="text-2xl font-bold text-white">Your Music Intelligence Dashboard</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Today's Mood */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <Zap className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">Today's Vibe</h3>
                    </div>
                    <p className="text-2xl font-bold mb-2">{dashboardData.todaysMood}</p>
                    <p className="text-white/80 text-sm">
                        Based on your recent listening patterns
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <Heart className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">Activity</h3>
                    </div>
                    <p className="text-2xl font-bold mb-2">{dashboardData.recentActivity.length}</p>
                    <p className="text-white/80 text-sm">
                        Recent interactions this week
                    </p>
                </div>

                {/* Trending */}
                <div className="bg-gradient-tobr from-orange-500 to-red-600 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">Trending</h3>
                    </div>
                    <p className="text-2xl font-bold mb-2">{dashboardData.trendingGenres[0]}</p>
                    <p className="text-white/80 text-sm">
                        Your top genre this month
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Recommended Artists */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User className="¨w-5 h-5 text-[#95c623]" />
                        Recomended for You
                    </h3>
                    <div className="space-y-3">
                        {dashboardData.recommendedArtists.map((artist, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                                onClick={() => handleArtistClick(artist.name)}
                            >
                                <div>
                                    <h4 className="font-medium text-white hover:text-[#95c623] transition-colors">
                                        {artist.name}
                                    </h4>
                                    <p className="text-sm text-gray-300">{artist.reason}</p>
                                </div>
                                <span className="text-xs bg-[#95c623] text-white px-2 py-1 rounded">
                                    {artist.confidence}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#95c623]" />
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {dashboardData.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                                <div className="w-2 h-2 bg-[#95c623] rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-white text-sm">
                                        You {activity.type} <span className="font-medium text-[#95c623]">{activity.artist}</span>
                                    </p>
                                    <p className="text-gray-400 text-xs">{activity.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Personalized Insights */}
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#95c623]" />
                    Your Music DNA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.personalizedInsights.map((insight, index) => (
                        <div key={index} className="bg-gray-700 rounded-lg p-4">
                            <p className="text-gray-300 text-sm">{insight}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SmartDashboard;