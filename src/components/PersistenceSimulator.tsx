"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CodeBlock } from '@/components/ui/code-block';
import { Play, RefreshCw, Layers, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const checkpointData = [
    { values: "{'foo': '', 'bar': []}", next: "('node_a',)", step: "Input" },
    { values: "{'foo': 'a', 'bar': ['a']}", next: "('node_b',)", step: "After Node A" },
    { values: "{'foo': 'b', 'bar': ['a', 'b']}", next: "()", step: "After Node B" },
];

const CheckpointNode = ({ data, isLast }: { data: any, isLast: boolean }) => (
    <div className="flex items-center">
        <Popover>
            <PopoverTrigger asChild>
                <motion.div 
                    className="p-3 border-2 rounded-lg bg-card cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -2 }}
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">{data.step}</span>
                    </div>
                </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Checkpoint State</h4>
                        <p className="text-sm text-muted-foreground">
                            A snapshot of the agent's memory at this step.
                        </p>
                    </div>
                    <div className="text-xs">
                        <p className="font-bold">Values:</p>
                        <CodeBlock code={data.values} className="text-[10px] p-2"/>
                        <p className="font-bold mt-2">Next Node:</p>
                        <CodeBlock code={data.next} className="text-[10px] p-2"/>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
        {!isLast && <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition:{delay: 0.3}}} className="w-16 h-0.5 bg-border mx-2" />}
    </div>
);

export const PersistenceSimulator = () => {
    const [threads, setThreads] = useState<{ id: number; checkpoints: any[] }[]>([]);

    const handleAddThread = () => {
        const newThreadId = threads.length + 1;
        setThreads(prev => [...prev, { id: newThreadId, checkpoints: [] }]);

        checkpointData.forEach((cp, index) => {
            setTimeout(() => {
                setThreads(prev => prev.map(t => 
                    t.id === newThreadId ? { ...t, checkpoints: [...t.checkpoints, cp] } : t
                ));
            }, (index + 1) * 700);
        });
    };

    const handleReset = () => {
        setThreads([]);
    };

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle>Persistence Simulation: Threads & Checkpoints</CardTitle>
                <CardDescription>
                    Visualize how LangGraph persists agent state. Each "Thread" is a separate conversation. Each "Checkpoint" is a snapshot of the agent's memory, enabling features like human-in-the-loop, time travel, and memory.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 justify-center p-4 border-b mb-4">
                    <Button onClick={handleAddThread}>
                        <Play className="mr-2" /> Run New Thread
                    </Button>
                    <Button variant="outline" onClick={handleReset} disabled={threads.length === 0}>
                        <RefreshCw className="mr-2" /> Reset
                    </Button>
                </div>

                <div className="space-y-4 min-h-[300px]">
                    <AnimatePresence>
                        {threads.map((thread) => (
                            <motion.div
                                key={thread.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Layers className="text-primary"/>
                                            Thread ID: {thread.id}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center flex-wrap gap-y-4">
                                         <AnimatePresence>
                                            {thread.checkpoints.map((cp, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center"
                                                >
                                                   <CheckpointNode data={cp} isLast={index === thread.checkpoints.length - 1} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {threads.length === 0 && (
                        <div className="flex items-center justify-center text-muted-foreground h-full min-h-[200px]">
                            <p>Click "Run New Thread" to start a simulation.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
