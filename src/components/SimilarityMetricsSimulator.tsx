// src/components/SimilarityMetricsSimulator.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Scaling } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Vector = { x: number; y: number; label: string; };

const vectors: Vector[] = [
    { x: 4, y: 1, label: 'King' },
    { x: 3.5, y: 1.5, label: 'Queen' },
    { x: 1, y: 4, label: 'Apple' },
];

const queryVector: Vector = { x: 4, y: 0.5, label: 'Man' };
const width = 500;
const height = 300;
const scale = 50;
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

const SimilarityMetricsSimulator = () => {
    const [metric, setMetric] = useState<'cosine' | 'euclidean'>('cosine');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedVector = vectors[selectedIndex];
    
    const cosSim = useMemo(() => cosineSimilarity(queryVector, selectedVector), [selectedVector]);
    const eucDist = useMemo(() => euclideanDistance(queryVector, selectedVector), [selectedVector]);

    const { formula, result, explanation } = useMemo(() => {
        if (metric === 'cosine') {
            return {
                formula: "cos(θ) = (A · B) / (||A|| * ||B||)",
                result: `Score: ${cosSim.toFixed(3)}`,
                explanation: "Cosine Similarity measures the angle between vectors. A score close to 1 means they point in a similar direction, indicating high semantic similarity. This is ideal for text embeddings.",
            };
        }
        return {
            formula: "dist(A, B) = √((x₂ - x₁)² + (y₂ - y₁)²)",
            result: `Distance: ${eucDist.toFixed(2)}`,
            explanation: "Euclidean Distance measures the direct, straight-line distance. Notice 'Queen' is closer than 'King' in distance, but 'King' is more semantically similar in direction (angle). This is why cosine is often preferred.",
        };
    }, [metric, cosSim, eucDist]);


    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator /> Similarity Metrics</CardTitle>
                <CardDescription>
                    Explore how different metrics measure the "closeness" of vectors. Compare the query 'Man' to other concepts.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                         <Tabs value={metric} onValueChange={(v) => setMetric(v as any)} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="cosine">Cosine Similarity</TabsTrigger>
                                <TabsTrigger value="euclidean">Euclidean Distance</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <p className="text-sm text-muted-foreground">Compare <span className="font-bold text-primary">'{queryVector.label}'</span> to:</p>
                        <div className="flex gap-2">
                            {vectors.map((v, i) => (
                                <Button key={v.label} onClick={() => setSelectedIndex(i)} variant={selectedIndex === i ? 'default' : 'outline'}>
                                    {v.label}
                                </Button>
                            ))}
                        </div>
                        <Alert>
                            <Scaling className="h-4 w-4" />
                            <AlertTitle className="font-mono text-primary text-sm">{formula}</AlertTitle>
                            <AlertDescription className="text-xs mt-2">{explanation}</AlertDescription>
                        </Alert>
                        <div className="text-center font-bold text-xl">{result}</div>
                    </div>
                    <div className="relative border rounded-lg bg-muted/30" style={{ width, height }}>
                        <svg width={width} height={height} className="text-xs">
                            {/* Grid lines */}
                            <path d={`M ${origin.x} 0 V ${height} M 0 ${origin.y} H ${width}`} stroke="hsl(var(--border))" strokeWidth="1" />
                            
                            {/* Query Vector */}
                            <motion.line x1={origin.x} y1={origin.y} x2={getCoords(queryVector).x} y2={getCoords(queryVector).y} stroke="hsl(var(--primary))" strokeWidth="2" />
                            <text x={getCoords(queryVector).x + 5} y={getCoords(queryVector).y} fill="hsl(var(--primary))">{queryVector.label}</text>

                            {/* Selected Vector */}
                            <motion.line x1={origin.x} y1={origin.y} x2={getCoords(selectedVector).x} y2={getCoords(selectedVector).y} stroke="hsl(var(--foreground))" strokeWidth="2" />
                            <text x={getCoords(selectedVector).x + 5} y={getCoords(selectedVector).y} fill="hsl(var(--foreground))">{selectedVector.label}</text>

                             {/* Other Vectors */}
                             {vectors.map((v, i) => i !== selectedIndex && (
                                <g key={v.label} opacity="0.3">
                                    <line x1={origin.x} y1={origin.y} x2={getCoords(v).x} y2={getCoords(v).y} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                    <text x={getCoords(v).x + 5} y={getCoords(v).y} fill="hsl(var(--muted-foreground))" >{v.label}</text>
                                </g>
                             ))}


                            {/* Angle Arc for Cosine */}
                            {metric === 'cosine' && (
                                <motion.path
                                    d={`M ${origin.x + 30} ${origin.y} A 30 30 0 0 1 ${origin.x + 30 * Math.cos(Math.acos(cosSim))} ${origin.y - 30 * Math.sin(Math.acos(cosSim))}`}
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeDasharray="3 3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    key={selectedIndex}
                                />
                            )}

                             {/* Line for Euclidean */}
                             {metric === 'euclidean' && (
                                <motion.line
                                    x1={getCoords(queryVector).x}
                                    y1={getCoords(queryVector).y}
                                    x2={getCoords(selectedVector).x}
                                    y2={getCoords(selectedVector).y}
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    key={selectedIndex + 'euclidean'}
                                />
                            )}
                        </svg>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export { SimilarityMetricsSimulator };
