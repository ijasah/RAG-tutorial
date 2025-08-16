// src/components/SimilarityMetricsSimulator.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Orbit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Vector = { x: number; y: number; label: string; };

const documents: Vector[] = [
    { x: 8, y: 1, label: "The sky is blue." },
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

const MetricDisplay = ({ title, formula, value, children }: { title: string, formula: string, value: string, children: React.ReactNode }) => (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg bg-muted/20 h-full">
        <h3 className="font-semibold text-lg text-primary text-center">{title}</h3>
        <p className="font-mono text-xs text-muted-foreground h-8 text-center">{formula}</p>
        <div className="relative w-full h-[300px] rounded-lg bg-muted/30 overflow-hidden">
            {children}
        </div>
        <div className="text-center mt-auto">
            <p className="text-xs uppercase text-muted-foreground">Score</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
    </div>
);


const VectorVisualization = ({ selectedVec, metric }: { selectedVec: Vector, metric: 'cosine' | 'euclidean' }) => {
    const queryCoords = getCoords(queryVector);
    const selectedCoords = getCoords(selectedVec);

    const queryAngle = Math.atan2(queryVector.y, queryVector.x);
    const selectedAngle = Math.atan2(selectedVec.y, selectedVec.x);

    const angleDiff = Math.abs(queryAngle - selectedAngle);
    const arcRadius = 40;

    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

    const startPointArc = {
        x: origin.x + arcRadius * Math.cos(Math.min(queryAngle, selectedAngle)),
        y: origin.y - arcRadius * Math.sin(Math.min(queryAngle, selectedAngle))
    }
    const endPointArc = {
        x: origin.x + arcRadius * Math.cos(Math.max(queryAngle, selectedAngle)),
        y: origin.y - arcRadius * Math.sin(Math.max(queryAngle, selectedAngle))
    }
    const arcPath = `M ${startPointArc.x} ${startPointArc.y} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${endPointArc.x} ${endPointArc.y}`;

    const getTextPosition = (vecCoords: { x: number, y: number }, baseCoords: { x: number, y: number } = {x: 0, y: 0}) => {
        const dx = (vecCoords.x - baseCoords.x);
        const dy = (vecCoords.y - baseCoords.y);
        const angle = Math.atan2(dy, dx);
        const offsetX = Math.cos(angle) * 30; // 30px offset
        const offsetY = Math.sin(angle) * 30;
        
        return {
            x: vecCoords.x + offsetX,
            y: vecCoords.y + offsetY,
            textAnchor: Math.abs(angle) > Math.PI / 2 ? "end" : "start"
        }
    }
    
    const selectedLabelPos = getTextPosition(selectedCoords, queryCoords);


    return (
        <svg viewBox={`0 0 ${width} ${height - 50}`} className="w-full h-full" style={{ fontSize: '12px' }}>
            <path d={`M ${origin.x} 0 V ${height} M 0 ${origin.y} H ${width}`} stroke="hsl(var(--border))" strokeWidth="0.5" />
            
            {/* Query Vector */}
            <g>
               <motion.line x1={origin.x} y1={origin.y} x2={queryCoords.x} y2={queryCoords.y} stroke="hsl(var(--primary))" strokeWidth="2.5" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5}} />
               <motion.circle cx={queryCoords.x} cy={queryCoords.y} r="4" fill="hsl(var(--primary))" initial={{scale: 0}} animate={{scale: 1}} transition={{delay: 0.5}}/>
                <text x={queryCoords.x} y={queryCoords.y - 12} textAnchor="middle" fontWeight="bold" fill="hsl(var(--primary))">{queryVector.label}</text>
            </g>

            {/* Selected Vector */}
            <g>
                <motion.line x1={origin.x} y1={origin.y} x2={selectedCoords.x} y2={selectedCoords.y} stroke="hsl(var(--foreground))" strokeWidth="2" opacity="0.8" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5}} />
                <motion.circle cx={selectedCoords.x} cy={selectedCoords.y} r="4" fill="hsl(var(--foreground))"  opacity="0.8" initial={{scale: 0}} animate={{scale: 1}} transition={{delay: 0.5}}/>
                <text x={selectedCoords.x} y={selectedCoords.y - 12} dy="0" textAnchor="middle" fontWeight="bold" fill="hsl(var(--foreground))" opacity="0.8" >{selectedVec.label}</text>
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
                    x1={queryCoords.x}
                    y1={queryCoords.y}
                    x2={selectedCoords.x}
                    y2={selectedCoords.y}
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
                    Select a document to compare against the query. Observe how Cosine Similarity (angle) and Euclidean Distance (direct line) produce different scores.
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
                    <MetricDisplay title="Cosine Similarity" formula="cos(θ) = (A · B) / (||A|| * ||B||)" value={cosSim.toFixed(3)}>
                        <VectorVisualization selectedVec={selectedVector} metric="cosine" />
                    </MetricDisplay>
                    <MetricDisplay title="Euclidean Distance" formula="√((x₂-x₁)² + (y₂-y₁)²)" value={eucDist.toFixed(2)}>
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
                           Select the other "RAG" document and notice that the two RAG documents have a very high Cosine Similarity score because their vectors point in almost the same direction, even though one sentence is much longer. Euclidean Distance is misled by the difference in magnitude (length). This <strong>scale-invariance</strong> is crucial for finding the best context.
                       </p>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
};
