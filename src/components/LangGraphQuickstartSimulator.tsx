"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, BrainCircuit, Wand2, Eye, MessageSquare, Calculator, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const executionSteps = [
    { 
        type: 'thought',
        activeNode: 'agent',
        icon: <BrainCircuit className="text-pink-400" />,
        title: 'Thought',
        content: 'The user wants to add two numbers. I need to use the `add` tool.',
        duration: 2000,
    },
    { 
        type: 'action',
        activeNode: 'agent',
        icon: <Wand2 className="text-blue-400" />,
        title: 'Action',
        content: 'Calling tool: add(a=3, b=4)',
        duration: 1500,
    },
    { 
        type: 'observation',
        activeNode: 'tools',
        icon: <Eye className="text-purple-400" />,
        title: 'Observation',
        content: 'Tool returned: 7',
        duration: 1500,
    },
     { 
        type: 'thought',
        activeNode: 'agent',
        icon: <BrainCircuit className="text-pink-400" />,
        title: 'Thought',
        content: 'I have the result from the tool. I can now form the final answer.',
        duration: 2000,
    },
    { 
        type: 'answer',
        activeNode: 'agent',
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

const GraphNode = ({ title, icon, active }: { title: string, icon: React.ReactNode, active: boolean }) => (
    <motion.div
        className={cn(
            "p-6 border-2 rounded-xl flex flex-col items-center gap-2 transition-all duration-300",
            active ? "bg-primary/10 border-primary shadow-lg" : "bg-muted/40 border-dashed"
        )}
        animate={{ scale: active ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
        {icon}
        <h3 className="font-semibold text-foreground">{title}</h3>
    </motion.div>
);

export const LangGraphQuickstartSimulator = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [log, setLog] = useState<(typeof executionSteps[0])[]>([]);

    useEffect(() => {
        if (isRunning && currentStep < executionSteps.length) {
            const timer = setTimeout(() => {
                setLog(prev => [...prev, executionSteps[currentStep]]);
                setCurrentStep(prev => prev + 1);
            }, executionSteps[currentStep].duration);
            return () => clearTimeout(timer);
        } else if (currentStep >= executionSteps.length) {
            setIsRunning(false);
        }
    }, [currentStep, isRunning]);

    const handleSimulate = () => {
        setLog([]);
        setCurrentStep(0);
        setIsRunning(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setLog([]);
        setCurrentStep(0);
    };

    const activeNode = log[log.length - 1]?.activeNode;

    return (
        <Card className="bg-muted/30 my-8 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle>Execution Simulation</CardTitle>
                <CardDescription>
                    Watch side-by-side as the agent graph executes and produces a step-by-step trace of its reasoning, actions, and observations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <Button onClick={log.length > 0 ? handleReset : handleSimulate} className="min-w-[180px]" disabled={isRunning}>
                        {isRunning ? 'Executing...' : (log.length > 0 ? <><RefreshCw /> Reset Simulation</> : <><Play /> Start Simulation</>)}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
                    {/* Left side: The Graph */}
                    <div className="flex flex-col justify-center items-center gap-4 relative p-4 rounded-lg bg-background border">
                         <h3 className="text-sm font-semibold text-muted-foreground absolute top-4 left-4">Agent Graph</h3>
                        <GraphNode title="Agent" icon={<BrainCircuit className="w-10 h-10 text-primary" />} active={activeNode === 'agent'} />
                        
                        {/* Arrows */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                            <AnimatePresence>
                                {log.some(l => l.type === 'action') && (
                                    <motion.svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <motion.path
                                            d="M 50 25 V 75"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                            markerEnd="url(#arrowhead)"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                             <AnimatePresence>
                                {log.some(l => l.type === 'observation') && (
                                     <motion.svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0">
                                         <motion.path
                                            d="M 55 75 C 80 60, 80 40, 55 25"
                                            stroke="hsl(var(--foreground))"
                                            strokeWidth="1.5"
                                            strokeDasharray="2 3"
                                            fill="none"
                                            markerEnd="url(#arrowhead-gray)"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                            <svg width="0" height="0">
                                <defs>
                                    <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="0" refY="1.75" orient="auto">
                                        <polygon points="0 0, 5 1.75, 0 3.5" fill="hsl(var(--primary))" />
                                    </marker>
                                     <marker id="arrowhead-gray" markerWidth="5" markerHeight="3.5" refX="0" refY="1.75" orient="auto">
                                        <polygon points="0 0, 5 1.75, 0 3.5" fill="hsl(var(--foreground))" />
                                    </marker>
                                </defs>
                            </svg>
                        </div>
                        
                        <GraphNode title="Tools" icon={<Calculator className="w-10 h-10 text-primary" />} active={activeNode === 'tools'} />
                    </div>

                    {/* Right side: The Trace */}
                    <div className="relative p-4 rounded-lg bg-background border">
                         <h3 className="text-sm font-semibold text-muted-foreground absolute top-4 left-4">Execution Trace</h3>
                         <div className="space-y-3 pt-10">
                            <AnimatePresence>
                                {log.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={cn("p-3 rounded-lg border text-sm", subTypeToBgColor[step.type!])}
                                    >
                                        <h4 className="font-semibold mb-1.5 flex items-center gap-2">
                                            {step.icon} {step.title}
                                        </h4>
                                        <p className="pl-8 text-muted-foreground">{step.content}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                         </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
