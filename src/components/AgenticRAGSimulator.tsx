// src/components/AgenticRAGSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Search, MessageSquare, CornerDownLeft, Sparkles } from 'lucide-react';

const AgenticRAGSimulator = () => {
    const [query, setQuery] = useState("What is the capital of France?");
    const [agentState, setAgentState] = useState<'idle' | 'thinking' | 'searching' | 'answering' | 'complete'>('idle');
    const [thought, setThought] = useState("");
    const [searchResult, setSearchResult] = useState("");
    const [finalAnswer, setFinalAnswer] = useState("");

    const handleSimulate = () => {
        setAgentState('thinking');
        setThought("");
        setSearchResult("");
        setFinalAnswer("");

        const lowerCaseQuery = query.toLowerCase();
        // Determine if the query requires an external search.
        const needsSearch = lowerCaseQuery.includes("ragas") || lowerCaseQuery.includes("latest ai trends");

        setTimeout(() => {
            if (needsSearch) {
                // Path 1: Agent decides to use the search tool.
                setThought("The user is asking about a specific or recent topic. I should use the search tool to get the latest information.");
                setTimeout(() => {
                    setAgentState('searching');
                    // Simulate finding the information.
                    let resultText = "";
                    if (lowerCaseQuery.includes("ragas")) {
                        resultText = `According to web sources, RAGAS is a framework for evaluating RAG applications, focusing on metrics like faithfulness and answer relevance.`;
                    } else if (lowerCaseQuery.includes("latest ai trends")) {
                         resultText = `According to web sources, the latest AI trends include multimodal models and agentic workflows.`;
                    }
                    setSearchResult(resultText);
                    
                    setTimeout(() => {
                        setAgentState('answering');
                        // Generate the final answer based on the search result.
                        let answerText = "";
                         if (lowerCaseQuery.includes("ragas")) {
                            answerText = `Based on the search results, RAGAS is an evaluation framework for Retrieval-Augmented Generation systems, designed to measure the performance based on metrics like faithfulness and relevance.`;
                        } else if (lowerCaseQuery.includes("latest ai trends")) {
                            answerText = `Based on recent search results, some of the latest trends in AI include the development of advanced multimodal models that can process text, images, and audio, as well as the rise of sophisticated agentic AI workflows.`;
                        }
                        setFinalAnswer(answerText);
                        setTimeout(() => setAgentState('complete'), 500);
                    }, 2000);
                }, 1500);
            } else {
                // Path 2: Agent uses its internal knowledge.
                setThought("I know the answer to this question based on my internal knowledge. I don't need to use the search tool.");
                setTimeout(() => {
                    setAgentState('answering');
                    setFinalAnswer("The capital of France is Paris.");
                    setTimeout(() => setAgentState('complete'), 500);
                }, 1500);
            }
        }, 1000);
    };

    const reset = () => {
        setAgentState('idle');
        setThought("");
        setSearchResult("");
        setFinalAnswer("");
        setQuery("What is the capital of France?");
    }

    return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot /> Agentic RAG Simulator
                </CardTitle>
                <CardDescription>
                    See how an AI agent decides whether to use a search tool. Try asking "What is RAGAS?" or "What are the latest AI trends?" to see it use a tool, or "What is the capital of France?" to see it use its internal knowledge.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <Input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={agentState !== 'idle'}
                    />
                    <Button onClick={agentState === 'idle' ? handleSimulate : reset} className="min-w-[120px]">
                        {agentState === 'idle' ? <><CornerDownLeft className="mr-2" />Ask</> : 'Reset'}
                    </Button>
                </div>

                <AnimatePresence>
                    <div className="space-y-4 min-h-[200px]">
                        {agentState !== 'idle' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-muted/50 rounded-lg border">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Sparkles className="text-primary" /> Agent's Thought Process</h4>
                                <p className="text-sm text-muted-foreground italic">{thought}</p>
                            </motion.div>
                        )}
                        {agentState === 'searching' && searchResult.length === 0 && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 flex items-center gap-2">
                                <Search className="w-5 h-5 text-blue-400 animate-pulse" />
                                <p className="text-sm text-blue-300">Using search tool to find information...</p>
                            </motion.div>
                        )}
                        {searchResult.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Search className="text-green-400" /> Search Result</h4>
                                <p className="text-sm text-muted-foreground">{searchResult}</p>
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
