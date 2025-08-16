// src/components/ANNVisualization.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, ArrowLeft, ListTree, Sparkles, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

// --- Data and Types ---
type Point = { id: number; x: number; y: number; };

const WIDTH = 550;
const HEIGHT = 500;
const PADDING = 40;

// Manually estimated coordinates to match the user's diagram
const initialPoints: Point[] = [
    { id: 1, x: 2.0, y: 2.8 }, { id: 2, x: 4.0, y: 8.5 }, { id: 3, x: 8.0, y: 9.0 },
    { id: 4, x: 1.2, y: 1.8 }, { id: 5, x: 2.2, y: 1.5 }, { id: 6, x: 6.5, y: 8.2 },
    { id: 7, x: 7.8, y: 5.5 }, { id: 8, x: 1.0, y: 0.8 }, { id: 9, x: 4.8, y: 6.0 },
    { id: 10, x: 8.5, y: 7.5 }, { id: 11, x: 6.0, y: 4.5 }, { id: 12, x: 6.8, y: 9.5 },
    { id: 13, x: 2.8, y: 2.2 }, { id: 14, x: 8.8, y: 4.8 }, { id: 15, x: 2.0, y: 9.5 },
    { id: 16, x: 5.5, y: 3.0 },
];

// Manually defined lines to match the user's diagram
const lines = [
    { id: 'red', p1: { x: 0, y: 3.5 }, p2: { x: 8, y: 0 }, color: 'hsl(var(--destructive))' },
    { id: 'blue', p1: { x: 0, y: 7.5 }, p2: { x: 10, y: 1.5 }, color: 'hsl(var(--primary))' },
    { id: 'purple', p1: { x: 1.5, y: 10 }, p2: { x: 5, y: 6.5 }, color: 'hsl(262, 84%, 58%)' },
    { id: 'orange', p1: { x: 3.5, y: 7.5 }, p2: { x: 10, y: 6 }, color: 'hsl(24, 91%, 50%)' },
    { id: 'magenta', p1: { x: 6.5, y: 6.5 }, p2: { x: 10, y: 0 }, color: 'hsl(300, 76%, 59%)' },
];

const queryPoint = { id: 0, x: 1.5, y: 0.5 }; // Lies in R1

const getCoords = (p: { x: number; y: number; }) => ({
    x: PADDING + (p.x / 10) * (WIDTH - PADDING * 2),
    y: PADDING + (1 - (p.y / 10)) * (HEIGHT - PADDING * 2),
});

// A simplified helper to determine which final region a point belongs to.
// This is specific to the hardcoded diagram.
const getRegionForPoint = (p: Point): number => {
    if (p.x > 6.5 && p.y > 6.0) return 4;
    if (p.x < 3.5 && p.y > 7.0) return 3;
    if (p.x > 8.0 && p.y < 5.0) return 6;
    if (p.x < 4.0 && p.y < 3.0) return 1;
    if (p.x > 6.0 && p.y < 4.0) return 5;
    return 2;
};

const regions: { [key: number]: { points: number[], name: string, color: string, coords: {x:number, y:number} } } = {
    1: { points: [4, 5, 8], name: "R1", color: 'hsla(var(--destructive), 0.1)', coords: {x: 2.0, y: 0.5} },
    2: { points: [1, 13, 16, 11, 9], name: "R2", color: 'hsla(var(--primary), 0.1)', coords: {x: 4.5, y: 3.0} },
    3: { points: [15, 2], name: "R3", color: 'hsla(262, 84%, 58%, 0.1)', coords: {x: 2.5, y: 8.0} },
    4: { points: [12, 6, 3, 10], name: "R4", color: 'hsla(24, 91%, 50%, 0.1)', coords: {x: 8.0, y: 8.5} },
    5: { points: [7], name: "R5", color: 'hsla(300, 76%, 59%, 0.1)', coords: {x: 7.0, y: 2.5} },
    6: { points: [14], name: "R6", color: 'hsla(300, 76%, 59%, 0.2)', coords: {x: 8.5, y: 3.5} },
};

