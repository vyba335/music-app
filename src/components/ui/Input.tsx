import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, helperText, className = "", id, ...props }, ref) => {
        const inputId =
            id || `input-${Math.random().toString(36).substr(2, 9)}`;

        const inputClasses = `
    w-full px-4 py-3 text-white bg-transparent border rounded-lg
    ${icon ? "pl-12" : ""}
    ${
        error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-600 focus:border-blue-500"
    }
    focus:outline-none focus:ring-2 focus:ring-blue-500/20
    placeholder:text-gray-400
    transition-colors duration-200
    ${className}
  `.trim();

        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-200"
                        suppressHydrationWarning
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={inputClasses}
                        {...props}
                        suppressHydrationWarning
                    />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                {helperText && !error && (
                    <p className="text-sm text-gray-400">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
