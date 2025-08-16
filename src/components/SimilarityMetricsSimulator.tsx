// src/components/SimilarityMetricsSimulator.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Orbit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Vector = { x: number; y: number; label: string; };

const documents: Vector[] = [
    { x: 1, y: 5, label: "The sky is blue." },
    { x: 4, y: 3, label: "RAG is a technique." },
    { x: 8, y: 6, label: "RAG is a powerful technique for LLMs." },
    { x: 3.5, y: 4, label: "Chunking splits text." },
];

const queryVector: Vector = { x: 5, y: 3.75, label: 'What is RAG?' };

const width = 500;
const height = 450;
const scale = 35;
const origin = { x: 50, y: height - 80 };

const getCoords = (vec: Vector) => ({
    x: origin.x + vec.x * scale,
    y: origin.y - vec.y * scale,
});

// Calculations
const dotProduct = (v1: Vector, v2: Vector) => v1.x * v2.x + v1.y * v2.y;
const magnitude = (v: Vector) => Math.sqrt(v.x * v.x + v.y * v.y);
const cosineSimilarity = (v1: Vector, v2: Vector) => dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2));
const euclideanDistance = (v1: Vector, v2: Vector) => Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));

const MetricDisplay = ({ title, formula, value, children, metric }: { title: string, formula: string, value: string, children: React.ReactNode, metric: 'cosine' | 'euclidean' }) => (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg bg-muted/20 h-full">
        <h3 className="font-semibold text-lg text-primary text-center">{title}</h3>
        <p className="font-mono text-xs text-muted-foreground h-8 text-center">{formula}</p>
        <div className="relative w-full h-[300px] rounded-lg bg-muted/30 overflow-hidden">
            {children}
        </div>
        <div className="text-center mt-auto">
            <p className="text-xs uppercase text-muted-foreground">Score</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
             <p className="text-xs text-muted-foreground mt-1 h-10">
                {metric === 'cosine'
                    ? 'Closer to 1 is more similar.'
                    : 'Closer to 0 is more similar.'
                }
            </p>
        </div>
    </div>
);


const VectorVisualization = ({ selectedVec, metric }: { selectedVec: Vector, metric: 'cosine' | 'euclidean' }) => {
    
    const queryAngle = Math.atan2(queryVector.y, queryVector.x);
    const selectedAngle = Math.atan2(selectedVec.y, selectedVec.x);

    const angleDiff = Math.abs(queryAngle - selectedAngle);
    const arcRadius = 40;
    
    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;
    
    const startPointArc = {
        x: origin.x + arcRadius * Math.cos(queryAngle),
        y: origin.y - arcRadius * Math.sin(queryAngle)
    }
    const endPointArc = {
        x: origin.x + arcRadius * Math.cos(selectedAngle),
        y: origin.y - arcRadius * Math.sin(selectedAngle)
    }

    const arcPath = `M ${startPointArc.x} ${startPointArc.y} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${queryAngle > selectedAngle ? 0 : 1} ${endPointArc.x} ${endPointArc.y}`;


    return (
         <svg viewBox={`0 0 ${width} ${height - 50}`} className="w-full h-full" style={{ fontSize: '12px' }}>
            {/* Grid lines and axes */}
            <path d={`M ${origin.x} 0 V ${height} M 0 ${origin.y} H ${width}`} stroke="hsl(var(--border))" strokeWidth="0.5" />
            
            {/* Query Vector */}
            <g>
               <motion.line x1={origin.x} y1={origin.y} x2={getCoords(queryVector).x} y2={getCoords(queryVector).y} stroke="hsl(var(--primary))" strokeWidth="2.5" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5}} />
               <motion.circle cx={getCoords(queryVector).x} cy={getCoords(queryVector).y} r="4" fill="hsl(var(--primary))" initial={{scale: 0}} animate={{scale: 1}} transition={{delay: 0.5}}/>
               <text x={getCoords(queryVector).x} y={getCoords(queryVector).y} dy="-10" textAnchor="middle" fontWeight="bold" fill="hsl(var(--primary))">{queryVector.label}</text>
            </g>

            {/* Selected Vector */}
            <g>
               <motion.line x1={origin.x} y1={origin.y} x2={getCoords(selectedVec).x} y2={getCoords(selectedVec).y} stroke="hsl(var(--foreground))" strokeWidth="2" opacity="0.8" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5}} />
                <motion.circle cx={getCoords(selectedVec).x} cy={getCoords(selectedVec).y} r="4" fill="hsl(var(--foreground))"  opacity="0.8" initial={{scale: 0}} animate={{scale: 1}} transition={{delay: 0.5}}/>
               <text x={getCoords(selectedVec).x} y={getCoords(selectedVec).y} dy="15" textAnchor="middle" fontWeight="bold" fill="hsl(var(--foreground))" opacity="0.8" >{selectedVec.label}</text>
            </g>

            {metric === 'cosine' && (
                <motion.path
                    key={`arc-${selectedVec.label}`}
                    d={arcPath}
                    stroke="hsl(var(--destructive))"
                    strokeWidth="2"
                    fill="hsla(var(--destructive), 0.1)"
                    strokeDasharray="3 3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{duration: 0.5, delay: 0.2}}
                />
            )}
            {metric === 'euclidean' && (
                <motion.line
                    key={`euclidean-${selectedVec.label}`}
                    x1={getCoords(queryVector).x}
                    y1={getCoords(queryVector).y}
                    x2={getCoords(selectedVec).x}
                    y2={getCoords(selectedVec).y}
                    stroke="hsl(var(--destructive))"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{duration: 0.5, delay: 0.2}}
                />
            )}
        </svg>
    );
}

