"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Search, MessageSquare, Sparkles, Play, Wand2, BrainCircuit, Eye, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const exampleQueries = [
    { value: "france-population", label: "Find the population of France in 2023." },
    { value: "cat-age-math", label: "What is the average age of a cat? Multiply it by 4." },
];

type AgentLog = {
    type: 'thought' | 'action' | 'observation' | 'answer';
    title: string;
    content: string;
    icon: React.ReactNode;
}

export const ReActSimulator = () => {
    const [selectedQuery, setSelectedQuery] = useState(exampleQueries[0].value);
    const [isRunning, setIsRunning] = useState(false);
    const [log, setLog] = useState<AgentLog[]>([]);

    const handleSimulate = () => {
        setIsRunning(true);
        setLog([]);

        const queryData = exampleQueries.find(q => q.value === selectedQuery);
        if (!queryData) return;

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

        if (queryData.value === 'france-population') {
            addLogEntry({ type: 'thought', title: "Thought", content: "I need to find the population of France in 2023. I should use a search tool for this." }, 500)
            .then(() => addLogEntry({ type: 'action', title: "Action", content: "Search('France population 2023')" }, 1200))
            .then(() => addLogEntry({ type: 'observation', title: "Observation", content: "Search tool returned: 'According to the World Bank, the population of France was approximately 65.8 million in 2023.'" }, 1200))
            .then(() => addLogEntry({ type: 'thought', title: "Thought", content: "I have found the answer. I can now provide the final response." }, 500))
            .then(() => addLogEntry({ type: 'answer', title: "Final Answer", content: "The population of France in 2023 was approximately 65.8 million." }, 1200))
            .finally(() => setIsRunning(false));
        } else if (queryData.value === 'cat-age-math') {
            addLogEntry({ type: 'thought', title: "Thought", content: "I need to find the average age of a cat and then multiply it by 4. First, I'll search for the age." }, 500)
            .then(() => addLogEntry({ type: 'action', title: "Action", content: "Search('average age of a cat')" }, 1200))
            .then(() => addLogEntry({ type: 'observation', title: "Observation", content: "Search tool returned: 'The average lifespan of a domestic cat is 15 years.'" }, 1200))
            .then(() => addLogEntry({ type: 'thought', title: "Thought", content: "Now I need to multiply 15 by 4. I will use the calculator tool." }, 500))
            .then(() => addLogEntry({ type: 'action', title: "Action", content: "Calculator(15 * 4)" }, 1200))
            .then(() => addLogEntry({ type: 'observation', title: "Observation", content: "Calculator returned: 60" }, 1200))
            .then(() => addLogEntry({ type: 'thought', title: "Thought", content: "I have the final result. I can now form the answer." }, 500))
            .then(() => addLogEntry({ type: 'answer', title: "Final Answer", content: "The average age of a cat (15 years) multiplied by 4 is 60." }, 1200))
            .finally(() => setIsRunning(false));
        }
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
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles /> ReAct Simulator
                </CardTitle>
                <CardDescription>
                    Watch how an agent uses the "Thought, Action, Observation" loop to solve multi-step problems.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-2">
                     <Select onValueChange={setSelectedQuery} defaultValue={selectedQuery} disabled={isRunning}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a task..." />
                        </SelectTrigger>
                        <SelectContent>
                            {exampleQueries.map((query) => (
                                <SelectItem key={query.value} value={query.value}>{query.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={!log.length ? handleSimulate : reset} className="min-w-[120px]" disabled={isRunning}>
                        {isRunning ? 'Running...' : (log.length === 0 ? <><Play className="mr-2" />Simulate</> : <><RefreshCw className="mr-2" />Reset</>)}
                    </Button>
                </div>

                <div className="space-y-4 min-h-[400px] bg-muted/30 p-4 rounded-lg border">
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
