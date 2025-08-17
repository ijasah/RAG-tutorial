// src/components/FaithfulnessSimulator.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HelpCircle, FileText, RefreshCw, MessageSquare, Sparkles, BrainCircuit, CheckCircle, XCircle, Play } from 'lucide-react';
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
    <Card className={cn("bg-muted/40", className)}>
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
    const [evaluatedClaims, setEvaluatedClaims] = useState<number[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const supportedClaims = useMemo(() => {
        return evaluatedClaims.filter(i => exampleData.claims[i].supported).length;
    }, [evaluatedClaims]);

    const score = useMemo(() => {
        if (evaluatedClaims.length === 0) return 0;
        const totalClaims = exampleData.claims.length > 0 ? exampleData.claims.length : 1;
        return supportedClaims / totalClaims;
    }, [supportedClaims, evaluatedClaims, exampleData.claims.length]);


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
    
    const formula = `Faithfulness = (Supported Claims) / (Total Claims)\n\n= ${supportedClaims} / ${exampleData.claims.length} = ${score.toFixed(2)}`;

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
             <CardHeader>
                <CardTitle>Faithfulness Simulator</CardTitle>
                <CardDescription>
                     See how Faithfulness is calculated by checking if the generated answer is grounded in the retrieved context.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="p-4 mb-6 bg-muted/40 rounded-lg border text-center space-y-2">
                    <h3 className="text-lg font-semibold text-primary">LLM-based Faithfulness</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">The LLM deconstructs the answer into claims and verifies each one against the retrieved context.</p>
                   <CodeBlock className="text-left !bg-background/50" code={formula} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <InfoCard icon={<HelpCircle className="text-primary"/>} title="User Question" content={exampleData.question} />
                        <InfoCard icon={<FileText className="text-primary"/>} title="Retrieved Context" content={exampleData.context} />
                        <InfoCard icon={<MessageSquare className="text-primary"/>} title="Generated Answer" content={exampleData.answer} className="border-amber-500/30 bg-amber-500/10"/>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                         <Card className="sticky top-24">
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="text-primary"/>Claim Verification</CardTitle>
                                 <CardDescription>Each claim in the answer is checked against the context. Click "Run" to start.</CardDescription>
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
