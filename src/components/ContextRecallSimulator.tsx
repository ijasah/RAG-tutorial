// src/components/ContextRecallSimulator.tsx
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
    llm_based: {
        name: "LLM-based Recall",
        description: "The LLM breaks the Ground Truth answer into 'claims' and checks if each claim is supported by the retrieved context. This evaluates the retriever's performance.",
        data: {
            question: "Who is the lead author of the RAG paper and where did they work?",
            retrieved_contexts: [
                "The RAG paper was authored by Patrick Lewis, Ethan Perez, and others at Facebook AI Research.",
                "Vector databases are used for efficient similarity search.",
            ],
            reference_answer: "The RAG paper's lead author is Patrick Lewis, who worked at Facebook AI Research.",
            claims: [
                { text: "Patrick Lewis is the lead author.", supported: true, reason: "The first context mentions Patrick Lewis as an author." },
                { text: "He worked at Facebook AI Research.", supported: true, reason: "The first context explicitly states he worked at Facebook AI Research." },
            ],
            analysis: [
                 { claim: 0, supported: true, reason: "The first context mentions Patrick Lewis as an author." },
                 { claim: 1, supported: true, reason: "The first context explicitly states he worked at Facebook AI Research." },
            ]
        }
    },
    non_llm_based: {
        name: "Similarity-based Recall",
        description: "This method checks how many of the ground-truth 'reference contexts' were successfully retrieved, using a similarity score.",
        data: {
            question: "What are RAG and Vector DBs?",
            retrieved_contexts: [
                "RAG combines retrieval and generation.",
                "Pinecone is a type of vector database."
            ],
            reference_contexts: [
                "RAG stands for Retrieval-Augmented Generation.", // Retrieved (similar)
                "Vector databases store embeddings for search.", // Missed
                "Pinecone is a popular vector DB solution."      // Retrieved (similar)
            ],
            analysis: [
                { chunk: 0, retrieved: true, reason: "A similar context was found." },
                { chunk: 1, retrieved: false, reason: "No matching context was retrieved." },
                { chunk: 2, retrieved: true, reason: "A similar context was found." },
            ],
        }
    }
};

type ScenarioKey = keyof typeof scenarios;

const ClaimCard = ({ claim, isEvaluated }: { claim: any, isEvaluated: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
            opacity: 1,
            y: 0,
            borderColor: isEvaluated ? (claim.supported ? 'hsl(var(--primary))' : 'hsl(var(--destructive))') : 'hsl(var(--border))',
            backgroundColor: isEvaluated ? (claim.supported ? 'hsla(var(--primary), 0.1)' : 'hsla(var(--destructive), 0.1)') : 'transparent',
        }}
        transition={{ duration: 0.4 }}
        className="p-3 rounded-lg border-2"
    >
         <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{claim.text}</p>
            <AnimatePresence>
            {isEvaluated && (
                 <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                    className="flex items-center gap-2 pl-4"
                >
                     {claim.supported ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
                 </motion.div>
            )}
            </AnimatePresence>
        </div>
    </motion.div>
);

const ReferenceContextCard = ({ context, analysis, isEvaluated }: { context: any, analysis: any, isEvaluated: boolean }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
            opacity: 1,
            y: 0,
            borderColor: isEvaluated ? (analysis.retrieved ? 'hsl(var(--primary))' : 'hsl(var(--destructive))') : 'hsl(var(--border))',
            backgroundColor: isEvaluated ? (analysis.retrieved ? 'hsla(var(--primary), 0.1)' : 'hsla(var(--destructive), 0.1)') : 'transparent',
        }}
        transition={{ duration: 0.4 }}
        className="p-3 rounded-lg border-2"
    >
        <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{context}</p>
            <AnimatePresence>
            {isEvaluated && (
                 <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
                    className="flex items-center gap-2 pl-4"
                >
                    {analysis.retrieved ? <Badge>Retrieved</Badge> : <Badge variant="destructive">Missed</Badge>}
                 </motion.div>
            )}
            </AnimatePresence>
        </div>
    </motion.div>
);


