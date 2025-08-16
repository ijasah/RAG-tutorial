// src/components/HydeSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, Bot, Search, RefreshCw, ArrowRight, MessageSquare, Sparkles, GitMerge } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const FlowNode = ({ icon, title, children, status, step, currentStep }: { icon: React.ReactNode, title: string, children: React.ReactNode, status: 'inactive' | 'active' | 'complete', step: number, currentStep: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3, y: currentStep >= step ? 0 : 20 }}
        transition={{ duration: 0.4 }}
        className={cn(
            "relative p-4 border rounded-lg transition-all duration-300 w-full flex flex-col items-center justify-start h-full",
            status === 'active' ? 'border-primary bg-primary/10' : 'border-border bg-muted/40'
        )}
    >
        <div className="flex flex-col items-center gap-2 mb-2 text-center">
            <div className={cn("flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 shrink-0", status === 'inactive' ? 'bg-muted border' : 'bg-primary text-primary-foreground')}>
                {icon}
            </div>
            <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <div className="text-xs text-muted-foreground text-center w-full">{children}</div>
    </motion.div>
);

const FlowArrow = ({ currentStep, step }: { currentStep: number, step: number }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: currentStep >= step ? 1 : 0.3 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center items-center h-full"
    >
        <ArrowRight className="w-6 h-6 text-muted-foreground/50" />
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
            "2. An LLM generates a hypothetical 'fake' answer document.",
            "3. This hypothetical document is used to search the vector store.",
            "4. The most relevant document chunks are retrieved.",
            "5. The original query and the retrieved chunks are passed to the final LLM.",
            "6. The LLM generates a final, grounded answer.",
        ];
        return descriptions[step] || descriptions[descriptions.length - 1];
    }

    return (
        <Card className="bg-card/60 border-primary/20">
            <CardHeader>
                <CardTitle className="text-base">Method: HyDE (Hypothetical Document Embeddings)</CardTitle>
                <CardDescription className="pt-2 h-12 flex items-center justify-center text-center">
                     {getStepDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-stretch min-h-[360px]">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-4 justify-around">
                        <AnimatePresence>
                        {step >= 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.1} }}>
                                <FlowNode icon={<HelpCircle />} title="User Query" status={getStatus(1)} step={1} currentStep={step}>
                                    <p className="p-2 border rounded bg-background text-xs">"What are the benefits of RAG?"</p>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        <AnimatePresence>
                        {step >= 6 && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.6} }}>
                                <FlowNode icon={<Sparkles />} title="Final Answer" status={getStatus(6)} step={6} currentStep={step}>
                                    <p className="p-2 border rounded bg-background text-xs">The main benefits of RAG are improved accuracy...</p>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    {/* Arrow 1 */}
                    <FlowArrow currentStep={step} step={2}/>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-4 justify-around">
                        <AnimatePresence>
                        {step >= 2 && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.2} }}>
                                <FlowNode icon={<Bot />} title="Generate Fake Answer" status={getStatus(2)} step={2} currentStep={step}>
                                    <p className="p-2 border rounded bg-background text-xs">"RAG offers several benefits, including improved accuracy..."</p>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                         <AnimatePresence>
                        {step >= 5 && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.5} }}>
                                <FlowNode icon={<GitMerge />} title="Combine & Augment" status={getStatus(5)} step={5} currentStep={step}>
                                    <p className="p-2 border rounded bg-background text-xs">Original query + retrieved chunks are combined.</p>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Arrow 2 */}
                    <FlowArrow currentStep={step} step={3}/>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-4 justify-around">
                         <AnimatePresence>
                         {step >= 3 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.3} }}>
                                <FlowNode icon={<Search />} title="Doc-to-Doc Search" status={getStatus(3)} step={3} currentStep={step}>
                                    <p className="p-2 border rounded bg-background text-xs">Fake answer embedding is used to find similar real documents.</p>
                                </FlowNode>
                            </motion.div>
                         )}
                         </AnimatePresence>
                         <AnimatePresence>
                         {step >= 4 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: {delay: 0.4} }}>
                                <FlowNode icon={<FileText />} title="Retrieve Top K Chunks" status={getStatus(4)} step={4} currentStep={step}>
                                    <div className="space-y-1">
                                        <p className="p-1.5 border rounded bg-background text-xs flex items-center gap-1"><Badge variant="secondary">C1</Badge> RAG grounds LLMs...</p>
                                        <p className="p-1.5 border rounded bg-background text-xs flex items-center gap-1"><Badge variant="secondary">C2</Badge> RAG improves accuracy...</p>
                                    </div>
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
