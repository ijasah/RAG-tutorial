// src/components/HypotheticalQuestionsSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrainCircuit, HelpCircle, FileText, Database, Search, ChevronRight, RefreshCw, ArrowRight, ArrowDown, GitMerge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
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

const FlowCard = ({ title, icon, children, highlighted, className }: { title: string, icon: React.ReactNode, children: React.ReactNode, highlighted?: boolean, className?: string }) => (
    <Card className={cn("transition-all h-full", highlighted ? "border-primary bg-primary/10" : "", className)}>
        <CardHeader className="p-3">
             <CardTitle className="flex items-center gap-2 text-sm">
                {icon}
                <h4 className="font-semibold">{title}</h4>
             </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
            <div className="text-xs text-muted-foreground space-y-1.5">
                {children}
            </div>
        </CardContent>
    </Card>
);

const Arrow = ({vertical = false}) => (
    <motion.div 
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.5}}
        className="flex justify-center items-center my-auto"
    >
       {vertical ? <ArrowDown className="w-5 h-5 text-muted-foreground/50" /> : <ChevronRight className="w-6 h-6 text-muted-foreground/50" />}
    </motion.div>
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
            "3. The hypothetical question with the highest similarity score is found.",
            "4. The system retrieves the original chunk linked to that winning question to answer the query."
        ];
        return descriptions[step] || descriptions[descriptions.length -1];
    }
    
    const resetAndSwitch = (newPhase: 'indexing' | 'retrieval') => {
        setPhase(newPhase);
        setStep(0);
    }
    
    const renderNode = (s: number, children: React.ReactNode) => {
        return <AnimatePresence>{step >= s && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: {delay: (s-1) * 0.2} }}>{children}</motion.div>}</AnimatePresence>
    }

    return (
        <Card className="bg-card/60 border-primary/20">
            <CardHeader>
                <CardTitle className="text-base">Method: Hypothetical Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
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
                             <CardDescription className="pt-2 h-12 flex items-center justify-center text-center mb-4">
                                {isIndexing ? getIndexingDescription() : getRetrievalDescription()}
                            </CardDescription>
                            
                            {isIndexing && (
                                <div className="p-2 grid grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-stretch min-h-[220px]">
                                    {renderNode(1, 
                                        <FlowCard title="Document Chunks" icon={<FileText className="w-5 h-5 text-primary"/>}>
                                            <p className="p-2 border rounded bg-background">{initialChunks['chunk-1']}</p>
                                            <p className="p-2 border rounded bg-background">{initialChunks['chunk-2']}</p>
                                        </FlowCard>
                                    )}
                                   
                                    {step >= 2 && <Arrow />}
                                    
                                    {renderNode(2,
                                        <FlowCard title="Generated Questions" icon={<BrainCircuit className="w-5 h-5 text-primary"/>}>
                                            <p className="p-2 border rounded bg-background">{hypotheticalQuestions['chunk-1']}</p>
                                            <p className="p-2 border rounded bg-background">{hypotheticalQuestions['chunk-2']}</p>
                                        </FlowCard>
                                    )}

                                    {step >= 3 && <Arrow />}

                                    {renderNode(3,
                                        <FlowCard title="Indexed Store" icon={<Database className="w-5 h-5 text-primary"/>}>
                                            <div>
                                                <Badge>Ref: chunk-1</Badge>
                                                <p className="p-1 mt-1 border rounded bg-background">{hypotheticalQuestions['chunk-1']}</p>
                                            </div>
                                             <div>
                                                <Badge>Ref: chunk-2</Badge>
                                                <p className="p-1 mt-1 border rounded bg-background">{hypotheticalQuestions['chunk-2']}</p>
                                            </div>
                                        </FlowCard>
                                    )}
                                </div>
                            )}

                            {isRetrieval && (
                                 <div className="p-2 grid grid-cols-[1fr,auto,1fr,auto,1fr] gap-4 items-stretch min-h-[220px]">
                                     {renderNode(1,
                                        <FlowCard title="User Query" icon={<HelpCircle className="w-5 h-5 text-primary" />}>
                                            <p className="p-2 border rounded bg-background">{userQuery}</p>
                                        </FlowCard>
                                     )}
                                     
                                     {step >= 2 && <Arrow />}

                                     {renderNode(2,
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
                                     )}
                                     
                                      {step >= 4 && <Arrow />}
                                     
                                     {renderNode(4,
                                        <FlowCard title="Retrieved Chunk" icon={<FileText className="w-5 h-5 text-primary"/>}>
                                            <p className="p-2 border rounded bg-background">{initialChunks['chunk-1']}</p>
                                        </FlowCard>
                                     )}
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
