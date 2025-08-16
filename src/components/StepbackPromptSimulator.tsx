// src/components/StepbackPromptSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, Bot, Search, RefreshCw, ArrowRight, ArrowDown, MessageSquare, Sparkles, GitMerge, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const originalQuery = "What is the RAGAS metric that evaluates if the generated answer is grounded in the retrieved context?";
const stepbackQuery = "What are the evaluation metrics in RAGAS?";
const retrievedContext = "RAGAS includes metrics like Faithfulness, which assesses if the answer is supported by the context, and Answer Relevancy, which checks if the answer is pertinent to the question.";
const stepbackAnswer = "RAGAS includes metrics like Faithfulness and Answer Relevancy.";
const finalAnswer = "The RAGAS metric that evaluates if the generated answer is grounded in the retrieved context is called Faithfulness.";

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
        <div className="flex items-center gap-2 mb-2 text-primary">
            {icon}
            <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <div className="text-xs text-muted-foreground w-full">{children}</div>
    </motion.div>
);

const Arrow = ({ step, currentStep, className }: { step: number, currentStep: number, className?: string }) => (
     <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.2, scale: currentStep >= step ? 1 : 0.5 }}
        transition={{ duration: 0.3, delay: (step * 0.1) + 0.1 }}
        className={cn("flex justify-center items-center text-muted-foreground/60", className)}
    >
       <ArrowRight className="w-6 h-6" />
    </motion.div>
);

export const StepbackPromptSimulator = () => {
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
            "Click 'Start' to begin the Step-back Prompting simulation.",
            "1. An LLM creates a more general 'step-back' question from the original query.",
            "2. The general step-back question is used to retrieve relevant context.",
            "3. The retrieved context is used by an LLM to answer the step-back question.",
            "4. The original query and the step-back answer are combined as context.",
            "5. The final LLM uses this combined context to generate a precise final answer."
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
                <div className="space-y-4 min-h-[300px]">
                    {/* Top Row: Abstraction & Retrieval */}
                    <AnimatePresence>
                    {step > 0 && (
                        <motion.div className="grid grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-stretch">
                            <FlowNode icon={<HelpCircle />} title="1. Original Query" status={getStatus(1)} step={1} currentStep={step} className={step > 1 ? 'opacity-50' : ''}>
                                <p className="p-2 bg-background rounded border">{originalQuery}</p>
                            </FlowNode>

                            <Arrow step={1} currentStep={step} />

                            <FlowNode icon={<BrainCircuit />} title="Step-back Question" status={getStatus(1)} step={1} currentStep={step}>
                                <p className="p-2 bg-background rounded border">{stepbackQuery}</p>
                            </FlowNode>
                            
                            <Arrow step={2} currentStep={step} />

                            <FlowNode icon={<Search />} title="2. Retrieved Context" status={getStatus(2)} step={2} currentStep={step}>
                                <p className="p-2 bg-background rounded border">{retrievedContext}</p>
                            </FlowNode>
                        </motion.div>
                    )}
                    </AnimatePresence>

                     {/* Arrow Down */}
                     <AnimatePresence>
                        {step >= 3 && (
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {delay: 0.3}}} className="flex justify-end pr-[calc(50%_-_1.25rem)]">
                                <ArrowDown className="w-6 h-6 text-muted-foreground/60"/>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Row: Synthesis */}
                     <AnimatePresence>
                     {step >= 3 && (
                         <motion.div className="grid grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-stretch">
                             <FlowNode icon={<Sparkles />} title="5. Final Answer" status={getStatus(5)} step={5} currentStep={step}>
                                <p className="p-2 bg-background rounded border">{finalAnswer}</p>
                            </FlowNode>
                            
                            <Arrow step={4} currentStep={step} />

                            <FlowNode icon={<GitMerge />} title="4. Final Context" status={getStatus(4)} step={4} currentStep={step}>
                                <p className="font-semibold text-foreground">Original Query:</p>
                                <p className="p-2 bg-background rounded border mb-2">{originalQuery}</p>
                                <p className="font-semibold text-foreground">Step-back Answer:</p>
                                <p className="p-2 bg-background rounded border">{stepbackAnswer}</p>
                            </FlowNode>

                            <Arrow step={3} currentStep={step} />

                            <FlowNode icon={<MessageSquare />} title="3. Step-back Answer" status={getStatus(3)} step={3} currentStep={step}>
                                <p className="p-2 bg-background rounded border">{stepbackAnswer}</p>
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
