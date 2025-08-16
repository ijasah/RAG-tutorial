// src/components/ResponseRelevancySimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HelpCircle, FileText, Bot, RefreshCw, ArrowRight, MessageSquare, Sparkles, BrainCircuit, CheckCircle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { CodeBlock } from './ui/code-block';

const exampleData = {
    userInput: "Where is France and what is its capital?",
    response: "France is in western Europe and Paris is its capital.",
    generatedQuestions: [
        { text: "Where is France located in Europe?", score: 0.95 },
        { text: "What is the capital city of France?", score: 0.98 },
        { text: "Can you name a country in western Europe?", score: 0.81 }
    ]
};

const InfoCard = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
    <Card className="bg-muted/40 h-full">
        <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-sm p-3 border rounded bg-background">{content}</div>
        </CardContent>
    </Card>
);

const QuestionCard = ({ question, isEvaluated }: { question: any, isEvaluated: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn("p-3 rounded-lg border-2", isEvaluated ? "border-primary bg-primary/10" : "border-border")}
    >
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{question.text}</p>
            <AnimatePresence>
                {isEvaluated && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                    >
                        <Badge>{question.score.toFixed(2)}</Badge>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </motion.div>
);

export const ResponseRelevancySimulator = () => {
    const [step, setStep] = useState(0);
    const [evaluatedQuestions, setEvaluatedQuestions] = useState<number[]>([]);
    const maxSteps = 4;

    const handleNext = () => {
        if (step === 1) { // Start generation
             setEvaluatedQuestions([]);
             // Just proceed to next step to show cards
        }
        if (step === 2) { // Start evaluation
            exampleData.generatedQuestions.forEach((_, index) => {
                setTimeout(() => {
                    setEvaluatedQuestions(prev => [...prev, index]);
                }, (index + 1) * 800);
            });
        }
        setStep(s => Math.min(maxSteps, s + 1));
    };

    const handleReset = () => {
        setStep(0);
        setEvaluatedQuestions([]);
    };
    
    const getStepDescription = () => {
        const descriptions = [
            "Click 'Start Simulation' to begin the Response Relevancy simulation.",
            "1. Start with the user's question and the LLM's generated answer.",
            "2. Generate hypothetical questions from the answer. If the answer is good, these should resemble the original question.",
            "3. Calculate the cosine similarity between the original question and each generated question.",
            "4. The final score is the average of these similarities."
        ];
        return descriptions[step];
    };
    
    const totalScore = evaluatedQuestions.reduce((acc, i) => acc + exampleData.generatedQuestions[i].score, 0);
    const finalScore = evaluatedQuestions.length > 0 ? totalScore / evaluatedQuestions.length : 0;
    const isEvaluating = step === 3 && evaluatedQuestions.length < exampleData.generatedQuestions.length;


    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
             <CardHeader>
                <CardTitle>Response Relevancy Simulator</CardTitle>
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
                    transition={{ duration: 0.3 }}
                >
                    {step >= 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <InfoCard icon={<HelpCircle className="text-primary"/>} title="User Input" content={exampleData.userInput} />
                            <InfoCard icon={<MessageSquare className="text-primary"/>} title="Generated Answer" content={exampleData.response} />
                        </div>
                    )}
                    {step >= 2 && (
                         <Card className="mt-4">
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="text-primary"/>Generated Questions</CardTitle>
                                 <CardDescription>An LLM generates questions that could be answered by the response. Similar questions indicate high relevancy.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {exampleData.generatedQuestions.map((q, index) => (
                                    <QuestionCard
                                        key={index}
                                        question={q}
                                        isEvaluated={evaluatedQuestions.includes(index)}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    {step === 4 && (
                        <div className="text-center p-4 mt-4">
                            <h3 className="text-xl font-semibold mb-3 text-foreground">Final Score</h3>
                             <p className="text-muted-foreground mb-4">The final score is the average of the cosine similarities between the original user input and each of the generated questions.</p>
                            <CodeBlock code={`Response Relevancy = (${exampleData.generatedQuestions.map(q => q.score.toFixed(2)).join(' + ')}) / ${exampleData.generatedQuestions.length}\n= ${finalScore.toFixed(3)}`} />
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
