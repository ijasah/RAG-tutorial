// src/components/NoiseSensitivitySimulator.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HelpCircle, FileText, Bot, Search, RefreshCw, Play, MessageSquare, Sparkles, GitMerge, BrainCircuit, Waves, CheckCircle, XCircle, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { CodeBlock } from './ui/code-block';

const exampleData = {
    question: "What is the Life Insurance Corporation of India (LIC) known for?",
    ground_truth: "The Life Insurance Corporation of India (LIC) is the largest insurance company in India, established in 1956 through the nationalization of the insurance industry. It is known for managing a large portfolio of investments.",
    retrieved_contexts: [
        { text: "The Life Insurance Corporation of India (LIC) was established in 1956 following the nationalization of the insurance industry in India.", relevant: true },
        { text: "LIC is the largest insurance company in India, with a vast network of policyholders and huge investments.", relevant: true },
        { text: "As the largest institutional investor in India, LIC manages substantial funds, contributing to the financial stability of the country.", relevant: true },
        { text: "The Indian economy is one of the fastest-growing major economies in the world, thanks to sectors like finance, technology, manufacturing etc.", relevant: false },
    ],
    generated_answer: "The Life Insurance Corporation of India (LIC) is the largest insurance company in India, known for its vast portfolio of investments. LIC contributes to the financial stability of the country.",
    claims: [
        { text: "The Life Insurance Corporation of India (LIC) is the largest insurance company in India, known for its vast portfolio of investments.", correct: true, reason: "This claim is directly supported by the ground truth." },
        { text: "LIC contributes to the financial stability of the country.", correct: false, reason: "This claim is not mentioned in the ground truth." },
    ]
};

const InfoCard = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string | React.ReactNode }) => (
    <Card className="bg-muted/40">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-xs text-muted-foreground p-2 border rounded bg-background">{content}</div>
        </CardContent>
    </Card>
);

const ClaimCard = ({ claim, isEvaluated }: { claim: any; isEvaluated: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
            opacity: 1,
            y: 0,
            borderColor: isEvaluated ? (claim.correct ? 'hsl(var(--primary))' : 'hsl(var(--destructive))') : 'hsl(var(--border))',
            backgroundColor: isEvaluated ? (claim.correct ? 'hsla(var(--primary), 0.1)' : 'hsla(var(--destructive), 0.1)') : 'transparent',
        }}
        transition={{ duration: 0.4 }}
        className="p-3 rounded-lg border-2"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium">{claim.text}</p>
                <AnimatePresence>
                {isEvaluated && (
                     <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                        className="text-xs text-muted-foreground mt-1"
                    >
                        {claim.reason}
                    </motion.p>
                )}
                </AnimatePresence>
            </div>
             <AnimatePresence>
            {isEvaluated && (
                 <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                    className="flex items-center gap-2 pl-4"
                >
                     {claim.correct ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                 </motion.div>
            )}
            </AnimatePresence>
        </div>
    </motion.div>
)

export const NoiseSensitivitySimulator = () => {
    const [evaluatedClaims, setEvaluatedClaims] = useState<number[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const incorrectClaims = useMemo(() => {
        return evaluatedClaims.filter(i => !exampleData.claims[i].correct).length;
    }, [evaluatedClaims]);
    
    const score = useMemo(() => {
        if (evaluatedClaims.length === 0) return 0;
        const totalClaims = exampleData.claims.length > 0 ? exampleData.claims.length : 1;
        return incorrectClaims / totalClaims;
    }, [incorrectClaims, evaluatedClaims, exampleData.claims.length]);
    

    const handleSimulate = () => {
        setIsRunning(true);
        setEvaluatedClaims([]);
        
        exampleData.claims.forEach((_, index) => {
            setTimeout(() => {
                setEvaluatedClaims(prev => [...prev, index]);
                if (index === exampleData.claims.length - 1) {
                    setIsRunning(false);
                }
            }, (index + 1) * 1500);
        });
    };

    const handleReset = () => {
        setIsRunning(false);
        setEvaluatedClaims([]);
    };
    
    const formula = `Noise Sensitivity = (Incorrect Claims) / (Total Claims)\n\n= ${incorrectClaims} / ${exampleData.claims.length} = ${score.toFixed(2)}`;

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
             <CardHeader>
                <CardTitle>Noise Sensitivity Simulator</CardTitle>
                <CardDescription>
                     See how Noise Sensitivity is calculated by checking if the LLM generates claims that are not supported by the ground truth.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 mb-6 bg-muted/40 rounded-lg border text-center space-y-2">
                    <h3 className="text-lg font-semibold text-primary">LLM-based Noise Sensitivity</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">The LLM deconstructs the answer into claims and verifies each one against the ground truth answer.</p>
                   <CodeBlock className="text-left !bg-background/50" code={formula} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {/* Left Column */}
                    <div className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard icon={<HelpCircle className="text-primary"/>} title="User Question" content={exampleData.question} />
                            <InfoCard icon={<ClipboardCheck className="text-primary"/>} title="Ground Truth" content={exampleData.ground_truth} />
                        </div>
                         <InfoCard icon={<Search className="text-primary"/>} title="Retrieved Contexts" content={
                            <div className="space-y-2">
                                {exampleData.retrieved_contexts.map((ctx, i) => (
                                    <p key={i} className={cn("p-1.5 rounded-md border", ctx.relevant ? "bg-green-500/10 border-green-500/30" : "bg-destructive/10 border-destructive/30")}>{ctx.text}</p>
                                ))}
                            </div>
                        } />
                        <InfoCard icon={<MessageSquare className="text-primary"/>} title="Generated Answer" content={exampleData.generated_answer} />
                    </div>
                    {/* Right Column */}
                     <div className="space-y-4">
                         <Card className="sticky top-24">
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="text-primary"/>Claim Verification</CardTitle>
                                 <CardDescription>Each claim in the answer is checked against the ground truth. Click "Run" to start.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {exampleData.claims.map((claim, index) => (
                                    <ClaimCard
                                        key={index}
                                        claim={claim}
                                        isEvaluated={evaluatedClaims.includes(index)}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                 <div className="flex justify-center mt-6 pt-4 border-t">
                     <Button onClick={!isRunning ? handleSimulate : handleReset} className="w-48">
                         {!isRunning && evaluatedClaims.length === 0 && <><Play className="mr-2" />Run Evaluation</>}
                         {isRunning && 'Evaluating...'}
                         {!isRunning && evaluatedClaims.length > 0 && <><RefreshCw className="mr-2" />Re-run Evaluation</>}
                     </Button>
                </div>
            </CardContent>
        </Card>
    );
};
