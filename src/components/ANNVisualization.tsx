// src/components/ANNVisualization.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, ArrowLeft, ListTree, Sparkles, Search, CheckCircle, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

// --- Data and Types ---
type Point = { id: number; x: number; y: number; };

const K = 4; // Max items in a leaf for this demo
const WIDTH = 550;
const HEIGHT = 450;
const PADDING = 40;

const initialPoints: Point[] = [
    { id: 1, x: 1.5, y: 2.5 },
    { id: 2, x: 4, y: 8.5 },
    { id: 3, x: 8, y: 9 },
    { id: 4, x: 1.8, y: 1.5 },
    { id: 5, x: 2.5, y: 1.2 },
    { id: 6, x: 6, y: 8 },
    { id: 7, x: 7.5, y: 5.5 },
    { id: 8, x: 2.2, y: 0.8 },
    { id: 9, x: 4.5, y: 6.5 },
    { id: 10, x: 8.5, y: 7.5 },
    { id: 11, x: 5, y: 4.5 },
    { id: 12, x: 6.5, y: 9.5 },
    { id: 13, x: 2.8, y: 2.2 },
    { id: 14, x: 8.8, y: 4.8 },
    { id: 15, x: 2, y: 9.5 },
    { id: 16, x: 5.5, y: 3 },
];

const getCoords = (p: Point) => ({
    x: PADDING + (p.x / 10) * (WIDTH - PADDING * 2),
    y: PADDING + (1 - (p.y / 10)) * (HEIGHT - PADDING * 2),
});

const splitSequence = [
    { p1Id: 1, p2Id: 9, path: 'R' },
    { p1Id: 1, p2Id: 4, path: 'RL' },
    { p1Id: 6, p2Id: 12, path: 'RR' },
    { p1Id: 10, p2Id: 7, path: 'RRR' },
    { p1Id: 7, p2Id: 11, path: 'RRRL' },
];

const queryPoint = { id: 0, x: 2.5, y: 4 };

type Split = { p1: Point; p2: Point; midX: number; midY: number; angle: number; };
type TreeNode = {
    id: string;
    points: Point[];
    split?: Split;
    children?: [TreeNode, TreeNode];
    isLeaf: boolean;
    regionColor?: string;
    path: string;
};

const colors = [
    'hsla(217, 91%, 60%, 0.1)', // R1 (blue)
    'hsla(142, 71%, 41%, 0.1)', // R2 (green)
    'hsla(262, 84%, 58%, 0.1)', // R3 (purple)
    'hsla(48, 91%, 50%, 0.1)',  // R4 (yellow)
    'hsla(0, 84%, 60%, 0.1)',   // R5 (red)
    'hsla(24, 91%, 50%, 0.1)',  // R6 (orange)
];

const createTreeFromSequence = (points: Point[], sequence: typeof splitSequence): TreeNode => {
    const root: TreeNode = { id: 'node-R', points, isLeaf: false, path: 'R' };
    const queue: TreeNode[] = [root];
    let colorIndex = 0;

    sequence.forEach(splitInfo => {
        const node = queue.find(n => n.path === splitInfo.path)!;
        if (!node) return;

        const p1 = points.find(p => p.id === splitInfo.p1Id)!;
        const p2 = points.find(p => p.id === splitInfo.p2Id)!;
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const angle = Math.atan2(p1.y - p2.y, p1.x - p2.x);
        node.split = { p1, p2, midX, midY, angle };
        
        const leftPoints: Point[] = [];
        const rightPoints: Point[] = [];

        node.points.forEach(p => {
            const val = (p.x - midX) * Math.cos(angle) + (p.y - midY) * Math.sin(angle);
            (val > 0 ? leftPoints : rightPoints).push(p);
        });

        const leftChild: TreeNode = { id: `node-${splitInfo.path}L`, points: leftPoints, path: `${splitInfo.path}L`, isLeaf: true };
        const rightChild: TreeNode = { id: `node-${splitInfo.path}R`, points: rightPoints, path: `${splitInfo.path}R`, isLeaf: true };
        
        if (leftPoints.length > K) leftChild.isLeaf = false; else leftChild.regionColor = colors[colorIndex++];
        if (rightPoints.length > K) rightChild.isLeaf = false; else rightChild.regionColor = colors[colorIndex++];
        
        node.children = [leftChild, rightChild];
        queue.push(leftChild, rightChild);
    });

    return root;
};

