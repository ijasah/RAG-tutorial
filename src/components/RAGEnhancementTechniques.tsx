// src/components/RAGEnhancementTechniques.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GitBranch, Lightbulb, Search, Database, Brain, Sparkles, Wand2, BrainCircuit } from 'lucide-react';
import { HypotheticalQuestionsSimulator } from './HypotheticalQuestionsSimulator';
import { HydeSimulator } from './HydeSimulator';
import { Separator } from './ui/separator';
import { SubQuerySimulator } from './SubQuerySimulator';

const divideAndConquerTechniques = [
    {
        icon: <Search className="h-5 w-5 text-blue-400" />,
        title: "Query Enhancement",
        content: "Improves the user's query before it hits the retrieval system. This can involve expanding the query with synonyms, correcting typos, or using advanced techniques like generating hypothetical documents or questions that the query might be asking.",
    },
    {
        icon: <Database className="h-5 w-5 text-green-400" />,
        title: "Indexing Enhancement",
        content: "Focuses on improving the quality of the data that the retriever searches through. This includes data cleanup, using a better text parser, and implementing more sophisticated chunking strategies (like semantic chunking).",
    },
    {
        icon: <GitBranch className="h-5 w-5 text-amber-400" />,
        title: "Retriever Enhancement",
        content: "Goes beyond simple vector search. This can involve using multiple retrievers (e.g., one for keywords, one for semantics) and then merging the results with a hybrid search strategy to get the best of both worlds.",
    },
    {
        icon: <Brain className="h-5 w-5 text-rose-400" />,
        title: "Generator Enhancement",
        content: "Improves the final answer generation. This involves advanced prompt engineering techniques to better guide the LLM, or using a more powerful, fine-tuned LLM for the generation step.",
    }
];

export const RAGEnhancementTechniques = () => {
    return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 /> Advanced RAG Strategies
                </CardTitle>
                <CardDescription>
                    Explore sophisticated techniques to boost the performance and accuracy of your RAG system.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Divide & Conquer
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        These techniques break down the RAG process into smaller parts and optimize each one individually.
                    </p>
                    <Accordion type="multiple" className="w-full" defaultValue={['query-enhancement']}>
                        <AccordionItem value="query-enhancement">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <Search className="h-5 w-5 text-blue-400" />
                                    <span className="font-medium">Query Enhancement</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-4 pr-1 pt-4 text-muted-foreground space-y-4">
                                <p className="text-sm">
                                    Improve the user's query before it hits the retrieval system. This can involve expanding the query, correcting typos, or using advanced techniques like generating hypothetical questions or breaking the query into smaller pieces.
                                </p>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                     <AccordionItem value="sub-query">
                                        <AccordionTrigger className="p-4 bg-muted/30 rounded-lg">Method: Sub-Query Generation</AccordionTrigger>
                                        <AccordionContent className="pt-4">
                                             <SubQuerySimulator />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="hypothetical-questions">
                                        <AccordionTrigger className="p-4 bg-muted/30 rounded-lg">Method: Hypothetical Questions</AccordionTrigger>
                                        <AccordionContent className="pt-4">
                                             <HypotheticalQuestionsSimulator />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="hyde">
                                        <AccordionTrigger className="p-4 bg-muted/30 rounded-lg">Method: HyDE (Hypothetical Document Embeddings)</AccordionTrigger>
                                        <AccordionContent className="pt-4">
                                             <HydeSimulator />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                        {divideAndConquerTechniques.slice(1).map((item, index) => (
                            <AccordionItem key={index} value={`item-${index+1}`}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span className="font-medium">{item.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pl-10 text-muted-foreground">
                                    {item.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="pt-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Thinking Outside the Box
                    </h3>
                     <p className="text-sm text-muted-foreground mb-4">
                        This approach re-imagines the role of the retriever itself.
                    </p>
                    <Card className="bg-muted/40 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-3">
                                <BrainCircuit className="h-5 w-5 text-purple-400" />
                                Agentic RAG
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Instead of just retrieving information, what if the model could use other tools? Agentic RAG gives the model the ability to decide *if* it needs to search, and what other actions it might take, like calling an API or running code. This is a move towards more autonomous, intelligent systems.
                            </p>
                        </CardContent>
                    </Card>
                </div>

            </CardContent>
        </Card>
    );
};
