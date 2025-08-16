
// src/components/ANNVisualization.tsx
"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Search, Play, RefreshCw, ArrowRight, Waypoints, GitBranchPlus, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

// --- Helper Functions and Data ---
const generatePoints = (numPoints: number, width: number, height: number) => {
    return Array.from({ length: numPoints }, (_, i) => ({
        id: `p${i}`,
        x: Math.random() * (width - 60) + 30,
        y: Math.random() * (height - 60) + 30,
    }));
};

const getEuclideanDistance = (p1: {x:number, y:number}, p2: {x:number, y:number}) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

// --- Sub-components ---
const IndexTypeCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="p-4 border rounded-lg bg-muted/40 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">{icon}</div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground">{children}</p>
    </div>
);

const StepIndicator = ({ current, total }: { current: number, total: number }) => (
    <div className="flex justify-center gap-1.5 my-2">
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={cn("h-1.5 w-6 rounded-full transition-colors", i + 1 < current ? 'bg-primary' : 'bg-muted')}/>
        ))}
    </div>
);


export function ANNVisualization() {
    const width = 550;
    const height = 350;
    const [points, setPoints] = useState<{ id: string; x: number; y: number; }[]>([]);
    const [step, setStep] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    const queryPoint = useMemo(() => ({ x: width / 2, y: height / 2 }), []);

    const regeneratePoints = useCallback(() => {
        setPoints(generatePoints(50, width, height));
    }, [width, height]);

    useEffect(() => {
        regeneratePoints();
    }, [regeneratePoints]);

    const { entryPoint, layer1Connections, layer0Connections, path, neighbors } = useMemo(() => {
        if (points.length === 0) return { entryPoint: null, layer1Connections: [], layer0Connections: [], path: [], neighbors: [] };

        // Simplified HNSW-like structure
        const sortedByDistance = [...points].sort((a, b) => getEuclideanDistance({x: a.x, y: a.y}, {x:0,y:0}) - getEuclideanDistance({x: b.x, y: b.y}, {x:0,y:0}));
        const entryPoint = sortedByDistance[0];

        // Layer 1: "Highway" connections
        const layer1Candidates = points.filter(p => p.id !== entryPoint.id).sort((a,b) => getEuclideanDistance(a, entryPoint) - getEuclideanDistance(b, entryPoint));
        const l1_neighbor_1 = layer1Candidates[15];
        const l1_neighbor_2 = layer1Candidates[35];

        // Layer 0: Local connections
        const localNeighbors = points.filter(p => getEuclideanDistance(p, queryPoint) < 120).sort((a,b) => getEuclideanDistance(a, queryPoint) - getEuclideanDistance(b, queryPoint));

        const path = [entryPoint, l1_neighbor_1, localNeighbors[5], localNeighbors[0]];

        return {
            entryPoint,
            layer1Connections: [
                { source: entryPoint, target: l1_neighbor_1 },
                { source: entryPoint, target: layer1Candidates[10] },
                { source: l1_neighbor_1, target: l1_neighbor_2 },
                { source: l1_neighbor_2, target: layer1Candidates[45] },
            ],
            layer0Connections: points.flatMap((p) => {
                const close = points.filter(other => p.id !== other.id && getEuclideanDistance(p, other) < 50).slice(0,1);
                return close.map(c => ({ source: p, target: c }));
            }),
            path,
            neighbors: localNeighbors.slice(0, 5)
        };
    }, [points, queryPoint]);


    const reset = () => {
        setIsSimulating(false);
        setStep(0);
        regeneratePoints();
    };

    const handleNext = () => {
        if (!isSimulating) return;
        setStep(s => Math.min(s + 1, 8));
    }
    
    const handleStart = () => {
        reset();
        setIsSimulating(true);
        setStep(1);
    }

    const getStepDescription = () => {
        const descriptions = [
            "Ready to see how ANN works? Click 'Start' to begin.",
            "This is our dataset of 50 points. A brute-force search would have to check every single one against a query.",
            "First, ANN builds an intelligent graph. An entry point (blue) is chosen to start all searches.",
            "Layer 1, the 'highway', is built. These are long-range links that connect distant points, allowing a search to quickly jump to the right region of the graph.",
            "Layer 0, the 'local streets', is built. These are short-range links connecting nearby points, used for fine-grained searching within a region.",
            "Now, a query (purple) enters. Instead of checking all points, the search starts at the graph's entry point.",
            "The search follows the fast 'highway' links to traverse to the most promising region of the graph.",
            "Once in the right neighborhood, the search switches to the dense local links to find the exact nearest neighbors.",
            "Success! The nearest neighbors (highlighted) are found after visiting only a fraction of the total points."
        ];
        return descriptions[step] || "Learn how ANN indexing and search works."
    };

    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap /> Approximate Nearest Neighbor (ANN) Search</CardTitle>
                <CardDescription>
                    A visual guide to how vector databases perform lightning-fast searches without checking every single item.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs defaultValue="simulation" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="problem">The Problem</TabsTrigger>
                        <TabsTrigger value="simulation">How ANN Works</TabsTrigger>
                        <TabsTrigger value="types">Index Types</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="problem" className="p-4 text-center">
                        <h3 className="text-xl font-semibold text-foreground mb-2">The Challenge of Scale</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Imagine searching for a single grain of sand on a huge beach. Brute-force search (checking every grain) is accurate but impossibly slow.
                            Vector search is similar; with millions of vectors, comparing a query to every single one is too costly. ANN provides a clever solution.
                        </p>
                    </TabsContent>

                    <TabsContent value="simulation">
                        <Card className="bg-muted/20">
                            <CardHeader className="pb-2">
                                 <CardDescription className="text-center min-h-[40px]">{getStepDescription()}</CardDescription>
                                 <StepIndicator current={step} total={8}/>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border rounded-lg bg-background" style={{ width, height }}>
                                    <svg width={width} height={height}>
                                        <AnimatePresence>
                                        {/* Layer 0 Connections */}
                                        {step >= 4 && layer0Connections.map((conn, i) => (
                                            <motion.line key={`l0-${conn.source.id}-${conn.target.id}`} x1={conn.source.x} y1={conn.source.y} x2={conn.target.x} y2={conn.target.y} stroke="hsl(var(--border))" strokeWidth="0.5" initial={{opacity:0}} animate={{opacity:1}} transition={{delay: i * 0.01}}/>
                                        ))}

                                        {/* Layer 1 Connections */}
                                        {step >= 3 && layer1Connections.map((conn, i) => (
                                            <motion.line key={`l1-${conn.source.id}-${conn.target.id}`} x1={conn.source.x} y1={conn.source.y} x2={conn.target.x} y2={conn.target.y} stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay: i * 0.2}}/>
                                        ))}
                                        
                                        {/* Data Points */}
                                        {step >= 1 && points.map((p) => (
                                            <motion.circle key={p.id} cx={p.x} cy={p.y} r="3" className="fill-muted-foreground/50" />
                                        ))}
                                        
                                        {/* Entry Point */}
                                        {step >= 2 && entryPoint && <motion.circle cx={entryPoint.x} cy={entryPoint.y} r="6" className="fill-primary" initial={{scale:0}} animate={{scale:1}}/>}

                                        {/* Query Point */}
                                        {step >= 5 && <motion.circle cx={queryPoint.x} cy={queryPoint.y} r="5" className="fill-purple-500 stroke-background" strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} />}

                                        {/* Search Path */}
                                        {step >= 6 && path.map((p, i) => i > 0 && (
                                            <motion.line key={`path-${path[i-1].id}-${p.id}`} x1={path[i-1].x} y1={path[i-1].y} x2={p.x} y2={p.y} stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.5 }}/>
                                        ))}

                                        {/* Final Neighbors */}
                                        {step >= 8 && neighbors.map((p) => (
                                           <motion.g key={`neighbor-${p.id}`}>
                                                <motion.line x1={queryPoint.x} y1={queryPoint.y} x2={p.x} y2={p.y} stroke="hsl(var(--primary))" strokeWidth={1} initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:0.5}} />
                                                <motion.circle cx={p.x} cy={p.y} r={5} className="fill-primary/50 stroke-primary" strokeWidth={2} initial={{scale:0}} animate={{scale:1}} transition={{delay:0.5}}/>
                                           </motion.g>
                                        ))}
                                        </AnimatePresence>
                                    </svg>
                                </div>
                                <div className="flex justify-center gap-4 mt-4">
                                    <Button onClick={handleStart} variant={isSimulating ? 'outline' : 'default'}>
                                        {isSimulating ? <RefreshCw className="mr-2"/> : <Play className="mr-2"/>}
                                        {isSimulating ? 'Reset' : 'Start'}
                                    </Button>
                                    {isSimulating && <Button onClick={handleNext} disabled={step >= 8}>Next <ArrowRight className="ml-2"/></Button>}
                                </div>
                                {step === 8 && (
                                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center mt-4">
                                        <Badge variant="secondary" className="border-green-500/50 bg-green-500/10 text-green-300">
                                            Success! Found 5 neighbors by visiting only {path.length} main nodes.
                                        </Badge>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="types" className="p-4 space-y-4">
                        <p className="text-center text-muted-foreground">Different ANN algorithms use different strategies to build their search indexes. Here are a few common types:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <IndexTypeCard icon={<Waypoints/>} title="HNSW (Graph-Based)">
                                Creates a multi-layer graph where top layers have long-range "highway" links for fast traversal and bottom layers have short-range links for precise search. Excellent balance of speed and accuracy.
                           </IndexTypeCard>
                           <IndexTypeCard icon={<GitBranchPlus/>} title="LSH (Hashing)">
                                Uses special hash functions to group similar items into the same "buckets." It's fast but can be less accurate than other methods, as it relies on hash collisions.
                           </IndexTypeCard>
                           <IndexTypeCard icon={<BookOpen/>} title="IVF (Inverted File)">
                                Divides the dataset into clusters. A search first identifies the most promising clusters to search within, dramatically reducing the number of vectors that need to be compared.
                           </IndexTypeCard>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
