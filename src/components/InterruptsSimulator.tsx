"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Play, RefreshCw, UserCheck, ArrowRight, Hand, X, Check, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const GraphNode = ({ label, active, approved, rejected, className }: { label: string; active?: boolean; approved?: boolean; rejected?: boolean, className?: string; }) => (
    <motion.div
        layout
        className={cn(
            "border-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 w-32 text-center",
            "bg-card",
            active && "bg-primary/20 border-primary shadow-lg",
            approved && "bg-green-500/20 border-green-500 shadow-lg",
            rejected && "bg-destructive/20 border-destructive shadow-lg",
            className
        )}
    >
        {label}
    </motion.div>
);

const GraphArrow = ({ active }: { active?: boolean }) => (
    <motion.div layout className="flex justify-center items-center">
        <ArrowRight className={cn("w-6 h-6 text-muted-foreground/50 transition-colors", active && "text-primary")} />
    </motion.div>
);

export const InterruptsSimulator = () => {
    const [step, setStep] = useState(0); // 0: idle, 1: running, 2: paused, 3: approved, 4: rejected, 5: finished
    const isRunning = step > 0 && step < 5;

    const handleRun = () => {
        setStep(1);
        setTimeout(() => setStep(2), 1000);
    };

    const handleResume = (approved: boolean) => {
        if (approved) {
            setStep(3);
             setTimeout(() => setStep(5), 1000);
        } else {
            setStep(4);
            setTimeout(() => setStep(5), 1000);
        }
    };

    const handleReset = () => {
        setStep(0);
    };
    
    const interruptPayload = `{
  "__interrupt__": [
    {
      "value": {
        "question": "Do you approve this action?",
        "details": "Transfer $500"
      }
    }
  ]
}`;

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardContent className="pt-6 space-y-6">
                <div className="flex gap-2 justify-center">
                    <Button onClick={handleRun} disabled={step > 0}>
                        <Play className="mr-2" /> Run Graph
                    </Button>
                    <Button onClick={handleReset} variant="outline" disabled={step === 0}>
                        <RefreshCw className="mr-2" /> Reset
                    </Button>
                </div>
                
                {/* Graph Visualization */}
                <div className="bg-muted/30 p-4 rounded-lg border flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <GraphNode label="START" active={step === 1} />
                        <GraphArrow active={step === 1} />
                        <GraphNode label="Approval Node" active={step === 1 || step === 2} />
                    </div>
                     <AnimatePresence>
                    {step >= 2 && (
                         <motion.div 
                            initial={{opacity:0, height: 0}} 
                            animate={{opacity:1, height: 'auto'}} 
                            className="flex flex-col items-center gap-2 text-muted-foreground"
                        >
                            <Hand className="rotate-90"/>
                         </motion.div>
                    )}
                    </AnimatePresence>
                     <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                        <div className="flex flex-col items-end gap-2">
                            <GraphArrow active={step === 3} />
                            <GraphNode label="Proceed" approved={step === 3} />
                        </div>
                        
                        <div className="h-full w-px bg-border"></div>

                        <div className="flex flex-col items-start gap-2">
                            <GraphArrow active={step === 4} />
                            <GraphNode label="Cancel" rejected={step === 4} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2"><FileJson className="text-primary"/> Graph Output</h4>
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-48"
                            >
                                {step === 2 && (
                                    <div className="h-full">
                                        <p className="text-sm text-muted-foreground mb-2">Graph has paused. The payload from `interrupt()` is returned.</p>
                                        <CodeBlock code={interruptPayload} className="h-full text-xs" />
                                    </div>
                                )}
                                 {step > 2 && step < 5 && (
                                    <div className="flex items-center justify-center flex-col h-full bg-muted/40 border rounded-lg">
                                        <Badge variant={step === 3 ? "default" : "destructive"} className={cn(step===3 && "bg-green-600")}>
                                            {step === 3 ? "Resumed with: true" : "Resumed with: false"}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground mt-2">Graph execution continuing...</p>
                                    </div>
                                )}
                                {step === 5 && (
                                     <div className="flex items-center justify-center flex-col h-full bg-muted/40 border rounded-lg">
                                        <Check className="text-green-500 w-8 h-8 mb-2" />
                                        <p className="text-sm font-semibold">Graph Execution Finished</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2"><UserCheck className="text-primary"/> Human Input</h4>
                        <div className={cn("flex gap-2 p-4 h-48 border rounded-lg justify-center items-center", step !== 2 && "bg-muted/40")}>
                            {step === 2 ? (
                                <>
                                    <Button onClick={() => handleResume(true)} className="bg-green-600 hover:bg-green-700">
                                        <Check className="mr-2"/>Approve
                                    </Button>
                                    <Button onClick={() => handleResume(false)} variant="destructive">
                                        <X className="mr-2"/>Reject
                                    </Button>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">Waiting for graph to pause...</p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
