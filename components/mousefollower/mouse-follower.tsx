'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import * as Portal from '@radix-ui/react-portal';
import { cn } from '@/lib/utils';
import { useMouseStickContext } from './mouse-stick-context';

import type { MousefollowerProps, StickElement } from './types';
import type { ReactNode } from 'react';

const Mousefollower = ({
	stiffness = 400,
	damping = 32,
	defaultSize = 6,
	defaultRadius = 999,
	defaultOpacity = 0,
	container = null,
	deltaAxes = ['x', 'y'],
	deltaValue = 0.1,
	overflowSize = { height: 0, width: 0 },
}: MousefollowerProps) => {
	const cursorRef = useRef(null);
	const [isSticking, setIsSticking] = useState(false);
	const [currentStickElement, setCurrentStickElement] = useState<HTMLElement | null>(null);
	const [labels, setLabels] = useState({ stickLabel: '', stickSublabel: '' });
	const [content, setContent] = useState<ReactNode | null>(null);
	const { stickElements, setHideMouseFollower } = useMouseStickContext();

	const pos = {
		x: useSpring(0, { stiffness, damping }),
		y: useSpring(0, { stiffness, damping }),
	};
	const width = useSpring(defaultSize, { stiffness, damping });
	const height = useSpring(defaultSize, { stiffness, damping });
	const borderRadius = useSpring(defaultRadius, { stiffness, damping });
	const opacity = useSpring(defaultOpacity, { stiffness, damping });
	const yDelta = useSpring(0, { stiffness: 400, damping: 40 });
	const xDelta = useSpring(0, { stiffness: 400, damping: 40 });

	const combinedY = useTransform(() => pos.y.get() + yDelta.get());
	const combinedX = useTransform(() => pos.x.get() + xDelta.get());

	const mouseEventsController = new AbortController();
	const focusEventsController = new AbortController();

	const handleStickFocus = useCallback((event: FocusEvent) => {
		if (!event?.target) return;
		
		const element = event.target as HTMLElement;
		const stickElement = findStickElementByHTMLElement(element);
		if (!stickElement) return;

		const targetElement = stickElement.childElement || stickElement.element;
		handleStickToElement(targetElement, targetElement.getBoundingClientRect().top + targetElement.getBoundingClientRect().height / 2, targetElement.getBoundingClientRect().left + targetElement.getBoundingClientRect().width / 2);
	}, [stickElements]);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		const { clientX: mouseX, clientY: mouseY } = e;
		const stickElement = findStickElement(mouseX, mouseY, stickElements);
	
		if (stickElement) {
			handleStickToElement(stickElement.childElement || stickElement.element, mouseY, mouseX);
		} else {
			handleUnstick(mouseX, mouseY);
		}
	}, [stickElements]);

	useEffect(() => {		
		let containerEl: HTMLElement;

		if (typeof container === 'string') {
			containerEl = document.querySelector(container) as HTMLElement;
		} else if (container && 'current' in container) {
			containerEl = container.current || document.body;
		} else {
			containerEl = document.body;
		}

		if (!containerEl) {
			throw new Error('Container element not found');
		}

		containerEl.addEventListener('mousemove', handleMouseMove, { signal: mouseEventsController.signal });
		containerEl.addEventListener('mouseleave', (e) => hideMouseFollower(e), { signal: mouseEventsController.signal });
		containerEl.addEventListener('mouseenter', handleMouseMove, { signal: mouseEventsController.signal });

		return () => {
			mouseEventsController.abort();
		};
	}, [container, handleMouseMove]);

	useEffect(() => {
		stickElements.forEach((stickElement) => {
			stickElement.element.addEventListener('focus', handleStickFocus, { signal: focusEventsController.signal });
			stickElement.element.addEventListener('focusout', () => hideMouseFollower(), { signal: focusEventsController.signal });
		});

		return () => {
			focusEventsController.abort();
		};
	}, [stickElements, handleStickFocus]);

	useEffect(() => {
		setHideMouseFollower(() => hideMouseFollower);
	}, [setHideMouseFollower]);

	function findStickElement(mouseX: number, mouseY: number, stickElements: StickElement[]) {
		return (
			stickElements.find((stickElement) => {
				const rect = stickElement.element.getBoundingClientRect();
				return (
					mouseX >= rect.left &&
					mouseX <= rect.right &&
					mouseY >= rect.top &&
					mouseY <= rect.bottom
				);
			}) || null
		);
	}

	function updateYDelta(element: HTMLElement, mouseY: number) {
		const rect = element.getBoundingClientRect();
		const elementCenterY = rect.top + rect.height / 2;
		const maxDelta = rect.height * deltaValue;
		const newDelta = ((mouseY - elementCenterY) / rect.height) * maxDelta;
		yDelta.set(newDelta);
	}

	function updateXDelta(element: HTMLElement, mouseX: number) {
		const rect = element.getBoundingClientRect();
		const elementCenterX = rect.left + rect.width / 2;
		const maxDelta = rect.width * deltaValue;
		const newDelta = ((mouseX - elementCenterX) / rect.width) * maxDelta;
		xDelta.set(newDelta);
	}

	function handleStickToElement(element: HTMLElement, mouseY: number, mouseX: number) {
		if (isSticking && currentStickElement === element) {
			if (deltaAxes.includes('x')) updateXDelta(element, mouseX);
			if (deltaAxes.includes('y')) updateYDelta(element, mouseY);
			return;
		}

		const targetElement = element;

		const rect = targetElement.getBoundingClientRect();
		const elementStyle = getComputedStyle(targetElement);

		width.set(rect.width);
		height.set(rect.height);
		borderRadius.set(
			parseFloat(elementStyle.borderRadius) || defaultRadius
		);
		opacity.set(parseFloat(elementStyle.opacity) || defaultOpacity);

		pos.x.set(rect.left);
		pos.y.set(rect.top);
		yDelta.set(0);
		xDelta.set(0);

		setIsSticking(true);
		
		setCurrentStickElement(targetElement);

		const stickElement = findStickElementByHTMLElement(targetElement);
		if (stickElement) {
			setLabels({
				stickLabel: stickElement.label || '',
				stickSublabel: stickElement.sublabel || '',
			});
			setContent(stickElement.content || null);
		}

		updateYDelta(targetElement, mouseY);
		updateXDelta(targetElement, mouseX);
	}

	function handleUnstick(mouseX: number, mouseY: number) {	
		width.set(defaultSize);
		height.set(defaultSize);
		borderRadius.set(defaultRadius);
		opacity.set(defaultOpacity);
		yDelta.set(0);
		xDelta.set(0);
		setIsSticking(false);
		setCurrentStickElement(null);
		setLabels({ stickLabel: '', stickSublabel: '' });
		setContent(null);

		pos.x.set(mouseX - defaultSize / 2);
		pos.y.set(mouseY - defaultSize / 2);
	}

	function hideMouseFollower(event?: MouseEvent) {
		let x, y;
		if (event instanceof MouseEvent) {
			x = event.clientX;
			y = event.clientY;
		} else {
			x = pos.x.get() + width.get() / 2;
			y = pos.y.get() + height.get() / 2;
		}

		handleUnstick(x, y);
		opacity.set(0);
	}

	function findStickElementByHTMLElement(element: HTMLElement) {
		return stickElements.find((stickEl) => stickEl.element === element || stickEl.childElement === element);
	}

	return (
		<Portal.Root>
			<motion.div
				aria-hidden="true"
				ref={cursorRef}
				className={cn(
					'fixed z-[1000] will-change-transform pointer-events-none top-0 left-0',
					!isSticking && 'overflow-hidden'
				)}
				style={{
					x: combinedX,
					y: combinedY,
					width,
					height,
					borderRadius,
					opacity,
				}}
			>
				<div style={{ height: `calc(100% + ${overflowSize.height * 2}px)`, width: `calc(100% + ${overflowSize.width * 2}px)` }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-spotify inset-0 rounded-[inherit] shadow-inner-shadow-float grid place-items-center">
					{content}
				</div>
				{labels.stickLabel && (
					<div style={{ bottom: `calc(100% + ${overflowSize.height}px)` }} className="absolute left-1/2 -translate-x-1/2 text-nowrap text-sm mb-2">
						{labels.stickLabel}
					</div>
				)}
				{labels.stickSublabel && (
					<div style={{ top: `calc(100% + ${overflowSize.height}px)` }} className="absolute left-1/2 -translate-x-1/2 text-nowrap text-sm mt-2">
						{labels.stickSublabel}
					</div>
				)}
			</motion.div>
		</Portal.Root>
	);
};

export default Mousefollower;
