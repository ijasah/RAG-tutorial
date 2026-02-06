"use client";

import { motion } from 'framer-motion';
import { BrainCircuit, BookOpen, Database, MessagesSquare, GanttChartSquare, Puzzle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const components = [
    {
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        title: "Large Language Model (LLM)",
        description: "The core engine, like GPT-4, providing advanced language understanding, reasoning, and generation."
    },
    {
        icon: <BookOpen className="w-8 h-8 text-primary" />,
        title: "Prompts",
        description: "Structured instructions that define the agent's role, capabilities, and task-specific goals."
    },
    {
        icon: <MessagesSquare className="w-8 h-8 text-primary" />,
        title: "Memory",
        description: "Enables agents to handle multi-step tasks by tracking short-term context and retaining long-term information."
    },
    {
        icon: <Database className="w-8 h-8 text-primary" />,
        title: "Knowledge Retrieval",
        description: "Allows agents to access real-time or domain-specific information from external sources like vector databases or APIs."
    },
    {
        icon: <GanttChartSquare className="w-8 h-8 text-primary" />,
        title: "Planning & Reasoning",
        description: "The ability to decompose complex problems into smaller subtasks and reflect on progress."
    },
    {
        icon: <Puzzle className="w-8 h-8 text-primary" />,
        title: "Tool Integration",
        description: "Expands capabilities by using external tools like search engines, calculators, or other APIs."
    }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export const AgentCoreComponents = () => {
    return (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {components.map((component) => (
                <motion.div key={component.title} variants={itemVariants}>
                    <Card className="h-full bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            {component.icon}
                            <CardTitle className="text-base font-semibold">{component.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{component.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
};
