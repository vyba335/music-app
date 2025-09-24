import React, { useState, useCallback, memo } from "react";
import Image from "next/image";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";

interface LazyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    fallback?: string;
    priority?: boolean;
    onLoad?: () => void;
    fill?: boolean;
}

export const LazyImage = memo<LazyImageProps>(
    ({
        src,
        alt,
        width,
        height,
        className = "",
        fallback = "/images/placeholder.jpg",
        priority = false,
        onLoad,
        fill = false,
    }) => {
        const [imageSrc, setImageSrc] = useState(src);
        const [imageLoading, setImageLoading] = useState(true);
        const [imageError, setImageError] = useState(false);

        const { ref, isIntersecting } = useIntersectionObserver({
            triggerOnce: true,
            threshold: 0.1,
        });

        const handleImageLoad = useCallback(() => {
            setImageLoading(false);
            onLoad?.();
        }, [onLoad]);

        const handleImageError = useCallback(() => {
            setImageError(true);
            setImageLoading(false);
            setImageSrc(fallback);
        }, [fallback]);

        return (
            <div ref={ref} className={`relative overflow-hidden ${className}`}>
                {/* Loading skeleton */}
                {imageLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
                )}

                {/* Image */}
                {isIntersecting && (
                    <Image
                        src={imageSrc}
                        alt={alt}
                        width={fill ? undefined : width}
                        height={fill ? undefined : height}
                        fill={fill}
                        className={`transition-opacity duration-300 ${
                            imageLoading ? "opacity-0" : "opacity-100"
                        } ${className}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        priority={priority}
                        sizes={
                            fill
                                ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                : undefined
                        }
                    />
                )}

                {/* Error state */}
                {imageError && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <div className="w-8 h-8 mx-auto mb-2">
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <p className="text-xs">Image unavailable</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

LazyImage.displayName = "LazyImage";
