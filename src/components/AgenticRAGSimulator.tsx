// src/components/AgenticRAGSimulator.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Search, MessageSquare, Sparkles, Play, Wand2, Database, HelpCircle } from 'lucide-react';

const exampleQueries = [
    { value: "What is the capital of France?", type: 'internal', label: "Simple QA (Internal): What is the capital of France?" },
    { value: "What is RAGAS?", type: 'search', label: "Simple QA (Search): What is RAGAS?" },
    { value: "Who is the CEO of Databricks?", type: 'reflect', label: "Self-Reflection: Who is the CEO of Databricks?" },
    { value: "What was the key finding of the original RAG paper and who were its authors?", type: 'multi_reflect', label: "Multi-Step: What is the key finding of the original RAG paper and who were its authors?" },
];

type AgentLog = {
    type: 'thought' | 'retrieval' | 'verification' | 'answer';
    title: string;
    content: string;
    icon: React.ReactNode;
}

export const AgenticRAGSimulator = () => {
    const [selectedQuery, setSelectedQuery] = useState(exampleQueries[0].value);
    const [isRunning, setIsRunning] = useState(false);
    const [log, setLog] = useState<AgentLog[]>([]);

    const handleSimulate = () => {
        setIsRunning(true);
        setLog([]);

        const queryData = exampleQueries.find(q => q.value === selectedQuery);
        if (!queryData) return;

        const { type } = queryData;

        const addLogEntry = (entry: Omit<AgentLog, 'icon'>, delay: number) => {
             return new Promise(resolve => {
                setTimeout(() => {
                    let icon;
                    switch (entry.type) {
                        case 'thought': icon = <Sparkles className="text-primary" />; break;
                        case 'retrieval': icon = <Database className="text-purple-400" />; break;
                        case 'verification': icon = <Search className="text-blue-400" />; break;
                        case 'answer': icon = <MessageSquare className="text-primary" />; break;
                    }
                    setLog(prev => [...prev, { ...entry, icon }]);
                    resolve(true);
                }, delay);
            });
        };

        if (type === 'internal') {
            addLogEntry({ type: 'thought', title: "Agent's Thought Process", content: "I know the answer to this question based on my internal knowledge. I don't need any tools." }, 1000)
            .then(() => addLogEntry({ type: 'answer', title: "Final Answer", content: "The capital of France is Paris." }, 1500));
        } else if (type === 'search') {
            addLogEntry({ type: 'thought', title: "Agent's Thought Process", content: "The user is asking about a specific or recent topic. I should use the search tool to get the latest information." }, 1000)
            .then(() => addLogEntry({ type: 'verification', title: "Verification Result", content: "According to web sources, RAGAS is a framework for evaluating RAG applications, focusing on metrics like faithfulness and answer relevance." }, 1500))
            .then(() => addLogEntry({ type: 'answer', title: "Final Answer", content: "Based on the search results, RAGAS is an evaluation framework for Retrieval-Augmented Generation systems." }, 2000));
        } else if (type === 'reflect') {
            addLogEntry({ type: 'thought', title: "Agent's Thought Process", content: "I should first check my internal knowledge base to answer this question." }, 1000)
            .then(() => addLogEntry({ type: 'retrieval', title: "Retrieved from Knowledge Base", content: "Internal document: Ali Ghodsi is a co-founder of Databricks." }, 1500))
            .then(() => addLogEntry({ type: 'thought', title: "Self-Reflection", content: "The retrieved information mentions he is a co-founder, but not explicitly the CEO. This could be outdated. I need to verify this using an external tool to be sure." }, 2000))
            .then(() => addLogEntry({ type: 'verification', title: "Verification Result", content: "Web search result: Ali Ghodsi is the current CEO of Databricks." }, 2000))
            .then(() => addLogEntry({ type: 'answer', title: "Final Answer", content: "Based on verified information, Ali Ghodsi is the CEO of Databricks." }, 2000));
        } else if (type === 'multi_reflect') {
            addLogEntry({ type: 'thought', title: "Agent's Thought Process", content: "This is a complex query. I'll break it down. First, I will search for the key finding of the RAG paper." }, 1000)
            .then(() => addLogEntry({ type: 'verification', title: "Search Result 1", content: "The key finding of the original RAG paper is that it significantly reduces hallucinations and improves factuality in LLMs by grounding them in external knowledge." }, 1500))
            .then(() => addLogEntry({ type: 'thought', title: "Self-Reflection", content: "Okay, I have the key finding. Now I need to find the authors. I will perform a second search." }, 2000))
            .then(() => addLogEntry({ type: 'verification', title: "Search Result 2", content: "The original RAG paper, 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', was authored by Patrick Lewis, Ethan Perez, and others at Facebook AI Research." }, 2000))
            .then(() => addLogEntry({ type: 'thought', title: "Final Synthesis", content: "I have both pieces of information now. I can combine them to form the final answer." }, 1500))
            .then(() => addLogEntry({ type: 'answer', title: "Final Answer", content: "The key finding of the original RAG paper was that it reduces hallucinations by grounding LLMs in external knowledge. The paper was authored by Patrick Lewis, Ethan Perez, and others at Facebook AI Research." }, 2000));
        }
    };

    const reset = () => {
        setIsRunning(false);
        setLog([]);
        setSelectedQuery(exampleQueries[0].value);
    }

    const getCardColor = (type: AgentLog['type']) => {
        switch (type) {
            case 'thought': return 'bg-muted/50';
            case 'retrieval': return 'bg-purple-500/10 border-purple-500/30';
            case 'verification': return 'bg-blue-500/10 border-blue-500/30';
            case 'answer': return 'bg-primary/10 border-primary/30';
            default: return 'bg-card';
        }
    }

    return (
        <Card className="bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot /> Agentic RAG Simulator
                </CardTitle>
                <CardDescription>
                    See how an AI agent decides which tools to use. It can use internal knowledge, perform searches, or even reflect on retrieved information and perform more actions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                     <Select onValueChange={setSelectedQuery} defaultValue={selectedQuery} disabled={isRunning}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a question..." />
                        </SelectTrigger>
                        <SelectContent>
                            {exampleQueries.map((query) => (
                                <SelectItem key={query.value} value={query.value}>{query.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={!isRunning ? handleSimulate : reset} className="min-w-[120px]">
                        {!isRunning ? <><Play className="mr-2" />Simulate</> : 'Reset'}
                    </Button>
                </div>

                <div className="space-y-4 min-h-[350px]">
                     <AnimatePresence>
                        {log.map((entry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                layout
                                className={`p-4 rounded-lg border ${getCardColor(entry.type)}`}
                            >
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                   {entry.icon} {entry.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">{entry.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};
