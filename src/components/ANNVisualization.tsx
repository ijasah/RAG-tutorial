// src/components/ANNVisualization.tsx
"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTree, Sparkles, Search, CheckCircle, RefreshCw, Users, Binary, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';


// --- Data and Types ---
type Point = { id: string; x: number; y: number; };
type TreeNode = {
    id: string;
    points: Point[];
    isLeaf: boolean;
    children?: [TreeNode, TreeNode];
    split?: { p1: Point; p2: Point; midX: number; midY: number; angle: number; };
};
type Forest = TreeNode[];

const generatePoints = (num: number, width: number, height: number): Point[] =>
    Array.from({ length: num }, (_, i) => ({
        id: `p${i}`,
        x: Math.random() * (width - 60) + 30,
        y: Math.random() * (height - 60) + 30,
    }));

const createTree = (points: Point[], maxItemsInLeaf = 10, depth = 0): TreeNode => {
    const id = `n-${depth}-${Math.random().toString(36).substring(2, 7)}`;
    if (points.length <= maxItemsInLeaf) {
        return { id, points, isLeaf: true };
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
        (val < 0 ? leftPoints : rightPoints).push(p);
    });

    return {
        id,
        points,
        isLeaf: false,
        split: { p1, p2, midX, midY, angle },
        children: [
            createTree(leftPoints, maxItemsInLeaf, depth + 1),
            createTree(rightPoints, maxItemsInLeaf, depth + 1),
        ],
    };
};

const findLeafNodes = (node: TreeNode, queryPoint: Point, searchK: number): TreeNode[] => {
    const pq: [TreeNode, number][] = [[node, 0]];
    const leaves: TreeNode[] = [];
    
    while(pq.length > 0 && leaves.length < searchK) {
        pq.sort((a,b) => a[1] - b[1]); // Sort by distance to keep it a priority queue
        const [currentNode] = pq.shift()!;

        if(currentNode.isLeaf) {
            leaves.push(currentNode);
            continue;
        }

        const { split, children } = currentNode;
        if (!split || !children) continue;

        const distanceToHyperplane = (queryPoint.x - split.midX) * Math.cos(split.angle) + (queryPoint.y - midY) * Math.sin(split.angle);

        // Add both children to the priority queue with their "wrong side" distance
        pq.push([children[0], Math.max(0, -distanceToHyperplane)]);
        pq.push([children[1], Math.max(0, distanceToHyperplane)]);
    }
    
    return leaves;
};


const distance = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));


