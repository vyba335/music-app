"use client";

import React, { useState, useEffect, useRef } from "react";
import type {
    Song,
    ArtistOid,
    ArtistResult,
    SongResult,
    AlbumResult,
    LyricsResult,
    SearchResult,
} from "@/lib/types";
import {
    Search,
    Music,
    Album as LucideAlbum,
    User,
    Clock,
    Sparkles,
    Brain,
} from "lucide-react";

interface SearchComponentProps {
    onSelect?: (result: SearchResult) => void;
}

interface SmartSearchResult {
    name: string;
    type: "artist" | "song" | "album";
    reason: string;
    confidence: number;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSelect }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [smartResults, setSmartResults] = useState<SmartSearchResult[]>([]);
    const [interpretation, setInterpretation] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [artists, setArtists] = useState<ArtistOid[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [useAI, setUseAI] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/artists");
                if (response.ok) {
                    const artistData = await response.json();
                    setArtists(artistData);
                }
            } catch (error) {
                console.error("Error fetching artists:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArtists();
    }, []);

    const searchArtists = (searchQuery: string): ArtistResult[] => {
        return artists
            .filter((artist) =>
                artist.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((artist) => ({ type: "artist" as const, artist }));
    };

    const searchSongs = (searchQuery: string): SongResult[] => {
        const songResults: SongResult[] = [];

        artists.forEach((artist) => {
            artist.albums.forEach((album) => {
                album.songs.forEach((song) => {
                    if (
                        song.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    ) {
                        songResults.push({
                            type: "song",
                            artist,
                            album,
                            song,
                        });
                    }
                });
            });
        });

        return songResults;
    };

    const searchAlbums = (searchQuery: string): AlbumResult[] => {
        const albumResults: AlbumResult[] = [];

        artists.forEach((artist) => {
            artist.albums.forEach((album) => {
                if (
                    album.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                ) {
                    albumResults.push({
                        type: "album",
                        artist,
                        album,
                    });
                }
            });
        });

        return albumResults;
    };

    const searchByLyrics = (searchQuery: string): LyricsResult[] => {
        const lyricsResults: LyricsResult[] = [];

        artists.forEach((artist) => {
            artist.albums.forEach((album) => {
                album.songs.forEach((song) => {
                    if (song.lyrics && song.lyrics !== "fě") {
                        const cleanedLyrics = song.lyrics
                            .replace(/\\"/g, '"')
                            .replace(/\\'/g, "'")
                            .replace(/\\\\/g, "\\")
                            .replace(/\\n/g, "\n");

                        const lowerLyrics = cleanedLyrics.toLowerCase();
                        const lowerQuery = searchQuery.toLowerCase();

                        if (lowerLyrics.includes(lowerQuery)) {
                            const index = lowerLyrics.indexOf(lowerQuery);
                            const start = Math.max(0, index - 30);
                            const end = Math.min(
                                cleanedLyrics.length,
                                index + searchQuery.length + 30
                            );
                            let matchedText = cleanedLyrics.substring(
                                start,
                                end
                            );

                            matchedText = matchedText
                                .replace(/\n+/g, " ")
                                .trim();

                            lyricsResults.push({
                                type: "lyrics",
                                artist,
                                album,
                                song,
                                matchedText:
                                    start > 0
                                        ? "..." + matchedText
                                        : matchedText,
                            });
                        }
                    }
                });
            });
        });

        return lyricsResults;
    };

    const performRegularSearch = (searchQuery: string): SearchResult[] => {
        if (searchQuery.length < 2) return [];

        const artistResults = searchArtists(searchQuery);
        const songResults = searchSongs(searchQuery);
        const albumResults = searchAlbums(searchQuery);
        const lyricsResults = searchByLyrics(searchQuery);

        return [
            ...artistResults.slice(0, 3),
            ...songResults.slice(0, 5),
            ...albumResults.slice(0, 3),
            ...lyricsResults.slice(0, 2),
        ];
    };

    const performAISearch = async (searchQuery: string) => {
        if (searchQuery.length < 5) return;

        setIsLoading(true);
        try {
            const response = await fetch("/api/ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery }),
            });

            if (response.ok) {
                const data = await response.json();
                setSmartResults(data.results || []);
                setInterpretation(data.interpretation || "");
            }
        } catch (error) {
            console.error("AI search error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (useAI && query.length >= 5) {
                performAISearch(query);
                setResults([]);
            } else {
                const searchResults = performRegularSearch(query);
                setResults(searchResults);
                setSmartResults([]);
                setInterpretation("");
            }
            setSelectedIndex(-1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, useAI]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            const totalResults = useAI ? smartResults.length : results.length;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < totalResults - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev > 0 ? prev - 1 : totalResults - 1
                    );
                    break;
                case "Enter":
                    e.preventDefault();
                    if (selectedIndex >= 0) {
                        if (useAI && smartResults[selectedIndex]) {
                            handleSmartResultClick(smartResults[selectedIndex]);
                        } else if (!useAI && results[selectedIndex]) {
                            handleSelect(results[selectedIndex]);
                        }
                    }
                    break;
                case "Escape":
                    setIsOpen(false);
                    inputRef.current?.blur();
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedIndex, results, smartResults, useAI]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false);
        setQuery("");
        onSelect?.(result);
    };

    const handleSmartResultClick = (result: SmartSearchResult) => {
        // Find the actual artist/album/song in your data
        let artist: ArtistResult | null = null;
        let album: AlbumResult | null = null;
        let song: SongResult | null = null;
        
        for (const artistObj of artists) {
            // Check if it's an artist name match
            if (artistObj.name === result.name) {
                artist = {type: "artist", artist: artistObj};
                break;
            }

            // Check albums and songs within this artist
            for (const albumObj of artistObj.albums) {
                // Check if it's an album title match
                if (albumObj.title === result.name) {
                    album = { type: "album", artist: artistObj, album: albumObj };
                    break;
                }

                // Check if it's a song title match
                const foundSong = albumObj.songs.find(
                    (songObj) => songObj.title === result.name
                );
                if (foundSong) {
                    song = {
                        type: "song",
                        artist: artistObj,
                        album: albumObj,
                        song: foundSong,
                    };
                    break;
                }
            }

            // Break out of outer loop if we found a match
            if (album || song) break;
        }

        const typeMap = { artist, album, song };
        const item = typeMap[result.type as keyof typeof typeMap];
        if (item) {
            handleSelect(item as SearchResult);
        }
    };

    const hasLyrics = (song: Song): boolean => {
        return !!(song.lyrics && song.lyrics !== "fě");
    };

    const renderResult = (result: SearchResult, index: number) => {
        const isSelected = index === selectedIndex;
        const baseClasses = `px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
            isSelected
                ? "bg-blue-50 dark:bg-blue-900/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
        }`;

        switch (result.type) {
            case "artist":
                return (
                    <div
                        key={`artist-${result.artist._id.$oid}`}
                        className={baseClasses}
                        onClick={() => handleSelect(result)}
                    >
                        <div className="flex items-center space-x-3">
                            <img
                                src={result.artist.image}
                                alt={result.artist.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {result.artist.name}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {result.artist.albums.length} album
                                    {result.artist.albums.length !== 1
                                        ? "s"
                                        : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case "song":
                return (
                    <div
                        key={`song-${result.artist._id.$oid}-${result.album.title}-${result.song.title}`}
                        className={baseClasses}
                        onClick={() => handleSelect(result)}
                    >
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <Music className="w-4 h-4 text-green-500" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {result.song.title}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                by {result.artist.name} • {result.album.title}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{result.song.length}</span>
                                </div>
                                <span>
                                    Lyrics:{" "}
                                    {hasLyrics(result.song) ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    </div>
                );

            case "album":
                const firstThreeSongs = result.album.songs.slice(0, 3);
                return (
                    <div
                        key={`album-${result.artist._id.$oid}-${result.album.title}`}
                        className={baseClasses}
                        onClick={() => handleSelect(result)}
                    >
                        <div className="flex space-x-3">
                            <img
                                src={result.album.cover}
                                alt={result.album.title}
                                className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                    <LucideAlbum className="w-4 h-4 text-purple-500" />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {result.album.title}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    by {result.artist.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {result.album.songs.length} songs •{" "}
                                    {result.album.released}
                                </p>
                                <p className="text-xs text-gray-500  dark:text-gray-400">
                                    {firstThreeSongs
                                        .map((song) => song.title)
                                        .join(", ")}
                                    {result.album.songs.length > 3 && "..."}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case "lyrics":
                return (
                    <div
                        key={`lyrics-${result.artist._id.$oid}-${result.album.title}-${result.song.title}`}
                        className={baseClasses}
                        onClick={() => handleSelect(result)}
                    >
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <Search className="w-4 h-4 text-orange-500" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {result.song.title}
                                </span>
                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded dark:bg-orange-900/50 dark:text-orange-400">
                                    Lyrics match
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                by {result.artist.name} • {result.album.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2">
                                "{result.matchedText}"
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderSmartResult = (result: SmartSearchResult, index: number) => {
        const isSelected = index === selectedIndex;
        const baseClasses = `px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${isSelected ? "bg-purple-50" : "hover:bg-purple-25"}`;

        return (
            <div key={`smart-${index}`} className={baseClasses} onClick={() => handleSmartResultClick(result)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <div>
                            <span className="font-medium text-gray-900">{result.name}</span>
                            <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                                {result.type}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">{result.reason}</p>
                        </div>
                    </div>
                    <span className="text-xs text-purple-600 font-medium">
                        {result.confidence}% match
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#95c623] w-5 h-5" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={useAI ? "Try: 'upbeat songs for working out'" : "Search artists, songs, albums, lyrics..."}
                    className="w-full pl-10 pr-4 py-2 border border-[#95c623] rounded-lg focus:ring-2 focus:ring-[#95c623] focus:border-transparent outline-none caret-[#95c623] text-white"
                    disabled={isLoading}
                    suppressHydrationWarning
                />
                <button 
                    onClick={() => setUseAI(!useAI)}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded ${useAI ? "text-purple-500" : "text-gray-400"} hover:text-purple-600 transition-colors`}
                    title={useAI ? "Switch to regular search" : "Switch to AI search"}
                    >
                        <Sparkles className="w-4 h-4" />
                </button>
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
                    </div>
                )}
            </div>

            {isOpen && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {useAI && interpretation && (
                        <div className="px-4 py-2 bg-purple-50 border-b border-purple-100 ">
                            <p className="text-sm text-purple-700">
                                <Sparkles className="w-3 h-3 inline mr-1" />
                                AI understands: {interpretation}
                            </p>
                        </div>
                    )}

                    {useAI ? (
                        smartResults.length > 0 ? (
                            <div>
                                {smartResults.map((result, index) => renderSmartResult(result, index))}
                            </div>
                        ) : query.length >= 5 && !isLoading ? (
                            <div className="px-4 py-3 text-gray-500 text-center text-sm">
                                No AI results found for "{query}"
                            </div>
                        ) : null
                    ) : (
                        results.length > 0 ? (
                            <div>
                                {results.map((result, index) => renderResult(result, index))}
                            </div>
                        ) : (
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center text-sm">
                                No results found for "{query}"
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
