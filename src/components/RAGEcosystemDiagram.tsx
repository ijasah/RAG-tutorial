// src/components/RAGEcosystemDiagram.tsx
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const DiagramSection = ({ title, icon, children, className, gridArea }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string, gridArea?: string }) => (
    <motion.div variants={itemVariants} className="h-full" style={gridArea ? { gridArea } : {}}>
        <div className={cn("h-full bg-background/30 border-border p-4 rounded-3xl", className)}>
            <h3 className="font-semibold text-sm flex items-center gap-2 text-primary mb-3">
                {icon}
                {title}
            </h3>
            {children}
        </div>
    </motion.div>
);

const SubSection = ({title, children, className}: {title?: string, children: React.ReactNode, className?: string}) => (
    <div className={cn("bg-muted/40 p-3 rounded-2xl", className)}>
        {title && <h4 className="text-xs font-semibold text-muted-foreground mb-2">{title}</h4>}
        <div className="flex flex-wrap gap-1.5">
            {children}
        </div>
    </div>
)

const AnimatedBadge = ({ children, custom, className, size="default" }: { children: React.ReactNode, custom: number, className?: string, size?: "sm" | "default" }) => (
    <motion.custom
        variants={badgeVariants}
        custom={custom}
        whileHover={{ y: -2, boxShadow: "0px 2px 8px hsla(var(--foreground), 0.1)" }}
    >
        <Badge variant="secondary" className={cn("text-xs font-normal border-border/50 transition-all rounded-lg", size === 'sm' && "px-2 py-0.5", className)}>
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
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-4 auto-rows-auto"
        >
            <div className="lg:col-span-3 space-y-4">
                 <DiagramSection title="RAG Ecosystem" icon={<ChevronRight />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SubSection title="Downstream Tasks">
                            {["Dialogue", "Question answering", "Summarization", "Fact verification"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                        </SubSection>
                        <SubSection title="Technology Stacks">
                            {["Langchain", "LlamaIndex", "FlowiseAI", "AutoGen"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                        </SubSection>
                    </div>
                </DiagramSection>
                <DiagramSection title="The RAG Paradigm" icon={<ChevronRight />} className="flex flex-col justify-center">
                     <SubSection>
                        <div className="w-full flex items-center justify-around gap-2 py-4">
                            <AnimatedBadge custom={badgeCounter++} className="py-2 px-4 bg-background">Naive RAG</AnimatedBadge>
                            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                <ArrowRight className="w-4 h-4"/>
                                <span>Advanced RAG</span>
                                <ArrowRight className="w-4 h-4"/>
                            </div>
                            <AnimatedBadge custom={badgeCounter++} className="py-2 px-4 bg-background">Modular RAG</AnimatedBadge>
                        </div>
                     </SubSection>
                 </DiagramSection>
            </div>


            <div className="lg:col-span-2 space-y-4">
                <DiagramSection title="RAG Prospect" icon={<ChevronRight />}>
                    <div className="space-y-3">
                        <SubSection title="Challenges">
                            {["RAG in Long Context Length", "Hybrid", "Robustness", "Scaling-laws for RAG", "Production-ready RAG"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                        </SubSection>
                        <SubSection title="Modality Extension">
                            {["Image", "Audio", "Video", "Code"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                        </SubSection>
                        <SubSection title="Ecosystem">
                            {["Customization", "Simplification", "Specialization"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                        </SubSection>
                    </div>
                </DiagramSection>
                <DiagramSection title="Evaluation of RAG" icon={<ChevronRight />}>
                    <SubSection title="Evaluation Target">
                        {["Retrieval Quality", "Generation Quality"].map(item => <AnimatedBadge key={item} custom={badgeCounter++}>{item}</AnimatedBadge>)}
                    </SubSection>
                </DiagramSection>
            </div>
        </motion.div>
    );
};
