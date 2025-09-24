import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
    triggerOnce?: boolean;
}

export function useIntersectionObserver(
    options: UseIntersectionObserverOptions = {}
) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null); // Edited to HMLTDivElement to get rid of an error

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const { triggerOnce = false, ...observerOptions } = options;

        const observer = new IntersectionObserver(([entry]) => {
            const isElementIntersecting = entry.isIntersecting;

            if (triggerOnce && hasTriggered) {
                return;
            }

            setIsIntersecting(isElementIntersecting);

            if (triggerOnce && isElementIntersecting) {
                setHasTriggered(true);
            }
        }, observerOptions);

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [options, hasTriggered]);

    return { ref: elementRef, isIntersecting };
}