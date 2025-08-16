// src/components/ContextPrecisionSimulator.tsx
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, Check, X, FileText, Search, BrainCircuit, Bot, Database, MessageSquare, Play, RefreshCw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { CodeBlock } from './ui/code-block';
import { Badge } from './ui/badge';

const scenarios = {
    llm_vs_response: {
        name: "LLM vs. Response",
        description: "An LLM compares each retrieved context chunk against the final generated answer to determine relevance.",
        data: {
            question: "What is RAG?",
            retrieved_contexts: [
                "RAG stands for Retrieval-Augmented Generation.",
                "The sky is blue.",
                "A vector database stores embeddings."
            ],
            response: "RAG (Retrieval-Augmented Generation) is a technique for improving LLM accuracy.",
            analysis: [
                { chunk: 0, relevant: true, reason: "This chunk directly defines the acronym in the response." },
                { chunk: 1, relevant: false, reason: "This chunk is completely unrelated to the response." },
                { chunk: 2, relevant: false, reason: "While related to the RAG ecosystem, this chunk isn't used in the final response." },
            ],
        }
    },
    llm_vs_reference: {
        name: "LLM vs. Reference Answer",
        description: "An LLM compares each retrieved chunk against a pre-written, ground-truth 'reference' answer.",
         data: {
            question: "What is RAG?",
            retrieved_contexts: [
                "RAG stands for Retrieval-Augmented Generation.",
                "The sky is blue.",
                "A vector database stores embeddings."
            ],
            reference_answer: "Retrieval-Augmented Generation (RAG) is a technique that grounds Large Language Models in external knowledge sources to improve factual accuracy.",
            analysis: [
                 { chunk: 0, relevant: true, reason: "This chunk is directly supported by the reference answer." },
                 { chunk: 1, relevant: false, reason: "This chunk is completely irrelevant to the reference answer." },
                 { chunk: 2, relevant: true, reason: "This chunk explains a key component (vector DBs for knowledge sources) mentioned in the reference." },
            ],
        }
    },
    non_llm_vs_reference: {
        name: "Similarity vs. Reference Contexts",
        description: "This method avoids an LLM for evaluation. Instead, it calculates a similarity score (e.g., cosine similarity) between each retrieved chunk and a set of ground-truth 'reference contexts'.",
        data: {
            question: "What is RAG?",
            retrieved_contexts: [
                { text: "RAG stands for Retrieval-Augmented Generation.", score: 0.95 },
                { text: "The sky is blue.", score: 0.05 },
                { text: "A vector database stores embeddings.", score: 0.75 },
            ],
            reference_contexts: [
                "Retrieval-Augmented Generation is a method to enhance LLMs.",
                "RAG uses vector databases for information retrieval."
            ],
             analysis: [
                 { chunk: 0, relevant: true, reason: "High similarity score with the reference contexts." },
                 { chunk: 1, relevant: false, reason: "Very low similarity score." },
                 { chunk: 2, relevant: true, reason: "High similarity score with the reference contexts." },
            ],
        }
    }
};

type ScenarioKey = keyof typeof scenarios;

const ChunkCard = ({ chunk, analysis, isNonLLM, isEvaluated }: { chunk: any, analysis: any, isNonLLM: boolean, isEvaluated: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
            opacity: 1,
            y: 0,
            borderColor: isEvaluated ? (analysis.relevant ? 'hsl(var(--primary))' : 'hsl(var(--destructive))') : 'hsl(var(--border))',
            backgroundColor: isEvaluated ? (analysis.relevant ? 'hsla(var(--primary), 0.1)' : 'hsla(var(--destructive), 0.1)') : 'transparent',
        }}
        transition={{ duration: 0.4 }}
        className="p-3 rounded-lg border-2"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium">{isNonLLM ? chunk.text : chunk}</p>
                 <AnimatePresence>
                {isEvaluated && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                        className="text-xs text-muted-foreground mt-1"
                    >
                        {analysis.reason}
                    </motion.p>
                )}
                </AnimatePresence>
            </div>
             <AnimatePresence>
            {isEvaluated && (
                 <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                    className="flex items-center gap-2 pl-4"
                >
                     {isNonLLM && <Badge variant={analysis.relevant ? 'default' : 'destructive'} className={cn(analysis.relevant && 'bg-green-600')}>{chunk.score.toFixed(2)}</Badge>}
                     {analysis.relevant ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
                 </motion.div>
            )}
            </AnimatePresence>
        </div>
    </motion.div>
);

