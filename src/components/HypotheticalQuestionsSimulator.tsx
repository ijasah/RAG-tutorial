// src/components/HypotheticalQuestionsSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrainCircuit, HelpCircle, FileText, Database, Search, RefreshCw, ArrowRight, GitMerge, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

const initialChunks = {
    "chunk-1": "RAG enhances LLMs by grounding them in external knowledge, reducing hallucinations.",
    "chunk-2": "A key RAG component is the vector database, used for efficient similarity search.",
};

const hypotheticalQuestions = {
    "chunk-1": "How does RAG improve LLM factuality?",
    "chunk-2": "What role do vector databases play in RAG?",
};

const userQuery = "Why is RAG better than just using an LLM?";
const finalAnswer = "RAG is better than a standalone LLM because it grounds the model in external knowledge, which reduces hallucinations and improves factuality. This is achieved by retrieving relevant information before generating an answer."

const FlowNode = ({ title, icon, children, highlighted, step, currentStep }: { title: string, icon: React.ReactNode, children: React.ReactNode, highlighted?: boolean, step: number, currentStep: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <Card className={cn("transition-all h-full", highlighted ? "border-primary bg-primary/10" : "")}>
            <CardHeader className="p-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                    {icon}
                    <span className="font-semibold">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <div className="text-xs text-muted-foreground space-y-1.5">
                    {children}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const Arrow = ({ step, currentStep }: { step: number, currentStep: number }) => (
     <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center items-center my-auto"
    >
       <ArrowRight className="w-6 h-6 text-muted-foreground/50" />
    </motion.div>
);

export const HypotheticalQuestionsSimulator = () => {
    const [step, setStep] = useState(0);
    const maxSteps = 7;

    const handleNext = () => setStep(s => Math.min(s + 1, maxSteps));
    const handleReset = () => setStep(0);

    const getStepDescription = () => {
        const descriptions = [
            "Click 'Start' to walk through the Hypothetical Questions method.",
            "1. First, documents are split into smaller, manageable chunks.",
            "2. An LLM generates a hypothetical question that each specific chunk could answer.",
            "3. The generated questions are indexed, with a link back to their original document chunk.",
            "4. A new user query arrives. This query may be phrased differently than the document text.",
            "5. The user's query is used to perform a similarity search against the *hypothetical questions*.",
            "6. The original chunk linked to the most similar question is retrieved.",
            "7. The LLM uses the original query and the retrieved chunk to synthesize a final, grounded answer."
        ];
        return descriptions[step];
    }

    return (
        <Card className="bg-card/60 border-primary/20">
            <CardHeader>
                <CardTitle className="text-base">Method: Hypothetical Questions</CardTitle>
                 <CardDescription className="pt-2 h-12 flex items-center justify-center text-center">
                    {getStepDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                    {/* Top Row: Indexing Path */}
                    <div className="grid grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-stretch">
                        <FlowNode title="Document Chunks" icon={<FileText className="w-5 h-5 text-primary"/>} step={1} currentStep={step}>
                            <p className="p-2 border rounded bg-background">{initialChunks['chunk-1']}</p>
                            <p className="p-2 border rounded bg-background">{initialChunks['chunk-2']}</p>
                        </FlowNode>
                        
                        <Arrow step={2} currentStep={step} />
                        
                        <FlowNode title="Generate Questions" icon={<BrainCircuit className="w-5 h-5 text-primary"/>} step={2} currentStep={step}>
                            <p className="p-2 border rounded bg-background">{hypotheticalQuestions['chunk-1']}</p>
                            <p className="p-2 border rounded bg-background">{hypotheticalQuestions['chunk-2']}</p>
                        </FlowNode>
                        
                        <Arrow step={3} currentStep={step} />

                        <FlowNode title="Indexed Store" icon={<Database className="w-5 h-5 text-primary"/>} step={3} currentStep={step} highlighted={step === 5}>
                             <div>
                                <Badge variant={step >= 5 ? "default" : "secondary"}>Similarity: {step >= 5 ? 0.91 : 'N/A'}</Badge>
                                <p className="p-1 mt-1 border rounded bg-background">{hypotheticalQuestions['chunk-1']}</p>
                            </div>
                             <div>
                                <Badge variant="secondary">Similarity: {step >= 5 ? 0.62 : 'N/A'}</Badge>
                                <p className="p-1 mt-1 border rounded bg-background">{hypotheticalQuestions['chunk-2']}</p>
                            </div>
                        </FlowNode>
                    </div>

                    {/* Bottom Row: Retrieval Path */}
                     <AnimatePresence>
                    {step >= 4 && (
                        <motion.div 
                            initial={{opacity: 0, y: 10}} 
                            animate={{opacity: 1, y: 0}}
                            className="grid grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-stretch mt-4"
                        >
                            <FlowNode title="User Query" icon={<HelpCircle className="w-5 h-5 text-primary"/>} step={4} currentStep={step}>
                                <p className="p-2 border rounded bg-background">{userQuery}</p>
                            </FlowNode>
                            
                            <Arrow step={5} currentStep={step} />

                            <FlowNode title="Similarity Search" icon={<Search className="w-5 h-5 text-primary"/>} step={5} currentStep={step}>
                                <p>Search against the indexed questions to find the most semantically similar one.</p>
                            </FlowNode>
                            
                            <Arrow step={6} currentStep={step} />

                            <FlowNode title="Retrieved Chunk" icon={<GitMerge className="w-5 h-5 text-primary"/>} step={6} currentStep={step}>
                                <p className="p-2 border rounded bg-background">{initialChunks['chunk-1']}</p>
                            </FlowNode>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {/* Final Answer */}
                    <AnimatePresence>
                    {step >= 7 && (
                        <motion.div
                           initial={{opacity: 0, y: 10}} 
                           animate={{opacity: 1, y: 0}}
                           className="mt-4"
                        >
                            <FlowNode title="Final Synthesized Answer" icon={<Sparkles className="w-5 h-5 text-primary"/>} step={7} currentStep={step}>
                                <p className="p-2 border rounded bg-background">{finalAnswer}</p>
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
