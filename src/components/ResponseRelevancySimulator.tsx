// src/components/ResponseRelevancySimulator.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HelpCircle, RefreshCw, MessageSquare, BrainCircuit, CheckCircle, Target, Play } from 'lucide-react';
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
        animate={{
            opacity: 1,
            y: 0,
            borderColor: isEvaluated ? 'hsl(var(--primary))' : 'hsl(var(--border))',
            backgroundColor: isEvaluated ? 'hsla(var(--primary), 0.1)' : 'transparent',
        }}
        transition={{ duration: 0.4 }}
        className="p-3 rounded-lg border-2"
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
    const [evaluatedQuestions, setEvaluatedQuestions] = useState<number[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const totalScore = useMemo(() => {
        return evaluatedQuestions.reduce((acc, i) => acc + exampleData.generatedQuestions[i].score, 0);
    }, [evaluatedQuestions]);

    const finalScore = useMemo(() => {
        if (evaluatedQuestions.length === 0) return 0;
        return totalScore / evaluatedQuestions.length;
    }, [totalScore, evaluatedQuestions]);

    const isEvaluating = isRunning && evaluatedQuestions.length < exampleData.generatedQuestions.length;


    const handleSimulate = () => {
        setIsRunning(true);
        setEvaluatedQuestions([]);

        exampleData.generatedQuestions.forEach((_, index) => {
            setTimeout(() => {
                setEvaluatedQuestions(prev => [...prev, index]);
                if (index === exampleData.generatedQuestions.length - 1) {
                    setIsRunning(false);
                }
            }, (index + 1) * 800);
        });
    };

    const handleReset = () => {
        setIsRunning(false);
        setEvaluatedQuestions([]);
    };
    
    const formula = `Response Relevancy = average(${exampleData.generatedQuestions.map(q => q.score.toFixed(2)).join(', ')})\n\n= ${finalScore.toFixed(3)}`;

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
             <CardHeader>
                <CardTitle>Response Relevancy Simulator</CardTitle>
                <CardDescription>
                     See how Response Relevancy is calculated by generating questions from the answer and comparing them to the original query.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 mb-6 bg-muted/40 rounded-lg border text-center space-y-2">
                    <h3 className="text-lg font-semibold text-primary">LLM-based Relevancy</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">The LLM generates questions from the answer, then we measure how similar they are to the original user input.</p>
                   <CodeBlock className="text-left !bg-background/50" code={formula} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <InfoCard icon={<HelpCircle className="text-primary"/>} title="User Input" content={exampleData.userInput} />
                        <InfoCard icon={<MessageSquare className="text-primary"/>} title="Generated Answer" content={exampleData.response} />
                    </div>

                    {/* Right Column */}
                     <div className="space-y-4">
                         <Card className="sticky top-24">
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="text-primary"/>Analysis</CardTitle>
                                 <CardDescription>Generated questions are compared to the user input. Click "Run" to start.</CardDescription>
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
                    </div>
                </div>

                <div className="flex justify-center mt-6 pt-4 border-t">
                    <Button onClick={!isRunning ? handleSimulate : handleReset} className="w-40">
                         {!isRunning && evaluatedQuestions.length === 0 && <><Play className="mr-2" />Run Evaluation</>}
                         {isRunning && 'Evaluating...'}
                         {!isRunning && evaluatedQuestions.length > 0 && <><RefreshCw className="mr-2" />Re-run</>}
                     </Button>
                </div>
            </CardContent>
        </Card>
    );
};
