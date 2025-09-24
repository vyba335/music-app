"use client";
import React, { useState } from "react";
import { Filter, Search, Calendar, Music, User } from "lucide-react";

interface SearchFilters {
    genre: string;
    decade: string;
    mood: string;
    artist: string;
}

const AdvancedSearch: React.FC = () => {
    const [filters, setFilters] = useState<SearchFilters>({
        genre: "",
        decade: "",
        mood: "",
        artist: "",
    });
    const [isOpen, setIsOpen] = useState(false);

    const genres = [
        "Rock",
        "Pop",
        "Electronic",
        "Hip Hop",
        "Jazz",
        "Classical",
        "Country",
        "Reggae",
    ];
    const decades = [
        "1960s",
        "1970s",
        "1980s",
        "1990s",
        "2000s",
        "2010s",
        "2020s",
    ];
    const moods = [
        "Happy",
        "Sad",
        "Energetic",
        "Relaxed",
        "Romantic",
        "Angry",
        "Nostalgic",
    ];

    return (
        <div className="card rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[var(--primary-500)]" />
                    <h3 className="text-lg font-semibold text-white">
                        Advanced Search
                    </h3>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-[var(--primary-500)] hover:text-white transition-colors"
                >
                    {isOpen ? "Hide" : "Show"} Filters
                </button>
            </div>

            {isOpen && (
                <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">
                                Genre
                            </label>
                            <select
                                title="Select genre"
                                value={filters.genre}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        genre: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-[var(--primary-500)] rounded bg-gray-800 text-white"
                            >
                                <option value="">Any Genre</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">
                                Decade
                            </label>
                            <select
                                title="Select decade"
                                value={filters.decade}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        decade: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-[var(--primary-500)] rounded bg-gray-800 text-white"
                            >
                                <option value="">Any Decade</option>
                                {decades.map((decade) => (
                                    <option key={decade} value={decade}>
                                        {decade}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">
                                Mood
                            </label>
                            <select
                                title="Select mood"
                                value={filters.mood}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        mood: e.target.value,
                                    })
                                }
                                className="w-full p-2 border border-[var(--primary-500)] rounded bg-gray-800 text-white"
                            >
                                <option value="">Any Mood</option>
                                {moods.map((mood) => (
                                    <option key={mood} value={mood}>
                                        {mood}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">
                                Artist
                            </label>
                            <input
                                type="text"
                                value={filters.artist}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        artist: e.target.value,
                                    })
                                }
                                placeholder="Artist name..."
                                className="w-full p-2 border border-[var(--primary-500)] rounded bg-gray-800 text-white"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="bg-[var(--primary-500)] text-white px-4 py-2 rounded hover:bg-[var(--primary-700)] transition-colors">
                            Apply Filters
                        </button>
                        <button
                            onClick={() =>
                                setFilters({
                                    genre: "",
                                    decade: "",
                                    mood: "",
                                    artist: "",
                                })
                            }
                            className="border border-gray-600 text-gray-300 px-4 py-2 rounded hover:border-[var(--primary-500)] transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {Object.values(filters).some((v) => v) && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(filters).map(
                        ([key, value]) =>
                            value && (
                                <span
                                    key={key}
                                    className="bg-[var(--primary-500)] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                >
                                    {key}: {value}
                                    <button
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                [key]: "",
                                            })
                                        }
                                        className="ml-1 hover:text-gray-200"
                                    >
                                        ×
                                    </button>
                                </span>
                            )
                    )}
                </div>
            )}
        </div>
    );
};

export default AdvancedSearch;
