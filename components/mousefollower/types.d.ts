import type { RefObject, ReactNode } from 'react';

export type MousefollowerProps = {
	stiffness?: number;
	damping?: number;
	defaultSize?: number;
	defaultRadius?: number;
	defaultOpacity?: number;
	container?: RefObject<HTMLElement> | string | null;
	deltaAxes?: ('x' | 'y')[];
	deltaValue?: number;
	overflowSize?: { height: number; width: number };
}

export type UseMouseStickElementProps<T extends HTMLElement = HTMLElement> = {
	label?: string;
	sublabel?: string;
	childRef?: RefObject<HTMLElement>;
	content?: ReactNode;
}

export type StickElement = {
	element: HTMLElement;
	childElement?: HTMLElement | null;
	label?: string;
	sublabel?: string;
	content?: ReactNode;
}

export type MouseStickContextType = {
	stickElements: StickElement[];
	registerStickElement: (element: StickElement) => void;
	unregisterStickElement: (element: HTMLElement) => void;
	hideMouseFollower: () => void;
	setHideMouseFollower: (fn: () => void) => void;
}
