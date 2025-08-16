// src/components/SubQuerySimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, Search, RefreshCw, ArrowRight, MessageSquare, Database, GitMerge, BrainCircuit } from 'lucide-react';
import { Badge } from './ui/badge';

const FlowNode = ({ icon, title, children, status, step, currentStep, annotation, annotationPosition = 'top' }: { icon: React.ReactNode, title: string, children: React.ReactNode, status: 'inactive' | 'active' | 'complete', step: number, currentStep: number, annotation?: string, annotationPosition?: 'top' | 'bottom' }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3, scale: currentStep >= step ? 1 : 0.9 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center text-center"
    >
        {annotation && <Badge variant="secondary" className={`absolute -translate-y-full ${annotationPosition === 'top' ? '-top-2' : 'bottom-full -mb-2'}`}>{annotation}</Badge>}
        <div className={`p-3 rounded-lg border-2 transition-all w-full flex flex-col items-center min-h-[80px] justify-center ${status === 'active' ? 'border-primary bg-primary/10' : 'border-border bg-muted/40'}`}>
            <div className="flex items-center gap-2 mb-1 text-sm font-semibold">{icon}{title}</div>
            <div className="text-xs text-muted-foreground">{children}</div>
        </div>
    </motion.div>
);

const FlowArrow = ({ step, currentStep, label }: { step: number, currentStep: number, label?: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3 }}
        className="relative flex justify-center items-center h-full"
    >
        <ArrowRight className="w-6 h-6 text-muted-foreground/50" />
        {label && <Badge variant="outline" className="absolute top-1/2 -translate-y-[150%]">{label}</Badge>}
    </motion.div>
);

const originalQuery = "What are the differences in features between Milvus and Zilliz Cloud?";
const subQueries = ["What are the features of Milvus?", "What are the features of Zilliz Cloud?"];
const retrieved = {
    q1: ["Milvus is open-source, supports multiple index types.", "It can be self-hosted on Kubernetes."],
    q2: ["Zilliz Cloud is a fully-managed vector database service.", "It provides enterprise-grade security and scalability."],
};
const finalAnswer = "Milvus is an open-source, self-hostable vector database, while Zilliz Cloud is a fully-managed, enterprise-focused service with enhanced security and scalability."

export const SubQuerySimulator = () => {
    const [step, setStep] = useState(0);
    const maxSteps = 5;

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
            "2. The LLM breaks the query into simpler, standalone sub-queries.",
            "3. Each sub-query is executed independently against the vector store to retrieve relevant document chunks.",
            "4. The retrieved chunks from all sub-queries are gathered together.",
            "5. The original query and all retrieved chunks are passed to the final LLM to synthesize a comprehensive answer.",
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
                <div className="grid grid-cols-[1fr,auto,1fr,auto,1fr] items-center gap-x-4">
                    {/* Column 1: Initial Query & LLM */}
                    <div className="space-y-4">
                         <FlowNode icon={<HelpCircle />} title="User Query" status={getStatus(1)} step={1} currentStep={step}>
                            <p className="p-2 bg-background rounded border">{originalQuery}</p>
                        </FlowNode>
                        <FlowNode icon={<BrainCircuit />} title="Decomposition LLM" status={getStatus(2)} step={2} currentStep={step}>
                            <p>Breaks down the query</p>
                        </FlowNode>
                    </div>

                    <FlowArrow step={2} currentStep={step} label="②" />

                    {/* Column 2: Sub-Queries & Vector Store */}
                    <div className="space-y-2">
                        <FlowNode icon={<HelpCircle />} title="Sub Query 1" status={getStatus(2)} step={2} currentStep={step}>
                             <p className="p-2 bg-background rounded border">{subQueries[0]}</p>
                        </FlowNode>
                         <FlowNode icon={<HelpCircle />} title="Sub Query 2" status={getStatus(2)} step={2} currentStep={step}>
                             <p className="p-2 bg-background rounded border">{subQueries[1]}</p>
                        </FlowNode>
                    </div>

                    <FlowArrow step={3} currentStep={step} label="③" />

                    {/* Column 3: Retrieval & Synthesis */}
                    <div className="space-y-2">
                         <FlowNode icon={<Database />} title="Vector Store" status={getStatus(3)} step={3} currentStep={step}>
                            <p>Retrieved Chunks for Q1</p>
                            <AnimatePresence>
                            {step >= 3 && retrieved.q1.map(chunk => (
                               <motion.p key={chunk} initial={{opacity:0}} animate={{opacity:1}} className="p-1.5 mt-1 bg-background rounded border">{chunk}</motion.p>
                            ))}
                            </AnimatePresence>
                        </FlowNode>
                         <FlowNode icon={<Database />} title="Vector Store" status={getStatus(3)} step={3} currentStep={step}>
                            <p>Retrieved Chunks for Q2</p>
                            <AnimatePresence>
                             {step >= 3 && retrieved.q2.map(chunk => (
                               <motion.p key={chunk} initial={{opacity:0}} animate={{opacity:1}} className="p-1.5 mt-1 bg-background rounded border">{chunk}</motion.p>
                            ))}
                            </AnimatePresence>
                        </FlowNode>
                    </div>
                </div>
                
                 {/* Bottom Row: Synthesis LLM and Final Answer */}
                <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-x-4 mt-4">
                     <FlowNode icon={<GitMerge />} title="Combine Chunks" status={getStatus(4)} step={4} currentStep={step} annotation="④ Gather" annotationPosition="bottom">
                        <p>All retrieved context is collected.</p>
                    </FlowNode>
                    <FlowArrow step={5} currentStep={step} label="⑤" />
                    <FlowNode icon={<MessageSquare />} title="Synthesis LLM" status={getStatus(5)} step={5} currentStep={step} annotation="⑥ Synthesize" annotationPosition="bottom">
                         <AnimatePresence>
                           {step >= 5 && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="p-2 bg-background rounded border">{finalAnswer}</motion.p>}
                        </AnimatePresence>
                    </FlowNode>
                </div>


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