export const ContextPrecisionSimulator = () => {
  const [activeTab, setActiveTab] = useState<ScenarioKey>('llm_vs_response');
  const [evaluatedChunks, setEvaluatedChunks] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const activeScenario = scenarios[activeTab];
  const isNonLLM = activeTab === 'non_llm_vs_reference';
  
  const score = useMemo(() => {
    if (evaluatedChunks.length === 0) return 0;
    const relevantCount = evaluatedChunks.map(i => activeScenario.data.analysis[i]).filter(a => a.relevant).length;
    return relevantCount / evaluatedChunks.length;
  }, [evaluatedChunks, activeScenario]);

  const handleSimulate = () => {
    setIsRunning(true);
    setEvaluatedChunks([]);
    
    const chunks = activeScenario.data.retrieved_contexts;
    chunks.forEach((_, index) => {
        setTimeout(() => {
            setEvaluatedChunks(prev => [...prev, index]);
            if (index === chunks.length - 1) {
                setIsRunning(false);
            }
        }, (index + 1) * 1000);
    });
  }

  const handleReset = () => {
      setIsRunning(false);
      setEvaluatedChunks([]);
  }

  const handleTabChange = (value: string) => {
      handleReset();
      setActiveTab(value as ScenarioKey);
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Context Precision Simulator</CardTitle>
        <CardDescription>
          Explore methods for calculating Context Precision, which measures the signal-to-noise ratio of retrieved context. High precision means the context is focused and relevant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="llm_vs_response">LLM (vs. Response)</TabsTrigger>
            <TabsTrigger value="llm_vs_reference">LLM (vs. Reference)</TabsTrigger>
            <TabsTrigger value="non_llm_vs_reference">Similarity-based</TabsTrigger>
          </TabsList>
            <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value={activeTab} className="mt-4">
                 <div className="p-4 mb-6 bg-muted/40 rounded-lg border text-center space-y-2">
                  <h3 className="text-lg font-semibold text-primary">{activeScenario.name}</h3>
                  <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{activeScenario.description}</p>
                   <CodeBlock className="text-left !bg-background/50" code={`# Formula: (Sum of Relevant Chunks) / (Total Retrieved Chunks)
score = ${activeScenario.data.analysis.filter((a,i) => evaluatedChunks.includes(i) && a.relevant).length} / ${evaluatedChunks.length} = ${score.toFixed(2)}`} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Inputs */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><HelpCircle className="text-primary"/>User Input</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{activeScenario.data.question}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><Database className="text-primary"/>Retrieved Contexts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                               {isNonLLM ? 
                                 (activeScenario.data.retrieved_contexts as any[]).map((c, i) => <p key={i} className="p-2 bg-muted/50 rounded-md border text-sm">{c.text}</p>) :
                                 (activeScenario.data.retrieved_contexts as string[]).map((c, i) => <p key={i} className="p-2 bg-muted/50 rounded-md border text-sm">{c}</p>)
                               }
                            </CardContent>
                        </Card>

                        {/* Ground Truth Column */}
                        <Card>
                             <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2"><FileText className="text-primary"/>Ground Truth</CardTitle>
                            </CardHeader>
                             <CardContent>
                                {activeTab === 'llm_vs_response' && <p className="text-sm">{(activeScenario.data as any).response}</p>}
                                {activeTab === 'llm_vs_reference' && <p className="text-sm">{(activeScenario.data as any).reference_answer}</p>}
                                {activeTab === 'non_llm_vs_reference' && <div className="space-y-2">{(activeScenario.data as any).reference_contexts.map((c: string, i: number) => (<p key={i} className="p-2 bg-muted/50 rounded-md border text-sm">{c}</p>))}</div>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Analysis */}
                     <div className="space-y-4">
                         <Card className="sticky top-24">
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="text-primary"/>Relevance Analysis</CardTitle>
                                 <CardDescription>Each retrieved chunk is evaluated for relevance against the target. Click "Run" to start.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(isNonLLM ? activeScenario.data.retrieved_contexts as any[] : activeScenario.data.retrieved_contexts as string[]).map((chunk, index) => (
                                    <ChunkCard
                                        key={index}
                                        chunk={chunk}
                                        analysis={activeScenario.data.analysis[index]}
                                        isNonLLM={isNonLLM}
                                        isEvaluated={evaluatedChunks.includes(index)}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
                 <div className="flex justify-center mt-6 pt-4 border-t">
                     <Button onClick={!isRunning ? handleSimulate : handleReset} className="w-40">
                         {!isRunning && evaluatedChunks.length === 0 && <><Play className="mr-2" />Run Evaluation</>}
                         {isRunning && 'Evaluating...'}
                         {!isRunning && evaluatedChunks.length > 0 && <><RefreshCw className="mr-2" />Re-run</>}
                     </Button>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
};
