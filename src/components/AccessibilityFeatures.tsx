"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Type, Contrast } from "lucide-react";

const AccessibilityFeatures: React.FC = () => {
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Apply accessibility settings
        const root = document.documentElement;

        if (highContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast")
        }

        if (largeText) {
            root.classList.add('large-text');
        } else {
            root.classList.remove('large-text');
        }
        
        if (reducedMotion) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }
    }, [highContrast, largeText, reducedMotion]);

    return (
        <div className="fixed top-3 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="Accessibility options"
            >
                <Eye className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border p-4 min-w-[250px]">
                    <h3 className="font-semibold text-gray-900 mb-3">Accessibility Options</h3>

                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                title="High contrast"
                                type="checkbox"
                                checked={highContrast}
                                onChange={(e) => setHighContrast(e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <Contrast className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">High Contrast</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                title="Large text"
                                type="checkbox"
                                checked={largeText}
                                onChange={(e) => setLargeText(e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <Type className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Large Text</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                title="Reduced motion"
                                type="checkbox"
                                checked={reducedMotion}
                                onChange={(e) => setReducedMotion(e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <EyeOff className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Reduce Motion</span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessibilityFeatures;