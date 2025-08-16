// src/components/SentenceWindowSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, RefreshCw, ArrowRight, MessageSquare, Sparkles, Database, GitMerge, Search, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const userQuery = "Who developed Milvus?";
const documentChunks = [
    {id: 's1', text: 'Milvus is an open-source similarity search engine.'},
    {id: 's2', text: 'It is developed by Zilliz, a leading AI vector database company.'},
    {id: 's3', text: 'Milvus enables users to store, manage, and search large-scale vector data.'},
];
const relevantChunkId = 's2';
const finalAnswer = "Based on the provided context, Milvus was developed by Zilliz, a leading AI vector database company."

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
        <div className="text-xs text-muted-foreground w-full pl-7 space-y-1.5">{children}</div>
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

const DocumentChunk = ({ text, isHighlighted }: { text: string; isHighlighted: boolean; }) => (
     <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
            "p-2 border rounded bg-background transition-all",
            isHighlighted ? "border-primary border-2 shadow-md" : "border-border"
        )}
    >
        {text}
    </motion.div>
)

export const SentenceWindowSimulator = () => {
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
            "Click 'Start' to begin the Sentence Window Retrieval simulation.",
            "1. Documents are split into small chunks (sentences) and stored in a vector DB.",
            "2. The user's query is used to perform a similarity search on the small chunks.",
            "3. The single most relevant sentence is retrieved from the vector store.",
            "4. A 'window' is expanded around the retrieved sentence to include its neighbors for better context.",
            "5. This wider window of context is passed to the LLM.",
            "6. The LLM generates the final answer using the richer context."
        ];
        return descriptions[step] || descriptions[descriptions.length - 1];
    }

    return (
        <Card className="bg-card/60 border-primary/20">
             <CardHeader>
                 <CardDescription className="pt-2 h-12 flex items-center justify-center text-center">
                    {getStepDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                 <div className="grid grid-cols-[1fr,auto,1.5fr,auto,1.5fr] gap-4 items-stretch min-h-[300px]">
                    {/* Column 1: Query */}
                    <AnimatePresence>
                    {step >= 2 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex items-center">
                            <FlowNode icon={<HelpCircle />} title="2. User Query" status={getStatus(2)} step={2} currentStep={step}>
                                <div className="p-2 border rounded bg-background text-xs">{userQuery}</div>
                            </FlowNode>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <AnimatePresence>{step >= 3 && <FlowArrow step={3} currentStep={step} />}</AnimatePresence>


                    {/* Column 2: Vector Store */}
                   <AnimatePresence>
                    {step >= 3 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex items-center">
                            <FlowNode icon={<Database />} title="3. Vector Store" status={getStatus(3)} step={3} currentStep={step}>
                                <div className="space-y-1.5">
                                    {documentChunks.map((chunk) => (
                                        <DocumentChunk key={chunk.id} text={chunk.text} isHighlighted={step >= 3 && chunk.id === relevantChunkId} />
                                    ))}
                                </div>
                            </FlowNode>
                        </motion.div>
                    )}
                    </AnimatePresence>


                    <AnimatePresence>{step >= 4 && <FlowArrow step={4} currentStep={step} />}</AnimatePresence>

                    {/* Column 3: Wider Window & LLM */}
                     <div className="flex flex-col gap-4 justify-center">
                        <AnimatePresence>
                        {step >= 4 && (
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                                <FlowNode icon={<GitMerge />} title="4. Wider Window of Context" status={getStatus(4)} step={4} currentStep={step}>
                                    <div className="p-2 bg-primary/10 border border-primary/20 rounded-md space-y-1.5">
                                        {documentChunks.map((chunk, i) => (
                                             <motion.div
                                                key={chunk.id}
                                                initial={{opacity: 0}} animate={{opacity: 1, transition:{delay: i * 0.1}}}
                                                className={cn(
                                                    "p-2 border rounded bg-background",
                                                    chunk.id === relevantChunkId && "border-primary border-2 shadow-lg"
                                                )}
                                            >
                                                {chunk.text}
                                            </motion.div>
                                        ))}
                                    </div>
                                </FlowNode>
                            </motion.div>
                         )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {step >= 5 && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex justify-center"><ArrowRight className="w-5 h-5 text-muted-foreground/50 rotate-90"/></motion.div>}
                        </AnimatePresence>
                        <AnimatePresence>
                        {step >= 5 && (
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                                <FlowNode icon={<Sparkles />} title="5. LLM & Answer" status={getStatus(5)} step={5} currentStep={step}>
                                     <p>The LLM receives the expanded context to generate a more informed response.</p>
                                     {step >= 6 && <p className="mt-2 p-2 border rounded bg-background text-xs text-foreground">{finalAnswer}</p>}
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