export function ANNVisualization() {
    const [step, setStep] = useState(0);
    const maxSteps = lines.length + 2; // 5 lines + query + result

    const reset = () => setStep(0);
    const nextStep = () => setStep(s => Math.min(s + 1, maxSteps));
    const prevStep = () => setStep(s => Math.max(0, s - 1));

    const queryRegion = useMemo(() => getRegionForPoint(queryPoint as Point), []);
    
    const getStepDescription = () => {
        if (step === 0) return "We start with a set of 16 data points in a 2D space. Our goal is to partition this space to enable fast searches.";
        if (step > 0 && step <= lines.length) return `Step ${step}/${lines.length}: A dividing line is drawn, splitting a region into smaller sub-regions. This is repeated to form a tree-like structure.`;
        if (step === lines.length + 1) return "The space is now fully partitioned. A new query point ('X') arrives. We need to find which region it belongs to.";
        if (step === lines.length + 2) return `The query point falls into region R${queryRegion}. All points in this region (${regions[queryRegion].points.join(', ')}) are now candidates for the nearest neighbors.`;
        return "";
    };

    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTree /> Space Partitioning Simulation</CardTitle>
                <CardDescription>A step-by-step visualization of how a vector space can be partitioned for efficient nearest neighbor search.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="lg:grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                        <div className="relative border rounded-lg bg-background" style={{ width: WIDTH, height: HEIGHT }}>
                            <svg width={WIDTH} height={HEIGHT}>
                                {/* Region Fills (simplified polygons for effect) */}
                                <AnimatePresence>
                                {step > lines.length && (
                                    <>
                                        <motion.path d="M90 248 L463 460 L90 460 Z" fill={regions[1].color} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} />
                                        <motion.path d="M90 123 L490 288 L90 248 Z" fill={regions[2].color} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} />
                                        <motion.path d="M123 40 L260 215 L90 123 Z" fill={regions[3].color} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} />
                                        <motion.path d="M215 125 L490 90 L463 225 L260 215 Z" fill={regions[4].color} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} />
                                        <motion.path d="M365 215 L490 460 L490 288 L463 225 Z" fill={regions[5].color.replace('0.1', '0.2')} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} />
                                        <motion.path d="M490 225 L463 460 L365 215 Z" fill={regions[6].color} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} />

                                         {/* Highlighted Search Region */}
                                        {step === maxSteps && queryRegion === 1 && <motion.path d="M90 248 L463 460 L90 460 Z" fill={regions[1].color.replace('0.1','0.4')} initial={{opacity:0}} animate={{opacity:1}} />}
                                    </>
                                )}
                                </AnimatePresence>

                                {/* Dividing Lines */}
                                <AnimatePresence>
                                {lines.slice(0, step).map((line) => (
                                    <motion.line
                                        key={line.id}
                                        x1={getCoords(line.p1).x} y1={getCoords(line.p1).y}
                                        x2={getCoords(line.p2).x} y2={getCoords(line.p2).y}
                                        stroke={line.color} strokeWidth="2.5"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                ))}
                                </AnimatePresence>
                                
                                {/* Region Labels */}
                                {step > lines.length && Object.values(regions).map(r => (
                                    <text key={r.name} x={getCoords(r.coords).x} y={getCoords(r.coords).y} fontSize="20" fontWeight="bold" fill={r.color.replace(/, 0\.\d+\)/, ', 1)')} className="pointer-events-none">{r.name}</text>
                                ))}

                                {/* Data Points */}
                                {initialPoints.map((p) => {
                                    const { x, y } = getCoords(p);
                                    const pointRegion = getRegionForPoint(p);
                                    const isCandidate = step === maxSteps && pointRegion === queryRegion;
                                    return (
                                        <g key={`point-group-${p.id}`}>
                                            <motion.circle
                                                key={`point-${p.id}`}
                                                cx={x} cy={y} r={6}
                                                className={cn("stroke-muted-foreground/50", {
                                                    "fill-primary/70 stroke-primary": isCandidate,
                                                    "fill-background": !isCandidate
                                                })}
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            />
                                            <text x={x + 10} y={y + 4} className="text-[10px] fill-foreground font-semibold pointer-events-none">{p.id}</text>
                                        </g>
                                    );
                                })}

                                {/* Query Point */}
                                {step >= lines.length + 1 && (
                                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transform={`translate(${getCoords(queryPoint).x} ${getCoords(queryPoint).y})`}>
                                      <motion.path key="query-x" d="M-6 6 L6 -6 M6 6 L-6 -6" stroke="hsl(var(--destructive))" strokeWidth={3}  />
                                      <text x="10" y="5" className="fill-destructive font-bold text-lg">X</text>
                                    </motion.g>
                                )}
                            </svg>
                        </div>
                        <div className="flex justify-between items-center">
                            <Button variant="outline" onClick={prevStep} disabled={step === 0}><ArrowLeft className="mr-2 h-4 w-4" />Previous</Button>
                            <span className="text-sm text-muted-foreground">Step {step} / {maxSteps}</span>
                            <Button variant="outline" onClick={nextStep} disabled={step >= maxSteps}>Next<ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </div>
                    </div>
                     <div className="lg:col-span-2 flex flex-col justify-between">
                         <div className="space-y-4">
                            <Alert className="min-h-[100px] flex flex-col">
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>What's Happening?</AlertTitle>
                                <AlertDescription className="flex-grow flex items-center">
                                    <AnimatePresence mode="wait">
                                        <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm leading-relaxed">
                                            {getStepDescription()}
                                        </motion.p>
                                    </AnimatePresence>
                                </AlertDescription>
                            </Alert>
                             
                            {step === maxSteps && (
                                <motion.div initial={{opacity: 0, y:10}} animate={{opacity:1, y:0}}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg"><CheckCircle className="text-green-500"/> Search Result</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">The query point is in Region <strong className="text-primary">{`R${queryRegion}`}</strong>.</p>
                                        <p className="text-sm text-muted-foreground mt-2">The candidate points for nearest neighbors are:</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {regions[queryRegion].points.map(id => (
                                                <span key={id} className="font-bold text-lg text-primary bg-primary/10 px-3 py-1 rounded-md">{id}</span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                </motion.div>
                            )}

                         </div>
                        <Button onClick={reset} className="w-full mt-4"><RefreshCw className="mr-2 h-4 w-4" />Reset Simulation</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
