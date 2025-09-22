"use client";
import React, { useState } from "react";
import {
    PlayCircle,
    Plus,
    Shuffle,
    Clock,
    Music,
    Loader2,
    Download,
    Share,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { PlaylistTrack, GeneratedPlaylist } from "@/lib/types";

const PlaylistGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState("");
    const [playlist, setPlaylist] = useState<GeneratedPlaylist | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const generatePlaylist = async () => {
        if (!prompt.trim()) {
            setError("Please describe what kind of playlist you want");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/ai/playlist-generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to generate playlist"
                );
            }

            const data = await response.json();
            setPlaylist(data.playlist);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to generate playlist"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleTrackClick = (track: PlaylistTrack) => {
        const artistSlug = track.artist.toLowerCase().replace(/\s+/g, "-");
        router.push(`/artist/${artistSlug}`);
    };

    const exportPlaylist = () => {
        if (!playlist) return;

        const playlistText = `${playlist.name}\n${
            playlist.description
        }\n\nTracks:\n${playlist.tracks
            .map(
                (track, i) =>
                    `${i + 1}. ${track.artist} - ${track.song} (${track.album})`
            )
            .join("\n")}`;

        const blob = new Blob([playlistText], { type: "text/plain "});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${playlist.name}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const presetPrompts = [
        "Road trip playlist with upbeat rock and indie songs",
        "Chill study session with ambient and lo-fi tracks",
        "Workout motivation with high-energy electronic music",
        "Romantic dinner with acoustic songs",
        "90s nostalgia playlist with hits from that decade",
        "Rainy day melancholy with indie folk and alternative"
    ];

    return (
        <div className="bg-[#272932] rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <PlayCircle className="w-6 h-6 text-[#95c623]" />
                <h2 className="text-2xl font-bold text-white">AI Playlist Generator</h2>
            </div>

            <div className="space-y-4">
                {/* Prompt Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Describe your playlist
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., 'Create a workout playlist with high-energy electronic music and motivational lyrics'"
                        className="w-full p-3 border border-[#95c623] rounded-lg focus:ring-2 focus:ring-[#95c623] focus:border-transparent resize-none text-white bg-gray-800 caret-[#95c623]"
                        rows={3}
                        suppressHydrationWarning
                    />
                </div>

                {/* Preset Prompts */}
                <div>
                    <p className="text-sm text-gray-300 mb-2">Or try one of these:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {presetPrompts.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => setPrompt(preset)}
                                className="text-left p-2 text-sm border border-gray-600 rounded hover:border-[#95c623] text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generatePlaylist}
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-[#95c623] text-white px-4 py-3 rounded-lg hover:bg-[#5e7d16] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors font-medium"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </>
                    ) : (
                        <>
                            <Shuffle className="w-5 h-5" />
                            Generate Playlist
                        </>
                    )}
                </button>

                {error && (
                    <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {/* Generated Playlist */}
                {playlist && (
                    <div className="mt-8 space-y-6">
                        {/* Playlist Header */}
                        <div className="bg-gradient-to-r from-[#95c623] to-[#5e7d16] rounded-lg p-6 texyt-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{playlist.name}</h3>
                                    <p className="text-white/90 mb-2">{playlist.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-white/80">
                                        <span className="flex items-center gap-1">
                                            <Music className="w-4 h-4" />
                                            {playlist.tracks.length} tracks
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {playlist.totalDuration}
                                        </span>
                                        <span className="bg-white/20 px-2 py-1 rounded">
                                            {playlist.theme}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={exportPlaylist}
                                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                                        title="Export playlist"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => navigator.share?.({ title: playlist.name, text: playlist.description })}
                                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                                        title="Share playlist"
                                    >
                                        <Share className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Track List */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-white mb-3">Tracks:</h4>
                            {playlist.tracks.map((track, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                                    onClick={() => handleTrackClick(track)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-[đ95c623] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-white group-hover:text-[#95c623] transition-colors">
                                                {track.song}
                                            </h5>
                                            <p className="text-sm text-gray-300">
                                                {track.artist } • {track.album}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {track.reason}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {track.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistGenerator;