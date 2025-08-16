
// src/components/ANNVisualization.tsx
"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, ArrowLeft, ListTree, Sparkles, Search, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

// --- Data and Types ---
type Point = { id: string; x: number; y: number; };
type Split = { p1: Point; p2: Point; midX: number; midY: number; angle: number; };
type TreeNode = {
    id: string;
    points: Point[];
    split?: Split;
    children?: [TreeNode, TreeNode];
    bounds: { minX: number; minY: number; maxX: number; maxY: number; };
};

// --- Helper Functions ---
const generatePoints = (num: number, width: number, height: number): Point[] => 
    Array.from({ length: num }, (_, i) => ({
        id: `p${i}`,
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
    }));

const createTree = (points: Point[], bounds: any, depth = 0, maxDepth = 4): TreeNode => {
    const id = `n${depth}-${Math.random()}`;
    if (depth >= maxDepth || points.length < 2) {
        return { id, points, bounds };
    }
    
    const p1Index = Math.floor(Math.random() * points.length);
    let p2Index = Math.floor(Math.random() * points.length);
    while (p1Index === p2Index) {
        p2Index = Math.floor(Math.random() * points.length);
    }
    const p1 = points[p1Index];
    const p2 = points[p2Index];

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const angle = Math.atan2(p1.y - p2.y, p1.x - p2.x);

    const leftPoints: Point[] = [];
    const rightPoints: Point[] = [];

    points.forEach(p => {
        const val = (p.x - midX) * Math.cos(angle) + (p.y - midY) * Math.sin(angle);
        if (val < 0) leftPoints.push(p);
        else rightPoints.push(p);
    });

    const leftBounds = { ...bounds };
    const rightBounds = { ...bounds };

    return {
        id,
        points,
        split: { p1, p2, midX, midY, angle },
        children: [
            createTree(leftPoints, leftBounds, depth + 1, maxDepth),
            createTree(rightPoints, rightBounds, depth + 1, maxDepth),
        ],
        bounds,
    };
};

const getSplitsAtDepth = (node: TreeNode, depth: number, currentDepth = 0): Split[] => {
    if (!node.split || currentDepth > depth) return [];
    if (currentDepth === depth) return [node.split];
    if (!node.children) return [];
    return [...getSplitsAtDepth(node.children[0], depth, currentDepth + 1), ...getSplitsAtDepth(node.children[1], depth, currentDepth + 1)];
};

const findPath = (node: TreeNode, query: Point): TreeNode[] => {
    const path = [node];
    let currentNode = node;
    while (currentNode.children) {
        const split = currentNode.split!;
        const val = (query.x - split.midX) * Math.cos(split.angle) + (query.y - split.midY) * Math.sin(split.angle);
        currentNode = val < 0 ? currentNode.children[0] : currentNode.children[1];
        path.push(currentNode);
    }
    return path;
};


