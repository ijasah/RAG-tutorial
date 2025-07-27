"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search, Database, BrainCircuit, MessageSquare, RefreshCw, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    name: "Query",
    icon: <Search className="w-8 h-8" />,
    description: "User asks a question.",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    name: "Encode",
    icon: <BrainCircuit className="w-8 h-8" />,
    description: "Query is converted to a vector.",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    name: "Retrieve",
    icon: <Database className="w-8 h-8" />,
    description: "Search vector DB for similar documents.",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    name: "Augment",
    icon: <FileText className="w-8 h-8" />,
    description: "Relevant docs are added to the prompt.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  {
    name: "Generate",
    icon: <MessageSquare className="w-8 h-8" />,
    description: "LLM generates an informed response.",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
];

const Arrow = ({ active }: { active: boolean }) => (
  <motion.div
    className="w-16 h-1 text-muted-foreground hidden md:block"
    initial={{ opacity: 0 }}
    animate={{ opacity: active ? 1 : 0.3 }}
    transition={{ duration: 0.5 }}
  >
    <svg width="100%" height="100%" viewBox="0 0 64 4">
      <path d="M 0 2 L 64 2" stroke="currentColor" strokeWidth="2" strokeDasharray={active ? "0" : "4 4"} />
    </svg>
  </motion.div>
);

export const RAGFlowDiagram = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        setIsSimulating(false);
        return prev;
      });
    }, 1200);
  };
  
  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentStep(-1);
  };

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>How RAG Works: An Animated Flow</CardTitle>
        <CardDescription>
          This is a step-by-step visualization of the Retrieval-Augmented Generation process. Click "Start" to see it in action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          {steps.map((step, index) => (
            <>
              <motion.div
                key={step.name}
                className={cn(
                  "flex flex-col items-center text-center p-4 rounded-lg border w-full md:w-32 h-40 transition-colors duration-300",
                  currentStep >= index ? `${step.bgColor} ${step.color} border-current/50` : "bg-muted/50 border-transparent"
                )}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: currentStep >= index ? 1 : 0.9, opacity: currentStep >= index ? 1 : 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="mb-2">{step.icon}</div>
                <h4 className="font-bold text-sm">{step.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </motion.div>
              {index < steps.length - 1 && <Arrow active={currentStep > index} />}
            </>
          ))}
        </div>
        <div className="flex justify-center mt-8">
            <Button onClick={currentStep === -1 ? startSimulation : resetSimulation} disabled={isSimulating}>
                {isSimulating ? <RefreshCw className="mr-2 animate-spin" /> : (currentStep === -1 ? <Play className="mr-2"/> : <RefreshCw className="mr-2" />)}
                {isSimulating ? 'Simulating...' : (currentStep === -1 ? 'Start Simulation' : 'Reset')}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};
