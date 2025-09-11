"use client";
import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import type { Artist, Album, Song } from "@/lib/types";
import "@/styles/albumcarousel.css";

interface SelectedAlbum extends Album {
    index: number;
}

interface AlbumCarouselProps {
    artistData: Artist;
    activeAlbumIndex: number | null;
}

const ROTATION_SPEEDS = {
    MOBILE: 0.15,
    DESKTOP: 0.25,
} as const;

const DRAG_SENSITIVITY = -0.5;
const MIN_DRAG_DISTANCE = 5;

const SPACING = {
    MOBILE: 220,
    DESKTOP: 320,
} as const;

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
    const [rotation, setRotation] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<SelectedAlbum | null>(
        null
    );
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, rotation: 0, time: 0 });
    const [dragDistance, setDragDistance] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [touchStartPosition, setTouchStartPosition] = useState({
        x: 0,
        y: 0,
    });

    const carouselRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    const albums = useMemo(
        () => artistData?.albums || [],
        [artistData?.albums]
    );
    const albumCount = albums.length;

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    useEffect(() => {
        if (activeAlbumIndex !== null && activeAlbumIndex < albums.length) {
            setSelectedAlbum({
                ...albums[activeAlbumIndex],
                index: activeAlbumIndex,
            });
        }
    }, [activeAlbumIndex, albums]);

    // Auto-rotation
    useEffect(() => {
        const animate = () => {
            if (!isHovered && !isDragging && !selectedAlbum) {
                const speed = isMobile
                    ? ROTATION_SPEEDS.MOBILE
                    : ROTATION_SPEEDS.DESKTOP;
                setRotation((prev) => prev + speed);
            }
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isHovered, isDragging, selectedAlbum, isMobile]);

    // Mouse event handlers

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || selectedAlbum) return;
            e.preventDefault();
            const deltaX = e.clientX - dragStart.x;
            const deltaRotation = deltaX * DRAG_SENSITIVITY;
            setDragDistance(Math.abs(deltaX));
            setRotation(dragStart.rotation + deltaRotation);
        },
        [isDragging, selectedAlbum, dragStart]
    );

    const handleMouseUp = useCallback(
        (e: MouseEvent) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
            setIsDragging(false);
            setTimeout(() => setDragDistance(0), 50);
        },
        [isDragging]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (!isDragging || selectedAlbum || !e.touches[0]) return;
            e.preventDefault();
            const deltaX = e.touches[0].clientX - dragStart.x;
            const deltaRotation = deltaX * DRAG_SENSITIVITY;
            setDragDistance(Math.abs(deltaX));
            setRotation(dragStart.rotation + deltaRotation);
        },
        [isDragging, selectedAlbum, dragStart]
    );

    // Mouse drag handlers

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            console.log('Carousel mousedown detected');
            if (selectedAlbum) return;

            const target = e.target as HTMLElement;
            const albumElement = target.closest("[data-album]");
            if (albumElement) {
                console.log("Click on album element, not starting drag");
                return;
            }

            e.preventDefault();
            setIsDragging(true);
            setDragDistance(0);
            setDragStart({
                x: e.clientX,
                rotation: rotation,
                time: Date.now(),
            });
        },
        [selectedAlbum, rotation]
    );

    // Touch handlers for mobile
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            console.log("Carousel touchstart detected");
            if (selectedAlbum || !e.touches[0]) return;

            const touch = e.touches[0];
            setTouchStartPosition({ x: touch.clientX, y: touch.clientY });

            setIsDragging(true);
            setDragDistance(0);
            setDragStart({
                x: touch.clientX,
                rotation: rotation,
                time: Date.now(),
            });
        },
        [selectedAlbum, rotation]
    );

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
            setIsDragging(false);
            setTimeout(() => setDragDistance(0), 50);
        },
        [isDragging]
    );

    // Album selection handler
    const handleAlbumClick = useCallback(
        (album: Album, index: number, e: React.MouseEvent) => {
            console.log(
                "Album clicked:",
                album.title,
                "Drag distance:",
                dragDistance,
                "Is dragging:",
                isDragging
            );
            if (dragDistance > MIN_DRAG_DISTANCE) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (isDragging) {
                console.log("Click prevented - currently dragging");
                return;
            }

            console.log("Setting selected album:", album.title);
            setSelectedAlbum({ ...album, index });
            setSelectedSong(null);
        },
        [dragDistance, isDragging]
    );

    // Song selection handler
    const handleSongClick = useCallback(
        (song: Song) => {
            if (song === selectedSong) {
                setSelectedSong(null);
                return;
            }
            setSelectedSong(song);
        },
        [selectedSong]
    );

    // Close handlers
    const closeAlbumView = useCallback(() => {
        setSelectedAlbum(null);
        setSelectedSong(null);
    }, []);

    // Body overflow - disable scroll on modal open
    useEffect(() => {
        if (selectedAlbum) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [selectedAlbum]);

    // Event listeners for mouse events
    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove, {
                passive: false,
            });
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const albumElements = useMemo(() => {
        if (!albums.length) return null;

        const spacing = isMobile ? SPACING.MOBILE : SPACING.DESKTOP;
        const maxDistance = isMobile
            ? DISTANCES.MAX_MOBILE
            : DISTANCES.MAX_DESKTOP;
        const containerEdge = isMobile
            ? DISTANCES.CONTAINER_EDGE_MOBILE
            : DISTANCES.CONTAINER_EDGE_DESKTOP;
        const centerOffset = -rotation * 2;

        return [...Array(3)].map((_, copyIndex) =>
            albums.map((album: Album, index: number) => {
                const totalIndex = copyIndex * albumCount + index;
                const x = totalIndex * spacing + centerOffset;
                const centerDistance = Math.abs(x);

                const centerOpacity = Math.max(
                    0,
                    1 - centerDistance / maxDistance
                );
                const edgeOpacity = Math.max(
                    0,
                    1 -
                        Math.max(0, centerDistance - containerEdge) /
                            DISTANCES.EDGE_FADE
                );
                const opacity = Math.min(centerOpacity, edgeOpacity);
                const scale = Math.max(
                    0.7,
                    1 - centerDistance / (maxDistance * 2)
                );

                return (
                    <div
                        key={`${copyIndex}-${index}`}
                        className="absolute cursor-pointer select-none flex flex-col items-center"
                        style={{
                            left: "50%",
                            top: "50%",
                            transform: `translate(calc(-50% + ${x}px), -50%) scale(${scale})`,
                            opacity: opacity,
                            transition: "opacity 0.3s ease-out",
                            pointerEvents: opacity > 0.1 ? "auto" : "none",
                        }}
                        onClick={(e: React.MouseEvent) => {
                            console.log(
                                "Album div clicked! Album:",
                                album.title,
                                "opacity:",
                                opacity
                            );
                            e.stopPropagation();
                            if (opacity > 0.1) {
                                handleAlbumClick(album, index, e);
                            }
                        }}
                        onMouseDown={(e: React.MouseEvent) => {
                            console.log("Album mousedown:", album.title);
                            e.stopPropagation();
                        }}
                        onTouchStart={(e: React.TouchEvent) => {
                            console.log('Album touchstart:', album.title);
                            if (e.touches[0]) {
                                setTouchStartPosition({
                                    x: e.touches[0].clientX,
                                    y: e.touches[0].clientY,
                                });
                                setDragDistance(0);
                            }
                        }}
                        onTouchMove={(e: React.TouchEvent) => {
                            if (e.touches[0]) {
                                const deltaX = Math.abs(
                                    e.touches[0].clientX - touchStartPosition.x
                                );
                                const deltaY = Math.abs(
                                    e.touches[0].clientY - touchStartPosition.y
                                );
                                const totalDistance = Math.sqrt(
                                    deltaX * deltaX + deltaY * deltaY
                                );
                                setDragDistance(totalDistance);
                                console.log(
                                    "Album touchmove distance:",
                                    totalDistance
                                );
                            }
                        }}
                        onTouchEnd={(e: React.TouchEvent) => {
                            console.log(
                                "Album touchend:",
                                album.title,
                                "drag distance:",
                                dragDistance
                            );
                            e.stopPropagation();

                            const touchDuration =
                                Date.now() - (dragStart.time || 0);
                            const isQuickTap = touchDuration < 300;
                            const isMinimalMovement =
                                dragDistance <= MIN_DRAG_DISTANCE;

                            console.log("Touch analysis:", {
                                duration: touchDuration,
                                distance: dragDistance,
                                isQuickTap,
                                isMinimalMovement,
                                shouldOpen:
                                    isQuickTap &&
                                    isMinimalMovement &&
                                    opacity > 0.1,
                            });

                            if (
                                isQuickTap &&
                                isMinimalMovement &&
                                opacity > 0.1
                            ) {
                                const syntheticEvent = {
                                    stopPropagation: () => {},
                                    preventDefault: () => {},
                                } as React.MouseEvent;
                                handleAlbumClick(album, index, syntheticEvent);
                            }

                            setTimeout(() => setDragDistance(0), 100);
                        }}
                        onDragStart={(e: React.DragEvent) => e.preventDefault()}
                    >
                        <div
                            className="w-80 h-80 md:w-48 md:h-48 lg:w-100 lg:h-100 rounded-lg overflow-hidden shadow-xl border-2 border-white/20 hover:border-[#95c623] transition-colors duration-300 mb-2"
                            data-album={album.title}
                        >
                            <img
                                src={
                                    album.cover ||
                                    "https://placehold.co/400x400.png"
                                }
                                alt={album.title || "Album cover"}
                                className="w-full h-full object-cover"
                                draggable={false}
                                loading="lazy"
                            />
                        </div>
                        <div
                            className="text-white text-sm md:text-base font-medium text-center px-2"
                            style={{ maxWidth: "200px" }}
                        >
                            {album.title}{" "}
                            {album.released && `(${album.released})`}
                        </div>
                    </div>
                );
            })
        );
    }, [
        albums,
        albumCount,
        rotation,
        isMobile,
        handleAlbumClick,
        touchStartPosition,
        dragStart.time,
    ]);

    if (!artistData) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-black via-black to-[#95c623] overflow-hidden">
            {/* Background blur when album selected */}
            {selectedAlbum && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-10"
                    onClick={closeAlbumView}
                    role="button"
                    aria-label="Close album details"
                />
            )}

            {/* Main Layout - Two Columns desktop, stacked mobile */}
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Column - Artist Image and Bio */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
                    <img
                        src={
                            artistData.image ||
                            "https://placehold.co/800x600.png"
                        }
                        alt={`${artistData.name} portrait`}
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                    {/* Artist Bio Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-8">
                        <h1 className="text-white text-2xl md:text-4xl font-bold mb-1 md:mb-2">
                            {artistData.name}
                        </h1>
                        {artistData.nationality && (
                            <p className="text-white/90 text-base md:text-lg mb-1">
                                {artistData.nationality}
                            </p>
                        )}
                        {artistData.birthday && (
                            <p className="text-white/80 text-sm md:text-base">
                                Born: {artistData?.birthday}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column - Album Carousel */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center overflow-hidden">
                    {/* 2D Infinite Horizontal Carousel */}
                    <div
                        ref={carouselRef}
                        className="relative w-full h-72 md:h-96 select-none flex items-center"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        role="region"
                        aria-label="Album carousel"
                        style={{ touchAction: "none" }}
                    >
                        {albumElements}
                    </div>
                </div>
            </div>

            {/* Album Details Panel */}
            {selectedAlbum && (
                <div
                    className="fixed top-1/2 left-1/2 bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-flip-open z-20"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    style={{
                        animation: "flipOpen 0.6s ease-out forwards",
                        transform: "translate(-50%, -50%)",
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="album-title"
                >
                    {/* Album Cover Section */}
                    <div className="relative">
                        <img
                            src={
                                selectedAlbum.cover ||
                                "https://placehold.co/400x400.png"
                            }
                            alt={`${selectedAlbum.title} album cover`}
                            className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h2
                                id="album-title"
                                className="text-xl font-bold mb-1"
                            >
                                {selectedAlbum?.title}
                            </h2>
                            {selectedAlbum.released && (
                                <p className="text-white/90">
                                    Released: {selectedAlbum.released}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={closeAlbumView}
                            className="absolute top-4 right-4 text-white hover:text-[#95c623] text-2xl font-bold bg-black/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-300"
                            aria-label="Close album details"
                        >
                            ×
                        </button>
                    </div>

                    {/* Tracklist Section */}
                    <div
                        className="p-6 overflow-y-auto"
                        style={{ maxHeight: selectedSong ? "200px" : "400px" }}
                    >
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Tracklist:
                        </h3>
                        <div className="space-y-2" role="list">
                            {selectedAlbum.songs?.map(
                                (song: Song, index: number) => (
                                    <div
                                        key={`${song.title}-${index}`}
                                        className={`flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors ${
                                            selectedSong?.title === song.title
                                                ? "bg-[#95c623]/10 border-l-4 border-[#95c623]"
                                                : ""
                                        }`}
                                        onClick={() => handleSongClick(song)}
                                        role="listitem"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                handleSongClick(song);
                                            }
                                        }}
                                    >
                                        <span className="text-gray-900">
                                            {index + 1}. {song.title}
                                        </span>
                                        {song.length && (
                                            <span className="text-gray-500">
                                                ({song.length})
                                            </span>
                                        )}
                                    </div>
                                )
                            ) || (
                                <p className="text-gray-500">
                                    No tracks available
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Lyrics Section (Hidden by default, shown when song selected) */}
                    {selectedSong && (
                        <div className="border-t bg-gray-50 p-6 max-h-64 overflow-y-auto animate-slide-down">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-gray-900">
                                    "{selectedSong.title}" Lyrics
                                </h4>
                                <button
                                    onClick={() => setSelectedSong(null)}
                                    className="text-gray-500 hover:text-[#95c623] text-lg font-bold transition-colors duration-300"
                                    aria-label="Close lyrics"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="text-gray-700 whitespace-pre-line text-sm">
                                {selectedSong.lyrics &&
                                selectedSong.lyrics !== "placeholder" &&
                                selectedSong.lyrics !== "fě"
                                    ? selectedSong.lyrics
                                    : "No lyrics available"}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AlbumCarousel;
