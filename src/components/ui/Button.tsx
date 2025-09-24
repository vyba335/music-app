import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            loading = false,
            disabled,
            icon,
            children,
            className = "",
            ...props
        },
        ref
    ) => {
        const baseClasses =
            "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variantClasses = {
            primary: "btn-primary focus:ring-blue-500",
            secondary: "btn-secondary focus:ring-gray-500",
            ghost: "btn-ghost focus:ring-gray-500",
            danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500",
        };

        const sizeClasses = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base",
        };

        const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={classes}
                {...props}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : icon ? (
                    <span className="mr-2">{icon}</span>
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
