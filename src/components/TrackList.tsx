"use client";
import type { Album, Song } from "@/lib/types";
import "../../styles/base.css";
import "../../styles/embla.css";
import { useState } from "react";

type TrackListProps = {
    album: Album;
};

const TrackList: React.FC<TrackListProps> = ({ album }) => {
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleSongClick = (song: Song) => {
        if (selectedSong?.title === song.title && isVisible) {
            setIsVisible(false);
            setTimeout(() => setSelectedSong(null), 300);
        } else {
            setSelectedSong(song);
            setIsVisible(true);
        }
    };

    return (
        <div className="relative overflow-hidden">
            <div
                id={album.title}
                className={`grid transition-all duration-300 ease-in-out gap-4 my-5 ${
                    isVisible ? "grid-cols-4" : "grid-cols-3"
                }`}
            >
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isVisible ? "col-start-1" : "col-start-2"
                    }`}
                >
                    <img
                        alt={album.title}
                        src={album.cover}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div
                    className={`flex flex-col justify-center transition-all duration-300 ease-in-out h-full ${
                        isVisible ? "col-start-2" : "col-start-3"
                    }`}
                >
                    {album.title && <h1 className="text-5xl">{album.title}</h1>}
                    <ul className="overflow-y-auto">
                        {album.songs.map((song, index) => (
                            <li
                                key={index}
                                onClick={() => handleSongClick(song)}
                                className={`cursor-pointer p-2 rounded transition-all duration-200 ${
                                    selectedSong?.title === song.title &&
                                    isVisible
                                        ? "bg-blue-100 text-blue-800 font-semibold"
                                        : "hover:text-blue-600 hover:bg-gray-100"
                                }`}
                            >
                                {index + 1}. {song.title} ({song.length})
                            </li>
                        ))}
                    </ul>
                </div>
                <div
                    className={`flex flex-col justify-start p-4 border border-gray-200 rounded-lg transition-all duration-300 ease-in-out col-start-3 h-full overflow-y-auto ${
                        isVisible
                            ? "opacity-100 transform translate-x-0"
                            : "opacity-0 transform translate-x-full pointer-events-none absolute"
                    }`}
                >
                    {selectedSong && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-200 mb-3">
                                {selectedSong.title}
                            </h2>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-200">
                                    Duration: {selectedSong.length}
                                </p>
                                <p className="text-sm text-gray-300">
                                    From: {album.title}
                                </p>
                                <p>
                                    {selectedSong.lyrics}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackList;
