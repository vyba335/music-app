import React, { useCallback, useEffect, useState, useRef } from "react";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";
import { LoadingSpinner } from "@/src/components/ui/LoadingStates";

interface InfiniteScrollProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    loadMore: () => Promise<void>;
    hasMore: boolean;
    loading: boolean;
    threshold?: number;
    className?: string;
    loadingComponent?: React.ReactNode;
    endMessage?: React.ReactNode;
}

export function InfiniteScroll<T>({
    items,
    renderItem,
    loadMore,
    hasMore,
    loading,
    threshold = 0.1,
    className = "",
    loadingComponent,
    endMessage,
}: InfiniteScrollProps<T>) {
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadingRef = useRef(false);

    const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
        threshold,
        triggerOnce: false,
    });

    const handleLoadMore = useCallback(async () => {
        if (loading || isLoadingMore || !hasMore || loadingRef.current) return;

        loadingRef.current = true;
        setIsLoadingMore(true);

        try {
            await loadMore();
        } catch (error) {
            console.error("Error loading more items:", error);
        } finally {
            setIsLoadingMore(false);
            loadingRef.current = false;
        }
    }, [loading, isLoadingMore, hasMore, loadMore]);

    useEffect(() => {
        if (isIntersecting && hasMore && !loading && !isLoadingMore) {
            handleLoadMore();
        }
    }, [isIntersecting, hasMore, loading, isLoadingMore, handleLoadMore]);

    return (
        <div className={className}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {renderItem(item, index)}
                </React.Fragment>
            ))}

            {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                    {loadingComponent || (
                        <LoadingSpinner
                            size="md"
                            text={isLoadingMore ? "Loading more..." : ""}
                        />
                    )}
                </div>
            )}

            {!hasMore && items.length > 0 && (
                <div className="flex justify-center py-8">
                    {endMessage || (
                        <p className="text-gray-400 text-sm">
                            You've reached the end!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
