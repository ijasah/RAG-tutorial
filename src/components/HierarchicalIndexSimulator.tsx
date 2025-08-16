// src/components/HierarchicalIndexSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, Search, RefreshCw, ArrowRight, MessageSquare, Sparkles, GitMerge, Library, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const userQuery = "What are the core ideas of RAG?";
const docSummary = "Summary of RAG Principles Document";
const docChunks = [
    { text: "Chunk 1: RAG combines retrieval..."},
    { text: "Chunk 2: It grounds LLMs in facts..."},
    { text: "Chunk 3: Vector DBs are crucial..."}
]
const topKChunks = [docChunks[0], docChunks[1]];
const finalAnswer = "The core ideas of RAG are combining retrieval with generation to ground LLMs in factual data, often using vector databases."

const FlowNode = ({ icon, title, children, status, step, currentStep, className }: { icon: React.ReactNode, title: string, children: React.ReactNode, status: 'inactive' | 'active' | 'complete', step: number, currentStep: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3, y: currentStep >= step ? 0 : 10 }}
        transition={{ duration: 0.4, delay: (step * 0.1) }}
        className={cn(
            "relative p-3 border rounded-lg transition-all duration-300 w-full text-left flex flex-col items-start justify-start h-full",
            status === 'active' ? 'border-primary bg-primary/10' : 'border-border bg-muted/40',
            className
        )}
    >
        <div className="flex items-center gap-2 mb-2">
             <div className={cn("flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold transition-all duration-300 shrink-0", status === 'inactive' ? 'bg-muted border' : 'bg-primary text-primary-foreground')}>
                {icon}
            </div>
            <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <div className="text-xs text-muted-foreground w-full pl-7">{children}</div>
    </motion.div>
);

const FlowArrow = ({ step, currentStep }: { step: number, currentStep: number }) => (
     <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.2, scale: currentStep >= step ? 1 : 0.5 }}
        transition={{ duration: 0.3, delay: (step * 0.1) + 0.1 }}
        className="flex justify-center items-center text-muted-foreground/60"
    >
       <ArrowRight className="w-5 h-5" />
    </motion.div>
);

export const HierarchicalIndexSimulator = () => {
    const [step, setStep] = useState(0);
    const maxSteps = 6;

    const handleNext = () => setStep(s => Math.min(maxSteps, s + 1));
    const handleReset = () => setStep(0);

    const getStatus = (s: number) => {
        if (step < s) return 'inactive';
        if (step === s) return 'active';
        return 'complete';
    };
    
    const getStepDescription = () => {
        const descriptions = [
            "Click 'Start' to begin the Hierarchical Index simulation.",
            "1. Documents are processed into summaries and chunks, which are then vectorized.",
            "2. The user's query is used to search the 'Index of summary vectors' first.",
            "3. This identifies the most relevant document summary.",
            "4. The system then searches for chunks only within that relevant document.",
            "5. The top K relevant chunks are passed to the LLM as context.",
            "6. The LLM generates a final, contextually-aware answer."
        ];
        return descriptions[step] || descriptions[descriptions.length - 1];
    }

    return (
        <Card className="bg-card/60 border-primary/20">
             <CardHeader>
                <CardTitle className="text-base">Method: Hierarchical Index</CardTitle>
                 <CardDescription className="pt-2 h-12 flex items-center justify-center text-center">
                    {getStepDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                 <div className="grid grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-center min-h-[300px]">
                    {/* Column 1: Query & Docs */}
                    <div className="flex flex-col justify-center h-full space-y-4">
                        <AnimatePresence>
                        {step >= 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.2} }}>
                                <FlowNode icon={<HelpCircle className="text-xs"/>} title="Query" status={getStatus(2)} step={2} currentStep={step}>
                                    <div className="p-2 border rounded bg-background text-xs">{userQuery}</div>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        <AnimatePresence>
                        {step >= 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.1} }}>
                                <FlowNode icon={<FileText className="text-xs"/>} title="Documents" status={getStatus(1)} step={1} currentStep={step}>
                                     <div className="p-2 border rounded bg-background text-xs">Original source documents are processed.</div>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Arrow 1 */}
                    <FlowArrow step={2} currentStep={step} />

                     {/* Column 2: Indexes */}
                    <div className="flex flex-col justify-around h-full space-y-4">
                        <AnimatePresence>
                        {step >= 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.2} }}>
                                <FlowNode 
                                    icon={<Library className="text-xs"/>} 
                                    title="Index of Summaries" 
                                    status={getStatus(3)} step={3} currentStep={step}
                                    className={step === 3 ? "border-primary bg-primary/10" : ""}
                                >
                                     <div className="space-y-1">
                                        <div className={cn("p-1.5 border rounded bg-background text-xs", step >=3 && "border-destructive")}>Doc A Summary</div>
                                        <div className={cn("p-1.5 border rounded bg-background text-xs")}>Doc B Summary</div>
                                     </div>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        <AnimatePresence>
                        {step >= 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.3} }}>
                                <FlowNode 
                                    icon={<Layers className="text-xs"/>} 
                                    title="Vector Store of Chunks" 
                                    status={getStatus(4)} step={4} currentStep={step}
                                     className={step === 4 ? "border-primary bg-primary/10" : ""}
                                >
                                     <div className="space-y-1">
                                        <div className={cn("p-1.5 border rounded bg-background text-xs", step >=4 && "border-destructive")}>Chunk 1: RAG combines...</div>
                                        <div className={cn("p-1.5 border rounded bg-background text-xs", step >=4 && "border-destructive")}>Chunk 2: It grounds...</div>
                                        <div className={cn("p-1.5 border rounded bg-background text-xs")}>Chunk 3: Vector DBs...</div>
                                        <div className={cn("p-1.5 border rounded bg-background text-xs")}>Chunk 4: Other doc...</div>
                                     </div>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Arrow 2 */}
                    <FlowArrow step={4} currentStep={step} />

                    {/* Column 3: Augment & Generate */}
                     <div className="flex flex-col justify-around h-full space-y-4">
                        <AnimatePresence>
                        {step >= 5 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.5} }}>
                                <FlowNode icon={<GitMerge className="text-xs"/>} title="Top K Chunks" status={getStatus(5)} step={5} currentStep={step}>
                                      <div className="p-2 border rounded bg-background text-xs">The 2 most relevant chunks are passed to the LLM.</div>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        <AnimatePresence>
                        {step >= 6 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.6} }}>
                                <FlowNode icon={<Sparkles className="text-xs"/>} title="Final Answer" status={getStatus(6)} step={6} currentStep={step}>
                                     <div className="p-2 border rounded bg-background text-xs">{finalAnswer}</div>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                </div>
                
                <div className="flex justify-center items-center mt-6 pt-4 border-t">
                    <Button onClick={handleReset} variant="outline" size="sm" disabled={step === 0}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button onClick={handleNext} size="sm" className="ml-4 w-28" disabled={step >= maxSteps}>
                        {step > 0 ? 'Next' : 'Start'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
