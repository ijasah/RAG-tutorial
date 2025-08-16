// src/components/RAGEnhancementTechniques.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GitBranch, Lightbulb, Search, Database, Brain, Sparkles, Wand2, BrainCircuit, CornerDownLeft } from 'lucide-react';
import { HypotheticalQuestionsSimulator } from './HypotheticalQuestionsSimulator';
import { HydeSimulator } from './HydeSimulator';
import { SubQuerySimulator } from './SubQuerySimulator';
import { StepbackPromptSimulator } from './StepbackPromptSimulator';
import { HierarchicalIndexSimulator } from './HierarchicalIndexSimulator';
import { HybridRetrieveSimulator } from './HybridRetrieveSimulator';
import { SentenceWindowSimulator } from './SentenceWindowSimulator';
import { MetadataFilteringSimulator } from './MetadataFilteringSimulator';


const techniqueCategories = [
    {
        icon: <Search className="h-5 w-5 text-blue-400" />,
        title: "Query Enhancement",
        description: "Improve the user's query before retrieval. This includes expanding it, correcting typos, or breaking it into smaller pieces.",
        value: "query-enhancement",
    },
    {
        icon: <Database className="h-5 w-5 text-green-400" />,
        title: "Indexing Enhancement",
        description: "Improve the quality of the data being searched. This involves better data cleanup, parsing, and chunking strategies.",
        value: "indexing-enhancement",
    },
    {
        icon: <GitBranch className="h-5 w-5 text-amber-400" />,
        title: "Retriever Enhancement",
        description: "Go beyond simple vector search. This can involve using multiple retrievers (e.g., keyword and semantic) and merging the results.",
        value: "retriever-enhancement",
    },
    {
        icon: <Brain className="h-5 w-5 text-rose-400" />,
        title: "Generator Enhancement",
        description: "Improve the final answer generation. This involves advanced prompt engineering or using a more powerful, fine-tuned LLM.",
        value: "generator-enhancement",
    }
];

const queryEnhancementMethods = [
    {
        title: "Sub-Query Generation",
        value: "sub-query",
        component: <SubQuerySimulator />
    },
    {
        title: "Hypothetical Questions",
        value: "hypothetical-questions",
        component: <HypotheticalQuestionsSimulator />
    },
    {
        title: "HyDE (Hypothetical Document Embeddings)",
        value: "hyde",
        component: <HydeSimulator />
    },
    {
        title: "Step-back Prompting",
        value: "step-back",
        component: <StepbackPromptSimulator />
    }
];

const indexingEnhancementMethods = [
    {
        title: "Hierarchical Index",
        value: "hierarchical-index",
        component: <HierarchicalIndexSimulator />
    }
];

const retrieverEnhancementMethods = [
    {
        title: "Hybrid Retrieve & Rerank",
        value: "hybrid-retrieve",
        component: <HybridRetrieveSimulator />
    },
    {
        title: "Sentence Window Retrieval",
        value: "sentence-window",
        component: <SentenceWindowSimulator />
    },
    {
        title: "Meta-data Filtering",
        value: "metadata-filtering",
        component: <MetadataFilteringSimulator />
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
                    <Accordion type="multiple" className="w-full space-y-2" defaultValue={[]}>
                        {techniqueCategories.map((category) => (
                             <AccordionItem key={category.value} value={category.value} className="border-b-0">
                                <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {category.icon}
                                        <span className="font-medium">{category.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 text-muted-foreground space-y-4">
                                     <p className="text-sm px-2">{category.description}</p>
                                    
                                     {category.value === 'query-enhancement' && (
                                         <Accordion type="single" collapsible className="w-full space-y-2">
                                            {queryEnhancementMethods.map((method) => (
                                                 <AccordionItem key={method.value} value={method.value} className="border-b-0">
                                                    <AccordionTrigger className="p-3 text-sm bg-muted/40 hover:bg-muted/60 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                           <CornerDownLeft className="w-4 h-4" /> 
                                                           {method.title}
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-4">
                                                        {method.component}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                     )}

                                     {category.value === 'indexing-enhancement' && (
                                         <Accordion type="single" collapsible className="w-full space-y-2">
                                            {indexingEnhancementMethods.map((method) => (
                                                 <AccordionItem key={method.value} value={method.value} className="border-b-0">
                                                    <AccordionTrigger className="p-3 text-sm bg-muted/40 hover:bg-muted/60 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                           <CornerDownLeft className="w-4 h-4" /> 
                                                           {method.title}
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-4">
                                                        {method.component}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                     )}

                                     {category.value === 'retriever-enhancement' && (
                                         <Accordion type="single" collapsible className="w-full space-y-2">
                                            {retrieverEnhancementMethods.map((method) => (
                                                 <AccordionItem key={method.value} value={method.value} className="border-b-0">
                                                    <AccordionTrigger className="p-3 text-sm bg-muted/40 hover:bg-muted/60 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                           <CornerDownLeft className="w-4 h-4" /> 
                                                           {method.title}
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-4">
                                                        {method.component}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                     )}
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
