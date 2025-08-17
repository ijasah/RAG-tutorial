// src/components/RAGEcosystemDiagram.tsx
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookCopy, Bot, BrainCircuit, Boxes, CheckSquare, ChevronRight, Cpu, FileQuestion, Globe, HardDrive, Lightbulb, Puzzle, Recycle, Scale, Search, ShieldCheck, SlidersHorizontal, Sparkles, TestTube, Waypoints } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const badgeVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.05,
      }
    })
};

const DiagramCard = ({ title, icon, children, className, gridArea }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string, gridArea: string }) => (
    <motion.div variants={itemVariants} className="h-full" style={{ gridArea }}>
        <Card className={cn("h-full bg-card/50 border-border/50", className)}>
            <CardHeader className="p-3 pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                {children}
            </CardContent>
        </Card>
    </motion.div>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">{title}</h4>
        <div className="flex flex-wrap gap-1.5">
            {children}
        </div>
    </div>
);

const AnimatedBadge = ({ children, custom, className }: { children: React.ReactNode, custom: number, className?: string }) => (
    <motion.custom
        variants={badgeVariants}
        custom={custom}
        whileHover={{ y: -2, boxShadow: "0px 4px 12px hsla(var(--foreground), 0.1)" }}
    >
        <Badge variant="secondary" className={cn("text-xs font-normal border border-transparent transition-all", className)}>
            {children}
        </Badge>
    </motion.custom>
);

export const RAGEcosystemDiagram = () => {
    let badgeCounter = 0;
    
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto"
            style={{
                gridTemplateAreas: `
                    "ecosystem ecosystem prospect"
                    "paradigm techniques prospect"
                    "paradigm issues evaluation"
                    "paradigm issues evaluation"
                `
            }}
        >
            <DiagramCard title="RAG Ecosystem" icon={<Globe className="w-4 h-4 text-blue-400" />} gridArea="ecosystem">
                <div className="grid grid-cols-2 gap-4">
                    <Section title="Downstream Tasks">
                        {["Dialogue", "Question Answering", "Summarization", "Fact Verification"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </Section>
                    <Section title="Technology Stacks">
                         {["Langchain", "LlamaIndex", "FlowiseAI", "AutoGen"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </Section>
                </div>
            </DiagramCard>

            <DiagramCard title="The RAG Paradigm" icon={<Waypoints className="w-4 h-4 text-teal-400" />} gridArea="paradigm">
                 <div className="space-y-3">
                    <motion.div variants={itemVariants}>
                        <Card className="p-3 bg-muted/30">
                            <h5 className="font-semibold text-sm flex items-center gap-2"><BookCopy className="w-4 h-4"/> Naive RAG</h5>
                            <p className="text-xs text-muted-foreground mt-1">The simplest form: Retrieve -> Augment -> Generate.</p>
                        </Card>
                    </motion.div>
                     <motion.div variants={itemVariants} className="flex justify-center items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-muted-foreground"/>
                        <span className="text-xs font-semibold text-muted-foreground">Advanced RAG</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground"/>
                    </motion.div>
                     <motion.div variants={itemVariants}>
                        <Card className="p-3 bg-muted/30">
                            <h5 className="font-semibold text-sm flex items-center gap-2"><Boxes className="w-4 h-4"/> Modular RAG</h5>
                            <p className="text-xs text-muted-foreground mt-1">Breaks the pipeline into interchangeable modules (e.g., search, memory, fusion).</p>
                        </Card>
                    </motion.div>
                </div>
            </DiagramCard>
            
            <DiagramCard title="Techniques for Better RAG" icon={<Sparkles className="w-4 h-4 text-amber-400" />} gridArea="techniques">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                        "Chunk Optimization", "Iterative Retrieval", "Retriever Fine-tuning",
                        "Query Transformation", "Recursive Retrieval", "Generator Fine-tuning",
                        "Context Selection", "Adaptive Retrieval", "Dual Fine-tuning"
                    ].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                </div>
            </DiagramCard>
            
            <DiagramCard title="Key Issues of RAG" icon={<Lightbulb className="w-4 h-4 text-purple-400" />} gridArea="issues">
                 <div className="flex flex-col space-y-3 items-center justify-center h-full">
                    <AnimatedBadge custom={badgeCounter++} className="bg-rose-500/20 text-rose-200 p-2 text-sm">What to retrieve?</AnimatedBadge>
                    <AnimatedBadge custom={badgeCounter++} className="bg-indigo-500/20 text-indigo-200 p-2 text-sm">When to retrieve?</AnimatedBadge>
                    <AnimatedBadge custom={badgeCounter++} className="bg-teal-500/20 text-teal-200 p-2 text-sm">How to use retrieval?</AnimatedBadge>
                </div>
            </DiagramCard>

            <DiagramCard title="RAG Prospect" icon={<TestTube className="w-4 h-4 text-rose-400" />} gridArea="prospect">
                <div className="space-y-4">
                    <Section title="Challenges">
                         {["RAG in Long Context", "Hybrid", "Robustness", "Scaling-laws", "Production-ready"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </Section>
                     <Section title="Modality Extension">
                         {["Image", "Audio", "Video", "Code"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </Section>
                     <Section title="Ecosystem">
                         {["Customization", "Simplification", "Specialization"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </Section>
                </div>
            </DiagramCard>

             <DiagramCard title="Evaluation of RAG" icon={<ShieldCheck className="w-4 h-4 text-green-400" />} gridArea="evaluation">
                <div className="space-y-4">
                     <Section title="Evaluation Target">
                         {["Retrieval Quality", "Generation Quality"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </Section>
                     <Section title="Evaluation Aspects">
                        {["Answer Relevance", "Context Relevance", "Answer Faithfulness", "Noise Robustness", "Negation Rejection", "Info Integration", "Counterfactual Robustness"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </Section>
                     <Section title="Evaluation Framework">
                         {["Benchmarks", "Tools", "CRUD", "RGB", "RECALL", "TruLens", "RAGAS", "ARES"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </Section>
                </div>
            </DiagramCard>
        </motion.div>
    );
};
