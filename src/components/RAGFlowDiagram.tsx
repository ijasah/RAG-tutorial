"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Search, Database, BrainCircuit, MessageSquare, RefreshCw, Play, ArrowRight, ArrowLeft } from 'lucide-react';
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

    const handleStart = () => {
        setIsSimulating(true);
        setCurrentStep(1); // Move to the first step: Query
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            const nextStep = currentStep + 1;
            // Simulate data generation for the upcoming step
            if (nextStep === 2) { // Encode
                setEncodedQuery(Array.from({ length: 10 }, () => parseFloat(Math.random().toFixed(2))));
            } else if (nextStep === 3) { // Retrieve
                setRetrievedDocs([knowledgeBase[0], knowledgeBase[1]]);
            } else if (nextStep === 4) { // Augment
                const context = `Context:\n1. ${knowledgeBase[0].content}\n2. ${knowledgeBase[1].content}`;
                setAugmentedPrompt(`${context}\n\nQuestion: ${query}\n\nAnswer:`);
            } else if (nextStep === 5) { // Generate
                setFinalResponse("Based on the retrieved context, RAG stands for Retrieval-Augmented Generation, which is a technique to improve LLM accuracy. It often uses vector databases to store and query information.");
            }
            setCurrentStep(nextStep);
        }
    };
    
    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
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
                        <h3 className="font-semibold text-primary">1. User Query</h3>
                        <p className="text-sm text-muted-foreground">The process begins with a user's question. This query will be the input for the entire RAG pipeline.</p>
                        <div className="p-3 bg-muted/50 border rounded-md text-sm">{query}</div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-primary">2. Encoding</h3>
                        <p className="text-sm text-muted-foreground">The user's query is converted into a numerical representation (embedding) to capture its semantic meaning.</p>
                        {encodedQuery.length > 0 && <CodeBlock code={`[${encodedQuery.join(', ')}, ...]`} />}
                    </div>
                );
            case 3:
                return (
                     <div className="space-y-2">
                        <h3 className="font-semibold text-primary">3. Retrieval</h3>
                        <p className="text-sm text-muted-foreground">The query embedding is used to search the vector database for the most similar document chunks.</p>
                        {retrievedDocs.map(doc => (
                            <div key={doc.id} className="p-2 bg-muted/50 border rounded-md text-xs">{doc.content}</div>
                        ))}
                    </div>
                );
            case 4:
                 return (
                     <div className="space-y-2">
                        <h3 className="font-semibold text-primary">4. Augmentation</h3>
                        <p className="text-sm text-muted-foreground">The retrieved documents are added to the original query to form an "augmented prompt", providing rich context for the LLM.</p>
                        <CodeBlock code={augmentedPrompt} />
                    </div>
                );
            case 5:
                return (
                     <div className="space-y-2">
                        <h3 className="font-semibold text-primary">5. Generation</h3>
                        <p className="text-sm text-muted-foreground">The LLM uses the augmented prompt to generate a final, context-aware answer.</p>
                        <p className="p-3 bg-primary/10 border-primary/20 border rounded-md">{finalResponse}</p>
                    </div>
                );
            default:
                 return (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                        <p>Enter a query and click "Start Simulation" to begin.</p>
                    </div>
                 );
        }
    }

  return (
    <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
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
                disabled={isSimulating}
            />
            <Button onClick={isSimulating ? resetSimulation : handleStart} className="w-40">
                {isSimulating ? <RefreshCw />  : <><Play className="mr-2" />Start Simulation</>}
            </Button>
        </div>

        <div className="flex items-center justify-between">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center w-full">
                    <motion.div
                        className={cn("flex flex-col items-center text-center gap-2 transition-colors duration-300")}
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
                       <motion.div className="w-full h-1 mx-2 bg-border rounded-full">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: currentStep > index + 1 ? '100%' : '0%' }}
                                transition={{ duration: 0.5 }}
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
                className="p-4 border rounded-lg bg-muted/30 min-h-[250px] flex flex-col justify-center"
            >
               {renderStepContent()}
            </motion.div>
        </AnimatePresence>

        {isSimulating && (
            <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep <= 1}>
                    <ArrowLeft className="mr-2" /> Previous
                </Button>
                <Button onClick={handleNext} disabled={currentStep >= steps.length}>
                    Next <ArrowRight className="ml-2" />
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};
