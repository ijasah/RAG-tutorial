// src/components/ANNVisualization.tsx
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Search, Play, RefreshCw, ArrowRight } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Generate more random points for a denser visualization
const generatePoints = (numPoints: number, width: number, height: number) => {
    return Array.from({ length: numPoints }, () => ({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
    }));
};

const ANNVisualization = () => {
    const width = 500;
    const height = 300;
    const [step, setStep] = useState(0);
    const [points, setPoints] = useState<{x: number, y: number}[]>([]);

    useEffect(() => {
        setPoints(generatePoints(100, width, height));
    }, [width, height]);


    const queryPoint = useMemo(() => ({ x: width / 2, y: height / 2 }), [width, height]);

    // Find true nearest neighbors for comparison
    const getNeighbors = (center: {x:number, y:number}, num: number) => {
        return [...points]
            .sort((a, b) => {
                const distA = Math.hypot(a.x - center.x, a.y - center.y);
                const distB = Math.hypot(b.x - center.x, b.y - center.y);
                return distA - distB;
            })
            .slice(0, num);
    };
    
    const trueNeighbors = useMemo(() => getNeighbors(queryPoint, 5), [points, queryPoint]);
    // Simulate ANN by picking a random subset + some true neighbors
    const annNeighbors = useMemo(() => {
        if (points.length === 0) return [];
        const ann = new Set([...trueNeighbors.slice(0,3), ...getNeighbors(points[10], 2)]);
        return Array.from(ann);
    }, [trueNeighbors, points]);


    const reset = () => {
        setStep(0);
        setPoints(generatePoints(100, width, height));
    };
    const nextStep = () => setStep(s => s + 1);

    const getStepDescription = () => {
        switch (step) {
            case 1: return "A query (purple) is introduced. In a brute-force search, we would compare it to all 100 points.";
            case 2: return "ANN creates shortcuts (a graph, not shown for simplicity). It intelligently navigates to a promising region.";
            case 3: return "It explores the local neighborhood, checking only a fraction of points (yellow) to find the 'good enough' closest ones.";
            case 4: return "The approximate nearest neighbors are returned. It's much faster than checking every point, and usually correct!";
            default: return "See how ANN speeds up search by not checking every single data point."
        }
    }


    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap /> Approximate Nearest Neighbor (ANN) Search</CardTitle>
                <CardDescription>{getStepDescription()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative border rounded-lg bg-muted/30" style={{ width, height }}>
                    <svg width={width} height={height}>
                        {/* Data Points */}
                        {points.map((p, i) => (
                            <motion.circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r={3}
                                fill="hsl(var(--primary) / 0.5)"
                                initial={{ opacity: 0}}
                                animate={{ opacity: step > 0 ? 1: 0}}
                            />
                        ))}
                        
                        {/* Query Point */}
                        {step > 0 && <motion.circle cx={queryPoint.x} cy={queryPoint.y} r={5} fill="hsl(var(--accent-foreground))" initial={{ scale: 0 }} animate={{ scale: 1 }} />}

                        {/* ANN Searched Region */}
                        {step > 1 && (
                            <motion.circle
                                cx={queryPoint.x}
                                cy={queryPoint.y}
                                r={80}
                                fill="hsl(var(--primary) / 0.1)"
                                stroke="hsl(var(--primary) / 0.3)"
                                strokeDasharray="4 4"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                            />
                        )}

                        {/* Searched points */}
                        {step > 2 && annNeighbors.map((p, i) => (
                            <motion.circle
                                key={`ann-${i}`}
                                cx={p.x}
                                cy={p.y}
                                r={4}
                                fill="hsl(var(--primary))"
                                stroke="white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1}}
                            />
                        ))}

                         {/* Final Result */}
                        {step > 3 && trueNeighbors.map((p, i) => (
                            <motion.line
                                key={`line-${i}`}
                                x1={queryPoint.x}
                                y1={queryPoint.y}
                                x2={p.x}
                                y2={p.y}
                                stroke="hsl(var(--primary))"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            />
                        ))}
                    </svg>
                </div>

                <div className="flex justify-center gap-4">
                    {step === 0 && <Button onClick={() => setStep(1)}><Play className="mr-2"/>Start</Button>}
                    {step > 0 && <Button variant="outline" onClick={reset}><RefreshCw className="mr-2"/>Reset</Button>}
                    {step > 0 && step < 4 && <Button onClick={nextStep}>Next <ArrowRight className="ml-2"/></Button>}
                </div>
                 {step === 4 && (
                    <Alert className="border-primary/30 bg-primary/10">
                        <Zap className="h-4 w-4" />
                        <AlertTitle>Conclusion</AlertTitle>
                        <AlertDescription>
                           ANN found the 5 nearest neighbors by only evaluating ~25 points instead of all 100. This is the key to efficient search in massive datasets.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};

export { ANNVisualization };
