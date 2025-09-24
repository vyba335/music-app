"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Heart, Play, Music, Calendar } from 'lucide-react';
import Image from 'next/image';
import type { Artist } from "@/lib/types";
import { Card, Button, Badge } from '@/src/components/ui';
import { useMusicContext } from '@/src/contexts/MusicContext';
import { useIntersectionObserver } from '@/src/hooks/useIntersectionObserver';
import { artistNameToSlug } from '@/src/utils/urlUtils';

interface ArtistCardProps {
    artist: Artist;
    showPlayButton?: boolean;
    className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ 
    artist, 
    showPlayButton = true,
    className = '' 
}) => {
    const router = useRouter();
    const { isFavorite, toggleFavorite, audioPlayer, setCurrentArtist } = useMusicContext();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // Intersection observer for lazy loading
    const { ref, isIntersecting } = useIntersectionObserver({
        triggerOnce: true,
        threshold: 0.1,
    });

    const isArtistFavorited = isFavorite(artist._id);
    const albumCount = artist.albums?.length || 0;
    const songCount = artist.albums?.reduce((total, album) => total + album.songs.length, 0) || 0;

    const handleArtistClick = () => {
        const artistSlug = artistNameToSlug(artist.name);
        setCurrentArtist(artist);
        router.push(`/artist/${artistSlug}`);
    };

    const handleAlbumClick = (albumIndex: number, event: React.MouseEvent) => {
        event.stopPropagation();
        const artistSlug = artistNameToSlug(artist.name)
        setCurrentArtist(artist);
        router.push(`/artist/${artistSlug}?album=${albumIndex}`);
    };

    const handleFavoriteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        toggleFavorite(artist._id);
    };

    const handlePlayClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        // Play first song from first album
        if (artist.albums?.[0]?.songs?.[0]) {
            const firstSong = artist.albums[0].songs[0];
            audioPlayer.play(firstSong);
            setCurrentArtist(artist);
        }
    };

    const getArtistImage = () => {
        if (imageError) {
            return '/images/artist-placeholder.jpg';
        }
        return artist.image || '/images/artist-placeholder.jpg';
    };

    return (
        <div ref={ref} className={`group ${className}`}>
            <Card 
                interactive
                variant="glass" 
                className="h-full overflow-hidden animate-fade-in-up"
                onClick={handleArtistClick}
            >
                {/* Artist Image */}
                <div className="relative aspect-square overflow-hidden">
                    {isIntersecting && (
                        <Image
                            src={getArtistImage()}
                            alt={`${artist.name} portrait`}
                            fill
                            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                        />
                    )}
                    
                    {/* Loading skeleton */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            {showPlayButton && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={<Play className="w-4 h-4" />}
                                    onClick={handlePlayClick}
                                    className="backdrop-blur-sm"
                                >
                                    Play
                                </Button>
                            )}
                            
                            <Button
                                variant={isArtistFavorited ? "danger" : "secondary"}
                                size="sm"
                                icon={
                                    <Heart 
                                        className={`w-4 h-4 ${
                                            isArtistFavorited ? 'fill-current' : ''
                                        }`} 
                                    />
                                }
                                onClick={handleFavoriteClick}
                                className="backdrop-blur-sm"
                            >
                                {isArtistFavorited ? 'Loved' : 'Like'}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Favorite indicator */}
                    {isArtistFavorited && (
                        <div className="absolute top-3 right-3">
                            <Heart className="w-5 h-5 text-red-500 fill-current drop-shadow-lg" />
                        </div>
                    )}
                </div>

                {/* Artist Info */}
                <div className="p-6">
                    <div className="mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:gradient-text transition-all duration-300 line-clamp-1">
                            {artist.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-1">
                            {artist.nationality && (
                                <Badge variant="info" size="sm">
                                    {artist.nationality}
                                </Badge>
                            )}
                            {artist.birthday && (
                                <div className="flex items-center gap-1 text-gray-400 text-sm">
                                    <Calendar className="w-3 h-3" />
                                    <span>{artist.birthday}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                            <Music className="w-4 h-4" />
                            <span>{albumCount} album{albumCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span>{songCount} song{songCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Album Preview */}
                    {artist.albums && artist.albums.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-300">Latest Albums</h4>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {artist.albums.slice(0, 3).map((album, index) => (
                                    <button
                                        key={album.title}
                                        onClick={(e) => handleAlbumClick(index, e)}
                                        className="flex-shrink-0 group/album"
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 hover:cursor-pointer">
                                            <Image
                                                src={album.cover || '/images/album-placeholder.jpg'}
                                                alt={album.title}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover group-hover/album:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 w-12 truncate">
                                            {album.title}
                                        </p>
                                    </button>
                                ))}
                                {artist.albums.length > 3 && (
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                                        +{artist.albums.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};