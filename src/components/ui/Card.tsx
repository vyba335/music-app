import React, { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    interactive?: boolean;
    variant?: "default" | "glass" | "elevated";
    children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            interactive = false,
            variant = "default",
            className = "",
            children,
            ...props
        },
        ref
    ) => {
        const baseClasses = "card";
        const interactiveClasses = interactive ? "card-interactive" : "";
        const variantClasses = {
            default: "",
            glass: "glass",
            elevated: "shadow-2xl",
        };

        const classes = `
    ${baseClasses}
    ${interactiveClasses}
    ${variantClasses[variant]}
    ${className}
  `.trim();

        return (
            <div ref={ref} className={classes} {...props}>
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
