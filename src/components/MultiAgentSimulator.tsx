"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, Search, Feather, Play, RefreshCw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type AgentName = 'Manager' | 'Researcher' | 'Writer';
type Status = 'idle' | 'working' | 'done';

const AgentNode = ({ name, icon, status, task, result }: { name: AgentName, icon: React.ReactNode, status: Status, task?: string, result?: string }) => {
    const getStatusColor = () => {
        if (status === 'working') return 'border-amber-500 bg-amber-500/10';
        if (status === 'done') return 'border-green-500 bg-green-500/10';
        return 'border-border bg-muted/40';
    }
    return (
        <motion.div 
            className={cn("p-4 border rounded-lg w-full flex flex-col items-center text-center transition-colors duration-300", getStatusColor())}
            initial={{opacity: 0.5}}
            animate={{opacity: 1}}
            layout
        >
            <div className="flex items-center gap-2 font-semibold">
                {icon} {name}
            </div>
            <AnimatePresence>
                {task && (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0, transition: {delay: 0.3} }}
                        className="mt-2 text-xs text-muted-foreground p-2 bg-background rounded-md border w-full"
                    >
                       <p className="font-bold">TASK:</p>
                       <p>{task}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {result && (
                     <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0, transition: {delay: 0.3} }}
                        className="mt-2 text-xs text-muted-foreground p-2 bg-background rounded-md border w-full"
                    >
                       <p className="font-bold text-primary">RESULT:</p>
                       <p>{result}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Arrow = ({ from, to, active, label }: { from: string, to: string, active: boolean, label?: string }) => (
    <AnimatePresence>
        {active && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <svg width="200" height="150" viewBox="0 0 200 150" className="overflow-visible">
                    <motion.path
                        d={
                            from === 'Manager' && to === 'Researcher' ? "M 0,75 L 200,0" :
                            from === 'Manager' && to === 'Writer' ? "M 0,75 L 200,150" :
                            from === 'Researcher' && to === 'Manager' ? "M 200,0 L 0,75" :
                            "M 200,150 L 0,75"
                        }
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </svg>
                {label && (
                    <motion.div
                        className="absolute top-0 left-0 text-primary bg-background px-1 py-0.5 rounded-md text-xs font-semibold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
                        style={
                           from === 'Manager' && to === 'Researcher' ? { top: '15px', left: '80px' } :
                           from === 'Manager' && to === 'Writer' ? { top: '110px', left: '80px' } :
                           from === 'Researcher' && to === 'Manager' ? { top: '15px', left: '80px' } :
                           { top: '110px', left: '80px' }
                        }
                    >{label}</motion.div>
                )}
            </motion.div>
        )}
    </AnimatePresence>
);

export const MultiAgentSimulator = () => {
    const [step, setStep] = useState(0);

    const handleSimulate = () => {
        if (step > 0) {
            setStep(0);
        }
        for (let i = 1; i <= 6; i++) {
            setTimeout(() => setStep(i), i * 1500);
        }
    };
    
    const isRunning = step > 0 && step < 6;

    const getStatus = (agent: AgentName, activeStep: number, doneStep?: number): Status => {
        if (step === activeStep) return 'working';
        if (step >= (doneStep || activeStep)) return 'done';
        return 'idle';
    }

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle>Multi-Agent Collaboration Simulator</CardTitle>
                <CardDescription>
                    Visualize how a team of specialized AI agents can collaborate to solve a complex task, such as writing a research report.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                     <Button onClick={handleSimulate} className="min-w-[120px]" disabled={isRunning}>
                        {isRunning ? 'Running...' : (step === 0 ? <><Play className="mr-2" />Start Simulation</> : <><RefreshCw className="mr-2" />Re-run</>)}
                    </Button>
                </div>
                
                <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-8 min-h-[350px] relative">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <AgentNode
                            name="Manager"
                            icon={<Briefcase />}
                            status={getStatus('Manager', 1, 6)}
                            task={step >= 1 ? "Write a report on Agentic AI benefits" : undefined}
                            result={step >= 6 ? "Report on Agentic AI benefits.md" : undefined}
                        />
                    </div>
                    
                    <div className="relative w-full h-full">
                         <Arrow from="Manager" to="Researcher" active={step === 2} label="Research Task"/>
                         <Arrow from="Researcher" to="Manager" active={step === 3} label="Findings"/>
                         <Arrow from="Manager" to="Writer" active={step === 4} label="Writing Task + Findings"/>
                         <Arrow from="Writer" to="Manager" active={step === 5} label="Draft Report"/>
                    </div>

                    <div className="flex flex-col items-center justify-between space-y-8 h-full">
                        <AgentNode
                            name="Researcher"
                            icon={<Search />}
                            status={getStatus('Researcher', 2, 3)}
                            task={step >= 2 ? "Find benefits of Agentic AI" : undefined}
                            result={step >= 3 ? "[Accuracy, Efficiency, ...]" : undefined}
                        />
                        <AgentNode
                            name="Writer"
                            icon={<Feather />}
                            status={getStatus('Writer', 4, 5)}
                            task={step >= 4 ? "Draft report from findings" : undefined}
                            result={step >= 5 ? "Draft_v1.md" : undefined}
                        />
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
