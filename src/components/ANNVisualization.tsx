// src/components/ANNVisualization.tsx
"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, ArrowLeft, ListTree, Sparkles, Search, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Slider } from './ui/slider';


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
};
type Forest = TreeNode[];
type Split = { p1: Point; p2: Point; midX: number; midY: number; angle: number; path: string; };

const generatePoints = (num: number, width: number, height: number): Point[] =>
    Array.from({ length: num }, (_, i) => ({
        id: `p${i}`,
        x: Math.random() * (width - 60) + 30,
        y: Math.random() * (height - 60) + 30,
    }));

// --- Algorithm Simulation ---
const createTree = (points: Point[], maxItemsInLeaf = 10, depth = 0, path = 'R'): TreeNode => {
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
        depth,
        path,
        children: [
            createTree(leftPoints, maxItemsInLeaf, depth + 1, path + 'L'),
            createTree(rightPoints, maxItemsInLeaf, depth + 1, path + 'R'),
        ],
    };
};

const findLeafNodes = (node: TreeNode, queryPoint: Point, searchK: number): TreeNode[] => {
    const pq: [TreeNode, number][] = [[node, 0]];
    const leaves: TreeNode[] = [];

    while (pq.length > 0 && leaves.length < searchK) {
        pq.sort((a, b) => a[1] - b[1]); // Sort by distance to keep it a priority queue
        const [currentNode] = pq.shift()!;

        if (currentNode.isLeaf) {
            leaves.push(currentNode);
            continue;
        }

        const { split, children } = currentNode;
        if (!split || !children) continue;

        const distanceToHyperplane = (queryPoint.x - split.midX) * Math.cos(split.angle) + (queryPoint.y - split.midY) * Math.sin(split.angle);

        pq.push([children[0], Math.max(0, distanceToHyperplane)]);
        pq.push([children[1], Math.max(0, -distanceToHyperplane)]);
    }

    return leaves;
};

const getSplitsRecursive = (node: TreeNode): Split[] => {
    if (node.isLeaf || !node.split) return [];
    return [
        { ...node.split, path: node.path },
        ...getSplitsRecursive(node.children![0]),
        ...getSplitsRecursive(node.children![1]),
    ];
};

const distance = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

const TreeVisualizer = ({ node, queryPath, highlight }: { node: TreeNode; queryPath?: string; highlight?: boolean }) => {
    const isQueryNode = queryPath?.startsWith(node.path);
    const nodeIsHighlighted = highlight && isQueryNode;

    return (
        <div className="flex flex-col items-center">
            <motion.div
                layout
                className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center text-xs border transition-colors duration-300",
                    node.isLeaf ? "bg-primary/10 border-primary/50" : "bg-muted",
                    { "bg-amber-400 border-amber-600 text-black": nodeIsHighlighted }
                )}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: node.depth * 0.1 }}
            >
                {node.isLeaf ? node.points.length : ''}
            </motion.div>
            {!node.isLeaf && node.children && (
                <>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex gap-4">
                        <TreeVisualizer node={node.children[0]} queryPath={queryPath} highlight={highlight} />
                        <TreeVisualizer node={node.children[1]} queryPath={queryPath} highlight={highlight} />
                    </div>
                </>
            )}
        </div>
    );
};

