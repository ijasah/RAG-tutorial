// src/components/HydeSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from './ui/card';
import { HelpCircle, FileText, Bot, Search, RefreshCw, ArrowRight, CornerDownLeft, Sparkles, MessageSquare } from 'lucide-react';
import { Badge } from './ui/badge';

const FlowNode = ({ icon, title, children, status, step, currentStep }: { icon: React.ReactNode, title: string, children: React.ReactNode, status: 'inactive' | 'active' | 'complete', step: number, currentStep: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: currentStep >= step ? 1 : 0, y: currentStep >= step ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.1 * step }}
        className={`relative p-3 border rounded-lg transition-all duration-300 ${status === 'active' ? 'border-primary bg-primary/10' : 'border-border bg-muted/30'}`}
    >
        <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 ${status === 'inactive' ? 'bg-muted border' : 'bg-primary text-primary-foreground'}`}>
                {step}
            </span>
            <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <div className="text-xs text-muted-foreground pl-8">{children}</div>
    </motion.div>
);

const FlowArrow = ({ step, currentStep }: { step: number, currentStep: number }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStep >= step ? 1 : 0 }}
        className="flex justify-center items-center my-2"
    >
        <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
    </motion.div>
);

export const HydeSimulator = () => {
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
            "Click 'Start' to begin the HyDE process.",
            "1. The process starts with a user's query.",
            "2. An LLM generates a hypothetical 'fake' answer document that is likely to contain the answer to the query.",
            "3. This hypothetical document is used to search the vector store for real documents with similar meanings (doc-to-doc search).",
            "4. The most relevant document chunks are retrieved from the vector store based on similarity.",
            "5. The original query and the retrieved chunks are passed to the final LLM.",
            "6. The LLM generates a final, grounded answer based on the provided context.",
        ];
        return descriptions[step] || descriptions[descriptions.length - 1];
    }

    return (
        <Card className="bg-card/60 mt-4 border-primary/20">
            <CardContent className="p-4 space-y-4">
                <div className="text-center p-2 rounded-lg bg-muted/50 h-12 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
                </div>

                <div className="space-y-2">
                    <FlowNode icon={<HelpCircle />} title="User Query" status={getStatus(1)} step={1} currentStep={step}>
                        <p className="p-2 border rounded bg-background">"What are the benefits of RAG?"</p>
                    </FlowNode>

                    <FlowArrow step={2} currentStep={step} />

                    <FlowNode icon={<Bot />} title="Generate Fake Answer" status={getStatus(2)} step={2} currentStep={step}>
                        <p className="p-2 border rounded bg-background">"RAG offers several benefits, including improved accuracy by grounding responses in factual data, and reducing hallucinations..."</p>
                    </FlowNode>

                    <FlowArrow step={3} currentStep={step} />
                    
                    <FlowNode icon={<Search />} title="Doc-to-Doc Search" status={getStatus(3)} step={3} currentStep={step}>
                        <p className="p-2 border rounded bg-background">The fake answer's embedding is used to find similar real documents.</p>
                    </FlowNode>

                    <FlowArrow step={4} currentStep={step} />

                    <FlowNode icon={<FileText />} title="Retrieve Top K Chunks" status={getStatus(4)} step={4} currentStep={step}>
                        <div className="space-y-1">
                             <p className="p-2 border rounded bg-background"><Badge>Chunk 1</Badge> RAG grounds LLMs in external knowledge, which reduces factual inaccuracies (hallucinations).</p>
                             <p className="p-2 border rounded bg-background"><Badge>Chunk 2</Badge> By providing up-to-date context, RAG improves the accuracy and relevance of generated answers.</p>
                        </div>
                    </FlowNode>

                    <FlowArrow step={5} currentStep={step} />

                    <FlowNode icon={<MessageSquare />} title="Pass to LLM" status={getStatus(5)} step={5} currentStep={step}>
                        <p className="p-2 border rounded bg-background">The original query + retrieved chunks are combined into a final prompt.</p>
                    </FlowNode>
                    
                     <FlowArrow step={6} currentStep={step} />

                    <FlowNode icon={<Sparkles />} title="Final Answer" status={getStatus(6)} step={6} currentStep={step}>
                        <p className="p-2 border rounded bg-background">The main benefits of RAG are improved accuracy and a reduction in hallucinations because it grounds the language model in factual, retrieved data.</p>
                    </FlowNode>
                </div>

                <div className="flex justify-center items-center mt-4 pt-4 border-t">
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
