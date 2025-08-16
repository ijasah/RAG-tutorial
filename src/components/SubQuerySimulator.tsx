// src/components/SubQuerySimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, Search, RefreshCw, ArrowRight, MessageSquare, Database, GitMerge, BrainCircuit } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const FlowNode = ({ icon, title, children, status, step, currentStep, annotation, annotationPosition = 'top' }: { icon: React.ReactNode, title: string, children: React.ReactNode, status: 'inactive' | 'active' | 'complete', step: number, currentStep: number, annotation?: string, annotationPosition?: 'top' | 'bottom' }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3, scale: currentStep >= step ? 1 : 0.9 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center text-center"
    >
        <div className={cn("p-3 rounded-lg border-2 transition-all w-full flex flex-col items-center min-h-[140px] justify-center", status === 'active' ? 'border-primary bg-primary/10' : 'border-border bg-muted/40')}>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold">{icon}{title}</div>
            <div className="text-xs text-muted-foreground space-y-2">{children}</div>
        </div>
    </motion.div>
);

const FlowArrow = ({ step, currentStep, vertical = false }: { step: number, currentStep: number, vertical?: boolean }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3 }}
        className="relative flex justify-center items-center h-full"
    >
        <ArrowRight className={cn("w-6 h-6 text-muted-foreground/50", vertical && 'rotate-90')} />
    </motion.div>
);

const originalQuery = "What are the differences in features between Milvus and Zilliz Cloud?";
const subQueries = ["What are the features of Milvus?", "What are the features of Zilliz Cloud?"];
const retrieved = {
    q1: "Milvus is open-source, supports multiple index types, and can be self-hosted.",
    q2: "Zilliz Cloud is a fully-managed service with enterprise-grade security and scalability.",
};
const finalAnswer = "Milvus is an open-source, self-hostable vector database, while Zilliz Cloud is a fully-managed, enterprise-focused service with enhanced security and scalability."

export const SubQuerySimulator = () => {
    const [step, setStep] = useState(0);
    const maxSteps = 4;

    const handleNext = () => setStep(s => Math.min(maxSteps, s + 1));
    const handleReset = () => setStep(0);

    const getStatus = (s: number) => {
        if (step < s) return 'inactive';
        if (step === s) return 'active';
        return 'complete';
    };
    
     const getStepDescription = () => {
        const descriptions = [
            "Click 'Start' to see how Sub-Query Generation works.",
            "1. A complex user query is sent to an LLM for decomposition.",
            "2. The LLM breaks the query into simpler, standalone sub-queries which are executed in parallel.",
            "3. The retrieved chunks from all sub-queries are gathered together.",
            "4. The original query and all retrieved chunks are passed to the final LLM to synthesize a comprehensive answer.",
        ];
        return descriptions[step] || descriptions[descriptions.length-1];
    }

    return (
        <Card className="bg-card/60 border-primary/20">
            <CardHeader>
                <CardTitle className="text-base">Method: Sub-Query Generation</CardTitle>
                <CardDescription className="pt-2 h-12">
                    {getStepDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-[1fr,auto,1fr] grid-rows-[1fr,auto,1fr] gap-x-4 gap-y-2 items-center">
                    {/* Top Row */}
                    <div />
                     <AnimatePresence>
                       {step >= 1 && (
                         <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                           <FlowNode icon={<HelpCircle />} title="User Query" status={getStatus(1)} step={1} currentStep={step}>
                                <p className="p-2 bg-background rounded border">{originalQuery}</p>
                            </FlowNode>
                         </motion.div>
                       )}
                    </AnimatePresence>
                    <div />

                    {/* Arrow Down */}
                    <div />
                    <AnimatePresence>
                        {step >= 2 && <motion.div initial={{opacity:0}} animate={{opacity:1}}><FlowArrow step={2} currentStep={step} vertical={true} /></motion.div>}
                    </AnimatePresence>
                    <div />

                    {/* Middle Row */}
                     <AnimatePresence>
                       {step >= 2 && (
                         <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                            <FlowNode icon={<HelpCircle />} title="Sub Query 1" status={getStatus(2)} step={2} currentStep={step}>
                                 <p className="p-2 bg-background rounded border">{subQueries[0]}</p>
                                 {step >= 3 && <p className="p-2 mt-2 bg-primary/10 border-primary/20 border rounded">{retrieved.q1}</p>}
                            </FlowNode>
                         </motion.div>
                       )}
                    </AnimatePresence>

                    <div className="flex flex-col items-center justify-center">
                        <AnimatePresence>
                            {step >= 2 && <motion.div initial={{opacity:0}} animate={{opacity:1}}><BrainCircuit className="w-8 h-8 text-primary" /></motion.div>}
                        </AnimatePresence>
                    </div>

                     <AnimatePresence>
                       {step >= 2 && (
                         <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                            <FlowNode icon={<HelpCircle />} title="Sub Query 2" status={getStatus(2)} step={2} currentStep={step}>
                                <p className="p-2 bg-background rounded border">{subQueries[1]}</p>
                                {step >= 3 && <p className="p-2 mt-2 bg-primary/10 border-primary/20 border rounded">{retrieved.q2}</p>}
                            </FlowNode>
                         </motion.div>
                       )}
                    </AnimatePresence>

                </div>

                 {/* Final Answer */}
                 <AnimatePresence>
                    {step >= 4 && (
                        <motion.div initial={{opacity: 0, y:10}} animate={{opacity:1, y:0}} className="mt-4">
                             <FlowNode icon={<MessageSquare />} title="Final Synthesized Answer" status={getStatus(4)} step={4} currentStep={step}>
                                 <p className="p-2 bg-background rounded border">{finalAnswer}</p>
                             </FlowNode>
                        </motion.div>
                    )}
                 </AnimatePresence>

                <div className="flex justify-center items-center mt-6 pt-4 border-t">
                    <Button onClick={handleReset} variant="outline" size="sm" disabled={step === 0}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button onClick={handleNext} size="sm" className="ml-2 w-28" disabled={step >= maxSteps}>
                        {step > 0 ? 'Next' : 'Start'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
