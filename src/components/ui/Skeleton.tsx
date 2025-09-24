import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "rectangular" | "circular";
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    variant = "rectangular",
    width,
    height,
}) => {
    const baseClasses = "skeleton";
    const variantClasses = {
        text: "h-4",
        rectangular: "rounded-lg",
        circular: "rounded-full",
    };

    const styles = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={styles}
        />
    );
};
