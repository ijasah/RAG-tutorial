// src/components/HypotheticalQuestionsSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrainCircuit, HelpCircle, FileText, Database, Search, ChevronRight, RefreshCw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const initialChunks = {
    "chunk-1": "RAG enhances LLMs by grounding them in external knowledge, reducing hallucinations.",
    "chunk-2": "A key RAG component is the vector database, used for efficient similarity search.",
};

const hypotheticalQuestions = {
    "chunk-1": "How does RAG improve LLM factuality?",
    "chunk-2": "What role do vector databases play in RAG?",
};

const userQuery = "Why is RAG better than just using an LLM?";

const FlowCard = ({ title, icon, children, highlighted }: { title: string, icon: React.ReactNode, children: React.ReactNode, highlighted?: boolean }) => (
    <Card className={cn("transition-all", highlighted ? "border-primary bg-primary/10" : "")}>
        <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
                {icon}
                <h4 className="font-semibold text-sm">{title}</h4>
            </div>
            <div className="text-xs text-muted-foreground space-y-2">
                {children}
            </div>
        </CardContent>
    </Card>
);

const Arrow = () => (
    <div className="flex justify-center items-center my-2 md:rotate-90 md:my-0 md:mx-auto">
        <ChevronRight className="w-6 h-6 text-muted-foreground/50" />
    </div>
);

