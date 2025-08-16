// src/components/SubQuerySimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, Search, RefreshCw, ArrowRight, MessageSquare, Database, GitMerge, BrainCircuit, ArrowDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const FlowNode = ({ icon, title, children, status, step, currentStep }: { icon: React.ReactNode, title: string, children: React.ReactNode, status: 'inactive' | 'active' | 'complete', step: number, currentStep: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3, y: currentStep >= step ? 0 : 10 }}
        transition={{ duration: 0.4 }}
        className={cn(
            "relative p-3 border rounded-lg transition-all duration-300 w-full text-center flex flex-col items-center justify-center min-h-[120px]",
            status === 'active' ? 'border-primary bg-primary/10' : 'border-border bg-muted/40'
        )}
    >
        <div className="flex items-center gap-2 mb-2">
            <span className={cn("flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold transition-all duration-300 shrink-0", status === 'inactive' ? 'bg-muted border' : 'bg-primary text-primary-foreground')}>
                {step}
            </span>
            <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <div className="text-xs text-muted-foreground">{children}</div>
    </motion.div>
);

const FlowArrow = ({ step, currentStep, vertical = false, className }: { step: number, currentStep: number, vertical?: boolean, className?: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3 }}
        className={cn("flex justify-center items-center h-full", className)}
    >
        {vertical ? <ArrowDown className="w-5 h-5 text-muted-foreground/50" /> : <ArrowRight className="w-5 h-5 text-muted-foreground/50" />}
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
            "3. Each sub-query is executed in parallel to retrieve relevant documents.",
            "4. The retrieved documents from all sub-queries are gathered together.",
            "5. The original query and all retrieved documents are sent to synthesize a final, comprehensive answer.",
        ];
        return descriptions[step] || descriptions[descriptions.length - 1];
    }

    return (
        <Card className="bg-card/60 border-primary/20">
            <CardHeader>
                <CardTitle className="text-base">Method: Sub-Query Generation</CardTitle>
                <CardDescription className="pt-2 h-12 flex items-center justify-center text-center">
                    {getStepDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                <div className="space-y-4">
                    {/* Step 1: Initial Query */}
                    <AnimatePresence>
                        {step >= 1 && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                <FlowNode icon={<HelpCircle />} title="User Query" status={getStatus(1)} step={1} currentStep={step}>
                                    <p className="p-2 bg-background rounded border">{originalQuery}</p>
                                </FlowNode>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step 2: Decomposition */}
                    <AnimatePresence>
                        {step >= 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                                <FlowArrow step={2} currentStep={step} vertical />
                                <div className="flex items-center gap-2 text-sm font-semibold my-2 text-primary">
                                    <BrainCircuit /> LLM Decomposes Query
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step 3 & 4: Sub-queries and Retrieval */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {step >= 2 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <FlowNode icon={<HelpCircle />} title="Sub Query 1" status={getStatus(2)} step={2} currentStep={step}>
                                        <p className="p-2 bg-background rounded border">{subQueries[0]}</p>
                                    </FlowNode>
                                     {step >= 3 && <FlowArrow step={3} currentStep={step} vertical />}
                                     {step >= 3 && (
                                        <FlowNode icon={<FileText />} title="Retrieved Docs (Milvus)" status={getStatus(3)} step={3} currentStep={step}>
                                            <p className="p-2 bg-background rounded border">{retrieved.q1}</p>
                                        </FlowNode>
                                     )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {step >= 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <FlowNode icon={<HelpCircle />} title="Sub Query 2" status={getStatus(2)} step={2} currentStep={step}>
                                        <p className="p-2 bg-background rounded border">{subQueries[1]}</p>
                                    </FlowNode>
                                    {step >= 3 && <FlowArrow step={3} currentStep={step} vertical />}
                                     {step >= 3 && (
                                        <FlowNode icon={<FileText />} title="Retrieved Docs (Zilliz)" status={getStatus(3)} step={3} currentStep={step}>
                                            <p className="p-2 bg-background rounded border">{retrieved.q2}</p>
                                        </FlowNode>
                                     )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Step 5: Synthesis */}
                    <AnimatePresence>
                        {step >= 4 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                                <FlowArrow step={4} currentStep={step} vertical />
                                <div className="flex items-center gap-2 text-sm font-semibold my-2 text-primary">
                                    <GitMerge /> LLM Synthesizes Answer
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                         {step >= 5 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <FlowNode icon={<MessageSquare />} title="Final Answer" status={getStatus(5)} step={4} currentStep={step}>
                                    <p className="p-2 bg-background rounded border">{finalAnswer}</p>
                                </FlowNode>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
