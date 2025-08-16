// src/components/NoiseSensitivitySimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HelpCircle, FileText, Bot, Search, RefreshCw, ArrowRight, MessageSquare, Sparkles, GitMerge, BrainCircuit, Waves, CheckCircle, XCircle } from 'lucide-react';
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
    <Card className="bg-muted/40 h-full">
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
    const [step, setStep] = useState(0);
    const maxSteps = 4;
    const [evaluatedClaims, setEvaluatedClaims] = useState<number[]>([]);

    const handleNext = () => {
        if (step === 2) { // Start evaluation animation
            exampleData.claims.forEach((_, index) => {
                setTimeout(() => {
                    setEvaluatedClaims(prev => [...prev, index]);
                }, (index + 1) * 1500);
            });
        }
        setStep(s => Math.min(maxSteps, s + 1));
    };

    const handleReset = () => {
        setStep(0);
        setEvaluatedClaims([]);
    };
    
    const getStepDescription = () => {
        const descriptions = [
            "Click 'Start' to begin the Noise Sensitivity simulation.",
            "1. First, we examine the inputs: the user's question, the ground truth, and the contexts retrieved by the RAG system.",
            "2. Next, the LLM generates an answer based on the retrieved contexts.",
            "3. Now, we break the answer into individual claims and check if each one is supported by the ground truth.",
            "4. Finally, we calculate the Noise Sensitivity score based on how many incorrect claims were found."
        ];
        return descriptions[step];
    }
    
    const incorrectClaims = evaluatedClaims.filter(i => !exampleData.claims[i].correct).length;
    const totalClaims = exampleData.claims.length;
    const score = totalClaims > 0 ? incorrectClaims / totalClaims : 0;

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
             <CardHeader>
                <CardTitle>Noise Sensitivity Simulator</CardTitle>
                <CardDescription>
                     {getStepDescription()}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                    >
                        {step === 1 && (
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <InfoCard icon={<HelpCircle className="text-primary"/>} title="User Question" content={exampleData.question} />
                                <InfoCard icon={<ClipboardCheck className="text-primary"/>} title="Ground Truth" content={exampleData.ground_truth} />
                                <div className="lg:col-span-2">
                                    <InfoCard icon={<Search className="text-primary"/>} title="Retrieved Contexts" content={
                                        <div className="space-y-2">
                                            {exampleData.retrieved_contexts.map((ctx, i) => (
                                                <p key={i} className={cn("p-1.5 rounded-md border", ctx.relevant ? "bg-green-500/10 border-green-500/30" : "bg-destructive/10 border-destructive/30")}>{ctx.text}</p>
                                            ))}
                                        </div>
                                    } />
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                             <InfoCard icon={<MessageSquare className="text-primary"/>} title="Generated Answer" content={exampleData.generated_answer} />
                        )}
                        {step === 3 && (
                             <Card>
                                <CardHeader>
                                     <CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="text-primary"/>Claim Verification</CardTitle>
                                     <CardDescription>Each claim in the generated answer is checked against the ground truth.</CardDescription>
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
                        )}
                         {step === 4 && (
                            <div className="text-center p-4">
                                <h3 className="text-xl font-semibold mb-3 text-foreground">Final Score</h3>
                                 <p className="text-muted-foreground mb-4">The noise sensitivity is the ratio of incorrect claims to the total number of claims.</p>
                                <CodeBlock code={`Noise Sensitivity = (Incorrect Claims) / (Total Claims)\n= ${incorrectClaims} / ${totalClaims} = ${score.toFixed(3)}`} />
                                 <p className="text-muted-foreground mt-4">A lower score is better, indicating the model is less sensitive to noise and generates more factual answers.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                 <div className="flex justify-center items-center mt-6 pt-4 border-t">
                     <Button onClick={handleReset} variant="outline" size="sm" disabled={step === 0}>
                         <RefreshCw className="mr-2 h-4 w-4" /> Reset
                     </Button>
                     <Button onClick={handleNext} size="sm" className="ml-4 w-28" disabled={step >= maxSteps || (step === 3 && evaluatedClaims.length < totalClaims)}>
                         {step > 0 ? 'Next' : 'Start'} <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                </div>
            </CardContent>
        </Card>
    );
};