export const HypotheticalQuestionsSimulator = () => {
    const [phase, setPhase] = useState<'indexing' | 'retrieval'>('indexing');
    const [step, setStep] = useState(0);

    const handleNext = () => setStep(s => s + 1);
    const handleReset = () => setStep(0);

    const isIndexing = phase === 'indexing';
    const isRetrieval = phase === 'retrieval';
    const isRunning = step > 0;
    const maxIndexingSteps = 3;
    const maxRetrievalSteps = 4;

    const getIndexingDescription = () => {
        const descriptions = [
            "Click 'Start' to begin the indexing phase, where we prepare our data.",
            "1. First, original documents are split into smaller, manageable chunks.",
            "2. An LLM generates a hypothetical question that each specific chunk could answer.",
            "3. The generated questions and links to their original chunks are stored and indexed.",
        ];
        return descriptions[step] || descriptions[descriptions.length -1];
    }
    
    const getRetrievalDescription = () => {
        const descriptions = [
            "Now, let's see how a new user query is handled using our special index.",
            "1. A user asks a new question. This query may be phrased differently than our documents.",
            "2. The user's query is used to search for the most similar *hypothetical question* in our store.",
            "3. The hypothetical question with the highest similarity score is found (in this case, for 'chunk-1').",
            "4. The system retrieves the original chunk linked to that winning question to answer the user's query."
        ];
        return descriptions[step] || descriptions[descriptions.length -1];
    }
    
    const resetAndSwitch = (newPhase: 'indexing' | 'retrieval') => {
        setPhase(newPhase);
        setStep(0);
    }

    return (
        <Card className="bg-card/60 mt-4 border-primary/20">
            <CardContent className="p-4">
                <Tabs value={phase} onValueChange={(v) => resetAndSwitch(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="indexing">Phase 1: Indexing</TabsTrigger>
                        <TabsTrigger value="retrieval">Phase 2: Retrieval</TabsTrigger>
                    </TabsList>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={phase}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="mt-4"
                        >
                            <div className="p-2 text-center">
                                <p className="text-sm text-muted-foreground h-12 flex items-center justify-center">
                                    {isIndexing ? getIndexingDescription() : getRetrievalDescription()}
                                </p>
                            </div>
                            
                            {isIndexing && (
                                <div className="p-2 grid grid-cols-1 md:grid-cols-3 md:gap-4 items-start">
                                    <AnimatePresence>
                                        {step >= 1 && (
                                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                <FlowCard title="Document Chunks" icon={<FileText className="w-5 h-5 text-primary"/>}>
                                                    <p className="p-2 border rounded bg-background">{initialChunks['chunk-1']}</p>
                                                    <p className="p-2 border rounded bg-background">{initialChunks['chunk-2']}</p>
                                                </FlowCard>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                   
                                    {step >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Arrow /></motion.div>}
                                    
                                    <AnimatePresence>
                                        {step >= 2 && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                <FlowCard title="Generated Questions" icon={<BrainCircuit className="w-5 h-5 text-primary"/>}>
                                                    <p className="p-2 border rounded bg-background">{hypotheticalQuestions['chunk-1']}</p>
                                                    <p className="p-2 border rounded bg-background">{hypotheticalQuestions['chunk-2']}</p>
                                                </FlowCard>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {step >= 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Arrow /></motion.div>}

                                    <AnimatePresence>
                                    {step >= 3 && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <FlowCard title="Indexed Store" icon={<Database className="w-5 h-5 text-primary"/>}>
                                                <div>
                                                    <Badge>Ref: chunk-1</Badge>
                                                    <p className="p-2 mt-1 border rounded bg-background">{hypotheticalQuestions['chunk-1']}</p>
                                                </div>
                                                 <div>
                                                    <Badge>Ref: chunk-2</Badge>
                                                    <p className="p-2 mt-1 border rounded bg-background">{hypotheticalQuestions['chunk-2']}</p>
                                                </div>
                                            </FlowCard>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {isRetrieval && (
                                 <div className="p-2 grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto,1fr] items-start md:gap-4">
                                     <AnimatePresence>
                                     {step >= 1 && (
                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <FlowCard title="User Query" icon={<HelpCircle className="w-5 h-5 text-primary" />}>
                                                <p className="p-2 border rounded bg-background">{userQuery}</p>
                                            </FlowCard>
                                         </motion.div>
                                     )}
                                     </AnimatePresence>
                                     
                                     {step >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Arrow /></motion.div>}

                                     <AnimatePresence>
                                     {step >= 2 && (
                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <FlowCard title="Similarity Search" icon={<Search className="w-5 h-5 text-primary"/>} highlighted={step >=3}>
                                                 <div>
                                                    <p className="p-2 border rounded bg-background">{hypotheticalQuestions['chunk-1']}</p>
                                                    <div className="text-right pr-2 mt-1">{step >= 3 && <Badge variant={step >= 3 ? "default" : "secondary"}>Similarity: 0.91</Badge>}</div>
                                                </div>
                                                 <div>
                                                    <p className="p-2 border rounded bg-background">{hypotheticalQuestions['chunk-2']}</p>
                                                    <div className="text-right pr-2 mt-1">{step >= 3 && <Badge variant="secondary">Similarity: 0.62</Badge>}</div>
                                                </div>
                                            </FlowCard>
                                         </motion.div>
                                     )}
                                     </AnimatePresence>
                                     
                                      {step >= 4 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Arrow /></motion.div>}
                                     
                                     <AnimatePresence>
                                     {step >= 4 && (
                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <FlowCard title="Retrieved Chunk" icon={<FileText className="w-5 h-5 text-primary"/>}>
                                                <p className="p-2 border rounded bg-background">{initialChunks['chunk-1']}</p>
                                            </FlowCard>
                                         </motion.div>
                                     )}
                                     </AnimatePresence>
                                 </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </Tabs>
                
                 <div className="flex justify-center items-center mt-4 pt-4 border-t">
                     <Button onClick={handleReset} variant="outline" size="sm" disabled={!isRunning}>
                         <RefreshCw className="mr-2 h-4 w-4" /> Reset
                     </Button>
                     <Button onClick={handleNext} size="sm" className="ml-2 w-28" disabled={isIndexing ? step >= maxIndexingSteps : step >= maxRetrievalSteps}>
                         {isRunning ? 'Next' : 'Start'} <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                </div>
            </CardContent>
        </Card>
    );
};
