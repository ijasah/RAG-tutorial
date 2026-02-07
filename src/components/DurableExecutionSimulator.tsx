"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/ui/code-block';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Play, RefreshCw, Zap, History, Server, Code, AlertTriangle, Check, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const problemCode = `import requests

def get_time(state: dict):
    # This external API call is a side-effect
    # and is not wrapped in a @task.
    response = requests.get(
        "https://worldtimeapi.org/api/ip"
    )
    # On resume, this function runs again,
    # fetching a NEW time.
    return {"time": response.json()["datetime"]}`;

const solutionCode = `import requests
from langgraph.func import task

@task
def get_time_task(state: dict):
    # This external API call is now wrapped
    # in a @task decorator.
    response = requests.get(
        "https://worldtimeapi.org/api/ip"
    )
    # On resume, LangGraph uses the result
    # from the checkpoint, ensuring consistency.
    return {"time": response.json()["datetime"]}`;


const SimulationBox = ({ title, code, isSolution = false }: { title: string, code: string, isSolution?: boolean }) => {
    const [status, setStatus] = useState<'idle' | 'running' | 'crashed' | 'resumed'>('idle');
    const [run1Time, setRun1Time] = useState<string | null>(null);
    const [run2Time, setRun2Time] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getTime = async () => {
        setIsLoading(true);
        // Simulate network delay and return a local timestamp to avoid network errors.
        await new Promise(resolve => setTimeout(resolve, 500));
        const time = new Date().toISOString();
        setIsLoading(false);
        return time;
    };
    
    const handleRun = async () => {
        setStatus('running');
        const time = await getTime();
        setRun1Time(time);
        setRun2Time(null);
        setTimeout(() => setStatus('crashed'), 1000);
    };

    const handleResume = async () => {
        setStatus('resumed');
        if (isSolution) {
            setRun2Time(run1Time); // Load from "checkpoint"
        } else {
            const time = await getTime();
            setRun2Time(time); // Re-run the side-effect
        }
    };
    
    const handleReset = () => {
        setStatus('idle');
        setRun1Time(null);
        setRun2Time(null);
    }

    const ResultCard = ({ run, time, isReplayed }: {run: number, time: string | null, isReplayed?: boolean}) => (
        <AnimatePresence>
        {time && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <h4 className="font-semibold text-sm">Run {run} Output:</h4>
                <div className="p-3 bg-background border rounded-lg text-sm font-mono flex justify-between items-center">
                    <span>{time}</span>
                    {isReplayed && <Badge variant="secondary" className="flex items-center gap-1.5"><History size={14}/> Replayed</Badge>}
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    );

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <CodeBlock code={code} />
                </div>
                <div className="flex flex-col gap-4">
                     <div className="flex justify-center gap-2">
                        <Button onClick={handleRun} disabled={status !== 'idle'}>
                            <Play size={16}/> Run
                        </Button>
                         <Button onClick={handleResume} variant="outline" disabled={status !== 'crashed'}>
                            <RefreshCw size={16}/> Resume
                        </Button>
                         <Button onClick={handleReset} variant="ghost" disabled={status === 'idle'}>
                            Reset
                        </Button>
                    </div>

                    <div className="p-4 border bg-muted/40 rounded-lg min-h-[200px] space-y-4">
                        <ResultCard run={1} time={run1Time} />
                        
                        <AnimatePresence>
                        {status === 'crashed' && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex items-center justify-center gap-2 p-3 text-destructive border-2 border-dashed border-destructive/50 rounded-lg bg-destructive/10"
                            >
                                <Zap size={16} /> <span className="font-semibold">Workflow Crashed!</span>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        
                        <ResultCard run={2} time={run2Time} isReplayed={isSolution && status === 'resumed'} />
                        
                         <AnimatePresence>
                         {status === 'resumed' && run1Time && run2Time && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {run1Time !== run2Time ? (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Inconsistent State!</AlertTitle>
                                        <AlertDescription>
                                            The side-effect (API call) was re-executed on resume, producing a different result. This breaks determinism.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                     <Alert className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <AlertTitle>Consistent State!</AlertTitle>
                                        <AlertDescription>
                                            The result of the `@task` was loaded from the checkpoint, ensuring the resumed workflow is identical to the first run.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </motion.div>
                         )}
                         </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const DurableExecutionSimulator = () => {
    return (
        <Tabs defaultValue="problem" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="problem">The Problem</TabsTrigger>
                <TabsTrigger value="solution">The Solution</TabsTrigger>
            </TabsList>
            <TabsContent value="problem" className="mt-4">
                <SimulationBox title="Problem: Inconsistent Replay" code={problemCode} />
            </TabsContent>
            <TabsContent value="solution" className="mt-4">
                 <SimulationBox title="Solution: Using @task for Side-Effects" code={solutionCode} isSolution />
            </TabsContent>
        </Tabs>
    );
};
