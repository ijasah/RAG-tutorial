// src/components/SimilarityMetricsSimulator.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Orbit, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Vector = { x: number; y: number; label: string; };

const documents: Vector[] = [
    { x: 4, y: 3, label: 'RAG is a technique.' },
    { x: 8, y: 6, label: 'RAG is a powerful technique for LLMs.' }, 
    { x: 3.5, y: 4, label: 'Chunking splits text.' },
    { x: 1, y: 5, label: 'The sky is blue.' },
];

const queryVector: Vector = { x: 5, y: 3.75, label: 'What is RAG?' };

const width = 400;
const height = 300;
const scale = 25; 
const origin = { x: 40, y: height - 60 };

const getCoords = (vec: Vector) => ({
    x: origin.x + vec.x * scale,
    y: origin.y - vec.y * scale,
});

// Calculations
const dotProduct = (v1: Vector, v2: Vector) => v1.x * v2.x + v1.y * v2.y;
const magnitude = (v: Vector) => Math.sqrt(v.x * v.x + v.y * v.y);
const cosineSimilarity = (v1: Vector, v2: Vector) => dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2));
const euclideanDistance = (v1: Vector, v2: Vector) => Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));

const MetricDisplay = ({ title, formula, value, children }: { title: string, formula: string, value: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-center space-y-3">
        <h3 className="font-semibold text-lg text-primary">{title}</h3>
        <p className="font-mono text-xs text-muted-foreground">{formula}</p>
        <div className="relative w-full h-[300px] border rounded-lg bg-muted/30 overflow-hidden">
            {children}
        </div>
        <div className="text-center">
            <p className="text-xs uppercase text-muted-foreground">Score</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
    </div>
);


export const SimilarityMetricsSimulator = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedVector = documents[selectedIndex];
    
    const cosSim = useMemo(() => cosineSimilarity(queryVector, selectedVector), [selectedVector]);
    const eucDist = useMemo(() => euclideanDistance(queryVector, selectedVector), [selectedVector]);

    const VectorVisualization = ({ selectedVec, metric }: { selectedVec: Vector, metric: 'cosine' | 'euclidean' }) => (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" style={{ fontSize: '10px' }}>
            {/* Grid lines and axes */}
            <path d={`M ${origin.x} 0 V ${height} M 0 ${origin.y} H ${width}`} stroke="hsl(var(--border))" strokeWidth="0.5" />

            {/* Other Vectors (de-emphasized) */}
            {documents.map((v, i) => i !== selectedIndex && (
                <g key={`other-${i}`} opacity="0.1">
                    <line x1={origin.x} y1={origin.y} x2={getCoords(v).x} y2={getCoords(v).y} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
                </g>
            ))}
            
            {/* Query Vector */}
            <g>
               <line x1={origin.x} y1={origin.y} x2={getCoords(queryVector).x} y2={getCoords(queryVector).y} stroke="hsl(var(--primary))" strokeWidth="2" />
               <circle cx={getCoords(queryVector).x} cy={getCoords(queryVector).y} r="3" fill="hsl(var(--primary))" />
               <text x={getCoords(queryVector).x - 20} y={getCoords(queryVector).y - 10} fontWeight="bold" fill="hsl(var(--primary))">Query</text>
            </g>

            {/* Selected Vector */}
            <g>
               <line x1={origin.x} y1={origin.y} x2={getCoords(selectedVec).x} y2={getCoords(selectedVec).y} stroke="hsl(var(--foreground))" strokeWidth="2.5" />
                <circle cx={getCoords(selectedVec).x} cy={getCoords(selectedVec).y} r="3" fill="hsl(var(--foreground))" />
               <text x={getCoords(selectedVec).x + 5} y={getCoords(selectedVec).y + 3} fontWeight="bold" fill="hsl(var(--foreground))" >Doc</text>
            </g>

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
                    x2={getCoords(selectedVec).x}
                    y2={getCoords(selectedVec).y}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                />
            )}
        </svg>
    );

    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator /> Similarity Metrics Side-by-Side</CardTitle>
                <CardDescription>
                    Explore how Cosine Similarity and Euclidean Distance measure vector "closeness" differently. Select a document to see why direction (angle) is more important than magnitude (length) for semantic search.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {/* Controls */}
                <div className="p-4 rounded-lg bg-muted/40">
                    <p className="text-sm font-semibold mb-2 text-center">Compare Query: "{queryVector.label}"</p>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {documents.map((v, i) => (
                            <Button key={i} onClick={() => setSelectedIndex(i)} variant={selectedIndex === i ? 'default' : 'outline'} size="sm" className="text-xs h-auto py-1.5">
                                "{v.label}"
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <MetricDisplay title="Cosine Similarity" formula="cos(θ) = (A · B) / (||A|| * ||B||)" value={cosSim.toFixed(3)}>
                        <VectorVisualization selectedVec={selectedVector} metric="cosine" />
                    </MetricDisplay>
                    <MetricDisplay title="Euclidean Distance" formula="√((x₂-x₁)² + (y₂-y₁)²)" value={eucDist.toFixed(2)}>
                        <VectorVisualization selectedVec={selectedVector} metric="euclidean" />
                    </MetricDisplay>
                </div>
                 
                <Alert className="mt-8 border-primary/30 bg-primary/10">
                    <Orbit className="h-4 w-4" />
                    <AlertTitle>Why Cosine Similarity is Preferred</AlertTitle>
                    <AlertDescription className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2">
                       <p>
                           <strong>Focuses on Direction:</strong> LLM embeddings encode meaning in a vector's <span className="text-primary font-semibold">direction</span>. Cosine similarity excels by only measuring the angle between vectors, ignoring magnitude. This is why the two "RAG" documents have a near-perfect score of ~1.0—they point in the same direction.
                       </p>
                       <p>
                           <strong>Ignores Misleading Magnitude:</strong> Euclidean distance measures the literal distance between vector endpoints. A longer document on the same topic will have a different magnitude, resulting in a larger (worse) Euclidean distance, even though the meaning is the same. This makes it less reliable for semantic tasks.
                       </p>
                    </AlertDescription>
                </Alert>

            </CardContent>
        </Card>
    );
};
