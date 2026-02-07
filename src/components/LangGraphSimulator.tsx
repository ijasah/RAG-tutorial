"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, User, Bot, Search, MessageSquare, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/code-block';

type NodeStatus = 'inactive' | 'active' | 'complete';

const FlowNode = ({ title, icon, status, children, cardClassName }: { title: string, icon: React.ReactNode, status: NodeStatus, children: React.ReactNode, cardClassName?: string }) => {
    const getStatusColor = () => {
        if (status === 'active') return 'border-amber-500 bg-amber-500/10';
        if (status === 'complete') return 'border-green-500/30 bg-green-500/10';
        return 'border-border bg-muted/40';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("p-4 border rounded-lg w-full transition-colors duration-300", getStatusColor(), cardClassName)}
        >
            <div className="flex items-center gap-3 font-semibold mb-3">
                {icon}
                {title}
            </div>
            <div className="text-xs text-muted-foreground space-y-2">
                {children}
            </div>
        </motion.div>
    );
};

const Edge = ({ active }: { active: boolean }) => (
    <AnimatePresence>
        {active &&
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center my-2">
                <ArrowRight className="w-6 h-6 text-muted-foreground/50 transform -rotate-90" />
            </motion.div>
        }
    </AnimatePresence>
);

const CurveEdge = ({ active }: { active: boolean }) => (
     <AnimatePresence>
        {active &&
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-full top-1/2 ml-4 h-[110%] w-24 border-r-2 border-b-2 border-t-2 border-dashed border-muted-foreground rounded-r-full"
            >
                <ArrowRight className="absolute bottom-[-10px] left-0 w-4 h-4 text-muted-foreground/80"/>
             </motion.div>
        }
    </AnimatePresence>
)


const simulationSteps = [
    {
        nodes: {
            input: { status: 'active', data: "What is the most popular brand of headphones?" },
            agent: { status: 'inactive' },
            tools: { status: 'inactive' },
            output: { status: 'inactive' },
        },
        description: "Execution starts with the user's input."
    },
    {
        nodes: {
            input: { status: 'complete' },
            agent: { status: 'active', data: "Thought: I need to find popular headphones. I should use a search tool." },
            tools: { status: 'inactive' },
            output: { status: 'inactive' },
        },
        description: "The Agent node receives the input and begins its reasoning process."
    },
     {
        nodes: {
            input: { status: 'complete' },
            agent: { status: 'complete', data: "Thought: I need to find popular headphones. I should use a search tool." },
            tools: { status: 'active', data: "Action: search('popular headphones')" },
            output: { status: 'inactive' },
        },
        description: "The Agent decides to use a tool to gather external information."
    },
     {
        nodes: {
            input: { status: 'complete' },
            agent: { status: 'active', data: "Observation: The search tool returned 'Sony WH-1000XM5'.\nThought: Now I need to check the stock for this model." },
            tools: { status: 'complete', data: "Observation: 'Sony WH-1000XM5'" },
            output: { status: 'inactive' },
        },
        description: "The output (observation) from the tool is sent back to the Agent, creating a loop."
    },
    {
        nodes: {
            input: { status: 'complete' },
            agent: { status: 'complete', data: "Observation: The search tool returned 'Sony WH-1000XM5'.\nThought: Now I need to check the stock for this model." },
            tools: { status: 'active', data: "Action: check_inventory('Sony WH-1000XM5')" },
            output: { status: 'inactive' },
        },
        description: "The Agent reasons again and decides to call another tool to check inventory."
    },
     {
        nodes: {
            input: { status: 'complete' },
            agent: { status: 'active', data: "Observation: 'In stock'.\nThought: I have all the information. I can form the final answer." },
            tools: { status: 'complete', data: "Observation: 'In stock'" },
            output: { status: 'inactive' },
        },
        description: "The observation loops back to the Agent for final reasoning."
    },
    {
        nodes: {
            input: { status: 'complete' },
            agent: { status: 'complete' },
            tools: { status: 'complete' },
            output: { status: 'active', data: "The most popular headphone brand is Sony, and the WH-1000XM5 model is currently in stock." },
        },
        description: "The agent has enough information and sends the final answer to the Output node."
    },
];


export const LangGraphSimulator = () => {
    const [step, setStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        setStep(0);
        
        simulationSteps.forEach((_, i) => {
            setTimeout(() => {
                setStep(i);
                if (i === simulationSteps.length - 1) {
                    setIsRunning(false);
                }
            }, i * 2000);
        });
    };
    
    const handleReset = () => {
        setIsRunning(false);
        setStep(0);
    }

    const currentSimStep = simulationSteps[step];

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit /> LangGraph Execution Flow
                </CardTitle>
                <CardDescription>
                    {currentSimStep.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                     <Button onClick={step === 0 ? handleRun : handleReset} className="min-w-[150px]" disabled={isRunning}>
                        {isRunning ? 'Executing...' : (step === 0 ? <><Play className="mr-2" />Start Execution</> : <><RefreshCw className="mr-2" />Re-run</>)}
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-8">
                    <div className="space-y-2 flex flex-col">
                        <FlowNode title="Input" icon={<User />} status={currentSimStep.nodes.input.status}>
                            <p className="font-semibold text-foreground">Query:</p>
                            <AnimatePresence mode="wait">
                                {currentSimStep.nodes.input.data && <motion.p initial={{opacity:0}} animate={{opacity:1}}>{currentSimStep.nodes.input.data}</motion.p>}
                            </AnimatePresence>
                        </FlowNode>
                        <Edge active={step >= 1} />
                        <FlowNode title="Agent" icon={<Bot />} status={currentSimStep.nodes.agent.status}>
                             <p className="font-semibold text-foreground">Data:</p>
                             <AnimatePresence mode="wait">
                                {currentSimStep.nodes.agent.data && <motion.div initial={{opacity:0}} animate={{opacity:1}}><CodeBlock code={currentSimStep.nodes.agent.data} className="!p-2" /></motion.div>}
                            </AnimatePresence>
                        </FlowNode>
                         <Edge active={step >= 6} />
                         <FlowNode title="Output" icon={<MessageSquare />} status={currentSimStep.nodes.output.status}>
                            <p className="font-semibold text-foreground">Final Answer:</p>
                             <AnimatePresence mode="wait">
                                {currentSimStep.nodes.output.data && <motion.p initial={{opacity:0}} animate={{opacity:1}}>{currentSimStep.nodes.output.data}</motion.p>}
                            </AnimatePresence>
                        </FlowNode>
                    </div>

                    <div className="relative flex items-center">
                        <CurveEdge active={step === 3 || step === 5} />
                        <FlowNode title="Tools" icon={<Search />} status={currentSimStep.nodes.tools.status} cardClassName="min-h-[200px]">
                           <p className="font-semibold text-foreground">Data:</p>
                            <AnimatePresence mode="wait">
                               {currentSimStep.nodes.tools.data && <motion.div initial={{opacity:0}} animate={{opacity:1}}><CodeBlock code={currentSimStep.nodes.tools.data} className="!p-2" /></motion.div>}
                           </AnimatePresence>
                        </FlowNode>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