export function ANNVisualization() {
    const width = 550;
    const height = 400;
    const [step, setStep] = useState(0);
    const [numTrees, setNumTrees] = useState(1);
    const [searchK, setSearchK] = useState(1); // Simulates priority queue depth
    const [points, setPoints] = useState<Point[]>([]);
    const [forest, setForest] = useState<Forest>([]);
    
    const queryPoint = useMemo(() => ({ id: 'query', x: width / 2, y: height / 2 }), [width, height]);
    
    const regenerate = useCallback(() => {
        const newPoints = generatePoints(150, width, height);
        setPoints(newPoints);
        const newForest = Array.from({ length: numTrees }, () => createTree(newPoints, 10));
        setForest(newForest);
    }, [numTrees, width, height]);

    useEffect(() => {
        regenerate();
    }, [regenerate]);

    const reset = () => {
        setStep(0);
        regenerate();
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    
    const totalSplits = useMemo(() => forest.reduce((acc, tree) => acc + getSplitsRecursive(tree).length, 0), [forest]);
    const maxSteps = 5 + totalSplits;

    const { currentSplits, queryPath, candidateLeaves, candidates, topK } = useMemo(() => {
        const currentSplits = forest.flatMap(tree => getSplitsRecursive(tree)).slice(0, step - 1);
        
        if (step <= totalSplits + 1) return { currentSplits, queryPath: undefined, candidateLeaves: [], candidates: new Set(), topK: [] };
        
        let path = '';
        let currentNode = forest[0];
        while (!currentNode.isLeaf) {
            const { split, children } = currentNode;
            if (!split || !children) break;
            const distanceToHyperplane = (queryPoint.x - split.midX) * Math.cos(split.angle) + (queryPoint.y - queryPoint.y) * Math.sin(split.angle);
            currentNode = distanceToHyperplane < 0 ? children[0] : children[1];
            path = currentNode.path;
        }

        if (step <= totalSplits + 2) return { currentSplits, queryPath: path, candidateLeaves: [], candidates: new Set(), topK: [] };
        
        const leaves = forest.flatMap(tree => findLeafNodes(tree, queryPoint, searchK));
        const candidateSet = new Set<Point>();
        leaves.forEach(leaf => leaf.points.forEach(p => candidateSet.add(p)));

        if (step <= totalSplits + 3) return { currentSplits, queryPath: path, candidateLeaves: leaves, candidates: candidateSet, topK: [] };

        const sortedCandidates = [...candidateSet].sort((a, b) => distance(queryPoint, a) - distance(queryPoint, b));
        const finalTopK = sortedCandidates.slice(0, 10);
        
        return { currentSplits, queryPath: path, candidateLeaves: leaves, candidates: candidateSet, topK: finalTopK };
    }, [step, forest, queryPoint, searchK, totalSplits]);

    const getStepDescription = () => {
        if (step === 0) return "The goal is to find nearest neighbors in this 2D space without checking every point. Click 'Next' to begin building the index.";
        if (step <= totalSplits + 1) return `Step 1: Build Index. Annoy recursively splits the space. Two random points are chosen, and a hyperplane is drawn equidistant between them. This step repeats until leaf nodes contain at most K items (here, K=10).`;
        if (step === totalSplits + 2) return `Step 2: Search Tree. To find neighbors for a query (the red 'X'), we traverse the tree from the root. At each node, we check which side of the hyperplane the query point falls on to decide whether to go left or right.`;
        if (step === totalSplits + 3) return `Step 3: Collect Candidates. Using a priority queue (simulated by Search-K) and a forest of trees, we explore the most promising leaf nodes. All points in these leaves become candidates.`;
        if (step === totalSplits + 4) return `Step 4: Rank Candidates. Now, we compute the exact distance from the query point to ONLY the candidate points. We then sort them to find the true nearest neighbors within that set.`;
        if (step === totalSplits + 5) return `Step 5: Return Approximate Neighbors. The top K candidates are returned. Notice this is an *approximate* result—we might miss a true nearest neighbor (blue outline), but the search is orders of magnitude faster. Adjust sliders and reset to see how parameters affect the outcome.`;
        return "";
    };

    const trueNearest = useMemo(() => {
        if (step < totalSplits + 5) return [];
        return [...points].sort((a,b) => distance(queryPoint, a) - distance(queryPoint, b)).slice(0,10);
    }, [points, queryPoint, step, totalSplits]);
    
    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTree /> Annoy Simulation</CardTitle>
                <CardDescription>A step-by-step visualization of how Annoy builds an index and finds approximate nearest neighbors.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-4">
                     <div className="relative border rounded-lg bg-background" style={{ width, height }}>
                        <svg width={width} height={height}>
                            <AnimatePresence>
                                {/* Data Points */}
                                {points.map((p, i) => (
                                    <motion.circle key={`${p.id}-${i}`} cx={p.x} cy={p.y} r={2.5} className={cn("fill-muted-foreground/60 transition-all duration-300", {
                                        "fill-amber-400": step >= totalSplits + 3 && candidates.has(p),
                                        "fill-green-400 stroke-green-300": step >= totalSplits + 4 && topK.some(tk => tk.id === p.id),
                                        "stroke-blue-400 stroke-2 fill-transparent": step >= totalSplits + 5 && trueNearest.some(tn => tn.id === p.id) && !topK.some(tk => tk.id === p.id)
                                    })} />
                                ))}
                                
                                {/* Splits */}
                                {currentSplits.map((split, i) => (
                                    <motion.line key={`split-${split.p1.id}-${split.p2.id}-${i}`}
                                        x1={split.midX - 1000 * Math.sin(split.angle)} y1={split.midY + 1000 * Math.cos(split.angle)}
                                        x2={split.midX + 1000 * Math.sin(split.angle)} y2={split.midY - 1000 * Math.cos(split.angle)}
                                        className="stroke-border" strokeWidth="1"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    />
                                ))}

                                {/* Query Point */}
                                {step > totalSplits + 1 && <motion.path key="query-x" d="M8 8 L-8 -8 M-8 8 L8 -8" stroke="hsl(var(--destructive))" strokeWidth={2} initial={{scale:0}} animate={{scale:1}} transform={`translate(${queryPoint.x} ${queryPoint.y})`} />}
                            
                                {/* Search Path Highlight */}
                                {step === totalSplits + 2 && queryPath && <TreeVisualizer node={forest[0]} queryPath={queryPath} highlight={true}/>}
                           
                            </AnimatePresence>
                        </svg>
                    </div>
                     <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={prevStep} disabled={step === 0}><ArrowLeft className="mr-2"/>Previous</Button>
                        <span className="text-sm text-muted-foreground">Step {step} / {maxSteps}</span>
                        <Button variant="outline" onClick={nextStep} disabled={step >= maxSteps}>Next<ArrowRight className="ml-2"/></Button>
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
                                     <p className="text-xs text-muted-foreground mt-1">More trees improve accuracy but use more memory.</p>
                                 </div>
                                 <div>
                                     <label className="text-xs font-medium">Search-K ({searchK})</label>
                                     <Slider disabled={step > 0} min={1} max={20} step={1} value={[searchK]} onValueChange={(v) => setSearchK(v[0])} />
                                     <p className="text-xs text-muted-foreground mt-1">Inspects more leaf nodes for better accuracy but is slower.</p>
                                 </div>
                             </div>
                        </div>

                         <Alert className="min-h-[120px]">
                             <Sparkles className="h-4 w-4" />
                            <AlertTitle className="flex items-center justify-between">
                               <span>What's Happening?</span>
                                {step >= totalSplits + 3 && <Badge variant="outline">{candidates.size} Candidates</Badge>}
                                {step >= totalSplits + 4 && <Badge variant="destructive">{topK.length} Neighbors</Badge>}
                            </AlertTitle>
                            <AlertDescription>
                                <AnimatePresence mode="wait">
                                    <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                        {getStepDescription()}
                                    </motion.p>
                                </AnimatePresence>
                            </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-2">
                             <h4 className="font-semibold text-foreground mb-2">Binary Tree Index</h4>
                             <div className="p-2 bg-muted/40 border rounded-md flex justify-center overflow-x-auto">
                                <AnimatePresence>
                                {step > 0 && forest[0] && <TreeVisualizer node={forest[0]} queryPath={queryPath} highlight={step === totalSplits + 2} />}
                                </AnimatePresence>
                                {step === 0 && <p className="text-xs text-muted-foreground p-4">Tree will be built here.</p>}
                             </div>
                        </div>
                    </div>
                    
                    <Button onClick={reset} className="w-full mt-4"><RefreshCw className="mr-2"/>Reset Simulation</Button>
                </div>
            </CardContent>
        </Card>
    );
};