const TreeView = ({ node, activePath }: { node?: TreeNode; activePath?: string }) => {
    if (!node) return null;
    const { split, children } = node;
    const isActive = activePath === node.path || activePath?.startsWith(node.path + 'L') || activePath?.startsWith(node.path + 'R');

    return (
        <div className="flex flex-col items-center">
            {split && (
                 <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className={cn("px-3 py-1 rounded-md border text-sm", isActive ? 'bg-primary/20 border-primary' : 'bg-muted')}>
                    ({split.p1.id}, {split.p2.id})
                 </motion.div>
            )}
            {children && (
                <div className="flex w-full mt-2">
                    <div className="w-1/2 flex flex-col items-center">
                        <div className="w-px h-4 bg-border"></div>
                        <TreeView node={children[0]} activePath={activePath} />
                    </div>
                    <div className="w-1/2 flex flex-col items-center">
                        <div className="w-px h-4 bg-border"></div>
                        <TreeView node={children[1]} activePath={activePath} />
                    </div>
                </div>
            )}
            {node.isLeaf && (
                <div className={cn("px-3 py-1 rounded-md text-xs", node.regionColor?.replace('0.1', '0.2'))}>
                    R{colors.indexOf(node.regionColor || '') + 1}: {node.points.map(p => p.id).join(', ')}
                </div>
            )}
        </div>
    );
};

