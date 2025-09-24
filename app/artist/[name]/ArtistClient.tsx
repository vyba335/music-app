"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Play, Share2, Calendar, MapPin, Music, Clock, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image';
import type { Artist, Album, Song } from "@/lib/types";
import { Card, Button, Badge } from '@/src/components/ui';
import ArtistInsights from "@/src/components/features/ArtistInsights";
import MusicChatBot from "@/src/components/features/MusicChatBot";
import { useMusicContext } from '@/src/contexts/MusicContext';
import { useIntersectionObserver } from '@/src/hooks/useIntersectionObserver';

interface ArtistClientProps {
    artist: Artist;
    artistSlug: string;
}

const ArtistClient: React.FC<ArtistClientProps> = ({ artist, artistSlug }) => {
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [showInsights, setShowInsights] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { 
        isFavorite, 
        toggleFavorite, 
        audioPlayer, 
        setCurrentArtist,
        addToRecentlyPlayed 
    } = useMusicContext();
    
    // Intersection observer for animations
    const { ref: heroRef, isIntersecting: heroVisible } = useIntersectionObserver({
        triggerOnce: true,
        threshold: 0.2,
    });

    const isArtistFavorited = isFavorite(artist._id);
    
    // Calculate artist stats
    const totalSongs = artist.albums.reduce((total, album) => total + album.songs.length, 0);
    const totalDuration = artist.albums.reduce((total, album) => 
        total + album.songs.reduce((albumTotal, song) => {
            const duration = song.length?.match(/(\d+):(\d+)/);
            if (duration) {
                return albumTotal + (parseInt(duration[1]) * 60 + parseInt(duration[2]));
            }
            return albumTotal;
        }, 0), 0
    );
    
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    // Handle URL parameters
    useEffect(() => {
        const albumParam = searchParams.get("album");
        const insightsParam = searchParams.get("insights");

        if (albumParam) {
            const albumIndex = parseInt(albumParam);
            if (!isNaN(albumIndex) && albumIndex >= 0 && albumIndex < artist.albums.length) {
                setSelectedAlbum(artist.albums[albumIndex]);
            }
        }

        if (insightsParam === "true") {
            setShowInsights(true);
        }
    }, [searchParams, artist.albums]);

    // Set current artist in context
    useEffect(() => {
        setCurrentArtist(artist);
    }, [artist, setCurrentArtist]);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (selectedAlbum || showInsights || showShareModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedAlbum, showInsights, showShareModal]);

    const handleAlbumClick = (album: Album, index: number) => {
        setSelectedAlbum(album);
        setSelectedSong(null);
        
        // Update URL using the original slug
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("album", index.toString());
        router.replace(`/artist/${artistSlug}?${newSearchParams.toString()}`);
    };

    const closeAlbumView = () => {
        setSelectedAlbum(null);
        setSelectedSong(null);
        
        // Remove album parameter from URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("album");
        const newUrl = newSearchParams.toString() 
            ? `${window.location.pathname}?${newSearchParams.toString()}`
            : window.location.pathname;
        router.replace(newUrl);
    };

    const toggleInsights = () => {
        setShowInsights(!showInsights);
        const newSearchParams = new URLSearchParams(searchParams);
        if (!showInsights) {
            newSearchParams.set("insights", "true");
        } else {
            newSearchParams.delete("insights");
        }
        router.replace(`/artist/${artistSlug}?${newSearchParams.toString()}`);
    };

    const handleFavoriteToggle = () => {
        toggleFavorite(artist._id);
    };

    const handlePlayArtist = () => {
        if (artist.albums?.[0]?.songs?.[0]) {
            const firstSong = artist.albums[0].songs[0];
            audioPlayer.play(firstSong);
            addToRecentlyPlayed({
                song: firstSong,
                artist,
                album: artist.albums[0],
            });
        }
    };

    const handleAlbumPlay = (album: Album, e: React.MouseEvent) => {
        e.stopPropagation();
        if (album.songs && album.songs.length > 0) {
            const firstSong = album.songs[0];
            audioPlayer.play(firstSong);
            addToRecentlyPlayed({
                song: firstSong,
                artist,
                album,
            });
        }
    };

    const handleSongClick = (song: Song, album: Album) => {
        if (selectedSong?.title === song.title) {
            setSelectedSong(null);
            return;
        }
        
        setSelectedSong(song);
        audioPlayer.play(song);
        addToRecentlyPlayed({
            song,
            artist,
            album,
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: `${artist.name} - Music Discovery`,
            text: `Check out ${artist.name} on Music Discovery App!`,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare?.(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    setShowShareModal(true);
                }
            }
        } else {
            setShowShareModal(true);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareModal(false);
            // You could add a toast notification here
        } catch (error) {
            console.error('Failed to copy URL');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
            {/* Hero Section */}
            <section 
                ref={heroRef}
                className={`relative overflow-hidden transition-all duration-1000 ${
                    heroVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <Image
                        src={artist.image || '/images/artist-placeholder.jpg'}
                        alt={`${artist.name} background`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-transparent to-gray-900/90" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Artist Image */}
                        <div className="lg:col-span-4 flex justify-center">
                            <Card className="p-2 glass animate-fade-in-scale">
                                <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden group">
                                    <Image
                                        src={artist.image || '/images/artist-placeholder.jpg'}
                                        alt={artist.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Button
                                            onClick={handlePlayArtist}
                                            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
                                            variant="ghost"
                                        >
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Artist Info */}
                        <div className="lg:col-span-8 text-center lg:text-left space-y-6">
                            {/* Artist Name */}
                            <div className="animate-fade-in-up space-y-2">
                                <h1 className="text-4xl md:text-6xl font-bold gradient-text">
                                    {artist.name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                    {artist.nationality && (
                                        <Badge variant="info" className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {artist.nationality}
                                        </Badge>
                                    )}
                                    {artist.birthday && (
                                        <Badge variant="default" className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Born {artist.birthday}
                                        </Badge>
                                    )}
                                    {isArtistFavorited && (
                                        <Badge variant="danger" className="flex items-center gap-1">
                                            <Heart className="w-3 h-3 fill-current" />
                                            Favorited
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="animate-fade-in-up grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                                <Card className="glass p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{artist.albums.length}</div>
                                    <div className="text-sm text-gray-400">Albums</div>
                                </Card>
                                <Card className="glass p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{totalSongs}</div>
                                    <div className="text-sm text-gray-400">Songs</div>
                                </Card>
                                <Card className="glass p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{formatDuration(totalDuration)}</div>
                                    <div className="text-sm text-gray-400">Duration</div>
                                </Card>
                            </div>

                            {/* Action Buttons */}
                            <div className="animate-fade-in-up flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                <Button
                                    onClick={handlePlayArtist}
                                    variant="primary"
                                    className="flex items-center gap-2 px-8 py-3 text-lg"
                                >
                                    <Play className="w-5 h-5" />
                                    Play Artist
                                </Button>
                                
                                <Button
                                    onClick={handleFavoriteToggle}
                                    variant={isArtistFavorited ? "danger" : "secondary"}
                                    className="flex items-center gap-2"
                                >
                                    <Heart className={`w-4 h-4 ${isArtistFavorited ? 'fill-current' : ''}`} />
                                    {isArtistFavorited ? 'Unfavorite' : 'Favorite'}
                                </Button>

                                <Button
                                    onClick={toggleInsights}
                                    variant="secondary"
                                    className="flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    AI Insights
                                </Button>

                                <Button
                                    onClick={handleShare}
                                    variant="ghost"
                                    className="flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Albums Grid Section */}
            <section className="relative z-10 -mt-16">
                <Card className="mx-4 mb-8 glass">
                    <div className="p-6 border-b border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Music className="w-6 h-6 text-blue-400" />
                                Albums
                            </h2>
                            <Badge variant="info">{artist.albums.length} Albums</Badge>
                        </div>
                    </div>
                    
                    {/* Album Grid */}
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {artist.albums.map((album, index) => (
                                <Card
                                    key={album.title}
                                    interactive
                                    className="group cursor-pointer overflow-hidden"
                                    onClick={() => handleAlbumClick(album, index)}
                                >
                                    {/* Album Cover */}
                                    <div className="relative aspect-square">
                                        <Image
                                            src={album.cover || '/images/album-placeholder.jpg'}
                                            alt={album.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        
                                        {/* Hover Play Button */}
                                        <div className="hidden sm:flex absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
                                            <Button
                                                onClick={(e) => handleAlbumPlay(album, e)}
                                                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30"
                                                variant="ghost"
                                            >
                                                <Play className="w-5 h-5 text-white ml-0.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Album Info */}
                                    <div className="p-3 space-y-1">
                                        <h3 className="font-medium text-white text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                                            {album.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{album.released}</span>
                                            <span>{album.songs.length} tracks</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </Card>
            </section>

            {/* Album Details Overlay (Mobile-friendly) */}
            {selectedAlbum && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Album Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">{selectedAlbum.title}</h2>
                            <Button
                                onClick={closeAlbumView}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Album Content */}
                        <div className="p-4 overflow-y-auto max-h-[70vh]">
                            {/* Album Info */}
                            <div className="flex gap-4 mb-6">
                                <div className="flex-shrink-0">
                                    <Image
                                        src={selectedAlbum.cover || '/images/album-placeholder.jpg'}
                                        alt={selectedAlbum.title}
                                        width={120}
                                        height={120}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-lg font-bold text-white">{selectedAlbum.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="info">
                                            Released {selectedAlbum.released}
                                        </Badge>
                                        <Badge variant="default">
                                            {selectedAlbum.songs.length} tracks
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={(e) => handleAlbumPlay(selectedAlbum, e)}
                                        variant="primary"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4" />
                                        Play Album
                                    </Button>
                                </div>
                            </div>

                            {/* Track List */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-white mb-3">Tracks:</h4>
                                {selectedAlbum.songs?.map((song: Song, index: number) => (
                                    <div
                                        key={`${song.title}-${index}`}
                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                            selectedSong?.title === song.title
                                                ? "bg-blue-500/20 border border-blue-500/50"
                                                : "hover:bg-gray-800/50"
                                        }`}
                                        onClick={() => handleSongClick(song, selectedAlbum)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-300 flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-medium text-white truncate">
                                                    {song.title}
                                                </h5>
                                                {song.length && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{song.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {selectedSong?.title === song.title && (
                                            <div className="flex items-center gap-1 text-blue-400 flex-shrink-0">
                                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                                            </div>
                                        )}
                                    </div>
                                )) || (
                                    <p className="text-gray-400 text-center py-4">No tracks available</p>
                                )}
                            </div>

                            {/* Lyrics Section */}
                            {selectedSong && (
                                <div className="mt-6 pt-4 border-t border-gray-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-white">
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

                                    <div className="bg-gray-800/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                                        {selectedSong.lyrics &&
                                        selectedSong.lyrics !== "placeholder" &&
                                        selectedSong.lyrics !== "fě" ? (
                                            <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                                                {selectedSong.lyrics}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-center py-4">
                                                No lyrics available for this song
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Insights Overlay */}
            {showInsights && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">AI Artist Insights</h2>
                            <Button
                                onClick={toggleInsights}
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[80vh]">
                            <ArtistInsights artistName={artist.name} />
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">Share Artist</h2>
                            <Button
                                onClick={() => setShowShareModal(false)}
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="p-4 space-y-3">
                            <p className="text-gray-300">Share {artist.name} with your friends:</p>
                            
                            <Button
                                onClick={copyToClipboard}
                                variant="secondary"
                                className="w-full justify-start"
                            >
                                Copy Link
                            </Button>
                            
                            <Button
                                onClick={() => {
                                    window.open(`https://twitter.com/intent/tweet?text=Check out ${artist.name} on Music Discovery!&url=${window.location.href}`, '_blank');
                                    setShowShareModal(false);
                                }}
                                variant="secondary"
                                className="w-full justify-start"
                            >
                                Share on Twitter
                            </Button>
                            
                            <Button
                                onClick={() => {
                                    window.open(`mailto:?subject=Check out ${artist.name}&body=I found this amazing artist: ${window.location.href}`, '_blank');
                                    setShowShareModal(false);
                                }}
                                variant="secondary"
                                className="w-full justify-start"
                            >
                                Share via Email
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            {/* <Button
                onClick={toggleInsights}
                className={`fixed top-20 right-4 z-40 rounded-full w-14 h-14 shadow-xl transition-all duration-300 ${
                    showInsights ? 'bg-purple-600 rotate-45' : 'btn-primary'
                }`}
                title={showInsights ? "Hide AI Insights" : "Show AI Insights"}
            >
                <Sparkles className="w-5 h-5" />
            </Button> */}

            {/* AI Chat Assistant */}
            <MusicChatBot />
        </div>
    );
};

export default ArtistClient;