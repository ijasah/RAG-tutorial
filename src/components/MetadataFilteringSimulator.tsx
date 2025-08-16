// src/components/MetadataFilteringSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { HelpCircle, FileText, RefreshCw, ArrowRight, MessageSquare, Sparkles, Database, GitMerge, Search, Filter, BoxSelect } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const userQuery = "Tell me about recent developments in vector databases.";
const metadataFilter = { year: 2023 };
const finalAnswer = "Recent developments include Zilliz Cloud, a fully-managed enterprise service for Milvus.";

const documents = [
    { id: 'chunk1', text: 'Milvus is an open-source vector database.', year: 2021, relevant: true },
    { id: 'chunk2', text: 'Zilliz Cloud provides managed Milvus for enterprise.', year: 2023, relevant: true },
    { id: 'chunk3', text: 'The first version of Milvus was released in 2019.', year: 2019, relevant: true },
    { id: 'chunk4', text: 'The capital of France is Paris.', year: 2022, relevant: false },
];

const retrievedChunks = [documents[0], documents[1]]; // Semantically relevant
const filteredChunk = documents[1]; // Passes metadata filter

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

const Chunk = ({ text, year, isHighlighted, isFaded }: { text: string; year: number; isHighlighted?: boolean; isFaded?: boolean }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: isFaded ? 0.4 : 1, y: 0 }}
        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
        className={cn("p-2 border rounded bg-background flex justify-between items-center transition-all",
            isHighlighted && "border-primary bg-primary/10 border-2 shadow-lg",
            isFaded && "bg-muted/50 line-through"
        )}
    >
        <span>{text}</span>
        <Badge variant={year === 2023 ? "default" : "secondary"} className={cn(year === 2023 && "bg-green-500/80")}>Year: {year}</Badge>
    </motion.div>
);

export const MetadataFilteringSimulator = () => {
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
            "Click 'Start' to begin the Meta-data Filtering simulation.",
            "1. Documents are stored in a Vector DB with associated metadata (e.g., year).",
            "2. A user query arrives, along with a metadata filter.",
            "3. A semantic search finds the Top-K most relevant chunks.",
            "4. The retrieved chunks are then filtered. Chunks that don't match the metadata are discarded.",
            "5. The final, relevant, and filtered context is sent to the LLM.",
            "6. The LLM generates a precise answer from the high-quality context."
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
                <div className="grid grid-cols-[1.5fr,auto,1fr,auto,1fr] gap-4 items-center min-h-[300px]">
                    {/* Column 1: DB & Query */}
                    <div className="flex flex-col gap-4 justify-center h-full">
                        <FlowNode icon={<Database />} title="1. Vector Store" status={getStatus(1)} step={1} currentStep={step}>
                            {documents.map(doc => (
                                <AnimatePresence key={doc.id}>
                                    {step >= 1 && <Chunk text={doc.text} year={doc.year} isHighlighted={step >= 3 && retrievedChunks.some(c => c.id === doc.id)} />}
                                </AnimatePresence>
                            ))}
                        </FlowNode>
                        <AnimatePresence>
                        {step >= 2 && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                                <FlowNode icon={<HelpCircle />} title="2. User Query" status={getStatus(2)} step={2} currentStep={step}>
                                    <p className="p-2 bg-background rounded border">{userQuery}</p>
                                    <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded mt-1.5">
                                        <Filter className="w-4 h-4 text-amber-400"/>
                                        <p>Filter: <Badge>Year >= 2023</Badge></p>
                                    </div>
                                </FlowNode>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    <FlowArrow step={3} currentStep={step} />

                    {/* Column 2: Top K */}
                    <FlowNode icon={<BoxSelect />} title="3. Top K Relevant" status={getStatus(3)} step={3} currentStep={step}>
                        <AnimatePresence>
                            {step >= 3 && retrievedChunks.map(chunk => (
                                <Chunk
                                    key={chunk.id}
                                    text={chunk.text}
                                    year={chunk.year}
                                    isHighlighted
                                    isFaded={step >= 4 && chunk.id !== filteredChunk.id}
                                />
                            ))}
                        </AnimatePresence>
                    </FlowNode>

                    <FlowArrow step={4} currentStep={step} />

                    {/* Column 3: Filtered & LLM */}
                    <div className="flex flex-col gap-4 justify-center h-full">
                         <FlowNode icon={<GitMerge />} title="4. Filtered by Metadata" status={getStatus(4)} step={4} currentStep={step}>
                             <AnimatePresence>
                                {step >= 4 && (
                                    <Chunk
                                        text={filteredChunk.text}
                                        year={filteredChunk.year}
                                        isHighlighted
                                    />
                                )}
                             </AnimatePresence>
                         </FlowNode>
                         <AnimatePresence>
                         {step >= 5 && (
                             <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                                 <FlowNode icon={<Sparkles />} title="5. LLM & Final Answer" status={getStatus(5)} step={5} currentStep={step}>
                                    <p>The LLM receives only the most relevant, pre-filtered context.</p>
                                    {step >= 6 && (
                                        <p className="p-2 mt-2 border rounded bg-background text-foreground">{finalAnswer}</p>
                                    )}
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
