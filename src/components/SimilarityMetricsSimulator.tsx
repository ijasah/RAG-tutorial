// src/components/SimilarityMetricsSimulator.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Scaling, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Vector = { x: number; y: number; label: string; };

const vectors: Vector[] = [
    { x: 4, y: 3, label: 'RAG is a technique.' },
    { x: 8, y: 6, label: 'RAG is a powerful technique for LLMs.' }, // Same direction, larger magnitude
    { x: 3.5, y: 4, label: 'Chunking splits text.' },
    { x: 1, y: 5, label: 'The sky is blue.' },
];

const queryVector: Vector = { x: 5, y: 3.75, label: 'What is RAG?' };
const width = 500;
const height = 300;
const scale = 30; 
const origin = { x: 40, y: height - 40 };

const getCoords = (vec: Vector) => ({
    x: origin.x + vec.x * scale,
    y: origin.y - vec.y * scale,
});

// Calculations
const dotProduct = (v1: Vector, v2: Vector) => v1.x * v2.x + v1.y * v2.y;
const magnitude = (v: Vector) => Math.sqrt(v.x * v.x + v.y * v.y);
const cosineSimilarity = (v1: Vector, v2: Vector) => dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2));
const euclideanDistance = (v1: Vector, v2: Vector) => Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));

export const SimilarityMetricsSimulator = () => {
    const [metric, setMetric] = useState<'cosine' | 'euclidean'>('cosine');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedVector = vectors[selectedIndex];
    
    const cosSim = useMemo(() => cosineSimilarity(queryVector, selectedVector), [selectedVector]);
    const eucDist = useMemo(() => euclideanDistance(queryVector, selectedVector), [selectedVector]);

    const { formula, result, explanation } = useMemo(() => {
        if (metric === 'cosine') {
            return {
                formula: "cos(θ) = (A · B) / (||A|| * ||B||)",
                result: `${cosSim.toFixed(3)}`,
                explanation: "Measures the angle between vectors. A score of 1 means they are identical in direction.",
            };
        }
        return {
            formula: "dist(A, B) = √((x₂ - x₁)² + (y₁ - y₂)²)",
            result: `${eucDist.toFixed(2)}`,
            explanation: "Measures the direct, straight-line distance between the tips of the vectors.",
        };
    }, [metric, cosSim, eucDist]);


    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator /> Similarity Metrics</CardTitle>
                <CardDescription>
                    Explore how different metrics measure vector "closeness." See why Cosine Similarity's focus on direction is ideal for semantic search.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative border rounded-lg bg-muted/30 overflow-hidden">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ fontSize: '10px' }}>
                        {/* Grid lines and axes */}
                        <path d={`M ${origin.x} 0 V ${height} M 0 ${origin.y} H ${width}`} stroke="hsl(var(--border))" strokeWidth="0.5" />

                        {/* Other Vectors (de-emphasized) */}
                        {vectors.map((v, i) => i !== selectedIndex && (
                            <g key={`other-${i}`} opacity="0.2">
                                <line x1={origin.x} y1={origin.y} x2={getCoords(v).x} y2={getCoords(v).y} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
                                <text x={getCoords(v).x + 5} y={getCoords(v).y + 3} fill="hsl(var(--foreground))">{v.label}</text>
                            </g>
                        ))}
                        
                        {/* Query Vector */}
                        <motion.g initial={{opacity:0}} animate={{opacity:1}}>
                           <line x1={origin.x} y1={origin.y} x2={getCoords(queryVector).x} y2={getCoords(queryVector).y} stroke="hsl(var(--primary))" strokeWidth="2" />
                           <circle cx={getCoords(queryVector).x} cy={getCoords(queryVector).y} r="3" fill="hsl(var(--primary))" />
                           <text x={getCoords(queryVector).x - 20} y={getCoords(queryVector).y - 10} fontWeight="bold" fill="hsl(var(--primary))">Query: {queryVector.label}</text>
                        </motion.g>

                        {/* Selected Vector */}
                        <motion.g key={`selected-${selectedIndex}`} initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.1}}>
                           <line x1={origin.x} y1={origin.y} x2={getCoords(selectedVector).x} y2={getCoords(selectedVector).y} stroke="hsl(var(--foreground))" strokeWidth="2.5" />
                            <circle cx={getCoords(selectedVector).x} cy={getCoords(selectedVector).y} r="3" fill="hsl(var(--foreground))" />
                           <text x={getCoords(selectedVector).x + 5} y={getCoords(selectedVector).y + 3} fontWeight="bold" fill="hsl(var(--foreground))" >{selectedVector.label}</text>
                        </motion.g>

                        {/* Metric-specific visualization */}
                        <AnimatePresence>
                        {metric === 'cosine' && (
                            <motion.path
                                key={`arc-${selectedIndex}`}
                                d={`M ${origin.x + 40} ${origin.y} A 40 40 0 0 1 ${origin.x + 40 * Math.cos(Math.acos(cosSim))} ${origin.y - 40 * Math.sin(Math.acos(cosSim))}`}
                                stroke="hsl(var(--primary))"
                                strokeWidth="1.5"
                                fill="hsla(var(--primary), 0.1)"
                                strokeDasharray="3 3"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                            />
                        )}
                        {metric === 'euclidean' && (
                            <motion.line
                                key={`euclidean-${selectedIndex}`}
                                x1={getCoords(queryVector).x}
                                y1={getCoords(queryVector).y}
                                x2={getCoords(selectedVector).x}
                                y2={getCoords(selectedVector).y}
                                stroke="hsl(var(--primary))"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                            />
                        )}
                        </AnimatePresence>
                    </svg>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Controls</h3>
                        <Tabs value={metric} onValueChange={(v) => setMetric(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="cosine">Cosine Similarity</TabsTrigger>
                                <TabsTrigger value="euclidean">Euclidean Distance</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        
                        <p className="text-sm text-muted-foreground">Compare query to:</p>
                        <div className="flex gap-2 flex-wrap">
                            {vectors.map((v, i) => (
                                <Button key={i} onClick={() => setSelectedIndex(i)} variant={selectedIndex === i ? 'default' : 'outline'} size="sm">
                                    Document {i+1}
                                </Button>
                            ))}
                        </div>

                        <Card className="bg-muted/30">
                           <CardContent className="p-4 space-y-2">
                               <p className="font-mono text-primary text-sm text-center">{formula}</p>
                               <p className="text-xs text-muted-foreground text-center">{explanation}</p>
                               <div className="text-center font-bold text-4xl pt-2 text-primary">{result}</div>
                               <p className="text-center text-xs font-semibold uppercase text-primary/80">{metric === 'cosine' ? 'Similarity Score' : 'Distance'}</p>
                           </CardContent>
                        </Card>
                    </div>
                     <div className="space-y-4">
                        <Alert className="h-full border-primary/30 bg-primary/10">
                            <AlertTitle className="text-primary flex items-center gap-2"><Info className="h-4 w-4" />Why is Cosine Similarity Preferred?</AlertTitle>
                            <AlertDescription className="text-xs space-y-2 mt-2">
                                <p>In text analysis, we care more about the **semantic topic** (the vector's direction) than document length (the vector's magnitude). LLM embeddings encode meaning in **direction**.</p>
                                <p>Compare **Document 1** and **Document 2**. Notice their Cosine Similarity score is **1.000**. Their directions are identical, even though Doc 2 is longer. Euclidean Distance gives them different scores because it's sensitive to this length, which can be misleading.</p>
                                <p>This **scale-invariance** is crucial in high-dimensional spaces (like LLM embeddings), where angles remain meaningful while distances become less interpretable.</p>
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
