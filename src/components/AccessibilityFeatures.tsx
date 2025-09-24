"use client";
import React, { useState, useEffect } from "react";
import {
    Eye,
    EyeOff,
    Type,
    Contrast,
    Volume2,
    VolumeX,
    Settings,
} from "lucide-react";
import { Card, Button } from "@/src/components/ui";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";

interface AccessibilitySettings {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    focusIndicators: boolean;
}

const AccessibilityFeatures: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useLocalStorage<AccessibilitySettings>(
        "accessibility_settings",
        {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            screenReader: false,
            focusIndicators: true,
        }
    );

    // Apply accessibility settings to document
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        // High contrast mode
        if (settings.highContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }

        // Large text mode
        if (settings.largeText) {
            root.classList.add("large-text");
        } else {
            root.classList.remove("large-text");
        }

        // Reduced motion mode
        if (settings.reducedMotion) {
            root.classList.add("reduced-motion");
        } else {
            root.classList.remove("reduced-motion");
        }

        // Enhanced focus indicators
        if (settings.focusIndicators) {
            root.classList.add("enhanced-focus");
        } else {
            root.classList.remove("enhanced-focus");
        }

        // Screen reader optimizations
        if (settings.screenReader) {
            root.classList.add("screen-reader-optimized");
        } else {
            root.classList.remove("screen-reader-optimized");
        }
    }, [settings]);

    // Handle individual setting changes
    const updateSetting = (key: keyof AccessibilitySettings) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Reset all settings
    const resetSettings = () => {
        setSettings({
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            screenReader: false,
            focusIndicators: true,
        });
    };

    // Check if any accessibility features are enabled
    const hasActiveSettings = Object.entries(settings).some(
        ([key, value]) => key !== "focusIndicators" && value === true
    );

    return (
        <div className="relative">
            {/* Toggle Button */}
            <Button
                variant="secondary"
                size="md"
                onClick={() => setIsOpen(!isOpen)}
                className={`
          relative transition-all duration-300
          ${hasActiveSettings ? "ring-2 ring-blue-400 ring-opacity-50" : ""}
          ${isOpen ? "bg-blue-500/20 border-blue-400" : ""}
        `}
                aria-label={`Accessibility options ${
                    isOpen ? "opened" : "closed"
                }`}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                <Eye className="w-5 h-5" />

                {/* Active indicator */}
                {hasActiveSettings && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white animate-pulse" />
                )}
            </Button>

            {/* Settings Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <Card
                        className="absolute bottom-12 right-0 w-80 max-w-[calc(100vw-2rem)] z-50 animate-fade-in-scale"
                        variant="glass"
                        role="dialog"
                        aria-labelledby="accessibility-title"
                        aria-describedby="accessibility-description"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3
                                        id="accessibility-title"
                                        className="font-semibold text-white flex items-center gap-2"
                                    >
                                        <Settings className="w-4 h-4 text-blue-400" />
                                        Accessibility Options
                                    </h3>
                                    <p
                                        id="accessibility-description"
                                        className="text-sm text-gray-400 mt-1"
                                    >
                                        Customize your viewing experience
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                    aria-label="Close accessibility options"
                                >
                                    <EyeOff className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Settings List */}
                        <div className="p-4 space-y-4">
                            {/* High Contrast */}
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="high-contrast"
                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                >
                                    <div
                                        className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${
                        settings.highContrast
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-800 text-gray-400"
                    }
                  `}
                                    >
                                        <Contrast className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">
                                            High Contrast
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Increase color contrast for better
                                            visibility
                                        </div>
                                    </div>
                                </label>
                                <button
                                    id="high-contrast"
                                    role="switch"
                                    aria-checked={settings.highContrast}
                                    onClick={() =>
                                        updateSetting("highContrast")
                                    }
                                    className={`
                    relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    ${settings.highContrast ? "bg-blue-500" : "bg-gray-600"}
                  `}
                                >
                                    <div
                                        className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${
                        settings.highContrast
                            ? "translate-x-6"
                            : "translate-x-0.5"
                    }
                  `}
                                    />
                                </button>
                            </div>

                            {/* Large Text */}
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="large-text"
                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                >
                                    <div
                                        className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${
                        settings.largeText
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-800 text-gray-400"
                    }
                  `}
                                    >
                                        <Type className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">
                                            Large Text
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Increase text size throughout the
                                            app
                                        </div>
                                    </div>
                                </label>
                                <button
                                    id="large-text"
                                    role="switch"
                                    aria-checked={settings.largeText}
                                    onClick={() => updateSetting("largeText")}
                                    className={`
                    relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    ${settings.largeText ? "bg-green-500" : "bg-gray-600"}
                  `}
                                >
                                    <div
                                        className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${settings.largeText ? "translate-x-6" : "translate-x-0.5"}
                  `}
                                    />
                                </button>
                            </div>

                            {/* Reduced Motion */}
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="reduced-motion"
                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                >
                                    <div
                                        className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${
                        settings.reducedMotion
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-gray-800 text-gray-400"
                    }
                  `}
                                    >
                                        <EyeOff className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">
                                            Reduce Motion
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Minimize animations and transitions
                                        </div>
                                    </div>
                                </label>
                                <button
                                    id="reduced-motion"
                                    role="switch"
                                    aria-checked={settings.reducedMotion}
                                    onClick={() =>
                                        updateSetting("reducedMotion")
                                    }
                                    className={`
                    relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    ${settings.reducedMotion ? "bg-purple-500" : "bg-gray-600"}
                  `}
                                >
                                    <div
                                        className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${
                        settings.reducedMotion
                            ? "translate-x-6"
                            : "translate-x-0.5"
                    }
                  `}
                                    />
                                </button>
                            </div>

                            {/* Enhanced Focus */}
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="focus-indicators"
                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                >
                                    <div
                                        className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${
                        settings.focusIndicators
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-800 text-gray-400"
                    }
                  `}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">
                                            Enhanced Focus
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Stronger focus indicators for
                                            keyboard navigation
                                        </div>
                                    </div>
                                </label>
                                <button
                                    id="focus-indicators"
                                    role="switch"
                                    aria-checked={settings.focusIndicators}
                                    onClick={() =>
                                        updateSetting("focusIndicators")
                                    }
                                    className={`
                    relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    ${
                        settings.focusIndicators
                            ? "bg-yellow-500"
                            : "bg-gray-600"
                    }
                  `}
                                >
                                    <div
                                        className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${
                        settings.focusIndicators
                            ? "translate-x-6"
                            : "translate-x-0.5"
                    }
                  `}
                                    />
                                </button>
                            </div>

                            {/* Screen Reader Mode */}
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="screen-reader"
                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                >
                                    <div
                                        className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${
                        settings.screenReader
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-800 text-gray-400"
                    }
                  `}
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">
                                            Screen Reader Mode
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Optimize interface for screen
                                            readers
                                        </div>
                                    </div>
                                </label>
                                <button
                                    id="screen-reader"
                                    role="switch"
                                    aria-checked={settings.screenReader}
                                    onClick={() =>
                                        updateSetting("screenReader")
                                    }
                                    className={`
                    relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    ${settings.screenReader ? "bg-red-500" : "bg-gray-600"}
                  `}
                                >
                                    <div
                                        className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${
                        settings.screenReader
                            ? "translate-x-6"
                            : "translate-x-0.5"
                    }
                  `}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-400">
                                    {hasActiveSettings
                                        ? `${
                                              Object.values(settings).filter(
                                                  Boolean
                                              ).length
                                          } features active`
                                        : "All features disabled"}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetSettings}
                                    disabled={!hasActiveSettings}
                                    className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reset All
                                </Button>
                            </div>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default AccessibilityFeatures;
