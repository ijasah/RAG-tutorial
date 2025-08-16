// src/components/LLMToRAGTimeline.tsx
"use client";

import { motion } from 'framer-motion';
import { Brain, FileWarning, Lightbulb, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const timelineItems = [
    {
        icon: <Brain className="h-6 w-6 text-blue-400" />,
        title: "Standard Large Language Models (LLMs)",
        description: "LLMs are trained on vast datasets, making them incredibly knowledgeable and fluent in generating human-like text. They can write essays, translate languages, and answer a wide range of questions.",
        tags: ["Creative", "Fluent", "Broad Knowledge"],
        color: "blue",
    },
    {
        icon: <FileWarning className="h-6 w-6 text-red-400" />,
        title: "The Challenge: Static & Unreliable Knowledge",
        description: "LLM knowledge is frozen at the time of training, leading to outdated answers. They can also 'hallucinate'—confidently providing incorrect information—because they lack a grounding in real-time, verifiable facts.",
        tags: ["Outdated Info", "Hallucinations", "No Citations"],
        color: "red",
    },
    {
        icon: <Lightbulb className="h-6 w-6 text-green-400" />,
        title: "The Solution: Retrieval-Augmented Generation (RAG)",
        description: "RAG enhances LLMs by connecting them to external knowledge bases. Before generating a response, the system first retrieves relevant, up-to-date documents, providing the LLM with factual context to ground its answer.",
        tags: ["Up-to-Date", "Factual", "Reduces Hallucination"],
        color: "green",
    }
];

const TimelineCard = ({ item, index }: { item: any, index: number }) => (
    <motion.div
        className="flex items-start gap-4"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        viewport={{ once: true }}
    >
        <div className={`mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-${item.color}-500/10 border-2 border-${item.color}-500/30`}>
            {item.icon}
        </div>
        <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
        </div>
    </motion.div>
);

export const LLMToRAGTimeline = () => {
    return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle>From Potential to Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-12">
                    {/* Dotted line */}
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border/50" />

                    {timelineItems.map((item, index) => (
                        <TimelineCard key={index} item={item} index={index} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