export function ANNVisualization() {
    const width = 550;
    const height = 400;
    const [points, setPoints] = useState<Point[]>([]);
    const [tree, setTree] = useState<TreeNode | null>(null);
    const [step, setStep] = useState(0);
    
    const queryPoint = useMemo(() => ({ id: 'query', x: width / 2, y: height * 0.6 }), []);

    const regenerate = useCallback(() => {
        const newPoints = generatePoints(100, width, height);
        setPoints(newPoints);
        setTree(createTree(newPoints, { minX: 0, minY: 0, maxX: width, maxY: height }));
    }, [width, height]);
    
    useEffect(() => {
        regenerate();
    }, [regenerate]);
    
    const reset = () => {
        setStep(0);
        regenerate();
    };
    
    const searchPath = useMemo(() => tree ? findPath(tree, queryPoint) : [], [tree, queryPoint]);
    const finalLeaf = searchPath[searchPath.length - 1];

    const getStepDescription = () => {
        const descriptions = [
            "Start with a set of points. The goal is to find nearest neighbors efficiently.",
            "1. Randomly pick two points and create a hyperplane equidistant to them. This splits the space in two.",
            "2. Recursively split each resulting subspace with new random hyperplanes.",
            "3. Continue splitting... This process builds a binary tree structure.",
            "4. ...until each 'leaf' node in the tree contains a small number of points (e.g., K items). The space is now fully partitioned.",
            "5. To find neighbors for a new query point (red X), traverse the tree from the root.",
            "6. At each split, decide which side the query point falls on and follow that path down the tree.",
            "7. This leads to a single leaf node containing a small set of candidate points.",
            "8. Finally, compute the exact distance to these candidates, sort them, and return the top K. This is far faster than checking all 100 points.",
            "This is an *Approximate* method. The true nearest neighbor might be just across a split boundary. Annoy uses multiple trees (a forest) and a priority queue to search more smartly and improve accuracy."
        ];
        return descriptions[step];
    };

    const splits = useMemo(() => {
        if (!tree) return [];
        const maxDepth = 4;
        let allSplits: Split[] = [];
        for (let i = 0; i < maxDepth; i++) {
            if (step > i) {
                allSplits = [...allSplits, ...getSplitsAtDepth(tree, i)];
            }
        }
        return allSplits;
    }, [tree, step]);

    const renderTree = (node: TreeNode | undefined, pathIds: Set<string>): React.ReactNode => {
        if (!node) return null;
        const onPath = pathIds.has(node.id);
        
        return (
            <div key={node.id} className="flex flex-col items-center relative">
                <motion.div 
                    className={cn("w-4 h-4 rounded-sm border-2", onPath ? "bg-red-500/50 border-red-500" : "bg-muted border-foreground/30")}
                    initial={{opacity:0, scale: 0.5}}
                    animate={{opacity:1, scale: 1}}
                    transition={{delay: 0.2}}
                />
                {node.children && (
                     <div className="absolute top-4 h-6 w-px bg-border" />
                )}
                 {node.children && (
                    <div className="absolute top-10 flex w-full justify-center">
                        <div className="w-1/2 border-t-2"></div>
                        <div className="w-1/2 border-t-2"></div>
                    </div>
                )}
                {node.children && (
                    <div className="flex w-full justify-around mt-12">
                       <div className="w-1/2 flex justify-center"> {renderTree(node.children[0], pathIds)}</div>
                       <div className="w-1/2 flex justify-center"> {renderTree(node.children[1], pathIds)}</div>
                    </div>
                )}
            </div>
        )
    };


    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTree /> Annoy Simulation: Recursive Splitting</CardTitle>
                <CardDescription>
                    A visual guide to how Annoy builds a binary tree index to perform approximate nearest neighbor searches.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <div className="relative border rounded-lg bg-background" style={{ width, height }}>
                        <svg width={width} height={height}>
                            <AnimatePresence>
                                {points.map((p, i) => (
                                    <motion.circle key={`${p.id}-${i}`} cx={p.x} cy={p.y} r={2.5} className={cn("fill-muted-foreground/60", {
                                        "fill-primary stroke-primary/50 stroke-2": step >= 8 && finalLeaf?.points.some(lp => lp.id === p.id),
                                    })} />
                                ))}
                                
                                {splits.map((split, i) => {
                                    const length = width * 2;
                                    const lineX1 = split.midX - length/2 * Math.sin(split.angle);
                                    const lineY1 = split.midY + length/2 * Math.cos(split.angle);
                                    const lineX2 = split.midX + length/2 * Math.sin(split.angle);
                                    const lineY2 = split.midY - length/2 * Math.cos(split.angle);
                                    
                                    return (
                                        <motion.g key={`split-${i}`}>
                                            <motion.line
                                                x1={lineX1} y1={lineY1}
                                                x2={lineX2} y2={lineY2}
                                                stroke="hsl(var(--foreground))" strokeWidth="1"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                            />
                                        </motion.g>
                                    );
                                })}

                                {step >= 5 && <motion.path d="M10 10 L-10 -10 M-10 10 L10 -10" stroke="hsl(var(--destructive))" strokeWidth={2} initial={{scale:0}} animate={{scale:1}} transform={`translate(${queryPoint.x} ${queryPoint.y})`} />}
                            
                                {step >= 7 && finalLeaf && (
                                     <motion.polygon 
                                        points={`${finalLeaf.bounds.minX},${finalLeaf.bounds.minY} ${finalLeaf.bounds.maxX},${finalLeaf.bounds.minY} ${finalLeaf.bounds.maxX},${finalLeaf.bounds.maxY} ${finalLeaf.bounds.minX},${finalLeaf.bounds.maxY}`}
                                        className="fill-primary/10 stroke-primary/50"
                                        strokeWidth={2}
                                        initial={{opacity:0}}
                                        animate={{opacity:1}}
                                     />
                                )}
                            </AnimatePresence>
                        </svg>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <h4 className="font-semibold text-foreground mb-2">Simulation Steps</h4>
                        <div className="p-3 bg-muted/40 border rounded-md min-h-[100px] text-sm text-muted-foreground flex items-center justify-center text-center">
                           <AnimatePresence mode="wait">
                                <motion.p
                                    key={step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {getStepDescription()}
                                </motion.p>
                           </AnimatePresence>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold text-foreground mb-2">Resulting Binary Tree</h4>
                            <div className="p-4 bg-muted/40 border rounded-md min-h-[150px] flex items-start justify-center overflow-auto">
                               {tree && step > 0 && renderTree(step >= 5 ? searchPath[0] : tree, new Set(searchPath.map(n => n.id)))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex justify-between items-center">
                             <Button variant="outline" size="icon" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}><ArrowLeft/></Button>
                             <span className="text-sm text-muted-foreground">{step + 1} / 10</span>
                             <Button variant="outline" size="icon" onClick={() => setStep(s => Math.min(s + 1, 9))} disabled={step === 9}><ArrowRight/></Button>
                        </div>
                         <Button onClick={reset}><RefreshCw className="mr-2"/>Reset Simulation</Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};
