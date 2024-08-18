'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

import type { ReactNode } from 'react';
import type { MouseStickContextType, StickElement } from './types';

const MouseStickContext = createContext<MouseStickContextType | undefined>(undefined);

export const MouseStickProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [stickElements, setStickElements] = useState<StickElement[]>([]);
	const [hideMouseFollower, setHideMouseFollower] = useState<() => void>(() => () => {});

	const registerStickElement = useCallback((newElement: StickElement) => {   
		setStickElements((prev) => [...prev, newElement]);
	}, []);

	const unregisterStickElement = useCallback((element: HTMLElement) => {
		setStickElements((prev) => prev.filter((item) => item.element !== element));
	}, []);

	return (
		<MouseStickContext.Provider value={{ stickElements, registerStickElement, unregisterStickElement, hideMouseFollower, setHideMouseFollower }}>
			{children}
		</MouseStickContext.Provider>
	);
};

export const useMouseStickContext = () => {
	const context = useContext(MouseStickContext);
	if (context === undefined) {
		throw new Error('useMouseStickContext must be used within a MouseStickContext');
	}
	return context;
};
