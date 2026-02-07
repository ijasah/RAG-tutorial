"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, BrainCircuit, Wand2, Eye, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/code-block';

const executionSteps = [
    { 
        type: 'code', 
        content: `agent.invoke({"messages": [{"role": "user", "content": "Add 3 and 4."}]})`,
        title: 'Invoke Agent',
        duration: 1500,
    },
    { 
        type: 'output',
        subType: 'thought',
        icon: <BrainCircuit className="text-pink-400" />,
        title: 'Agent Thought',
        content: 'The user wants to add two numbers. I need to use the `add` tool.',
        duration: 2000,
    },
    { 
        type: 'output',
        subType: 'action',
        icon: <Wand2 className="text-blue-400" />,
        title: 'Action',
        content: 'Calling tool: add(a=3, b=4)',
        duration: 1500,
    },
    { 
        type: 'output',
        subType: 'observation',
        icon: <Eye className="text-purple-400" />,
        title: 'Observation',
        content: 'Tool returned: 7',
        duration: 1500,
    },
     { 
        type: 'output',
        subType: 'thought',
        icon: <BrainCircuit className="text-pink-400" />,
        title: 'Agent Thought',
        content: 'I have the result from the tool. I can now form the final answer.',
        duration: 2000,
    },
    { 
        type: 'output',
        subType: 'answer',
        icon: <MessageSquare className="text-primary" />,
        title: 'Final Answer',
        content: 'The result of adding 3 and 4 is 7.',
        duration: 1000,
    }
];

const subTypeToBgColor: Record<string, string> = {
    thought: 'bg-pink-500/10 border-pink-500/30',
    action: 'bg-blue-500/10 border-blue-500/30',
    observation: 'bg-purple-500/10 border-purple-500/30',
    answer: 'bg-primary/10 border-primary/30'
};

export const LangGraphQuickstartSimulator = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (isRunning && currentStep < executionSteps.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, executionSteps[currentStep].duration);

            return () => clearTimeout(timer);
        } else if (currentStep >= executionSteps.length) {
            setIsRunning(false);
        }
    }, [currentStep, isRunning]);

    const handleSimulate = () => {
        setCurrentStep(0);
        setIsRunning(true);
        // We add a small delay to let the state reset before starting the animation
        setTimeout(() => setCurrentStep(1), 100);
    };

    const handleReset = () => {
        setIsRunning(false);
        setCurrentStep(0);
    };

    return (
        <Card className="bg-muted/30 my-8 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle>Execution Simulation</CardTitle>
                <CardDescription>
                    Watch the agent think, act, and respond in a notebook-style execution flow.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <Button onClick={currentStep > 0 ? handleReset : handleSimulate} className="min-w-[180px]" disabled={isRunning}>
                        {isRunning ? 'Executing...' : (currentStep > 0 ? <><RefreshCw /> Reset Simulation</> : <><Play /> Start Simulation</>)}
                    </Button>
                </div>

                <div className="space-y-4 rounded-lg bg-background p-4 border min-h-[400px]">
                    <AnimatePresence>
                        {executionSteps.slice(0, currentStep).map((step, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {step.type === 'code' ? (
                                    <div className="relative">
                                         <CodeBlock code={step.content} className={cn(isRunning && index === currentStep - 1 && "ring-2 ring-primary shadow-lg")} />
                                         {isRunning && index === currentStep - 1 && <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full animate-pulse" />}
                                    </div>
                                ) : (
                                    <div className={cn("ml-8 p-3 rounded-lg border text-sm", subTypeToBgColor[step.subType!])}>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            {step.icon} {step.title}
                                        </h4>
                                        <p className="pl-8 text-muted-foreground">{step.content}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};
