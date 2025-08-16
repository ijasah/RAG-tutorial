// src/components/SimilarityMetricsSimulator.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Orbit, ArrowLeft, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/code-block';

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
    <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-muted/30 h-full">
        <div className="text-center">
            <h3 className="font-semibold text-lg text-primary">{title}</h3>
            <code className="font-mono text-sm text-muted-foreground mt-1 h-6 block">{formula}</code>
        </div>
        <div className="relative w-full h-[300px] rounded-lg bg-muted/40 overflow-hidden my-2">
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
        const yOffset = isQuery ? -20 : 20;
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

const Formula = ({children} : {children: React.ReactNode}) => <code className="font-mono text-base bg-muted p-2 rounded-md block text-center my-3">{children}</code>

const derivationSteps = [
    {
        title: "Goal: Two Views of the Dot Product",
        content: () => (
            <div>
                <p>Our goal is to understand why the two common definitions of the dot product are equivalent. From this, cosine similarity falls out naturally.</p>
                <h4 className="font-semibold text-foreground mt-4 mb-2">1. The Algebraic Definition (from coordinates)</h4>
                <Formula>a · b = ∑ aᵢbᵢ</Formula>
                <h4 className="font-semibold text-foreground mt-4 mb-2">2. The Geometric Definition (from angle)</h4>
                <Formula>a · b = ||a|| ||b|| cos(θ)</Formula>
                <p className="mt-4">Equating them gives the famous formula for cosine similarity:</p>
                <Formula>cos(θ) = (a · b) / (||a|| ||b||)</Formula>
            </div>
        )
    },
    {
        title: "Derivation 1: Using the Law of Cosines",
        content: () => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <p>Consider a triangle formed by vectors <strong>a</strong> and <strong>b</strong>. The third side is the vector <strong>a - b</strong>. The Law of Cosines states:</p>
                    <Formula>||a - b||² = ||a||² + ||b||² - 2||a||||b||cos(θ)</Formula>
                    <p>This relates the lengths of the sides of a triangle to the cosine of one of its angles.</p>
                </div>
                 <div className="w-full max-w-[250px] mx-auto">
                    <svg viewBox="0 0 100 100">
                        <path d="M 10 90 L 80 70" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-primary)" />
                        <text x="85" y="70" fill="hsl(var(--primary))" fontWeight="bold">a</text>
                        <path d="M 10 90 L 70 20" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrow-secondary)" />
                        <text x="75" y="20" fill="hsl(var(--foreground))" fontWeight="bold">b</text>
                        <path d="M 70 20 L 80 70" stroke="hsl(var(--destructive))" strokeDasharray="3 3" strokeWidth="1.5" />
                        <text x="80" y="45" fill="hsl(var(--destructive))" fontWeight="bold">a-b</text>
                        <path d="M 25 82 A 15 15 0 0 1 30 70" stroke="currentColor" fill="none" />
                        <text x="35" y="80">θ</text>
                        <defs>
                            <marker id="arrow-primary" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" /></marker>
                            <marker id="arrow-secondary" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--foreground))" /></marker>
                        </defs>
                    </svg>
                </div>
            </div>
        )
    },
    {
        title: "Derivation 1: Expanding the Algebra",
        content: () => (
             <div>
                <p>Now, let's expand the term ||a - b||² using coordinates, where a = (x₁, y₁) and b = (x₂, y₂).</p>
                <Formula>||a - b||² = (x₁-x₂)² + (y₁-y₂)²</Formula>
                <p>Expanding this out gives:</p>
                <CodeBlock className="text-xs" code={`= (x₁² - 2x₁x₂ + x₂²) + (y₁² - 2y₁y₂ + y₂²)
= (x₁² + y₁²) + (x₂² + y₂²) - 2(x₁x₂ + y₁y₂)
= ||a||² + ||b||² - 2(a · b)`} />
                 <p className="mt-4">Here, we've defined the algebraic dot product as a shorthand: a · b = x₁x₂ + y₁y₂.</p>
            </div>
        )
    },
     {
        title: "Derivation 1: Equating the Two Forms",
        content: () => (
             <div>
                <p>We now have two different expressions for ||a - b||².</p>
                <p className="font-semibold text-foreground mt-4">From Law of Cosines:</p>
                 <CodeBlock className="text-xs" code={`||a||² + ||b||² - 2||a||||b||cos(θ)`} />
                <p className="font-semibold text-foreground mt-4">From Algebra:</p>
                 <CodeBlock className="text-xs" code={`||a||² + ||b||² - 2(a · b)`} />
                <p className="mt-4">Equating them and canceling terms leaves us with the desired result:</p>
                <Formula>||a|| ||b|| cos(θ) = a · b</Formula>
                 <p>This proves that the geometric and algebraic definitions of the dot product are one and the same.</p>
            </div>
        )
    },
    {
        title: "Derivation 2: Using Projections",
        content: () => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                 <div>
                    <p>This is often a more intuitive route. The dot product <strong>a · b</strong> can be interpreted as the length of the "shadow" (projection) of vector <strong>b</strong> onto vector <strong>a</strong>, scaled by the length of <strong>a</strong>.</p>
                    <p className="mt-4">From basic trigonometry, the length of this projection is:</p>
                     <Formula>Projection Length = ||b|| cos(θ)</Formula>
                </div>
                 <div className="w-full max-w-[250px] mx-auto">
                    <svg viewBox="0 0 100 100">
                        <path d="M 10 90 L 90 90" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrow-primary)" />
                        <text x="95" y="90" fill="hsl(var(--primary))" fontWeight="bold">a</text>
                        <path d="M 10 90 L 60 40" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrow-secondary)" />
                        <text x="65" y="40" fill="hsl(var(--foreground))" fontWeight="bold">b</text>
                        <path d="M 60 40 L 60 90" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5" />
                        <path d="M 10 90 L 60 90" stroke="hsl(var(--destructive))" strokeWidth="3" />
                        <text x="30" y="80" fill="hsl(var(--destructive))">||b||cos(θ)</text>
                         <path d="M 25 82 A 15 15 0 0 1 30 70" stroke="currentColor" fill="none" />
                        <text x="35" y="80">θ</text>
                        <defs>
                            <marker id="arrow-primary" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" /></marker>
                            <marker id="arrow-secondary" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--foreground))" /></marker>
                        </defs>
                    </svg>
                </div>
            </div>
        )
    },
    {
        title: "Derivation 2: The Final Step",
        content: () => (
             <div>
                <p>The scalar projection of <strong>b</strong> onto the direction of <strong>a</strong> is also defined as <strong>b</strong> dotted with the unit vector of <strong>a</strong>.</p>
                <Formula>Projection Length = b · (a / ||a||) = (a · b) / ||a||</Formula>
                <p className="mt-4">Now we equate our two expressions for the projection length:</p>
                 <CodeBlock className="text-xs" code={`||b||cos(θ) = (a · b) / ||a||`} />
                <p className="mt-4">Rearranging gives the final result:</p>
                 <Formula>a · b = ||a|| ||b|| cos(θ)</Formula>
                <p>This confirms the equivalence again. The dot product elegantly connects geometry and algebra.</p>
            </div>
        )
    },
     {
        title: "Numeric Example: A=(5,4), B=(2,2)",
        content: () => (
             <div>
                <p>Let's walk through the math with concrete numbers.</p>
                <h4 className="font-semibold text-foreground mt-4 mb-2">Step A: Dot Product</h4>
                 <CodeBlock code={`A · B = (5 * 2) + (4 * 2) = 10 + 8 = 18`} />
                <h4 className="font-semibold text-foreground mt-4 mb-2">Step B: Norms (Lengths)</h4>
                 <CodeBlock code={`||A|| = √(5² + 4²) = √41 ≈ 6.40
||B|| = √(2² + 2²) = √8 ≈ 2.83`} />
                 <h4 className="font-semibold text-foreground mt-4 mb-2">Step C: Cosine Similarity</h4>
                 <CodeBlock code={`cos(θ) = 18 / (6.40 * 2.83) ≈ 18 / 18.11 ≈ 0.994`} />
                 <h4 className="font-semibold text-foreground mt-4 mb-2">Step D: Final Angle</h4>
                 <CodeBlock code={`θ = arccos(0.994) ≈ 6.3°`} />
                <p className="mt-4 text-center">The small angle confirms the vectors are closely aligned.</p>
            </div>
        )
    },
]

