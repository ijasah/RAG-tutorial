// src/components/FullScreenToggle.tsx
"use client";

import { useState, useEffect } from 'react';
import { Expand, Shrink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const FullScreenToggle = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);

        // Cleanup function
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleFullScreen}>
                        {isFullscreen ? (
                            <Shrink className="h-[1.2rem] w-[1.2rem]" />
                        ) : (
                            <Expand className="h-[1.2rem] w-[1.2rem]" />
                        )}
                        <span className="sr-only">Toggle fullscreen</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
