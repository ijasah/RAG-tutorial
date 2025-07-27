"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Search, Database, BrainCircuit, MessageSquare, RefreshCw, Play, CornerDownLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/code-block';

const steps = [
  { name: "Query", icon: <Search/>, description: "User asks a question." },
  { name: "Encode", icon: <BrainCircuit/>, description: "Query is converted to a vector." },
  { name: "Retrieve", icon: <Database/>, description: "Search vector DB for similar documents." },
  { name: "Augment", icon: <FileText/>, description: "Relevant docs are added to the prompt." },
  { name: "Generate", icon: <MessageSquare/>, description: "LLM generates an informed response." },
];

const knowledgeBase = [
    { id: 'doc1', content: 'RAG stands for Retrieval-Augmented Generation, a technique to improve LLM accuracy.' },
    { id: 'doc2', content: 'Vector databases like Pinecone or Weaviate are used to store and query embeddings.' },
    { id: 'doc3', content: 'Chunking is the process of breaking down large documents into smaller pieces.' },
];

export const RAGFlowDiagram = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [query, setQuery] = useState("What is RAG?");
    const [encodedQuery, setEncodedQuery] = useState<number[]>([]);
    const [retrievedDocs, setRetrievedDocs] = useState<{ id: string, content: string }[]>([]);
    const [augmentedPrompt, setAugmentedPrompt] = useState("");
    const [finalResponse, setFinalResponse] = useState("");
    const [isSimulating, setIsSimulating] = useState(false);

    const startSimulation = () => {
        setIsSimulating(true);
        setCurrentStep(1);

        // Step 1: Encode
        setTimeout(() => {
            setEncodedQuery(Array.from({ length: 10 }, () => parseFloat(Math.random().toFixed(2))));
            setCurrentStep(2);
        }, 1000);

        // Step 2: Retrieve
        setTimeout(() => {
            setRetrievedDocs([knowledgeBase[0], knowledgeBase[1]]);
            setCurrentStep(3);
        }, 2000);
        
        // Step 3: Augment
        setTimeout(() => {
            const context = `Context:\n1. ${knowledgeBase[0].content}\n2. ${knowledgeBase[1].content}`;
            setAugmentedPrompt(`${context}\n\nQuestion: ${query}\n\nAnswer:`);
            setCurrentStep(4);
        }, 3000);

        // Step 4: Generate
        setTimeout(() => {
            setFinalResponse("Based on the retrieved context, RAG stands for Retrieval-Augmented Generation, which is a technique to improve LLM accuracy. It often uses vector databases to store and query information.");
            setCurrentStep(5);
            setIsSimulating(false);
        }, 4000);
    };
  
    const resetSimulation = () => {
        setCurrentStep(0);
        setQuery("What is RAG?");
        setEncodedQuery([]);
        setRetrievedDocs([]);
        setAugmentedPrompt("");
        setFinalResponse("");
        setIsSimulating(false);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Encoding Query</h3>
                        <p className="text-sm text-muted-foreground">The user's query is converted into a numerical representation (embedding) to capture its semantic meaning.</p>
                        {encodedQuery.length > 0 && <CodeBlock code={`[${encodedQuery.join(', ')}, ...]`} />}
                    </div>
                );
            case 2:
                return (
                     <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Retrieving Documents</h3>
                        <p className="text-sm text-muted-foreground">The query embedding is used to search the vector database for the most similar document embeddings.</p>
                        {retrievedDocs.map(doc => (
                            <div key={doc.id} className="p-2 bg-muted/50 border rounded-md text-xs">{doc.content}</div>
                        ))}
                    </div>
                );
            case 3:
                 return (
                     <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Augmenting Prompt</h3>
                        <p className="text-sm text-muted-foreground">The retrieved documents are added to the original query to form an "augmented prompt", providing rich context for the LLM.</p>
                        <CodeBlock code={augmentedPrompt} />
                    </div>
                );
            case 4:
                return (
                     <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Generating Response</h3>
                        <p className="text-sm text-muted-foreground">The LLM uses the augmented prompt to generate a final, context-aware answer.</p>
                        <p className="p-3 bg-primary/10 border-primary/20 border rounded-md">{finalResponse}</p>
                    </div>
                );
            default:
                 return (
                    <div className="text-center text-muted-foreground">
                        <p>Enter a query and click "Simulate" to begin.</p>
                    </div>
                 );
        }
    }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Interactive RAG Simulation</CardTitle>
        <CardDescription>
          This is a step-by-step interactive simulation of the RAG process. Click through the steps to see how it works.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
            <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query..."
                disabled={currentStep > 0}
            />
            <Button onClick={currentStep > 0 ? resetSimulation : startSimulation} disabled={isSimulating} className="w-32">
                {isSimulating 
                    ? <RefreshCw className="animate-spin" /> 
                    : (currentStep > 0 ? 'Reset' : <><Play className="mr-2" />Simulate</>)
                }
            </Button>
        </div>

        <div className="flex items-center justify-between">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center w-full">
                    <motion.div
                        className={cn(
                        "flex flex-col items-center text-center gap-2 transition-colors duration-300",
                        )}
                        animate={{ opacity: currentStep > index ? 1 : 0.5 }}
                    >
                        <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all",
                            currentStep > index ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border"
                        )}>
                            {step.icon}
                        </div>
                        <span className="text-xs font-semibold">{step.name}</span>
                    </motion.div>

                    {index < steps.length - 1 && 
                       <motion.div 
                         className="w-full h-1 mx-2 bg-border rounded-full"
                         animate={{ 
                             background: currentStep > index + 1 ? 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)))' : 'linear-gradient(to right, hsl(var(--border)), hsl(var(--border)))'
                         }}
                       >
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: currentStep > index ? '100%' : '0%' }}
                                transition={{ duration: 0.5, delay: index * 1.0 }}
                            >
                            </motion.div>
                       </motion.div>
                    }
                </div>
            ))}
        </div>
        
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-lg bg-muted/30 min-h-[200px]"
            >
               {renderStepContent()}
            </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
