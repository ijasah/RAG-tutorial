// src/components/BasicReflectionSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Brain, FileText, Search, RefreshCw, MessageSquare, Sparkles, Play, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTypewriter } from '@/hooks/use-typewriter';

const FlowNode = ({ title, icon, children, active }: { title: string, icon: React.ReactNode, children: React.ReactNode, active: boolean }) => (
    <motion.div
        initial={{ opacity: 0.5, y: 10, scale: 0.95 }}
        animate={{ opacity: active ? 1 : 0.6, y: active ? 0 : 10, scale: active ? 1 : 0.95 }}
        transition={{ duration: 0.4 }}
        className={cn("p-4 border rounded-lg h-full flex flex-col items-center text-center transition-all", active ? "bg-primary/10 border-primary" : "bg-muted/50")}
    >
        <div className="flex items-center gap-2 mb-2">
            {icon}
            <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div className="text-xs text-muted-foreground w-full flex-grow flex items-center justify-center">
            {children}
        </div>
    </motion.div>
);

const Path = ({ active }: { active: boolean }) => (
    <div className="relative w-full h-8 flex items-center justify-center">
        <motion.div
            className="w-0.5 h-full bg-border"
            initial={{ height: 0 }}
            animate={{ height: active ? '100%' : '0%' }}
            transition={{ duration: 0.3, delay: 0.3 }}
        />
    </div>
);

const example = {
    request: "Generate a short, punchy marketing slogan for a new AI-powered code completion tool.",
    initialResponse: "Code faster with AI.",
    reflection: {
        critique: "The slogan is too generic. It doesn't highlight the specific benefits or sound unique.",
        merits: "It's short and easy to understand.",
        recs: "Try focusing on partnership or intelligence. Use stronger verbs like 'build' or 'create'. Mention 'your AI pair programmer'."
    },
    finalResponse: "Build, test, and deploy, faster. Your AI pair programmer is here to help."
}

export const BasicReflectionSimulator = () => {
    const [step, setStep] = useState(0);
    
    const displayText = useTypewriter(step >= 5 ? example.finalResponse : "", 30);
    const displayInitial = useTypewriter(step >= 2 ? example.initialResponse : "", 30);

    const handleSimulate = () => {
        setStep(1);
        let currentStep = 1;
        const interval = setInterval(() => {
            currentStep++;
            setStep(currentStep);
            if (currentStep >= 5) {
                clearInterval(interval);
            }
        }, 1500);
    };
    
    const handleReset = () => setStep(0);

    return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Repeat /> Basic Reflection Simulator
                </CardTitle>
                <CardDescription>
                    See how an AI agent can improve its output by generating a response, reflecting on it, and then generating a new, improved response based on the reflection.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center">
                    <Button onClick={step === 0 ? handleSimulate : handleReset}>
                        {step === 0 ? <><Play className="mr-2"/>Start Simulation</> : <><RefreshCw className="mr-2"/>Reset</>}
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-start">
                    {/* User Request */}
                    <FlowNode title="1. User Request" icon={<User className="w-4 h-4 text-primary" />} active={step >= 1}>
                        <p className="p-2 bg-background rounded-md">{example.request}</p>
                    </FlowNode>
                    
                    {/* Generate */}
                    <FlowNode title="2. Generate" icon={<Brain className="w-4 h-4 text-primary" />} active={step >= 2}>
                        <p>The LLM produces an initial draft based on the request.</p>
                    </FlowNode>

                    {/* Initial Response */}
                    <FlowNode title="3. Initial Response" icon={<FileText className="w-4 h-4 text-primary" />} active={step >= 2}>
                        <p className="p-2 bg-background rounded-md min-h-[50px]">{displayInitial}</p>
                    </FlowNode>

                    {/* Reflection */}
                    <div className="col-span-1 md:col-start-2">
                        <AnimatePresence>
                           {step >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition:{delay:0.3} }}
                                >
                                    <Path active={step >= 3} />
                                    <FlowNode title="4. Reflect" icon={<Search className="w-4 h-4 text-primary" />} active={step >= 3}>
                                        <p>The agent critiques its own work to find areas for improvement.</p>
                                    </FlowNode>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>


                    {/* Reflections & Final Answer */}
                    <AnimatePresence>
                    {step >= 4 && (
                        <motion.div
                            className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition:{delay:0.3} }}
                        >
                            <Card className="bg-muted/50 p-3">
                                <CardHeader className="p-1">
                                    <CardTitle className="text-sm">Reflections</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs space-y-2 p-1">
                                    <p><strong>Critique:</strong> {example.reflection.critique}</p>
                                    <p><strong>Merits:</strong> {example.reflection.merits}</p>
                                    <p><strong>Recs:</strong> {example.reflection.recs}</p>
                                </CardContent>
                            </Card>
                            <div className="flex flex-col">
                                <Path active={step >= 4} />
                                <FlowNode title="5. Final Response" icon={<Sparkles className="w-4 h-4 text-primary" />} active={step >= 5}>
                                    <p className="p-2 bg-background rounded-md min-h-[60px]">{displayText}</p>
                                </FlowNode>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};