export const SimilarityMetricsSimulator = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedVector = documents[selectedIndex];
    
    const cosSim = useMemo(() => cosineSimilarity(queryVector, selectedVector), [selectedVector]);
    const eucDist = useMemo(() => euclideanDistance(queryVector, selectedVector), [selectedVector]);

    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator /> Similarity Metrics Side-by-Side</CardTitle>
                <CardDescription>
                    Explore how Cosine Similarity and Euclidean Distance measure vector "closeness" differently. Select a document to see why direction (angle) is more important than magnitude (length) for semantic search.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/40">
                    <p className="text-sm font-semibold mb-3 text-center">Compare Query: "{queryVector.label}"</p>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {documents.map((v, i) => (
                            <Button key={i} onClick={() => setSelectedIndex(i)} variant={selectedIndex === i ? 'default' : 'outline'} size="sm" className="text-xs h-auto py-1.5 px-3">
                                "{v.label}"
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <MetricDisplay title="Cosine Similarity" formula="cos(θ) = (A · B) / (||A|| * ||B||)" value={cosSim.toFixed(3)} metric="cosine">
                        <VectorVisualization selectedVec={selectedVector} metric="cosine" />
                    </MetricDisplay>
                    <MetricDisplay title="Euclidean Distance" formula="√((x₂-x₁)² + (y₂-y₁)²)" value={eucDist.toFixed(2)} metric="euclidean">
                        <VectorVisualization selectedVec={selectedVector} metric="euclidean" />
                    </MetricDisplay>
                </div>
                 
                <Alert className="mt-8 border-primary/30 bg-primary/10">
                    <Orbit className="h-4 w-4" />
                    <AlertTitle>Why Cosine Similarity is Preferred for RAG</AlertTitle>
                     <AlertDescription className="mt-2 space-y-2">
                       <p>
                           In semantic search, we care more about the <strong>topic</strong> (the vector's direction) than the document's length (the vector's magnitude). LLM embeddings encode meaning in <strong>direction</strong>.
                       </p>
                       <p>
                           Notice that the two "RAG" documents have a very high Cosine Similarity score (~1.0) because their vectors point in almost the same direction, even though one sentence is much longer. Euclidean Distance gives them very different scores because it is misled by the difference in magnitude (length). This <strong>scale-invariance</strong> is crucial for finding the best context.
                       </p>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
};
