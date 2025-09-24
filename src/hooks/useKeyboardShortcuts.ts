import { useEffect } from "react";

interface Shortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            shortcuts.forEach(({ key, ctrlKey, shiftKey, altKey, callback }) => {
                if (
                    event.key.toLowerCase() === key.toLowerCase() &&
                    !!event.ctrlKey === !!ctrlKey &&
                    !!event.shiftKey === !!shiftKey &&
                    !!event.altKey === !!altKey
                ) {
                    event.preventDefault();
                    callback();
                }
            });
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [shortcuts]);
}