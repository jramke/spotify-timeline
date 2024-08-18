import type { RefObject } from 'react';

export type MousefollowerProps = {
	stiffness?: number;
	damping?: number;
	defaultSize?: number;
	defaultRadius?: number;
	defaultOpacity?: number;
	container?: RefObject<HTMLElement> | string | null;
}

export type UseMouseStickElementProps<T extends HTMLElement = HTMLElement> = {
	label?: string;
	sublabel?: string;
	childRef?: RefObject<HTMLElement>;
}

export type StickElement = {
	element: HTMLElement;
	childElement?: HTMLElement | null;
	label?: string;
	sublabel?: string;
}

export type MouseStickContextType = {
	stickElements: StickElement[];
	registerStickElement: (element: StickElement) => void;
	unregisterStickElement: (element: HTMLElement) => void;
	hideMouseFollower: () => void;
	setHideMouseFollower: (fn: () => void) => void;
}
