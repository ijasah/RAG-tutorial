// src/components/ANNVisualization.tsx
"use client";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, ArrowLeft, ListTree, Sparkles, Search, CheckCircle, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

// --- Data and Types ---
type Point = { id: string; x: number; y: number; };
type TreeNode = {
    id: string;
    points: Point[];
    isLeaf: boolean;
    children?: [TreeNode, TreeNode];
    split?: { p1: Point; p2: Point; midX: number; midY: number; angle: number; };
    depth: number;
    path: string;
    region?: { path: string, clipPath: string };
};
type Split = { p1: Point; p2: Point; midX: number; midY: number; angle: number; path: string; };

const K = 15; // Max items in a leaf
const WIDTH = 550;
const HEIGHT = 450;

const generatePoints = (num: number): Point[] =>
    Array.from({ length: num }, (_, i) => ({
        id: `p${i}`,
        x: Math.random() * (WIDTH - 60) + 30,
        y: Math.random() * (HEIGHT - 60) + 30,
    }));

// --- Algorithm Simulation ---
const createTreeRecursive = (points: Point[], maxItemsInLeaf: number, depth: number, path: string): TreeNode => {
    const id = `n-${path}`;
    if (points.length <= maxItemsInLeaf) {
        return { id, points, isLeaf: true, depth, path };
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
    const angle = Math.atan2(p1.y - p2.y, p1.x - p2.x); // Angle of the line connecting p1 and p2

    const leftPoints: Point[] = [];
    const rightPoints: Point[] = [];

    points.forEach(p => {
        // Project point onto the line perpendicular to the split line
        const val = (p.x - midX) * Math.cos(angle) + (p.y - midY) * Math.sin(angle);
        // Points on one side go to left child, others to right child
        (val > 0 ? leftPoints : rightPoints).push(p);
    });

    return {
        id,
        points,
        isLeaf: false,
        split: { p1, p2, midX, midY, angle },
        depth,
        path,
        children: [
            createTreeRecursive(leftPoints, maxItemsInLeaf, depth + 1, path + 'L'),
            createTreeRecursive(rightPoints, maxItemsInLeaf, depth + 1, path + 'R'),
        ],
    };
};

const getNodesByDepth = (node: TreeNode): { [key: number]: TreeNode[] } => {
    const nodesByDepth: { [key: number]: TreeNode[] } = {};
    const queue: TreeNode[] = [node];
    while (queue.length > 0) {
        const current = queue.shift()!;
        if (!nodesByDepth[current.depth]) {
            nodesByDepth[current.depth] = [];
        }
        nodesByDepth[current.depth].push(current);
        if (current.children) {
            queue.push(...current.children);
        }
    }
    return nodesByDepth;
};


const TreeVisualizer = ({ nodesByDepth, maxDepth, activePath }: { nodesByDepth: { [key: number]: TreeNode[] }, maxDepth: number, activePath?: string }) => {
    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            {Array.from({ length: maxDepth + 1 }).map((_, depth) => (
                <div key={depth} className="flex justify-center gap-2">
                    {nodesByDepth[depth]?.map(node => (
                        <motion.div
                            key={node.id}
                            layoutId={node.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                                "w-8 h-8 rounded-md flex items-center justify-center text-xs border transition-all duration-300",
                                node.isLeaf ? "bg-primary/10 border-primary" : "bg-muted",
                                activePath?.startsWith(node.path) && 'bg-amber-400 border-amber-600 text-black ring-2 ring-amber-400'
                            )}
                            title={`Path: ${node.path}, Points: ${node.points.length}`}
                        >
                            {node.isLeaf ? node.points.length : ''}
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export function ANNVisualization() {
    const [step, setStep] = useState(0);
    const [points, setPoints] = useState<Point[]>([]);
    const [tree, setTree] = useState<TreeNode | null>(null);

    const queryPoint = useMemo(() => ({ id: 'query', x: WIDTH / 2, y: HEIGHT / 2 + 50 }), []);

    const regenerate = useCallback(() => {
        const newPoints = generatePoints(150);
        setPoints(newPoints);
        const newTree = createTreeRecursive(newPoints, K, 0, 'R');
        setTree(newTree);
    }, []);

    useEffect(() => {
        regenerate();
    }, [regenerate]);
    
    const allSplits = useMemo(() => {
        if (!tree) return [];
        const splits: Split[] = [];
        const queue = [tree];
        while (queue.length > 0) {
            const node = queue.shift()!;
            if (node.split) splits.push({ ...node.split, path: node.path });
            if (node.children) queue.push(...node.children);
        }
        return splits.sort((a, b) => a.path.length - b.path.length);
    }, [tree]);
    
    const maxSteps = allSplits.length + 3; // Build steps + index ready + search + candidates

    const reset = () => {
        setStep(0);
        regenerate();
    };

    const nextStep = () => setStep(s => Math.min(s + 1, maxSteps));
    const prevStep = () => setStep(s => Math.max(0, s - 1));

    const { nodesByDepth, maxDepth, activeSearchPath, finalLeaf } = useMemo(() => {
        if (!tree) return { nodesByDepth: {}, maxDepth: 0 };
        const nodes = getNodesByDepth(tree);
        const maxD = Math.max(...Object.keys(nodes).map(Number));

        // Don't calculate search path until the search step
        if (step < allSplits.length + 2) {
             return { nodesByDepth: nodes, maxDepth: maxD, activeSearchPath: undefined, finalLeaf: undefined };
        }
        
        let path = '';
        let currentNode = tree;
        while (!currentNode.isLeaf) {
            path = currentNode.path;
            const { split, children } = currentNode;
            if (!split || !children) break;
            const val = (queryPoint.x - split.midX) * Math.cos(split.angle) + (queryPoint.y - split.midY) * Math.sin(split.angle);
            currentNode = val > 0 ? children[0] : children[1];
        }
        path = currentNode.path;

        return { nodesByDepth: nodes, maxDepth: maxD, activeSearchPath: path, finalLeaf: currentNode };

    }, [tree, step, allSplits.length, queryPoint]);


    const getStepDescription = () => {
        if (step === 0) return "Our goal is to find nearest neighbors without checking every point. First, we build a binary tree index.";
        if (step <= allSplits.length) {
            const currentSplit = allSplits[step - 1];
            return `Step 1 (${step}/${allSplits.length}): Build Index. Annoy recursively splits the space. Two points (p1, p2) are chosen randomly, and a hyperplane is drawn equidistant between them, partitioning the data. This creates a new level in the binary tree.`;
        }
        if (step === allSplits.length + 1) return `The index is built! The space is partitioned into many small regions, each corresponding to a leaf in our binary tree.`;
        if (step === allSplits.length + 2) return `Step 2: Search Tree. A query point (the 'X') enters the system. To find its neighbors, we traverse the tree, at each step choosing the side of the hyperplane the query falls on.`;
        if (step === allSplits.length + 3) return `Step 3: Identify Candidates. The search ends in a single leaf node. All points in this region become our initial candidates for nearest neighbors. This is much faster than checking all points.`;
        return "";
    };

    const currentSplit = step > 0 && step <= allSplits.length ? allSplits[step - 1] : null;

    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTree /> Annoy Simulation</CardTitle>
                <CardDescription>A step-by-step visualization of how Annoy builds a binary tree index and finds approximate nearest neighbors.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-4">
                     <div className="relative border rounded-lg bg-background" style={{ width: WIDTH, height: HEIGHT }}>
                        <svg width={WIDTH} height={HEIGHT}>
                            <defs>
                               {allSplits.slice(0, step).map((split, i) => {
                                    const R = 2000;
                                    const perpAngle = split.angle + Math.PI/2;
                                    const c = Math.cos(perpAngle);
                                    const s = Math.sin(perpAngle);
                                    const p1c = {x: split.midX - R*c, y: split.midY - R*s};
                                    const p2c = {x: split.midX + R*c, y: split.midY + R*s};
                                    const leftPath = `M ${p1c.x} ${p1c.y} L ${p2c.x} ${p2c.y} L ${p2c.x + R*s} ${p2c.y - R*c} L ${p1c.x + R*s} ${p1c.y - R*c} Z`;
                                    const rightPath = `M ${p1c.x} ${p1c.y} L ${p2c.x} ${p2c.y} L ${p2c.x - R*s} ${p2c.y + R*c} L ${p1c.x - R*s} ${p1c.y + R*c} Z`;

                                    return (
                                        <React.Fragment key={`clip-${i}`}>
                                            <clipPath id={`clip-left-${i}`}><path d={leftPath} /></clipPath>
                                            <clipPath id={`clip-right-${i}`}><path d={rightPath} /></clipPath>
                                        </React.Fragment>
                                    )
                               })}
                            </defs>
                            <AnimatePresence>
                                {/* Data Points */}
                                {points.map((p, i) => (
                                    <motion.circle key={`${p.id}-${i}`} cx={p.x} cy={p.y} r={2.5} className={cn("fill-muted-foreground/60 transition-colors duration-300", {
                                         "fill-amber-400 stroke-amber-600": currentSplit && (currentSplit.p1.id === p.id || currentSplit.p2.id === p.id),
                                         "fill-primary stroke-primary/50 stroke-2": step === maxSteps && finalLeaf?.points.some(lp => lp.id === p.id),
                                    })} />
                                ))}
                                
                                {/* Splits */}
                                {allSplits.slice(0, step).map((split, i) => (
                                    <motion.line key={`split-${split.p1.id}-${split.p2.id}-${i}`}
                                        x1={split.midX - 2000 * Math.sin(split.angle)} y1={split.midY + 2000 * Math.cos(split.angle)}
                                        x2={split.midX + 2000 * Math.sin(split.angle)} y2={split.midY - 2000 * Math.cos(split.angle)}
                                        className="stroke-border" strokeWidth="1"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    />
                                ))}

                                {/* Current Split's helper line */}
                                {currentSplit && (
                                     <motion.line
                                        key={`helper-${currentSplit.p1.id}-${currentSplit.p2.id}`}
                                        x1={currentSplit.p1.x} y1={currentSplit.p1.y}
                                        x2={currentSplit.p2.x} y2={currentSplit.p2.y}
                                        className="stroke-muted-foreground" strokeWidth="0.5" strokeDasharray="3 3"
                                        initial={{opacity: 0}} animate={{opacity: 1}}
                                     />
                                )}

                                {/* Query Point */}
                                {step > allSplits.length + 1 && <motion.path key="query-x" d="M-6 6 L6 -6 M6 6 L-6 -6" stroke="hsl(var(--destructive))" strokeWidth={2.5} initial={{scale:0}} animate={{scale:1}} transform={`translate(${queryPoint.x} ${queryPoint.y})`} />}
                            
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
                         <Alert className="min-h-[140px] flex flex-col">
                             <Sparkles className="h-4 w-4" />
                            <AlertTitle className="flex items-center justify-between">
                               <span>What's Happening?</span>
                            </AlertTitle>
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
                             <div className="p-2 bg-muted/40 border rounded-md flex justify-center items-start overflow-x-auto min-h-[150px]">
                                <AnimatePresence>
                                {step > 0 && tree && nodesByDepth && maxDepth > 0 && 
                                    <TreeVisualizer nodesByDepth={nodesByDepth} maxDepth={maxDepth} activePath={activeSearchPath} />
                                }
                                </AnimatePresence>
                                {step === 0 && <p className="text-xs text-muted-foreground p-4 text-center">The binary tree representation of the index will be built here.</p>}
                             </div>
                        </div>
                    </div>
                    
                    <Button onClick={reset} className="w-full mt-4"><RefreshCw className="mr-2 h-4 w-4"/>Reset Simulation</Button>
                </div>
            </CardContent>
        </Card>
    );
};
