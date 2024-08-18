'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import * as Portal from '@radix-ui/react-portal';
import { cn } from '@/lib/utils';
import { useMouseStickContext } from './mouse-stick-context';

import type { MousefollowerProps, StickElement } from './types';

const Mousefollower = ({
	stiffness = 400,
	damping = 32,
	defaultSize = 6,
	defaultRadius = 999,
	defaultOpacity = 0,
	container = null,
}: MousefollowerProps) => {
	const cursorRef = useRef(null);
	const [isSticking, setIsSticking] = useState(false);
	const [currentStickElement, setCurrentStickElement] = useState<HTMLElement | null>(null);
	const [labels, setLabels] = useState({ stickLabel: '', stickSublabel: '' });
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

	const combinedY = useTransform(() => pos.y.get() + yDelta.get());

	const mouseEventsController = new AbortController();
	const focusEventsController = new AbortController();

	const handleStickFocus = useCallback((event: FocusEvent) => {
		if (!event?.target) return;
		
		const element = event.target as HTMLElement;
		const stickElement = findStickElementByHTMLElement(element);
		if (!stickElement) return;

		const targetElement = stickElement.childElement || stickElement.element;
		handleStickToElement(targetElement, targetElement.getBoundingClientRect().top + targetElement.getBoundingClientRect().height / 2);
	}, [stickElements]);

	// const handleStickFocusLeave = useCallback((e: FocusEvent) => {
	// 	const lastElement = e.target as HTMLElement;

	// 	// const mouseY = lastElement.getBoundingClientRect().top + lastElement.getBoundingClientRect().height / 2;
	// 	// const mouseX = lastElement.getBoundingClientRect().left + lastElement.getBoundingClientRect().width / 2;
		
	// }, []);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		const { clientX: mouseX, clientY: mouseY } = e;
		const stickElement = findStickElement(mouseX, mouseY, stickElements);
	
		if (stickElement) {
			handleStickToElement(stickElement.childElement || stickElement.element, mouseY);
		} else {
			handleUnstick(mouseX, mouseY);
		}
	}, [stickElements]);

	// const handleMouseLeave = useCallback((e: MouseEvent) => {
	// 	// const { clientX: mouseX, clientY: mouseY } = e;
	// 	// handleUnstick(mouseX, mouseY);
	// 	// opacity.set(0);
	// 	hideMouseFollower(e);
	// }, []);

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
		const maxDelta = rect.height * 0.1;
		const newDelta = ((mouseY - elementCenterY) / rect.height) * maxDelta;
		yDelta.set(newDelta);
	}

	function handleStickToElement(element: HTMLElement, mouseY: number) {
		if (isSticking && currentStickElement === element) {
			updateYDelta(element, mouseY);
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

		setIsSticking(true);
		
		setCurrentStickElement(targetElement);

		const stickElement = findStickElementByHTMLElement(targetElement);
		if (stickElement) {
			setLabels({
				stickLabel: stickElement.label || '',
				stickSublabel: stickElement.sublabel || '',
			});
		}

		updateYDelta(targetElement, mouseY);
	}

	function handleUnstick(mouseX: number, mouseY: number) {	
		width.set(defaultSize);
		height.set(defaultSize);
		borderRadius.set(defaultRadius);
		opacity.set(defaultOpacity);
		yDelta.set(0);
		setIsSticking(false);
		setCurrentStickElement(null);
		setLabels({ stickLabel: '', stickSublabel: '' });

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
					x: pos.x,
					y: combinedY,
					width,
					height,
					borderRadius,
					opacity,
				}}
			>
				{/* {isSticking && (
					<div className="absolute w-20 h-[calc(100%+100px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-background inset-0 rounded-[50%]"></div>
				)} */}
				<div className="absolute w-full h-[calc(100%+60px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-spotify inset-0 rounded-[inherit] shadow-inner-shadow-float"></div>
				{labels.stickLabel && (
					<div className="absolute bottom-[calc(100%+30px)] left-1/2 -translate-x-1/2 text-nowrap text-sm mb-2">
						{labels.stickLabel}
					</div>
				)}
				{labels.stickSublabel && (
					<div className="absolute top-[calc(100%+30px)] left-1/2 -translate-x-1/2 text-nowrap text-sm mt-2">
						{labels.stickSublabel}
					</div>
				)}
			</motion.div>
		</Portal.Root>
	);
};

export default Mousefollower;