export function ANNVisualization() {
    const [step, setStep] = useState(0);
    const [points] = useState<Point[]>(initialPoints);
    
    const tree = useMemo(() => createTreeFromSequence(points, splitSequence), [points]);
    
    const maxSteps = splitSequence.length + 3;

    const reset = () => setStep(0);
    const nextStep = () => setStep(s => Math.min(s + 1, maxSteps));
    const prevStep = () => setStep(s => Math.max(0, s - 1));

    const { currentSplit, splitsToDraw, activeSearchPath, finalLeaf } = useMemo(() => {
        const current = step > 0 && step <= splitSequence.length ? splitSequence[step-1] : null;
        const splits = step > 0 ? splitSequence.slice(0, step) : [];
        let searchPath = '';
        let finalNode: TreeNode | undefined;

        if (step >= splitSequence.length + 2) { // Search step
            let currentNode = tree;
            while (!currentNode.isLeaf) {
                searchPath = currentNode.path;
                const { split, children } = currentNode;
                if (!split || !children) break;
                 const val = (queryPoint.x - split.midX) * Math.cos(split.angle) + (queryPoint.y - split.midY) * Math.sin(split.angle);
                currentNode = val > 0 ? children[0] : children[1];
            }
            searchPath = currentNode.path;
            finalNode = currentNode;
        }

        return { currentSplit: current, splitsToDraw: splits, activeSearchPath: searchPath, finalLeaf: finalNode };
    }, [step, tree]);

    const getStepDescription = () => {
        if (step === 0) return "Our goal is to find nearest neighbors. We start by building a binary tree index.";
        if (step <= splitSequence.length) return `Step ${step}/${splitSequence.length}: Recursively split the space. A hyperplane is drawn between two random points (highlighted) to partition the data.`;
        if (step === splitSequence.length + 1) return "The index is built! The space is partitioned into regions, each corresponding to a leaf in our binary tree.";
        if (step === splitSequence.length + 2) return "A query point ('X') enters. We traverse the tree, choosing the side of the hyperplane the query falls on.";
        if (step === splitSequence.length + 3) return "The search ends in a leaf node. All points in this region become our initial candidates for nearest neighbors.";
        return "";
    };

    const getSplitForPath = (path: string) => {
        let node = tree;
        for (const dir of path.slice(1)) { // slice(1) to skip root 'R'
            if (!node.children) return null;
            node = dir === 'L' ? node.children[0] : node.children[1];
        }
        return node.split;
    }

    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTree /> Annoy Simulation</CardTitle>
                <CardDescription>A step-by-step visualization of how Annoy builds an index and finds approximate nearest neighbors.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-4">
                     <div className="relative border rounded-lg bg-background" style={{ width: WIDTH, height: HEIGHT }}>
                        <svg width={WIDTH} height={HEIGHT}>
                            <AnimatePresence>
                                {/* Data Points */}
                                {points.map((p) => {
                                    const {x, y} = getCoords(p);
                                    const isSplitPoint = currentSplit && (p.id === currentSplit.p1Id || p.id === currentSplit.p2Id);
                                    const isCandidate = step === maxSteps && finalLeaf?.points.some(fp => fp.id === p.id);
                                    return (
                                        <g key={`point-group-${p.id}`}>
                                            <motion.circle 
                                                key={`point-${p.id}`} 
                                                cx={x} 
                                                cy={y} 
                                                r={isSplitPoint ? 8 : 6} 
                                                className={cn("fill-muted-foreground/30 stroke-muted-foreground/50", {
                                                    "fill-amber-400/50 stroke-amber-500": isSplitPoint,
                                                    "fill-primary/50 stroke-primary": isCandidate
                                                })}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                            />
                                            <text x={x} y={y} dy=".3em" textAnchor="middle" className="text-[10px] fill-foreground font-semibold pointer-events-none">{p.id}</text>
                                        </g>
                                    );
                                })}

                                {/* Split Lines */}
                                {splitsToDraw.map((s) => {
                                    const split = getSplitForPath(s.path);
                                    if (!split) return null;
                                    return (
                                        <motion.line key={`split-${s.path}`}
                                            x1={split.midX*55 - 2000 * Math.sin(split.angle)} y1={split.midY*45 + 2000 * Math.cos(split.angle)}
                                            x2={split.midX*55 + 2000 * Math.sin(split.angle)} y2={split.midY*45 - 2000 * Math.cos(split.angle)}
                                            className="stroke-border" strokeWidth="1.5"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        />
                                    );
                                })}
                                
                                {/* Helper line for current split */}
                                {currentSplit && (() => {
                                     const p1 = getCoords(points.find(p => p.id === currentSplit.p1Id)!);
                                     const p2 = getCoords(points.find(p => p.id === currentSplit.p2Id)!);
                                     return (
                                         <motion.line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="stroke-muted-foreground" strokeDasharray="2 2" strokeWidth="1" initial={{opacity:0}} animate={{opacity:1}}/>
                                     )
                                })()}
                                
                                {/* Query Point */}
                                {step >= splitSequence.length + 2 && (
                                     <motion.path key="query-x" d="M-6 6 L6 -6 M6 6 L-6 -6" stroke="hsl(var(--destructive))" strokeWidth={2.5} initial={{scale:0}} animate={{scale:1}} transform={`translate(${getCoords(queryPoint).x} ${getCoords(queryPoint).y})`} />
                                )}
                            </AnimatePresence>
                        </svg>
                    </div>
                     <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={prevStep} disabled={step === 0}><ArrowLeft className="mr-2 h-4 w-4"/>Previous</Button>
                        <span className="text-sm text-muted-foreground">Step {step} / {maxSteps}</span>
                        <Button variant="outline" onClick={nextStep} disabled={step >= maxSteps}>Next<ArrowRight className="ml-2 h-4 w-4"/></Button>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col justify-between">
                    <div className="space-y-4">
                         <Alert className="min-h-[100px] flex flex-col">
                             <Sparkles className="h-4 w-4" />
                            <AlertTitle>What's Happening?</AlertTitle>
                            <AlertDescription className="flex-grow flex items-center">
                                <AnimatePresence mode="wait">
                                    <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs leading-relaxed">
                                        {getStepDescription()}
                                    </motion.p>
                                </AnimatePresence>
                            </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-2">
                             <h4 className="font-semibold text-foreground mb-2 text-center">Binary Tree</h4>
                             <div className="p-4 bg-muted/40 border rounded-md flex justify-center items-start overflow-x-auto min-h-[220px]">
                                <AnimatePresence>
                                {step > 0 && <TreeView node={tree} activePath={activeSearchPath}/>}
                                </AnimatePresence>
                                {step === 0 && <p className="text-xs text-muted-foreground p-4 text-center">The binary tree will be built here.</p>}
                             </div>
                        </div>
                    </div>
                    <Button onClick={reset} className="w-full mt-4"><RefreshCw className="mr-2 h-4 w-4"/>Reset Simulation</Button>
                </div>
            </CardContent>
        </Card>
    );
};