export function ANNVisualization() {
    const width = 550;
    const height = 400;

    const [numTrees, setNumTrees] = useState(3);
    const [searchK, setSearchK] = useState(5);
    const [step, setStep] = useState(0);
    const [points, setPoints] = useState<Point[]>([]);
    const [forest, setForest] = useState<Forest>([]);
    
    const queryPoint = useMemo(() => ({ id: 'query', x: width / 2, y: height / 2 }), [width, height]);
    
    const regenerate = useCallback(() => {
        const newPoints = generatePoints(150, width, height);
        setPoints(newPoints);
        const newForest = Array.from({ length: numTrees }, () => createTree(newPoints, 15));
        setForest(newForest);
    }, [numTrees, width, height]);

    useEffect(() => {
        regenerate();
    }, [regenerate]);
    
    const reset = () => {
        setStep(0);
        regenerate();
    };
    
    const { leaves, candidates, topK } = useMemo(() => {
        if (step < 2) return { leaves: [], candidates: new Set(), topK: [] };
        
        const allLeaves = forest.flatMap(tree => findLeafNodes(tree, queryPoint, searchK));
        const candidateSet = new Set<Point>();
        allLeaves.forEach(leaf => leaf.points.forEach(p => candidateSet.add(p)));
        
        if (step < 3) return { leaves: allLeaves, candidates: candidateSet, topK: [] };

        const sortedCandidates = [...candidateSet].sort((a, b) => distance(queryPoint, a) - distance(queryPoint, b));
        return { leaves: allLeaves, candidates: candidateSet, topK: sortedCandidates.slice(0, 10) };

    }, [forest, queryPoint, searchK, step]);

    const getStepDescription = () => {
        const descriptions = [
            "1. Annoy builds a forest of random binary trees to index the data points.",
            "2. For each query, it searches the trees to find a pool of candidate neighbors.",
            "3. Finally, it calculates the exact distance to these candidates and returns the top K.",
            "4. The true nearest neighbor might be missed (it's approximate!), but this is much faster than checking every point."
        ];
        return descriptions[step];
    }
    

    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTree /> Annoy: A Forest of Random Trees</CardTitle>
                <CardDescription>
                    A simulation of how Annoy uses multiple binary trees to perform Approximate Nearest Neighbor (ANN) search.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <div className="relative border rounded-lg bg-background" style={{ width, height }}>
                        <svg width={width} height={height}>
                            <AnimatePresence>
                                {/* Data Points */}
                                {points.map(p => (
                                    <motion.circle 
                                        key={p.id} 
                                        cx={p.x} cy={p.y} r="2" 
                                        className={cn("fill-muted-foreground/60", {
                                            "fill-amber-400": step >=2 && candidates.has(p),
                                            "fill-green-400 stroke-green-300 stroke-2": step >= 3 && topK.some(tk => tk.id === p.id),
                                        })}
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                    />
                                ))}

                                {/* Query Point */}
                                {step >= 1 && <motion.path key="query-x" d="M8 8 L-8 -8 M-8 8 L8 -8" stroke="hsl(var(--destructive))" strokeWidth={2} initial={{scale:0}} animate={{scale:1}} transform={`translate(${queryPoint.x} ${queryPoint.y})`} />}
                            
                            </AnimatePresence>
                        </svg>
                         <AnimatePresence>
                            {step > 0 && (
                                <motion.div 
                                    className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-2 overflow-hidden pointer-events-none"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                >
                                    {forest.map((tree, i) => (
                                        <div key={i} className="relative w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                                            <Binary className="w-5 h-5 text-primary/50"/>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div>
                             <h4 className="font-semibold text-foreground mb-2">Configuration</h4>
                             <div className="space-y-3 p-3 bg-muted/40 border rounded-md">
                                 <div>
                                     <label className="text-xs font-medium">Number of Trees ({numTrees})</label>
                                     <Slider disabled={step > 0} min={1} max={10} step={1} value={[numTrees]} onValueChange={(v) => setNumTrees(v[0])} />
                                     <p className="text-xs text-muted-foreground mt-1">More trees improve accuracy at the cost of memory.</p>
                                 </div>
                                 <div>
                                     <label className="text-xs font-medium">Search-K ({searchK})</label>
                                     <Slider disabled={step > 0} min={1} max={20} step={1} value={[searchK]} onValueChange={(v) => setSearchK(v[0])} />
                                     <p className="text-xs text-muted-foreground mt-1">Inspects more leaf nodes for better accuracy but is slower.</p>
                                 </div>
                             </div>
                        </div>

                        <Alert>
                            <HelpCircle className="h-4 w-4" />
                            <AlertTitle className="flex items-center justify-between">
                                <span>Step {step + 1}</span>
                                {step === 1 && <Badge variant="outline">{leaves.length} Leaves Searched</Badge>}
                                {step === 2 && <Badge variant="outline">{candidates.size} Candidates Found</Badge>}
                                {step === 3 && <Badge variant="destructive">{topK.length} Neighbors Returned</Badge>}
                            </AlertTitle>
                            <AlertDescription>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={step}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {getStepDescription()}
                                    </motion.p>
                                </AnimatePresence>
                            </AlertDescription>
                        </Alert>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4">
                         <div className="flex justify-between items-center gap-2">
                             <Button className="w-full" variant="outline" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}>Previous</Button>
                             <Button className="w-full" variant="outline" onClick={() => setStep(s => Math.min(s + 1, 3))} disabled={step === 3}>Next</Button>
                        </div>
                         <Button onClick={reset}><RefreshCw className="mr-2"/>Reset Simulation</Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};
