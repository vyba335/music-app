import React from "react";

// Artist Card Skeleton
export const ArtistCardSkeleton = () => (
    <div className="bg-black w-[450px] h-[550px] animate-pulse relative overflow-hidden">
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>

        {/* Content area */}
        <div className="absolute bottom-0 w-full p-4">
            <div className="space-y-3">
                {/* Artist name */}
                <div className="h-6 bg-gray-600 rounded w-3/4"></div>
                {/* Artist info */}
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                {/* Album carousel area */}
                <div className="flex space-x-2 mt-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-16 h-16 bg-gray-600 rounded flex-shrink-0"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
    <div className="bg-[var(--surface-dark)] rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-lg p-4">
                    <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-600 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </div>
            ))}
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
                <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <div className="h-5 bg-gray-600 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                            <div
                                key={j}
                                className="flex items-center space-x-3"
                            >
                                <div className="w-10 h-10 bg-gray-600 rounded"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Search Results Skeleton
export const SearchSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
            <div
                key={i}
                className="flex items-center space-x-3 p-3 border-b border-gray-100"
            >
                <div className="w-12 h-12 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
        ))}
    </div>
);

// AI Component Skeleton
export const AIComponentSkeleton = () => (
    <div className="bg-[var(--surface-dark)] rounded-lg shadow-lg p-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-600 rounded"></div>
            <div className="h-6 bg-gray-600 rounded w-1/3"></div>
        </div>

        {/* Input area */}
        <div className="space-y-4">
            <div className="h-20 bg-gray-700 rounded-lg"></div>
            <div className="h-10 bg-gray-600 rounded-lg"></div>
        </div>

        {/* Results area */}
        <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-600 rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                </div>
            ))}
        </div>
    </div>
);

// Playlist Skeleton
export const PlaylistSkeleton = () => (
    <div className="bg-[var(--surface-dark)] rounded-lg shadow-lg p-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-gray-600 rounded"></div>
            <div className="h-7 bg-gray-600 rounded w-1/3"></div>
        </div>

        {/* Input */}
        <div className="space-y-4 mb-6">
            <div className="h-20 bg-gray-700 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-12 bg-gray-700 rounded border border-gray-600"
                    ></div>
                ))}
            </div>
            <div className="h-12 bg-gray-600 rounded-lg"></div>
        </div>

        {/* Generated playlist */}
        <div className="space-y-6">
            {/* Playlist header */}
            <div className="bg-gray-700 rounded-lg p-6">
                <div className="h-8 bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-600 rounded w-20"></div>
                    <div className="h-4 bg-gray-600 rounded w-24"></div>
                    <div className="h-6 bg-gray-600 rounded w-16"></div>
                </div>
            </div>

            {/* Track list */}
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg"
                    >
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                        </div>
                        <div className="w-12 h-4 bg-gray-600 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Album Carousel Skeleton
export const AlbumCarouselSkeleton = () => (
    <div className="relative w-full h-screen bg-gradient-to-br from-black via-black to-[var(--primary-500)] overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
            {/* Left side - Artist info */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
                <div className="w-full h-full bg-gray-700 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-8">
                    <div className="h-8 bg-gray-600 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/3 mb-1"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                </div>
            </div>

            {/* Right side - Album carousel */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center">
                <div className="flex space-x-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center animate-pulse"
                        >
                            <div className="w-48 h-48 bg-gray-600 rounded-lg mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded w-32"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Generic Loading Spinner
export const LoadingSpinner = ({
    size = "md",
    color = "text-[var(--primary-500)]",
}: {
    size?: "sm" | "md" | "lg";
    color?: string;
}) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    return (
        <div
            className={`animate-spin rounded-full border-2 border-gray-300 border-t-transparent ${sizeClasses[size]} ${color}`}
        ></div>
    );
};
