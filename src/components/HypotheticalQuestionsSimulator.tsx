// src/components/HypotheticalQuestionsSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Files, BrainCircuit, HelpCircle, FileText, Database, Search, MessageSquare, Play, RefreshCw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const initialChunks = {
    "chunk-1": "RAG enhances LLMs by grounding them in external knowledge, reducing hallucinations.",
    "chunk-2": "A key RAG component is the vector database, used for efficient similarity search.",
    "chunk-3": "BERT and other Transformer models are often used for creating text embeddings."
};

const hypotheticalQuestions = {
    "chunk-1": "How does RAG improve LLM factuality?",
    "chunk-2": "What role do vector databases play in RAG?",
    "chunk-3": "Which models create embeddings for RAG?"
};

const userQuery = "Why is RAG better than just using an LLM?";

const FlowNode = ({ icon, title, children, highlighted = false, className = '' }: { icon: React.ReactNode, title: string, children?: React.ReactNode, highlighted?: boolean, className?: string }) => (
    <div className={cn("relative text-center", className)}>
        <div className="flex flex-col items-center">
            {icon}
            <h4 className="text-xs font-semibold mt-2 text-muted-foreground">{title}</h4>
        </div>
        <AnimatePresence>
            {children && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                 >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const Arrow = ({ label, isDashed = false, className = '' }: { label: string, isDashed?: boolean, className?: string }) => (
    <div className={cn("flex flex-col items-center justify-center text-center h-full", className)}>
        <Badge variant="secondary" className="mb-2 z-10 text-xs">{label}</Badge>
        <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" className="z-0">
             <path d="M 0 10 L 100 10" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray={isDashed ? "4 4" : "none"} markerEnd="url(#arrowhead)" />
        </svg>
    </div>
)

const StepIndicator = ({ step, label, isActive }: { step: number, label: string, isActive: boolean }) => (
    <div className={cn("flex items-center gap-2 transition-all", isActive ? "text-primary" : "text-muted-foreground/60")}>
        <div className={cn("flex items-center justify-center w-5 h-5 rounded-full border-2 text-xs font-bold", isActive ? "border-primary" : "border-muted-foreground/60")}>
            {step}
        </div>
        <span className={cn("text-sm", isActive && "font-semibold")}>{label}</span>
    </div>
);

export const HypotheticalQuestionsSimulator = () => {
    const [step, setStep] = useState(0);

    const handleNext = () => setStep(s => Math.min(s + 1, 7));
    const handleReset = () => setStep(0);
    const isRunning = step > 0;

    const renderStepContent = () => {
        return (
            <div className="grid grid-cols-[1fr_auto_1.5fr_auto_1.5fr_auto_1fr] items-center gap-x-2 w-full">
                {/* Step 1: Documents to Chunks */}
                <FlowNode icon={<Files className="w-8 h-8 text-primary" />} title="Documents">
                    {step === 1 && <motion.div layoutId="doc-item" className="p-2 border rounded-md bg-muted text-xs mt-2 w-28">Doc 1</motion.div>}
                </FlowNode>
                <Arrow label="1. Chunk" />

                {/* Step 2: Chunks to Hypothetical Questions */}
                <FlowNode icon={<FileText className="w-8 h-8 text-primary" />} title="Document Chunks">
                    <div className="space-y-1 mt-2 w-48">
                         <AnimatePresence>
                           {step >= 1 && <motion.div layoutId="doc-item" className={cn("p-2 border rounded-md text-xs", step === 2 && "border-blue-500 bg-blue-500/10")}>{initialChunks['chunk-1']}</motion.div>}
                        </AnimatePresence>
                    </div>
                </FlowNode>
                 <Arrow label="2. Generate" isDashed />

                {/* Step 3: Store Hypothetical Questions */}
                <FlowNode icon={<Database className="w-8 h-8 text-primary" />} title="Vector Store of Hypothetical Questions">
                    <div className="space-y-1 mt-2 w-48">
                        {Object.entries(hypotheticalQuestions).map(([key, q], i) => (
                           <AnimatePresence key={key}>
                             {step >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.2, when: 'beforeChildren' } }}
                                    className={cn("p-2 border rounded-md text-xs", (step === 4 && key==='chunk-1') && "border-red-500 bg-red-500/10" )}
                                >
                                    {q}
                                </motion.div>
                             )}
                            </AnimatePresence>
                        ))}
                    </div>
                </FlowNode>

                {/* Step 6 & 7: LLM to Answer */}
                 <Arrow label="6. Augment" />
                <FlowNode icon={<BrainCircuit className="w-8 h-8 text-primary" />} title="LLM">
                    <AnimatePresence>
                        {step >= 7 && (
                           <motion.div
                             className="p-2 border rounded-md text-xs mt-2 w-48 space-y-2 bg-green-500/10 border-green-500"
                           >
                            <p className="font-bold">Answer:</p>
                            <p>RAG is better because it grounds the LLM in real-time, external facts, which significantly reduces the chance of making up incorrect information (hallucination).</p>
                           </motion.div>
                        )}
                    </AnimatePresence>
                </FlowNode>
                
                {/* Query Path */}
                <div className="col-start-1 col-span-1 mt-16">
                     <FlowNode icon={<HelpCircle className="w-8 h-8 text-primary" />} title="User Query">
                       {step >= 3 && <motion.div className="p-2 border rounded-md bg-muted text-xs mt-2 w-48">{userQuery}</motion.div>}
                    </FlowNode>
                </div>
                <div className="col-start-2 col-span-1 mt-16">
                     <Arrow label="3. Search" />
                </div>

                <div className="col-start-3 col-span-3 items-center flex justify-center mt-16 relative">
                    {step >= 5 &&
                        <motion.div
                         className="absolute flex items-center"
                         initial={{opacity: 0}}
                         animate={{opacity: 1}}
                        >
                            <Arrow label="4. Retrieve Chunk" />
                            <div className={cn("p-2 border rounded-md text-xs w-48 border-red-500 bg-red-500/10")}>{initialChunks['chunk-1']}</div>
                             <Arrow label="5. Pass to LLM" />
                        </motion.div>
                    }
                </div>
            </div>
        )
    }

    const getStepLabel = () => {
       const labels = [
           "Ready to start.",
           "1. Documents are broken into smaller, manageable chunks.",
           "2. An LLM generates a hypothetical question that each chunk could answer.",
           "3. The user's query is vectorized and used to search the hypothetical questions.",
           "4. The most semantically similar hypothetical question is found.",
           "5. The original document chunk associated with the winning question is retrieved.",
           "6. The chunk and the original query are passed to the LLM as context.",
           "7. The LLM generates a final, factually-grounded answer."
       ];
       return labels[step];
    }

    return (
        <Card className="bg-card/60 mt-4 border-primary/20">
            <svg width="0" height="0" className="absolute">
                <defs>
                    <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="0" refY="1.75" orient="auto">
                        <polygon points="0 0, 5 1.75, 0 3.5" fill="hsl(var(--border))" />
                    </marker>
                </defs>
            </svg>
            <CardContent className="p-4">
                 <div className="flex justify-between items-center mb-4">
                     <p className="text-sm text-muted-foreground flex-1 pr-4">{getStepLabel()}</p>
                     <div className="flex gap-2">
                        <Button onClick={handleReset} variant="outline" size="sm" disabled={!isRunning}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                        <Button onClick={handleNext} size="sm" disabled={step >= 7}>
                            {isRunning ? 'Next' : 'Start'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="relative p-6 border bg-muted/30 rounded-lg min-h-[400px] flex items-center justify-center overflow-hidden">
                   {renderStepContent()}
                </div>

            </CardContent>
        </Card>
    );
};
