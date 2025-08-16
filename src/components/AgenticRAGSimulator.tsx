// src/components/AgenticRAGSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Search, MessageSquare, Sparkles, Play, Wand2, Database } from 'lucide-react';

const exampleQueries = [
    { value: "What is the capital of France?", type: 'internal', label: "What is the capital of France?" },
    { value: "What is RAGAS?", type: 'search', label: "What is RAGAS?" },
    { value: "Who is the CEO of Databricks?", type: 'reflect', label: "Who is the CEO of Databricks?" },
];

const AgenticRAGSimulator = () => {
    const [selectedQuery, setSelectedQuery] = useState(exampleQueries[0].value);
    const [agentState, setAgentState] = useState<'idle' | 'thinking' | 'retrieving' | 'reflecting' | 'verifying' | 'answering'>('idle');
    const [thought, setThought] = useState("");
    const [retrievedChunk, setRetrievedChunk] = useState("");
    const [verificationResult, setVerificationResult] = useState("");
    const [finalAnswer, setFinalAnswer] = useState("");

    const handleSimulate = () => {
        setAgentState('thinking');
        setThought("");
        setRetrievedChunk("");
        setVerificationResult("");
        setFinalAnswer("");

        const queryData = exampleQueries.find(q => q.value === selectedQuery);
        if (!queryData) return;

        const { type, value: query } = queryData;

        setTimeout(() => {
            if (type === 'internal') {
                setThought("I know the answer to this question based on my internal knowledge. I don't need any tools.");
                setTimeout(() => {
                    setAgentState('answering');
                    setFinalAnswer("The capital of France is Paris.");
                }, 1500);
            } else if (type === 'search') {
                setThought("The user is asking about a specific or recent topic. I should use the search tool to get the latest information.");
                setTimeout(() => {
                    setAgentState('verifying');
                    setVerificationResult("According to web sources, RAGAS is a framework for evaluating RAG applications, focusing on metrics like faithfulness and answer relevance.");
                    setTimeout(() => {
                        setAgentState('answering');
                        setFinalAnswer("Based on the search results, RAGAS is an evaluation framework for Retrieval-Augmented Generation systems.");
                    }, 2000);
                }, 1500);
            } else if (type === 'reflect') {
                setThought("The user is asking about a person. I should first check my internal knowledge base.");
                 setTimeout(() => {
                    setAgentState('retrieving');
                    setRetrievedChunk("Internal document: Ali Ghodsi is a co-founder of Databricks.");
                     setTimeout(() => {
                        setAgentState('reflecting');
                        setThought("The retrieved information mentions he is a co-founder, but not explicitly the CEO. This could be outdated. I need to verify this using an external tool to be sure.");
                        setTimeout(() => {
                            setAgentState('verifying');
                            setVerificationResult("Web search result: Ali Ghodsi is the current CEO of Databricks.");
                            setTimeout(() => {
                                setAgentState('answering');
                                setFinalAnswer("Based on verified information, Ali Ghodsi is the CEO of Databricks.");
                            }, 2000)
                        }, 2000);
                    }, 1500);
                }, 1000);
            }
        }, 1000);
    };

    const reset = () => {
        setAgentState('idle');
        setThought("");
        setRetrievedChunk("");
        setVerificationResult("");
        setFinalAnswer("");
        setSelectedQuery(exampleQueries[0].value);
    }

    return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot /> Agentic RAG Simulator
                </CardTitle>
                <CardDescription>
                    See how an AI agent decides which tools to use. It can use internal knowledge, perform a direct search, or even reflect on retrieved information and verify it.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                     <Select onValueChange={setSelectedQuery} defaultValue={selectedQuery} disabled={agentState !== 'idle'}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a question..." />
                        </SelectTrigger>
                        <SelectContent>
                            {exampleQueries.map((query) => (
                                <SelectItem key={query.value} value={query.value}>{query.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={agentState === 'idle' ? handleSimulate : reset} className="min-w-[120px]">
                        {agentState === 'idle' ? <><Play className="mr-2" />Simulate</> : 'Reset'}
                    </Button>
                </div>

                <AnimatePresence>
                    <div className="space-y-4 min-h-[350px]">
                        {agentState !== 'idle' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-muted/50 rounded-lg border">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Sparkles className="text-primary" /> Agent's Thought Process</h4>
                                <p className="text-sm text-muted-foreground italic">{thought}</p>
                            </motion.div>
                        )}

                        {retrievedChunk.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Database className="text-purple-400" /> Retrieved from Knowledge Base</h4>
                                <p className="text-sm text-muted-foreground">{retrievedChunk}</p>
                            </motion.div>
                        )}
                        
                        {agentState === 'reflecting' && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-center gap-2">
                                <Wand2 className="w-5 h-5 text-amber-400" />
                                <p className="text-sm text-amber-300">Reflecting on retrieved information...</p>
                            </motion.div>
                        )}

                        {verificationResult.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Search className="text-blue-400" /> Verification Result</h4>
                                <p className="text-sm text-muted-foreground">{verificationResult}</p>
                            </motion.div>
                        )}

                         {finalAnswer.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><MessageSquare className="text-primary" /> Final Answer</h4>
                                <p className="text-sm text-foreground">{finalAnswer}</p>
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

export { AgenticRAGSimulator };