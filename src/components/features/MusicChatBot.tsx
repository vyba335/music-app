"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    MessageCircle,
    Send,
    X,
    Loader2,
    Music,
    Sparkles,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChatMessage } from "@/lib/types";

interface ChatResponse {
    response: string;
    suggestions?: string[];
    relatedArtists?: string[];
    actionType?: string;
    conversationHistory: ChatMessage[];
}

const CHAT_STORAGE_KEY = "musicChatHistory";
const SUGGESTION_STORAGE_KEY = "musicChatSuggestions";

const MusicChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Load chat history from localStorage on component mount
    useEffect(() => {
        const loadChatHistory = () => {
            try {
                const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
                const savedSuggestions = localStorage.getItem(
                    SUGGESTION_STORAGE_KEY
                );

                if (savedMessages) {
                    const parsedMessages = JSON.parse(savedMessages);
                    setMessages(parsedMessages);
                    setIsInitialized(true);
                }

                if (savedSuggestions) {
                    const parsedSuggestions = JSON.parse(savedSuggestions);
                    setSuggestions(parsedSuggestions);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
                // Clear corrupted data
                localStorage.removeItem(CHAT_STORAGE_KEY);
                localStorage.removeItem(SUGGESTION_STORAGE_KEY);
            }
        };

        loadChatHistory();
    }, []);

    // Save messages to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            try {
                localStorage.setItem(
                    CHAT_STORAGE_KEY,
                    JSON.stringify(messages)
                );
            } catch (error) {
                console.error("Failed to save chat history:", error);
            }
        }
    }, [messages]);

    // Save suggestions to localStorage whenever suggestions change
    useEffect(() => {
        if (suggestions.length > 0) {
            try {
                localStorage.setItem(
                    SUGGESTION_STORAGE_KEY,
                    JSON.stringify(suggestions)
                );
            } catch (error) {
                console.error("Failed to save suggestions:", error);
            }
        }
    }, [suggestions]);

    // Initialize chat when first opened (only if no history exists)
    useEffect(() => {
        if (isOpen && !isInitialized) {
            initializeChat();
        }
    }, [isOpen, isInitialized]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const initializeChat = async () => {
        try {
            const response = await fetch("/api/ai/chat");
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.suggestions || []);

                // Add welcome message
                const welcomeMessage: ChatMessage = {
                    role: "assistant",
                    content:
                        "Hi! I'm your AI music assistant. I can help you discover music, learn about artists, and find the perfect songs for any mood. What would you like to explore?",
                    timestamp: Date.now(),
                };
                setMessages([welcomeMessage]);
                setIsInitialized(true);
            }
        } catch (error) {
            console.error("Failed to initialize chat:", error);
            setError("Failed to initialize chat assistant");
        }
    };

    const clearChatHistory = () => {
        setMessages([]);
        setSuggestions([]);
        setIsInitialized(false);
        localStorage.removeItem(CHAT_STORAGE_KEY);
        localStorage.removeItem(SUGGESTION_STORAGE_KEY);

        // Re-initialize with welcome message
        const welcomeMessage: ChatMessage = {
            role: "assistant",
            content:
                "Hi! I'm your AI music assistant. I can help you discover music, learn about artists, and find the perfect songs for any mood. What would you like to explore?",
            timestamp: Date.now(),
        };
        setMessages([welcomeMessage]);
        setIsInitialized(true);
    };

    const sendMessage = async (messageText?: string) => {
        const message = messageText || inputMessage.trim();
        if (!message || loading) return;

        setLoading(true);
        setError("");
        setInputMessage("");

        // Add user message immediately
        const userMessage: ChatMessage = {
            role: "user",
            content: message,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    conversationHistory: messages,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const data: ChatResponse = await response.json();

            // Add assistant response
            const assistantMessage: ChatMessage = {
                role: "assistant",
                content: data.response,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setSuggestions(data.suggestions || []);

            // Handle related artists (optional navigation)
            if (data.relatedArtists && data.relatedArtists.length > 0) {
                const quickNavigation = `${data.relatedArtists.map(
                    (artist, index) => (
                        <span
                            onClick={() => handleArtistClick(artist)}
                            key={index}
                            className="rounded-full mx-2 px-4 py-2"
                        >
                            {artist}
                        </span>
                    )
                )}`;
            }
        } catch (err) {
            setError("Sorry, I encountered an error. Please try again.");
            console.error("Chat error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        sendMessage(suggestion);
    };

    const handleArtistClick = (artistName: string) => {
        const artistSlug = artistName.toLowerCase().replace(/\s+/g, "-");
        router.push(`/artist/${artistSlug}`);
    };

    const formatMessageContent = (content: string) => {
        // Simple formatting for artist names (make them clickable)
        const artistPattern =
            /(Ed Sheeran|Taylor Swift|Eminem|Avril Lavigne|Linkin Park|Green Day|Justin Bieber|Radical Something|The All-American Rejects|Billie Eilish|Dua Lipa|Ariana Grande|The Weeknd|Bruno Mars|Foo Fighters|Imagine Dragons|Drake|Kendrick Lamar|Post Malone|Twenty One Pilots|Adele|Katy Perry|Rihanna|Olivia Rodrigo|Kanye West|Britney Spears|Arctic Monkeys|Coldplay|Beyonce|Mac Miller|Lady Gaga|Tame Impala|Bob Marley & The Wailers|Frank Ocean|Radiohead|OutKast|SZA|Nirvana)/gi;

        return content.split(artistPattern).map((part, index) => {
            if (artistPattern.test(part)) {
                return (
                    <button
                        key={index}
                        onClick={() => handleArtistClick(part)}
                        className="text-purple-600 hover:text-purple-800 hover:cursor-pointer underline"
                    >
                        {part}
                    </button>
                );
            }
            return part;
        });
    };

    const hasHistory = messages.length > 1; // More than welcome message

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-4 right-4 z-50 border-2 ${
                    isOpen
                        ? "bg-purple-600 border-transparent"
                        : "bg-purple-600 border-[var(--primary-500)]"
                }  text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 ${
                    hasHistory && !isOpen
                        ? "ring-2 ring-purple-300 ring-opacity-50"
                        : ""
                }`}
                aria-label="Open music chat assistant"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
                {/* Indicator for active conversation */}
                {hasHistory && !isOpen && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
            </button>

            {/* Chat Interface */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-[var(--surface-dark)] rounded-lg shadow-2xl border border-[var(--primary-500)] z-40 flex flex-col">
                    {/* Header */}
                    <div className="bg-[var(--primary-500)] text-white p-4 rounded-t-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="font-semibold">Music Assistant</h3>
                        <div className="ml-auto flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Online</span>
                            {hasHistory && (
                                <button
                                    onClick={clearChatHistory}
                                    className="ml-2 text-white hover:text-red-200 transition-colors"
                                    title="Clear chat history"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        message.role === "user"
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-100 text-gray-900"
                                    }`}
                                >
                                    <div className="text-sm">
                                        {message.role === "assistant"
                                            ? formatMessageContent(
                                                  message.content
                                              )
                                            : message.content}
                                    </div>
                                    <div
                                        className={`text-xs mt-1 ${
                                            message.role === "user"
                                                ? "text-purple-200"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {new Date(
                                            message.timestamp
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                    <span className="text-sm text-gray-600">
                                        Thinking...
                                    </span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 && !loading && (
                        <div className="px-4 py-2 border-t border-[var(--primary-500)]">
                            <div className="text-xs text-gray-300 mb-2">
                                Suggested questions:
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {suggestions
                                    .slice(0, 3)
                                    .map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    suggestion
                                                )
                                            }
                                            className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs hover:bg-purple-200 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 border-t border-[var(--primary-500)]">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about music, artists, or get recommendations..."
                                className="flex-1 p-2 border border-[var(--primary-500)] rounded-lg focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent focus-visible:outline-0 text-sm caret-[var(--primary-500)]"
                                disabled={loading}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !inputMessage.trim()}
                                className="bg-[var(--primary-500)] text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MusicChatBot;
