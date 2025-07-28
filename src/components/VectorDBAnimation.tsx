// src/components/VectorDBAnimation.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Database, BrainCircuit, Search, Play, RefreshCw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/code-block';
import { Input } from './ui/input';

const documents = [
    { id: 'doc1', text: 'RAG combines retrieval with generation for enhanced LLM answers.' },
    { id: 'doc2', text: 'Vector databases like Pinecone are key for storing embeddings.' },
    { id: 'doc3', text: 'Semantic chunking divides text based on meaning for better context.' },
    { id: 'doc4', text: 'The sky is blue and the grass is green on a sunny day.' },
];

const initialVectors = {
    doc1: [0.1, 0.9, 0.2],
    doc2: [0.2, 0.8, 0.3],
    doc3: [0.3, 0.7, 0.4],
    doc4: [0.9, 0.1, 0.8],
}

const queryVector = [0.15, 0.85, 0.25]; // A vector semantically close to doc1 and doc2

export const VectorDBAnimation = () => {
    const [step, setStep] = useState(0);
    const [vectors, setVectors] = useState<Record<string, number[]>>({});
    const [processedDocs, setProcessedDocs] = useState<string[]>([]);

    const startAnimation = () => {
        setStep(1);
    };

    const resetAnimation = () => {
        setStep(0);
        setVectors({});
        setProcessedDocs([]);
    };

    const handleNextStep = () => {
        setStep(prev => Math.min(prev + 1, 6));
    };

    useEffect(() => {
        if (step > 1 && step < 6) {
            const docId = documents[processedDocs.length].id;
            const timer = setTimeout(() => {
                setVectors(prev => ({ ...prev, [docId]: initialVectors[docId as keyof typeof initialVectors] }));
                setProcessedDocs(prev => [...prev, docId]);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [step, processedDocs]);


    const getStepDescription = () => {
        switch (step) {
            case 1: return "1. Documents are prepared for encoding.";
            case 2: return "2. Each document is passed through an embedding model.";
            case 3: return "3. The model converts text into a numerical vector.";
            case 4: return "4. Vectors are stored and indexed in the Vector DB.";
            case 5: return "5. A user query is encoded into a vector.";
            case 6: return "6. Similarity search finds the closest vectors in the DB.";
            default: return "Click 'Start' to see how documents are converted to vectors and stored."
        }
    }
    
    const isFinished = Object.keys(vectors).length === documents.length;
    const showQuery = step >= 5;
    const showSearch = step >= 6;

    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle>Vector Database Simulation</CardTitle>
                <CardDescription>
                    {getStepDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[350px]">
                    {/* Left Side: Documents & Encoder */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-center text-sm">Document Source</h4>
                        <div className="grid grid-cols-2 gap-2">
                        <AnimatePresence>
                            {documents.map((doc, i) => (
                                !processedDocs.includes(doc.id) && step > 0 &&
                                <motion.div
                                    key={doc.id}
                                    layoutId={doc.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-2 border rounded-md bg-muted/50 text-xs"
                                >
                                    {doc.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        </div>
                    </div>

                     {/* Right Side: Vector DB */}
                     <div className="space-y-4">
                        <h4 className="font-semibold text-center text-sm">Vector Database</h4>
                        <div className="p-4 border rounded-lg bg-muted/50 h-full space-y-2">
                             <AnimatePresence>
                                {Object.entries(vectors).map(([id, vec]) => {
                                    const isSimilar = showSearch && (id === 'doc1' || id === 'doc2');
                                    return (
                                        <motion.div 
                                            key={id}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0,
                                                backgroundColor: isSimilar ? 'hsla(var(--primary), 0.2)' : 'hsla(var(--muted), 0.5)',
                                                borderColor: isSimilar ? 'hsla(var(--primary), 0.4)' : 'hsla(var(--border), 1)',
                                            }}
                                            transition={{ duration: 0.5 }}
                                            className="p-2 border rounded-md text-xs flex items-center gap-2"
                                        >
                                            <strong className="text-primary/80">{id}:</strong>
                                            <span className="font-mono">{`[${vec.join(', ')}]`}</span>
                                        </motion.div>
                                    )
                                })}
                                {showQuery && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-2 border border-green-500/50 bg-green-500/20 rounded-md text-xs mt-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <strong className="text-green-300">Query:</strong>
                                            <span>"What is RAG?"</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono mt-1">
                                            <strong className="text-green-300">Vector:</strong>
                                            <span>{`[${queryVector.join(', ')}]`}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4 gap-4">
                    {step === 0 && <Button onClick={startAnimation}><Play className="mr-2"/>Start</Button>}
                    {step > 0 && <Button variant="outline" onClick={resetAnimation}><RefreshCw className="mr-2"/>Reset</Button>}
                    {step === 1 && <Button onClick={() => setStep(2)}>Encode Documents <ArrowRight className="ml-2"/></Button>}
                    {step > 1 && isFinished && !showQuery && <Button onClick={() => setStep(5)}>Encode Query <ArrowRight className="ml-2"/></Button>}
                    {showQuery && !showSearch && <Button onClick={() => setStep(6)}>Similarity Search <ArrowRight className="ml-2"/></Button>}
                </div>

                 {showSearch && (
                    <motion.div 
                        initial={{opacity: 0}} animate={{opacity: 1}}
                        className="mt-6 text-center"
                    >
                        <h4 className="font-semibold text-primary">Retrieved Context</h4>
                        <p className="text-sm text-muted-foreground">The two most similar documents are retrieved to be used as context.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                           <div className="p-3 border rounded-lg bg-primary/10"><strong>Doc 1:</strong> RAG combines retrieval with generation...</div>
                           <div className="p-3 border rounded-lg bg-primary/10"><strong>Doc 2:</strong> Vector databases like Pinecone are key...</div>
                        </div>
                    </motion.div>
                )}

            </CardContent>
        </Card>
    );
};
