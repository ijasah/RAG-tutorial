
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GitBranch, Play, RefreshCw, ArrowRight, User, Bot, Search, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type NodeName = 'input' | 'agent' | 'tools' | 'output';
type Status = 'inactive' | 'active' | 'complete';

const FlowNode = ({ name, icon, status, description, result }: { name: string, icon: React.ReactNode, status: Status, description: string, result?: string }) => {
    const getStatusColor = () => {
        if (status === 'active') return 'border-amber-500 bg-amber-500/10';
        if (status === 'complete') return 'border-green-500 bg-green-500/10';
        return 'border-border bg-muted/40';
    }
    return (
        <motion.div
            layout
            className={cn("p-4 border rounded-lg w-full flex flex-col items-center text-center transition-colors duration-300 min-h-[120px] justify-center", getStatusColor())}
        >
            <div className="flex items-center gap-2 font-semibold">
                {icon} {name}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            <AnimatePresence>
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0, transition: {delay: 0.3} }}
                    className="mt-2 text-xs text-left text-muted-foreground p-2 bg-background rounded-md border w-full"
                >
                   <p className="font-bold text-primary">Data:</p>
                   <p className="whitespace-pre-wrap">{result}</p>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
    );
}

const FlowArrow = ({ active }: { active: boolean }) => (
    <AnimatePresence>
    {active && (
         <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 text-muted-foreground"
        >
            <ArrowRight />
        </motion.div>
    )}
    </AnimatePresence>
)

export const LangGraphSimulator = () => {
    const [step, setStep] = useState(0);

    const handleSimulate = () => {
        if (step > 0) {
            setStep(0);
            return;
        }
        // Use a loop with timeouts to advance steps automatically
        for (let i = 1; i <= 5; i++) {
            setTimeout(() => setStep(i), (i -1) * 1800);
        }
    }
    
    const isRunning = step > 0 && step < 5;

    const getStatus = (nodeStep: number, doneStep?: number): Status => {
        const currentActiveStep = Math.floor(step);
        if (currentActiveStep === nodeStep) return 'active';
        if (currentActiveStep >= (doneStep || nodeStep + 1)) return 'complete';
        return 'inactive';
    }

    const descriptions = {
        input: step >= 1 ? "What is LangGraph?" : "",
        agent1: step === 2 ? "Agent decides to use the search tool." : "",
        tools: step === 3 ? "Search Result: LangGraph is a library for building stateful, multi-actor applications with LLMs..." : "",
        agent2: step === 4 ? "Agent decides it has enough info to answer." : "",
        output: step >= 5 ? "LangGraph is a powerful library for creating complex, stateful AI agents by defining workflows as a graph." : "",
    }
    
    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GitBranch /> LangGraph Simulation
                </CardTitle>
                <CardDescription>
                    See how a request flows through a graph. Nodes represent actors (the agent or tools), and edges represent the connections between them. The cycle allows the agent to use tools and reason iteratively.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                     <Button onClick={handleSimulate} className="min-w-[150px]" disabled={isRunning}>
                        {isRunning ? 'Executing...' : (step === 0 ? <><Play className="mr-2" />Start Execution</> : <><RefreshCw className="mr-2" />Re-run</>)}
                    </Button>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                    {/* Main execution path */}
                    <div className="flex items-center justify-center gap-4 w-full">
                        <FlowNode name="User Input" icon={<User />} status={getStatus(1, 2)} description="The initial request." result={descriptions.input}/>
                        <FlowArrow active={step >= 2} />
                        <FlowNode name="Agent" icon={<Bot />} status={getStatus(2, 3)} description="The agent reasons about the input." result={descriptions.agent1} />
                        <FlowArrow active={step >= 3} />
                        <FlowNode name="Tools" icon={<Search />} status={getStatus(3, 4)} description="External tools are called for data." result={descriptions.tools} />
                    </div>

                    {/* Loop back arrow */}
                    <AnimatePresence>
                    {step >= 4 && (
                        <motion.div 
                            initial={{opacity: 0, pathLength: 0}} 
                            animate={{opacity: 1, pathLength: 1}} 
                            transition={{duration: 0.8, ease: "easeInOut"}}
                            className="w-full h-10"
                        >
                            <svg width="100%" height="40" viewBox="0 0 400 40">
                                <path 
                                    d="M 380 5 C 380 35, 20 35, 20 5" 
                                    stroke="hsl(var(--border))" 
                                    strokeWidth="2" 
                                    fill="transparent" 
                                    strokeDasharray="5 5" 
                                    markerStart="url(#arrow-start)"
                                />
                                <defs>
                                    <marker id="arrow-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--border))" />
                                    </marker>
                                </defs>
                            </svg>
                            <p className="text-xs text-muted-foreground text-center -mt-4">Observation</p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                    
                    {/* Second part of the flow */}
                     <div className="flex items-center justify-center gap-4 w-full">
                        <FlowNode name="Agent" icon={<Bot />} status={getStatus(4, 5)} description="Agent reasons again with new data." result={descriptions.agent2} />
                        <FlowArrow active={step >= 5} />
                        <FlowNode name="Final Output" icon={<FileText />} status={getStatus(5, 6)} description="A final answer is generated." result={descriptions.output} />
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
