import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useFavorites() {
    const [favorites, setFavorites] = useLocalStorage<string[]>("music_favorites", []);

    const addToFavorites = useCallback((artistId: string) => {
        setFavorites(prev => {
            if (prev.includes(artistId)) return prev;
            return [...prev, artistId];
        });
    }, [setFavorites]);

    const removeFromFavorites = useCallback((artistId: string) => {
        setFavorites(prev => prev.filter(id => id !== artistId));
    }, [setFavorites]);

    const toggleFavorite = useCallback((artistId: string) => {
        setFavorites(prev => {
            if (prev.includes(artistId)) {
                return prev.filter(id => id !== artistId);
            } else {
                return [...prev, artistId];
            }
        });
    }, [setFavorites]);

    const isFavorite = useCallback((artistId: string) => {
        return favorites.includes(artistId);
    }, [favorites]);

    return {
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite
    };
}