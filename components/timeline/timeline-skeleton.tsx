'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, debounce } from "@/lib/utils";
import TrackView from './trackview';
import { Mousefollower, useMouseStickElement, useMouseStickContext } from '@/components/mousefollower';
import { Skeleton } from '@/components/ui/skeleton';

export default function TimelineSkeleton() {

    const generateDummyData = (length: number) => {
        return Array.from({ length }).map((_, index) => {
            // Increase the chance of generating a zero-value item
            const isZeroValue = Math.random() < 0.3; // 30% chance of being a zero-value item
    
            return {
                // date: new Date(2010 + index, 0).toISOString(),
                // value: isZeroValue ? 0 : Math.floor((Math.random()) * 10),
                percentage: isZeroValue ? 0 : Math.floor(Math.random() * 100),
                // tracks: [],
            };
        });
    };
    
    const data = generateDummyData(175);

    return (
        <>
            <div aria-label='Loading Timeline' className="mx-auto flex gap-4 items-end justify-center mb-20 overflow-hidden">
                <div
                    className={cn("flex items-end pb-6 h-[400px] transition-all duration-500")}
                >
                    {data.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={cn("relative w-[9px] flex-shrink-0 flex-grow-0 rounded outline-none")}
                                style={{ height: item.percentage > 0 ? `${item.percentage}%` : '100%' }}
                            >
                                <div className="absolute size-full inset-0 flex flex-col items-center justify-end">
                                    {item.percentage === 0 ? (
                                        <Skeleton className="rounded w-[3px] h-4" />
                                    ) : (
                                        <>
                                            <Skeleton
                                                className="rounded w-[5px] h-full"   
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}