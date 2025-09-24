"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import type { Artist, Song, Album } from "@/lib/types";
import { useLocalStorage } from "../hooks";
import { useAudioPlayer } from "../hooks";

interface PlayHistory {
    song: Song;
    artist: Artist;
    album: Album;
    timestamp: number;
}

interface MusicContextType {
    // Current state
    currentArtist: Artist | null;
    currentAlbum: Album | null;

    // Favorites
    favorites: string[];
    addToFavorites: (artistId: string) => void;
    removeFromFavorites: (artistId: string) => void;
    toggleFavorite: (artistId: string) => void;
    isFavorite: (artistId: string) => boolean;

    // Recently played
    recentlyPlayed: PlayHistory[];
    addToRecentlyPlayed: (item: Omit<PlayHistory, "timestamp">) => void;

    // Audio player
    audioPlayer: ReturnType<typeof useAudioPlayer>;

    // Navigation
    setCurrentArtist: (artist: Artist | null) => void;
    setCurrentAlbum: (album: Album | null) => void;

    // Search history
    searchHistory: string[];
    addToSearchHistory: (query: string) => void;
    clearSearchHistory: () => void;

    // User preferences
    preferences: {
        autoplay: boolean;
        volume: number;
        theme: "light" | "dark" | "system";
    };
    updatePreferences: (
        prefs: Partial<MusicContextType["preferences"]>
    ) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function useMusicContext() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error("useMusicContext must be used within a MusicProvider");
    }
    return context;
}

interface MusicProviderProps {
    children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
    const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
    const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

    // Persistent state
    const [favorites, setFavorites] = useLocalStorage<string[]>(
        "music_favorites",
        []
    );
    const [recentlyPlayed, setRecentlyPlayed] = useLocalStorage<PlayHistory[]>(
        "recently_played",
        []
    );
    const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(
        "search_history",
        []
    );
    const [preferences, setPreferences] = useLocalStorage<
        MusicContextType["preferences"]
    >("uer_preferences", {
        autoplay: true,
        volume: 0.8,
        theme: "dark",
    });

    // Audio player
    const audioPlayer = useAudioPlayer();

    // Favorites functions
    const addToFavorites = useCallback(
        (artistId: string) => {
            setFavorites((prev) => {
                if (prev.includes(artistId)) return prev;
                return [...prev, artistId];
            });
        },
        [setFavorites]
    );

    const removeFromFavorites = useCallback(
        (artistId: string) => {
            setFavorites((prev) => prev.filter((id) => id !== artistId));
        },
        [setFavorites]
    );

    const toggleFavorite = useCallback(
        (artistId: string) => {
            setFavorites((prev) => {
                if (prev.includes(artistId)) {
                    return prev.filter((id) => id !== artistId);
                } else {
                    return [...prev, artistId];
                }
            });
        },
        [setFavorites]
    );

    const isFavorite = useCallback(
        (artistId: string) => {
            return favorites.includes(artistId);
        },
        [favorites]
    );

    // Recently played functions
    const addToRecentlyPlayed = useCallback(
        (item: Omit<PlayHistory, "timestamp">) => {
            const newItem: PlayHistory = {
                ...item,
                timestamp: Date.now(),
            };

            setRecentlyPlayed((prev) => {
                // Remove duplicate if exists
                const filtered = prev.filter(
                    (existing) =>
                        !(
                            existing.song.title === item.song.title &&
                            existing.artist.name === item.artist.name
                        )
                );

                return [newItem, ...filtered].slice(0, 50);
            });
        },
        [setRecentlyPlayed]
    );

    // Search history functions
    const addToSearchHistory = useCallback(
        (query: string) => {
            if (!query.trim()) return;

            setSearchHistory((prev) => {
                const filtered = prev.filter((item) => item !== query);
                return [query, ...filtered].slice(0, 20);
            });
        },
        [setSearchHistory]
    );

    const clearSearchHistory = useCallback(() => {
        setSearchHistory([]);
    }, [setSearchHistory]);

    // Preferences functions
    const updatePreferences = useCallback(
        (prefs: Partial<MusicContextType["preferences"]>) => {
            setPreferences((prev) => ({ ...prev, ...prefs }));

            // Update audio player volume if changed
            if (prefs.volume !== undefined) {
                audioPlayer.setVolume(prefs.volume);
            }
        },
        [setPreferences, audioPlayer]
    );

    const contextValue: MusicContextType = {
        currentArtist,
        currentAlbum,
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        recentlyPlayed,
        addToRecentlyPlayed,
        audioPlayer,
        setCurrentArtist,
        setCurrentAlbum,
        searchHistory,
        addToSearchHistory,
        clearSearchHistory,
        preferences,
        updatePreferences,
    };

    return (
        <MusicContext.Provider value={contextValue}>
            {children}
        </MusicContext.Provider>
    );
};