export const SimilarityMetricsSimulator = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedVector = documents[selectedIndex];
    const [derivationStep, setDerivationStep] = useState(0);

    const cosSim = useMemo(() => cosineSimilarity(queryVector, selectedVector), [selectedVector]);
    const eucDist = useMemo(() => euclideanDistance(queryVector, selectedVector), [selectedVector]);

    const CurrentStep = derivationSteps[derivationStep].content;

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
                    <AlertTitle>Deriving Cosine Similarity: A Step-by-Step Guide</AlertTitle>
                     <AlertDescription asChild className="mt-4 space-y-4">
                        <div>
                             <p className="text-center text-muted-foreground mb-4">Click through to see how the formula is derived from first principles.</p>
                            <Card className="bg-background/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">{derivationStep + 1}. {derivationSteps[derivationStep].title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={derivationStep}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                           <CurrentStep />
                                        </motion.div>
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                            <div className="flex justify-between items-center mt-4">
                                <Button variant="outline" onClick={() => setDerivationStep(s => Math.max(0, s - 1))} disabled={derivationStep === 0}>
                                    <ArrowLeft className="mr-2" /> Previous
                                </Button>
                                <p className="text-sm text-muted-foreground">{derivationStep + 1} / {derivationSteps.length}</p>
                                <Button variant="outline" onClick={() => setDerivationStep(s => Math.min(derivationSteps.length - 1, s + 1))} disabled={derivationStep === derivationSteps.length - 1}>
                                    Next <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
};