export const ContextRecallSimulator = () => {
  const [activeTab, setActiveTab] = useState<ScenarioKey>('llm_based');
  const [evaluatedItems, setEvaluatedItems] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const activeScenario = scenarios[activeTab];
  
  const score = useMemo(() => {
    if (activeTab === 'llm_based') {
        if (evaluatedItems.length === 0 && activeScenario.data.analysis.length > 0) return 0;
        const supportedCount = evaluatedItems.map(i => activeScenario.data.analysis[i]).filter(a => a.supported).length;
        const totalClaims = activeScenario.data.analysis.length;
        if(totalClaims === 0) return 0;
        return supportedCount / totalClaims;
    } else {
        if (evaluatedItems.length === 0 && activeScenario.data.analysis.length > 0) return 0;
        const retrievedCount = evaluatedItems.map(i => activeScenario.data.analysis[i]).filter(a => a.retrieved).length;
        const totalContexts = activeScenario.data.analysis.length;
         if(totalContexts === 0) return 0;
        return retrievedCount / totalContexts;
    }
  }, [evaluatedItems, activeScenario, activeTab]);

  const handleSimulate = () => {
    setIsRunning(true);
    setEvaluatedItems([]);
    
    const items = activeTab === 'llm_based' ? activeScenario.data.analysis : activeScenario.data.reference_contexts;
    items.forEach((_, index) => {
        setTimeout(() => {
            setEvaluatedItems(prev => [...prev, index]);
            if (index === items.length - 1) {
                setIsRunning(false);
            }
        }, (index + 1) * 1000);
    });
  }

  const handleReset = () => {
      setIsRunning(false);
      setEvaluatedItems([]);
  }

  const handleTabChange = (value: string) => {
      handleReset();
      setActiveTab(value as ScenarioKey);
  }

  const formula = activeTab === 'llm_based' 
    ? `score = (Attributed Claims) / (Total Claims) = ${activeScenario.data.analysis.filter((a,i) => evaluatedItems.includes(i) && a.supported).length} / ${activeScenario.data.analysis.length} = ${score.toFixed(2)}`
    : `score = (Retrieved Reference Contexts) / (Total Reference Contexts) = ${activeScenario.data.analysis.filter((a,i) => evaluatedItems.includes(i) && a.retrieved).length} / ${activeScenario.data.analysis.length} = ${score.toFixed(2)}`;

  return (
    <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle>Context Recall Simulator</CardTitle>
        <CardDescription>
          This metric evaluates the **Retriever**. It measures if the retrieved context was sufficient to support all the claims in the **ground truth answer**. High recall means we aren't missing important facts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="llm_based">LLM-based</TabsTrigger>
            <TabsTrigger value="non_llm_based">Similarity-based</TabsTrigger>
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
                   <CodeBlock className="text-left !bg-background/50" code={formula} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Inputs */}
                    <div className="space-y-4">
                         <Card>
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><Database className="text-primary"/>Retrieved Contexts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                               {(activeScenario.data.retrieved_contexts as string[]).map((c, i) => <p key={i} className="p-2 bg-muted/50 rounded-md border text-sm">{c}</p>)}
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2"><FileText className="text-primary"/>Ground Truth</CardTitle>
                            </CardHeader>
                             <CardContent>
                                {activeTab === 'llm_based' && <p className="text-sm">{(activeScenario.data as any).reference_answer}</p>}
                                {activeTab === 'non_llm_based' && <div className="space-y-2">{(activeScenario.data as any).reference_contexts.map((c: string, i: number) => (<p key={i} className="p-2 bg-muted/50 rounded-md border text-sm">{c}</p>))}</div>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Analysis */}
                     <div className="space-y-4">
                         <Card className="sticky top-24">
                            <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2"><BrainCircuit className="text-primary"/>Recall Analysis</CardTitle>
                                 <CardDescription>Each part of the ground truth is checked against the retrieved context. Click "Run" to start.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {activeTab === 'llm_based' && activeScenario.data.claims.map((claim, index) => (
                                     <ClaimCard
                                        key={index}
                                        claim={claim}
                                        isEvaluated={evaluatedItems.includes(index)}
                                    />
                                ))}
                                {activeTab === 'non_llm_based' && activeScenario.data.reference_contexts.map((context, index) => (
                                     <ReferenceContextCard
                                        key={index}
                                        context={context}
                                        analysis={activeScenario.data.analysis[index]}
                                        isEvaluated={evaluatedItems.includes(index)}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
                 <div className="flex justify-center mt-6 pt-4 border-t">
                     <Button onClick={!isRunning ? handleSimulate : handleReset} className="w-40">
                         {!isRunning && evaluatedItems.length === 0 && <><Play className="mr-2" />Run Evaluation</>}
                         {isRunning && 'Evaluating...'}
                         {!isRunning && evaluatedItems.length > 0 && <><RefreshCw className="mr-2" />Re-run</>}
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

    