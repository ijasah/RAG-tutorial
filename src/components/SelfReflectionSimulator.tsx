// src/components/SelfReflectionSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from './ui/card';
import { FileText, Database, HelpCircle, Search, RefreshCw, ArrowRight, MessageSquare, Sparkles, Wand2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const FlowNode = ({ icon, title, children, status, step, currentStep, className }: { icon: React.ReactNode, title: string, children: React.ReactNode, status: 'inactive' | 'active' | 'complete', step: number, currentStep: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.3, y: currentStep >= step ? 0 : 10 }}
        transition={{ duration: 0.4, delay: (step * 0.1) }}
        className={cn(
            "relative p-3 border rounded-lg transition-all duration-300 w-full text-left flex flex-col items-start justify-start h-full min-h-[100px]",
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
        initial={{ opacity: 0 }}
        animate={{ opacity: currentStep >= step ? 1 : 0.2 }}
        transition={{ duration: 0.3, delay: (step * 0.1) + 0.1 }}
        className="flex justify-center items-center text-muted-foreground/60 h-full"
    >
       <ArrowRight className="w-5 h-5" />
    </motion.div>
);

const initialChunks = [
    { text: "RAG combines retrieval with generation...", status: "correct" },
    { text: "LLMs were invented in 2022.", status: "correct" },
    { text: "Pinecone is a type of tree.", status: "ambiguous" },
    { text: "Zilliz develops vector databases.", status: "ambiguous" }
]

const verifiedChunk = { text: "Web search: Zilliz is a company that develops vector databases like Milvus." }
const finalAnswer = "RAG combines retrieval and generation. LLMs were invented in 2022. According to web search, Zilliz is a company that develops vector databases like Milvus."


export const SelfReflectionSimulator = () => {
    const [step, setStep] = useState(0);
    const maxSteps = 6;

    const handleNext = () => setStep(s => Math.min(s + 1, maxSteps));
    const handleReset = () => setStep(0);
    
    const getStatus = (s: number) => {
        if (step < s) return 'inactive';
        if (step === s) return 'active';
        return 'complete';
    };

    const Chunk = ({text, status, isFaded}: {text: string, status: 'correct' | 'ambiguous' | 'verified', isFaded?: boolean}) => {
        const color = {
            correct: "border-green-500/30 bg-green-500/10",
            ambiguous: "border-amber-500/30 bg-amber-500/10",
            verified: "border-blue-500/30 bg-blue-500/10",
        }
        return (
            <div className={cn("p-2 border rounded-md text-xs", color[status], isFaded && "opacity-40 line-through")}>
                <Badge variant={status === 'correct' ? 'default' : 'secondary'} className={cn("mb-1",
                   status === 'correct' && 'bg-green-500/80',
                   status === 'ambiguous' && 'bg-amber-500/80',
                   status === 'verified' && 'bg-blue-500/80',
                )}>{status}</Badge>
                <p>{text}</p>
            </div>
        )
    }

    return (
         <Card className="bg-card/60 border-primary/20">
            <CardContent className="p-4 pt-4 space-y-4">
                <div className="grid grid-cols-[auto,auto,1fr,auto,1fr,auto,1fr] items-stretch gap-4">
                    {/* Col 1: Docs & Query */}
                    <div className="flex flex-col gap-4 justify-between">
                         <FlowNode icon={<FileText/>} title="1. Documents" status={getStatus(1)} step={1} currentStep={step}>
                             <p>Source data is loaded.</p>
                         </FlowNode>
                         <FlowNode icon={<HelpCircle/>} title="2. Query" status={getStatus(2)} step={2} currentStep={step}>
                             <p>"Tell me about RAG and Zilliz."</p>
                         </FlowNode>
                    </div>

                    <FlowArrow step={3} currentStep={step} />

                    {/* Col 2: Top K Chunks */}
                    <div className="flex items-center">
                         <FlowNode icon={<Database/>} title="3. Top K Chunks" status={getStatus(3)} step={3} currentStep={step}>
                             {initialChunks.map((chunk, i) => (
                                 <AnimatePresence key={i}>
                                     {step >= 3 && <motion.div initial={{opacity: 0}} animate={{opacity:1, transition: {delay: i*0.1}}}><Chunk {...chunk}/></motion.div>}
                                 </AnimatePresence>
                             ))}
                         </FlowNode>
                    </div>

                    <FlowArrow step={4} currentStep={step} />
                    
                    {/* Col 3: Verification & Final */}
                    <div className="flex flex-col justify-around">
                        <FlowNode icon={<Wand2/>} title="4. Verification" status={getStatus(4)} step={4} currentStep={step}>
                            <p className="flex items-center gap-2"><Bot className="text-primary w-4 h-4"/> Agent reflects on chunks.</p>
                            <AnimatePresence>
                            {step >= 4 && (
                                <motion.div initial={{opacity:0}} animate={{opacity:1, transition: {delay: 0.2}}}>
                                    <Chunk text={initialChunks.find(c=>c.status==='ambiguous')!.text} status="ambiguous" />
                                    <div className="text-center my-1"><ArrowRight className="w-4 h-4 inline-block text-muted-foreground/50"/></div>
                                    <div className="flex items-center gap-2 p-2 border rounded-md text-xs bg-blue-950/20 border-blue-500/20">
                                        <Search className="w-4 h-4 text-blue-400"/>
                                        <p>Search Internet to verify...</p>
                                    </div>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </FlowNode>

                        <FlowNode icon={<Sparkles/>} title="5. Final Chunks" status={getStatus(5)} step={5} currentStep={step}>
                            <AnimatePresence>
                                {step >= 5 && initialChunks.map((chunk, i) => (
                                    chunk.status === 'correct' && <motion.div key={i} initial={{opacity: 0}} animate={{opacity:1}}><Chunk {...chunk} /></motion.div>
                                ))}
                                {step >= 5 && (
                                     <motion.div initial={{opacity: 0}} animate={{opacity:1, transition: {delay: 0.5}}}>
                                        <Chunk text={verifiedChunk.text} status="verified" />
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </FlowNode>
                    </div>

                     <FlowArrow step={6} currentStep={step} />
                    
                    {/* Col 4: Answer */}
                    <div className="flex items-center">
                         <FlowNode icon={<MessageSquare/>} title="6. Answer" status={getStatus(6)} step={6} currentStep={step}>
                             <AnimatePresence>
                                {step >= 6 && <motion.p initial={{opacity:0}} animate={{opacity:1}}>{finalAnswer}</motion.p>}
                             </AnimatePresence>
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
