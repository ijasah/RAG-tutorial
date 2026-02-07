"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Search, MessageSquare, Sparkles, Play, Wand2, BrainCircuit, Eye, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type AgentLog = {
    type: 'thought' | 'action' | 'observation' | 'answer';
    title: string;
    content: string;
    icon: React.ReactNode;
}

export const LangGraphQuickstartSimulator = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [log, setLog] = useState<AgentLog[]>([]);

    const handleSimulate = () => {
        setIsRunning(true);
        setLog([]);

        const addLogEntry = (entry: Omit<AgentLog, 'icon'>, delay: number) => {
             return new Promise(resolve => {
                setTimeout(() => {
                    let icon;
                    switch (entry.type) {
                        case 'thought': icon = <BrainCircuit className="text-pink-400" />; break;
                        case 'action': icon = <Wand2 className="text-blue-400" />; break;
                        case 'observation': icon = <Eye className="text-purple-400" />; break;
                        case 'answer': icon = <MessageSquare className="text-primary" />; break;
                    }
                    setLog(prev => [...prev, { ...entry, icon }]);
                    resolve(true);
                }, delay);
            });
        };

        addLogEntry({ type: 'thought', title: "Agent Thought", content: "The user wants to add two numbers. I need to use the `add` tool." }, 500)
        .then(() => addLogEntry({ type: 'action', title: "Action", content: "Calling tool: add(a=3, b=4)" }, 1200))
        .then(() => addLogEntry({ type: 'observation', title: "Observation", content: "Tool returned: 7" }, 1200))
        .then(() => addLogEntry({ type: 'thought', title: "Agent Thought", content: "I have the result. I can now form the final answer." }, 500))
        .then(() => addLogEntry({ type: 'answer', title: "Final Answer", content: "The result of adding 3 and 4 is 7." }, 1200))
        .finally(() => setIsRunning(false));
    };

    const reset = () => {
        setIsRunning(false);
        setLog([]);
    }

    const getCardColor = (type: AgentLog['type']) => {
        switch (type) {
            case 'thought': return 'bg-pink-500/10 border-pink-500/30';
            case 'action': return 'bg-blue-500/10 border-blue-500/30';
            case 'observation': return 'bg-purple-500/10 border-purple-500/30';
            case 'answer': return 'bg-primary/10 border-primary/30';
            default: return 'bg-card';
        }
    }

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1 my-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles /> LangGraph Execution Flow
                </CardTitle>
                <CardDescription>
                    This simulation shows the step-by-step execution of the calculator agent for the query: "Add 3 and 4."
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center">
                    <Button onClick={!log.length ? handleSimulate : reset} className="min-w-[150px]" disabled={isRunning}>
                        {isRunning ? 'Running...' : (log.length === 0 ? <><Play className="mr-2" />Start Simulation</> : <><RefreshCw className="mr-2" />Reset</>)}
                    </Button>
                </div>

                <div className="space-y-4 min-h-[350px] bg-muted/30 p-4 rounded-lg border">
                     <AnimatePresence>
                        {log.map((entry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{delay: 0.1 * index}}
                                layout
                                className={cn("p-4 rounded-lg border", getCardColor(entry.type))}
                            >
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                   {entry.icon} {entry.title}
                                </h4>
                                <p className="text-sm text-muted-foreground pl-8">{entry.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};
