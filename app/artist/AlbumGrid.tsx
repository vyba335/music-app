"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, Heart, Clock, Music, X } from "lucide-react";
import Image from 'next/image';
import type { Artist, Album, Song } from "@/lib/types";
import { Card, Button, Badge, Modal } from '@/src/components/ui';
import { LazyImage } from '@/src/components/performance/LazyImage';
import { useMusicContext } from '@/src/contexts/MusicContext';
import "@/styles/albumcarousel.css";

interface SelectedAlbum extends Album {
    index: number;
}

interface AlbumCarouselProps {
    artistData: Artist;
    activeAlbumIndex: number | null;
}

const ROTATION_SPEEDS = {
    MOBILE: 0.35,
    DESKTOP: 0.45,
} as const;

const DRAG_SENSITIVITY = -1;
const MIN_DRAG_DISTANCE = 5;
const SPACING = { MOBILE: 220, DESKTOP: 320 } as const;
const DISTANCES = {
    MAX_MOBILE: 200,
    MAX_DESKTOP: 600,
    CONTAINER_EDGE_MOBILE: 400,
    CONTAINER_EDGE_DESKTOP: 800,
    EDGE_FADE: 200,
} as const;

const AlbumCarousel: React.FC<AlbumCarouselProps> = ({
    artistData,
    activeAlbumIndex,
}) => {
    const [continuousPosition, setContinuousPosition] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<SelectedAlbum | null>(null);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, rotation: 0, time: 0 });
    const [dragDistance, setDragDistance] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const carouselRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    
    const { audioPlayer, addToRecentlyPlayed, isFavorite, toggleFavorite } = useMusicContext();

    const albums = useMemo(() => artistData?.albums || [], [artistData?.albums]);
    const albumCount = albums.length;

    // Responsive detection
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    // Auto-rotation
    useEffect(() => {
        const animate = () => {
            if (!isHovered && !isDragging && !selectedAlbum && albumCount > 0) {
                const speed = isMobile ? ROTATION_SPEEDS.MOBILE : ROTATION_SPEEDS.DESKTOP;
                setContinuousPosition((prev) => prev + speed);
            }
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isHovered, isDragging, selectedAlbum, isMobile, albumCount]);

    // Handle album selection
    const handleAlbumClick = useCallback((album: Album, index: number, e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setSelectedAlbum({ ...album, index });
        setSelectedSong(null);
    }, []);

    // Handle song selection and playback
    const handleSongClick = useCallback((song: Song, album: Album) => {
        if (selectedSong?.title === song.title) {
            setSelectedSong(null);
            return;
        }
        
        setSelectedSong(song);
        audioPlayer.play(song);
        addToRecentlyPlayed({
            song,
            artist: artistData,
            album,
        });
    }, [selectedSong, audioPlayer, addToRecentlyPlayed, artistData]);

    // Handle album play (play first song)
    const handleAlbumPlay = useCallback((album: Album, e: React.MouseEvent) => {
        e.stopPropagation();
        if (album.songs && album.songs.length > 0) {
            const firstSong = album.songs[0];
            audioPlayer.play(firstSong);
            addToRecentlyPlayed({
                song: firstSong,
                artist: artistData,
                album,
            });
        }
    }, [audioPlayer, addToRecentlyPlayed, artistData]);

    const closeAlbumView = useCallback(() => {
        setSelectedAlbum(null);
        setSelectedSong(null);
    }, []);

    // Drag handlers (simplified for modern design)
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (selectedAlbum) return;
        e.preventDefault();
        setIsDragging(true);
        setDragDistance(0);
        setContinuousPosition((currentPos) => {
            setDragStart({ x: e.clientX, rotation: currentPos, time: Date.now() });
            return currentPos;
        });
    }, [selectedAlbum]);

    // Generate album elements
    const albumElements = useMemo(() => {
        if (!albums.length) return null;

        const spacing = isMobile ? SPACING.MOBILE : SPACING.DESKTOP;
        const maxDistance = isMobile ? DISTANCES.MAX_MOBILE : DISTANCES.MAX_DESKTOP;
        const containerEdge = isMobile ? DISTANCES.CONTAINER_EDGE_MOBILE : DISTANCES.CONTAINER_EDGE_DESKTOP;

        const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
        const albumsNeeded = Math.ceil(screenWidth / spacing) + 6;
        const baseAlbumIndex = Math.floor(continuousPosition / spacing);
        const positionOffset = continuousPosition % spacing;

        const renderedAlbums = [];

        for (let i = -3; i < albumsNeeded - 3; i++) {
            const albumIndex = (baseAlbumIndex + i) % albumCount;
            const normalizedAlbumIndex = albumIndex < 0 ? albumIndex + albumCount : albumIndex;
            const album = albums[normalizedAlbumIndex];

            const x = i * spacing - positionOffset;
            const centerDistance = Math.abs(x);
            const centerOpacity = Math.max(0, 1 - centerDistance / maxDistance);
            const edgeOpacity = Math.max(0, 1 - Math.max(0, centerDistance - containerEdge) / DISTANCES.EDGE_FADE);
            const opacity = Math.min(centerOpacity, edgeOpacity);
            const scale = Math.max(0.7, 1 - centerDistance / (maxDistance * 2));

            if (opacity > 0.01) {
                renderedAlbums.push(
                    <div
                        key={`album-${normalizedAlbumIndex + i}`}
                        className="absolute cursor-pointer select-none flex flex-col items-center group"
                        style={{
                            left: "50%",
                            top: "50%",
                            transform: `translate(calc(-50% + ${x}px), -50%) scale(${scale})`,
                            opacity: opacity,
                            transition: "opacity 0.3s ease-out",
                            pointerEvents: opacity > 0.1 ? "auto" : "none",
                        }}
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            const clickDuration = Date.now() - (dragStart.time || 0);
                            const isQuickClick = clickDuration < 300;
                            const isMinimalMovement = dragDistance <= MIN_DRAG_DISTANCE;

                            if (isQuickClick && isMinimalMovement && opacity > 0.1) {
                                handleAlbumClick(album, normalizedAlbumIndex, e);
                            }
                        }}
                    >
                        {/* Modern Album Card */}
                        <Card className="glass card-interactive overflow-hidden w-72 md:w-80">
                            {/* Album Cover */}
                            <div className="relative aspect-square">
                                <Image
                                    src={album.cover || "/images/album-placeholder.jpg"}
                                    alt={album.title || "Album cover"}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <Button
                                        onClick={(e) => handleAlbumPlay(album, e)}
                                        className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30"
                                        variant="ghost"
                                    >
                                        <Play className="w-6 h-6 text-white ml-0.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Album Info */}
                            <div className="p-4 space-y-2">
                                <h3 className="font-bold text-white line-clamp-1 group-hover:gradient-text transition-all">
                                    {album.title}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <Badge variant="info" size="sm">
                                        {album.released}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                                        <Music className="w-3 h-3" />
                                        <span>{album.songs.length} tracks</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                );
            }
        }

        return renderedAlbums;
    }, [
        albums,
        albumCount,
        continuousPosition,
        isMobile,
        handleAlbumClick,
        handleAlbumPlay,
        dragStart.time,
        dragDistance,
    ]);

    if (!artistData || !albums.length) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <p className="text-gray-400">No albums available</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-96 overflow-hidden">
            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="relative w-full h-full select-none flex items-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={handleMouseDown}
                role="region"
                aria-label="Album carousel"
                style={{ touchAction: "none" }}
            >
                {albumElements}
            </div>

            {/* Album Details Modal */}
            <Modal
                isOpen={!!selectedAlbum}
                onClose={closeAlbumView}
                title={selectedAlbum?.title || ""}
                size="lg"
            >
                {selectedAlbum && (
                    <div className="space-y-6">
                        {/* Album Header */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-48 h-48 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedAlbum.cover || "/images/album-placeholder.jpg"}
                                        alt={selectedAlbum.title}
                                        width={192}
                                        height={192}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {selectedAlbum.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <Badge variant="info">
                                            Released {selectedAlbum.released}
                                        </Badge>
                                        <Badge variant="default" className="flex items-center gap-1">
                                            <Music className="w-3 h-3" />
                                            {selectedAlbum.songs.length} tracks
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleAlbumPlay(selectedAlbum, {} as React.MouseEvent)}
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    Play Album
                                </Button>
                            </div>
                        </div>

                        {/* Tracklist */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Music className="w-5 h-5 text-blue-400" />
                                Tracklist
                            </h3>
                            
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {selectedAlbum.songs?.map((song: Song, index: number) => (
                                    <Card
                                        key={`${song.title}-${index}`}
                                        interactive
                                        className={`p-3 cursor-pointer transition-all duration-200 ${
                                            selectedSong?.title === song.title
                                                ? "bg-blue-500/20 border-blue-500/50"
                                                : "hover:bg-gray-800/50"
                                        }`}
                                        onClick={() => handleSongClick(song, selectedAlbum)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-300">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-white truncate">
                                                        {song.title}
                                                    </h4>
                                                    {song.length && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{song.length}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {selectedSong?.title === song.title && (
                                                    <div className="flex items-center gap-1 text-blue-400">
                                                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                                                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                                                    </div>
                                                )}
                                                
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSongClick(song, selectedAlbum);
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Play className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                )) || (
                                    <div className="text-center py-8 text-gray-400">
                                        <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No tracks available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lyrics Section */}
                        {selectedSong && (
                            <div className="border-t border-gray-700/50 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Music className="w-5 h-5 text-purple-400" />
                                        "{selectedSong.title}" Lyrics
                                    </h4>
                                    <Button
                                        onClick={() => setSelectedSong(null)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Card className="p-4 bg-gray-900/50 max-h-48 overflow-y-auto">
                                    {selectedSong.lyrics &&
                                    selectedSong.lyrics !== "placeholder" &&
                                    selectedSong.lyrics !== "fě" ? (
                                        <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                                            {selectedSong.lyrics}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>No lyrics available for this song</p>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Navigation Hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-400">
                    <span>Drag to explore albums</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumCarousel;