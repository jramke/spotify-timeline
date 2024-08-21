'use client';

import { useEffect, useRef } from 'react';
import { useMouseStickContext } from './mouse-stick-context';

import type { RefObject } from 'react';
import type { UseMouseStickElementProps } from './types';

export function useMouseStickElement<T extends HTMLElement = HTMLElement>({ label, sublabel, childRef, content }: UseMouseStickElementProps<T> = {}): RefObject<T> {
	const ref = useRef<T>(null);
	const { registerStickElement, unregisterStickElement } = useMouseStickContext();

	useEffect(() => {	
		if (!ref.current) return;

		const element = ref.current;
		const childElement = childRef?.current;

		registerStickElement({ element, childElement, label, sublabel, content });

		return () => {
			unregisterStickElement(element);
		};
	}, [label, sublabel, childRef, registerStickElement, unregisterStickElement]);

	return ref;
};
