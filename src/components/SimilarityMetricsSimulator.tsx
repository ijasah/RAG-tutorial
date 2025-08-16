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

const MetricDisplay = ({ title, formula, value, children, description }: { title: string, formula: string, value: string, children: React.ReactNode, description?: React.ReactNode }) => (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-muted/30 h-full">
        <div className="text-center">
            <h3 className="font-semibold text-lg text-primary">{title}</h3>
            <p className="font-mono text-sm text-muted-foreground mt-1 h-6">{formula}</p>
        </div>
        <div className="relative w-full h-[300px] rounded-lg bg-muted/40 overflow-hidden my-2">
            {children}
        </div>
        <div className="text-center mt-auto">
            {description}
            <p className="text-xs uppercase text-muted-foreground">Score</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
    </div>
);

const VectorVisualization = ({ selectedVec, metric }: { selectedVec: Vector, metric: 'cosine' | 'euclidean' }) => {
    const queryCoords = getCoords(queryVector);
    const selectedCoords = getCoords(selectedVec);

    const queryAngle = Math.atan2(-queryVector.y, queryVector.x);
    const selectedAngle = Math.atan2(-selectedVec.y, selectedVec.x);
    
    const arcRadius = 40;

    const startAngle = Math.min(queryAngle, selectedAngle);
    const endAngle = Math.max(queryAngle, selectedAngle);
    
    const startPointArc = {
        x: origin.x + arcRadius * Math.cos(startAngle),
        y: origin.y + arcRadius * Math.sin(startAngle)
    };
    const endPointArc = {
        x: origin.x + arcRadius * Math.cos(endAngle),
        y: origin.y + arcRadius * Math.sin(endAngle)
    };
    const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0;
    
    const arcPath = `M ${startPointArc.x} ${startPointArc.y} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${endPointArc.x} ${endPointArc.y}`;
    
    const getTextPosition = (vec: Vector, isQuery: boolean) => {
        const coords = getCoords(vec);
        const yOffset = isQuery ? -20 : 20; // Increase y-offset to avoid overlap
        const xOffset = isQuery ? 15 : 0;

        return {
            x: coords.x + xOffset,
            y: coords.y + yOffset,
            textAnchor: isQuery ? "start" : "middle",
        }
    }
    
    const queryLabelPos = getTextPosition(queryVector, true);
    const selectedLabelPos = getTextPosition(selectedVec, false);


    return (
        <svg viewBox={`0 0 ${width} ${height - 50}`} className="w-full h-full" style={{ fontSize: '12px' }}>
            <path d={`M ${origin.x} 0 V ${height} M 0 ${origin.y} H ${width}`} stroke="hsl(var(--border))" strokeWidth="0.5" />
            
            {/* Vectors */}
            {[queryVector, selectedVec].map((vec, i) => {
                 const coords = getCoords(vec);
                 const pos = i === 0 ? queryLabelPos : selectedLabelPos;
                 return (
                    <g key={vec.label}>
                       <motion.line x1={origin.x} y1={origin.y} x2={coords.x} y2={coords.y} stroke={i === 0 ? "hsl(var(--primary))" : "hsl(var(--foreground))"} strokeWidth={i === 0 ? "2.5" : "2"} opacity={i === 0 ? 1 : 0.8} initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5}} />
                       <motion.circle cx={coords.x} cy={coords.y} r="4" fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--foreground))"} opacity={i === 0 ? 1 : 0.8} initial={{scale: 0}} animate={{scale: 1}} transition={{delay: 0.5}}/>
                        <text x={pos.x} y={pos.y} textAnchor={pos.textAnchor as any} fontWeight="bold" fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--foreground))"} opacity={i === 0 ? 1 : 0.8}>{vec.label}</text>
                    </g>
                 )
            })}

            {metric === 'cosine' && (
                <>
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
                </>
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
                    <AlertTitle>Understanding Cosine Similarity</AlertTitle>
                     <AlertDescription className="mt-2 space-y-4">
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Component 1: The Dot Product (A · B)</h4>
                            <p>The dot product is the sum of the products of the corresponding components of two vectors. Geometrically, it measures how much one vector points in the direction of another. A larger value means a greater degree of alignment.</p>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Component 2: The L2 Norm (Magnitude ||v||)</h4>
                                <p>The norm (or magnitude) is the length of a vector, calculated using the Pythagorean theorem: <code className="font-mono bg-muted p-1 rounded-md">||v|| = √(x² + y²)</code>. In text embeddings, this often corresponds to the length or amount of information in the text. Longer text might have a larger magnitude.</p>
                            </div>
                            <div className="w-full max-w-[200px] mx-auto">
                                <svg viewBox="0 0 100 100">
                                    <path d="M 10 90 H 80" stroke="currentColor" strokeDasharray="2 2" />
                                    <path d="M 80 90 V 20" stroke="currentColor" strokeDasharray="2 2" />
                                    <path d="M 10 90 L 80 20" stroke="hsl(var(--primary))" strokeWidth="2" />
                                    <text x="45" y="95" textAnchor="middle" fontSize="8">x</text>
                                    <text x="85" y="55" textAnchor="middle" fontSize="8">y</text>
                                    <text x="35" y="50" fill="hsl(var(--primary))" fontSize="8" transform="rotate(-35, 40, 50)">||v||</text>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Deriving Cosine Similarity</h4>
                            <p>The geometric definition of the dot product is <code className="font-mono bg-muted p-1 rounded-md">A · B = ||A|| * ||B|| * cos(θ)</code>, where θ is the angle between the vectors. By rearranging this formula to solve for <code className="font-mono bg-muted p-1 rounded-md">cos(θ)</code>, we get the Cosine Similarity formula. This isolates the angle, making the comparison independent of the vectors' magnitudes. In semantic search, this is crucial because we care about the topic (direction) far more than the document's length (magnitude).</p>
                        </div>
                       <div>
                            <h4 className="font-semibold text-foreground mb-2">Try it yourself:</h4>
                            <p>
                               Select the other "RAG" document. Notice that the two RAG documents have a very high Cosine Similarity score because their vectors point in almost the same direction, even though one sentence is much longer. Euclidean Distance is misled by the difference in magnitude (length). This <strong>scale-invariance</strong> is crucial for finding the best context.
                           </p>
                       </div>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
};
