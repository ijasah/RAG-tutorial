// src/components/FaithfulnessSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HelpCircle, FileText, RefreshCw, ArrowRight, MessageSquare, Sparkles, BrainCircuit, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/code-block';

const exampleData = {
    question: "Where and when was Einstein born?",
    context: "Albert Einstein (born 14 March 1879) was a German-born theoretical physicist, widely held to be one of the greatest and most influential scientists of all time.",
    answer: "Einstein was born in Germany on 20th March 1879.",
    claims: [
        { text: "Einstein was born in Germany.", supported: true, reason: "The context states he was 'German-born'." },
        { text: "Einstein was born on 20th March 1879.", supported: false, reason: "The context states he was born on '14 March 1879'." }
    ]
};

const InfoCard = ({ icon, title, content, className }: { icon: React.ReactNode, title: string, content: string, className?: string }) => (
    <Card className={cn("bg-muted/40 h-full", className)}>
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
            borderColor: isEvaluated ? (claim.supported ? 'hsl(var(--primary))' : 'hsl(var(--destructive))') : 'hsl(var(--border))',
            backgroundColor: isEvaluated ? (claim.supported ? 'hsla(var(--primary), 0.1)' : 'hsla(var(--destructive), 0.1)') : 'transparent',
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
                     {claim.supported ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                 </motion.div>
            )}
            </AnimatePresence>
        </div>
    </motion.div>
);

export const FaithfulnessSimulator = () => {
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
            "Click 'Start Simulation' to begin the Faithfulness simulation.",
            "1. First, we examine the inputs: the user's question, the retrieved context, and the generated answer.",
            "2. Next, the generated answer is broken down into individual claims.",
            "3. Each claim is fact-checked against the retrieved context to verify its accuracy.",
            "4. Finally, the Faithfulness score is calculated based on the ratio of supported claims."
        ];
        return descriptions[step] || descriptions[descriptions.length - 1];
    }
    
    const supportedClaims = evaluatedClaims.filter(i => exampleData.claims[i].supported).length;
    const totalClaims = exampleData.claims.length;
    const score = totalClaims > 0 ? supportedClaims / totalClaims : 0;
    const isEvaluating = step === 3 && evaluatedClaims.length < totalClaims;

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
             <CardHeader>
                <CardTitle>Faithfulness Simulator</CardTitle>
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
                        transition={{duration: 0.3}}
                    >
                        {step === 1 && (
                             <div className="grid grid-cols-1 gap-4">
                                <InfoCard icon={<HelpCircle className="text-primary"/>} title="User Question" content={exampleData.question} />
                                <InfoCard icon={<FileText className="text-primary"/>} title="Retrieved Context" content={exampleData.context} />
                                 <InfoCard icon={<MessageSquare className="text-primary"/>} title="Generated Answer" content={exampleData.answer} className="border-amber-500/30 bg-amber-500/10"/>
                            </div>
                        )}
                        {step === 2 && (
                            <InfoCard icon={<MessageSquare className="text-primary"/>} title="Generated Answer" content={exampleData.answer} />
                        )}
                        {step === 3 && (
                             <Card>
                                <CardHeader>
                                     <CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="text-primary"/>Claim Verification</CardTitle>
                                     <CardDescription>Each claim in the generated answer is checked against the retrieved context.</CardDescription>
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
                                 <p className="text-muted-foreground mb-4">The Faithfulness score is the ratio of supported claims to the total number of claims.</p>
                                <CodeBlock code={`Faithfulness Score = (Number of claims in the response supported by the retrieved context) / (Total number of claims in the response)\n\n= ${supportedClaims} / ${totalClaims} = ${score.toFixed(2)}`} />
                                 <p className="text-muted-foreground mt-4">A higher score is better, indicating the model is generating answers that are factually grounded in the context.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                 <div className="flex justify-center items-center mt-6 pt-4 border-t">
                     <Button onClick={handleReset} variant="outline" size="sm" disabled={step === 0}>
                         <RefreshCw className="mr-2 h-4 w-4" /> Reset
                     </Button>
                     <Button onClick={handleNext} size="sm" className="ml-4 w-40" disabled={step >= maxSteps || isEvaluating}>
                         {step === 0 && 'Start Simulation'}
                         {step > 0 && (isEvaluating ? 'Evaluating...' : 'Next')} 
                         {step > 0 && !isEvaluating && <ArrowRight className="ml-2 h-4 w-4" />}
                     </Button>
                </div>
            </CardContent>
        </Card>
    );
};
