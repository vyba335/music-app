import React from "react";

export const ArtistCardSkeleton = () => (
    <div className="bg-blac w-[450px] h-[550px] animate-pulse">
        <div className="h-full w-full bg-gray-700 rounded-lg"></div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="bg-[#272932] rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
        </div>
    </div>
);

export const SearchSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
                <div className="w-12 h-12 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);
