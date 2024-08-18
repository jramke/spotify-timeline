import { useRef, useEffect } from 'react';

type MouseScrollOptions = {
    disabled?: boolean;
    edgeThreshold?: number;
    maxScrollSpeed?: number;
};

export function useMouseScroll({
    disabled = false,
    edgeThreshold = 50,
    maxScrollSpeed = 30,
}: MouseScrollOptions = {}) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let element = elementRef.current;
        if (disabled || !element) return;   
        
        if (element.contains(document.activeElement)) return;

        let isScrolling = false;
        let scrollDirection: 'left' | 'right' | null = null;
        let animationFrameId: number | null = null;
        let latestMouseEvent: MouseEvent | null = null;

        function handleMouseMove(event: MouseEvent) {
            if (!element) return;
            
            latestMouseEvent = event;
            const rect = element.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;

            if (mouseX < edgeThreshold) {
                scrollDirection = 'left';
                if (!isScrolling) {
                    isScrolling = true;
                    scrollContent();
                }
            } else if (mouseX > rect.width - edgeThreshold) {
                scrollDirection = 'right';
                if (!isScrolling) {
                    isScrolling = true;
                    scrollContent();
                }
            } else {
                scrollDirection = null;
                isScrolling = false;
                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        }

        function handleMouseLeave() {
            scrollDirection = null;
            isScrolling = false;
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }

        function scrollContent() {
            if (!isScrolling || !scrollDirection || !element) return;

            const scrollAmount = calculateScrollSpeed();

            if (scrollDirection === 'left') {
                element.scrollLeft -= scrollAmount;
            } else if (scrollDirection === 'right') {
                element.scrollLeft += scrollAmount;
            }

            animationFrameId = requestAnimationFrame(scrollContent);
        }

        function calculateScrollSpeed(): number {
            if (!latestMouseEvent || !element) return 0;

            const rect = element.getBoundingClientRect();
            const mouseX = latestMouseEvent.clientX - rect.left;

            let proximity = 0;

            if (scrollDirection === 'left') {
                proximity = Math.max(0, edgeThreshold - mouseX);
            } else if (scrollDirection === 'right') {
                proximity = Math.max(0, mouseX - (rect.width - edgeThreshold));
            }

            const speed = (proximity / edgeThreshold) * maxScrollSpeed;
            return Math.min(speed, maxScrollSpeed);
        }

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [disabled, edgeThreshold, maxScrollSpeed]);

    return elementRef;
}