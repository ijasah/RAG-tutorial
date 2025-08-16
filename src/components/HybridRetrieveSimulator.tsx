// src/components/HybridRetrieveSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, Search, RefreshCw, ArrowRight, MessageSquare, Sparkles, Database, GitMerge, Combine, SortAsc, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const userQuery = "What is semantic chunking?";
const documents = [
    { id: "vec-1", text: "Chunking based on meaning is semantic.", score: 0.91, type: 'vector'},
    { id: "vec-2", text: "Vector databases store embeddings.", score: 0.65, type: 'vector'},
    { id: "bm25-1", text: "Semantic chunking divides text using NLP.", score: 0.88, type: 'bm25'},
    { id: "bm25-2", text: "BM25 is a keyword-based search algorithm.", score: 0.50, type: 'bm25'}
];
const rerankedChunks = [documents[0], documents[2]];
const finalAnswer = "Semantic chunking is a method of dividing text into meaningful pieces using NLP techniques, which is more context-aware than fixed-size chunking."

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

const FlowArrow = ({ step, currentStep, className, direction = 'right' }: { step: number, currentStep: number, className?: string, direction?: 'right' | 'down' | 'up' }) => (
     <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.2 }}
        transition={{ duration: 0.3, delay: (step * 0.1) + 0.1 }}
        className={cn("flex justify-center items-center text-muted-foreground/60 h-full", className)}
    >
       {direction === 'right' && <ArrowRight className="w-5 h-5" />}
       {direction === 'down' && <ArrowDown className="w-5 h-5" />}
       {direction === 'up' && <ArrowUp className="w-5 h-5" />}
    </motion.div>
);

const ArrowUp = (props: any) => <ArrowDown {...props} className={cn(props.className, "rotate-180")} />

const ChunkDisplay = ({id, text, score, type, step, currentStep}: {id: string, text: string, score: number, type: string, step: number, currentStep: number}) => {
    const isVector = type === 'vector';
    return (
        <AnimatePresence>
            {currentStep >= step && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("p-2 border rounded bg-background flex justify-between items-center", isVector ? "border-purple-500/30" : "border-teal-500/30")}
                >
                    <span>{text}</span>
                    <Badge variant={isVector ? "default" : "secondary"} className={cn(isVector ? "bg-purple-500/80" : "bg-teal-500/80", "ml-2")}>{score.toFixed(2)}</Badge>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export const HybridRetrieveSimulator = () => {
    const [step, setStep] = useState(0);
    const maxSteps = 7;

    const handleNext = () => setStep(s => Math.min(maxSteps, s + 1));
    const handleReset = () => setStep(0);

    const getStatus = (s: number) => {
        if (step < s) return 'inactive';
        if (step === s) return 'active';
        return 'complete';
    };
    
    const getStepDescription = () => {
        const descriptions = [
            "Click 'Start' to begin the Hybrid Retrieve & Rerank simulation.",
            "1. Documents are indexed in two ways: for vector search and keyword (BM25) search.",
            "2. The user's query is sent to both retrieval systems simultaneously.",
            "3. Each retriever returns its top K relevant chunks based on its algorithm.",
            "4. The results from both retrievers are combined into a single list.",
            "5. A reranker model re-evaluates the combined list to find the most relevant chunks overall.",
            "6. The top reranked chunks are passed to the LLM.",
            "7. The LLM generates the final answer based on the highly relevant, reranked context."
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
                <div className="space-y-4">
                    {/* Top Row: Docs & Query */}
                    <div className="grid grid-cols-2 gap-4">
                        <AnimatePresence>
                        {step >= 1 && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full">
                                <FlowNode icon={<FileText />} title="1. Documents" status={getStatus(1)} step={1} currentStep={step}>
                                    <p>Documents are indexed into a vector store (for semantic search) and a BM25 index (for keyword search).</p>
                                </FlowNode>
                            </motion.div>
                         )}
                         </AnimatePresence>
                         <AnimatePresence>
                         {step >= 2 && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full">
                                <FlowNode icon={<HelpCircle />} title="2. Query" status={getStatus(2)} step={2} currentStep={step}>
                                    <p className="p-2 bg-background rounded border">{userQuery}</p>
                                </FlowNode>
                            </motion.div>
                         )}
                         </AnimatePresence>
                    </div>

                    {/* Arrows pointing down to search */}
                    <div className="grid grid-cols-2 gap-4">
                        <FlowArrow step={2} currentStep={step} direction="up" />
                        <FlowArrow step={2} currentStep={step} direction="up" />
                    </div>

                     {/* Middle Row: Parallel Search */}
                    <div className="grid grid-cols-2 gap-4">
                        <FlowNode icon={<Database />} title="Vector Search" status={getStatus(2)} step={2} currentStep={step}>
                             <p>Finds chunks based on semantic meaning.</p>
                        </FlowNode>
                        <FlowNode icon={<Search />} title="BM25 Search" status={getStatus(2)} step={2} currentStep={step}>
                            <p>Finds chunks based on keywords.</p>
                        </FlowNode>
                    </div>

                    {/* Middle Row: Parallel Results */}
                    <div className="grid grid-cols-2 gap-4">
                        <FlowNode icon={<SortAsc />} title="3. Top Vector Chunks" status={getStatus(3)} step={3} currentStep={step}>
                             <ChunkDisplay {...documents[0]} step={3} currentStep={step} />
                             <ChunkDisplay {...documents[1]} step={3} currentStep={step} />
                        </FlowNode>
                         <FlowNode icon={<SortAsc />} title="3. Top BM25 Chunks" status={getStatus(3)} step={3} currentStep={step}>
                            <ChunkDisplay {...documents[2]} step={3} currentStep={step} />
                            <ChunkDisplay {...documents[3]} step={3} currentStep={step} />
                        </FlowNode>
                    </div>
                    
                    {/* Arrow for merging */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                         <FlowArrow step={4} currentStep={step} className="rotate-45 -translate-x-1/4"/>
                         <div></div>
                         <FlowArrow step={4} currentStep={step} className="-rotate-45 translate-x-1/4"/>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
                    {/* Rerank and Final Context */}
                    <div className="flex flex-col gap-4">
                        <FlowNode icon={<Combine />} title="4. Rerank" status={getStatus(4)} step={4} currentStep={step}>
                            <p>A model re-evaluates the combined results for relevance.</p>
                        </FlowNode>
                        <FlowNode icon={<GitMerge />} title="5. Final Context" status={getStatus(5)} step={5} currentStep={step}>
                            <ChunkDisplay {...rerankedChunks[0]} step={5} currentStep={step} />
                            <ChunkDisplay {...rerankedChunks[1]} step={5} currentStep={step} />
                        </FlowNode>
                    </div>

                    <FlowArrow step={6} currentStep={step} />

                    {/* Generate and Answer */}
                    <div className="flex flex-col gap-4">
                        <FlowNode icon={<Sparkles />} title="6. Generate" status={getStatus(6)} step={6} currentStep={step}>
                            <p>LLM generates answer from best context.</p>
                        </FlowNode>
                        <FlowNode icon={<MessageSquare />} title="7. Answer" status={getStatus(7)} step={7} currentStep={step}>
                            <p>{finalAnswer}</p>
                        </FlowNode>
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
