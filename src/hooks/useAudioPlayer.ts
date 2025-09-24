import { useState, useRef, useCallback, useEffect } from "react";
import type { Song } from "@/lib/types";

interface UseAudioPlayerReturn {
    currentTrack: Song | null;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    volume: number;
    isLoading: boolean;
    play: (track: Song, previewUrl?: string) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    togglePlay: () => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
    const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };
        const handleLoadStart = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        const handleError = () => {
            setIsLoading(false);
            console.error("Audio playback error");
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("loadstart", handleLoadStart);
        audio.addEventListener("canplay", handleCanPlay);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("loadstart", handleLoadStart);
            audio.removeEventListener("canplay", handleCanPlay);
            audio.removeEventListener("error", handleError);
        };
    }, [currentTrack]);

    const play = useCallback(
        (track: Song, previewUrl?: string) => {
            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(
                previewUrl || "/audio/preview-placeholder.mp3"
            );
            audio.volume = volume;
            audioRef.current = audio;

            setCurrentTrack(track);
            setIsPlaying(true);

            audio.play().catch((error) => {
                console.error("Playback failed:", error);
                setIsPlaying(false);
            });
        },
        [volume]
    );

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const resume = useCallback(() => {
        if (audioRef.current) {
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((error) => {
                    console.error("Resume failed:", error);
                });
        }
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setCurrentTime(0);
            setCurrentTrack(null);
        }
    }, []);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const setVolume = useCallback((newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        setVolume(clampedVolume);
        if (audioRef.current) {
            audioRef.current.volume = clampedVolume;
        }
    }, []);

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            pause();
        } else if (currentTrack) {
            resume();
        }
    }, [isPlaying, currentTrack, pause, resume]);

    return {
        currentTrack,
        isPlaying,
        duration,
        currentTime,
        volume,
        isLoading,
        play,
        pause,
        resume,
        stop,
        seek,
        setVolume,
        togglePlay,
    };
}
