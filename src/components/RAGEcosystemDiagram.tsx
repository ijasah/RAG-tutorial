// src/components/RAGEcosystemDiagram.tsx
"use client";

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const Section = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <motion.div variants={itemVariants} className={cn("w-full", className)}>
        <h3 className="font-semibold text-sm flex items-center gap-1.5 text-blue-500 mb-3">
            <ChevronRight className="w-5 h-5" />
            {title}
        </h3>
        {children}
    </motion.div>
);

const SubSection = ({ title, children, className }: { title?: string, children: React.ReactNode, className?: string }) => (
    <div className={className}>
        {title && <h4 className="text-xs font-semibold text-muted-foreground mb-2">{title}</h4>}
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    </div>
);

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.div 
        variants={itemVariants} 
        whileHover={{ y: -2, boxShadow: "0px 4px 10px hsla(var(--primary), 0.1)"}}
        className={cn("bg-white dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg px-3 py-1.5 text-xs text-center", className)}>
        {children}
    </motion.div>
);

const DashedContainer = ({children, className}: {children: React.ReactNode, className?:string}) => (
    <motion.div variants={itemVariants} className={cn("border-2 border-dashed border-blue-300/50 dark:border-blue-800/50 rounded-2xl p-4 space-y-6", className)}>
        {children}
    </motion.div>
)

export const RAGEcosystemDiagram = () => {
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="w-full bg-blue-50 dark:bg-blue-950/10 border border-blue-200/50 dark:border-blue-900/50 rounded-3xl p-6"
        >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-3 space-y-6">
                    <Section title="RAG Ecosystem">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4">
                            <SubSection title="Downstream Tasks">
                                <Badge>Dialogue</Badge>
                                <Badge>Question answering</Badge>
                                <Badge>Summarization</Badge>
                                <Badge>Fact verification</Badge>
                            </SubSection>
                             <div className="border-l border-blue-200 dark:border-blue-800/30"></div>
                            <SubSection title="Technology Stacks">
                                <Badge>Langchain</Badge>
                                <Badge>Llamalndex</Badge>
                                <Badge>FlowiseAI</Badge>
                                <Badge>AutoGen</Badge>
                            </SubSection>
                        </div>
                    </Section>

                    <DashedContainer className="bg-blue-100/30 dark:bg-blue-950/20">
                        <Section title="The RAG Paradigm">
                            <div className="bg-white dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4 flex items-center justify-around text-sm font-medium">
                                <Badge>Naive RAG</Badge>
                                <motion.div variants={itemVariants} className="flex items-center gap-1 text-muted-foreground"><ChevronRight className="w-4 h-4"/> Advanced RAG <ChevronRight className="w-4 h-4"/></motion.div>
                                <Badge>Modular RAG</Badge>
                            </div>
                        </Section>
                    </DashedContainer>

                    <DashedContainer className="bg-yellow-50/30 dark:bg-yellow-950/10 border-yellow-300/50 dark:border-yellow-800/30">
                        <Section title="Techniques for Better RAG">
                             <div className="grid grid-cols-3 gap-2">
                                <Badge>Chunk Optimization</Badge>
                                <Badge>Iterative Retrieval</Badge>
                                <Badge>Retriever Fine-tuning</Badge>
                                <Badge>Query Transformation</Badge>
                                <Badge>Recursive Retrieval</Badge>
                                <Badge>Generator Fine-tuning</Badge>
                                <Badge>Context Selection</Badge>
                                <Badge>Adaptive Retrieval</Badge>
                                <Badge>Dual Fine-tuning</Badge>
                             </div>
                        </Section>
                    </DashedContainer>

                     <DashedContainer className="bg-purple-50/30 dark:bg-purple-950/10 border-purple-300/50 dark:border-purple-800/30">
                        <Section title="Key Issues of RAG">
                            <div className="relative flex justify-center items-center h-16">
                                <motion.div 
                                    variants={itemVariants}
                                    className="absolute flex items-center justify-center w-32 h-16 bg-pink-200/50 dark:bg-pink-500/10 text-pink-800 dark:text-pink-200 rounded-full blur-sm" style={{ transform: 'translateX(-30%) rotate(-10deg)'}} />
                                <motion.div 
                                    variants={itemVariants}
                                    className="absolute flex items-center justify-center w-32 h-16 bg-purple-200/50 dark:bg-purple-500/10 text-purple-800 dark:text-purple-200 rounded-full blur-sm" style={{ transform: 'translateX(0%) rotate(5deg)'}} />
                                <motion.div 
                                    variants={itemVariants}
                                    className="absolute flex items-center justify-center w-32 h-16 bg-blue-200/50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-200 rounded-full blur-sm" style={{ transform: 'translateX(30%) rotate(-5deg)'}} />

                                 <div className="absolute flex justify-around w-full text-xs font-semibold">
                                     <motion.p variants={itemVariants}>What to retrieve</motion.p>
                                     <motion.p variants={itemVariants}>When to retrieve</motion.p>
                                     <motion.p variants={itemVariants}>How to use Retrieval</motion.p>
                                 </div>
                            </div>
                        </Section>
                     </DashedContainer>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Section title="RAG Prospect">
                         <div className="grid grid-cols-1 md:grid-cols-[1.2fr,auto,1fr,auto,1fr] gap-4">
                            <SubSection title="Challenges">
                                <Badge>RAG in Long Context Length</Badge>
                                <Badge>Hybrid</Badge>
                                <Badge>Robustness</Badge>
                                <Badge>Scaling-laws for RAG</Badge>
                                <Badge>Production-ready RAG</Badge>
                            </SubSection>
                             <div className="border-l border-blue-200 dark:border-blue-800/30"></div>
                            <SubSection title="Modality Extension">
                                <Badge>Image</Badge>
                                <Badge>Audio</Badge>
                                <Badge>Video</Badge>
                                <Badge>Code</Badge>
                            </SubSection>
                             <div className="border-l border-blue-200 dark:border-blue-800/30"></div>
                             <SubSection title="Ecosystem">
                                <Badge>Customization</Badge>
                                <Badge>Simplification</Badge>
                                <Badge>Specialization</Badge>
                            </SubSection>
                        </div>
                    </Section>

                     <DashedContainer className="bg-green-50/30 dark:bg-green-950/10 border-green-300/50 dark:border-green-800/30">
                        <Section title="Evaluation of RAG">
                            <div className="space-y-4">
                                <SubSection title="Evaluation Target">
                                    <Badge>Retrieval Quality</Badge>
                                    <Badge>Generation Quality</Badge>
                                </SubSection>
                                 <SubSection title="Evaluation Aspects">
                                    <div className="grid grid-cols-2 gap-2 w-full">
                                        <Badge>Answer Relevance</Badge>
                                        <Badge>Noise Robustness</Badge>
                                        <Badge>Context Relevance</Badge>
                                        <Badge>Negation Rejection</Badge>
                                        <Badge>Answer Faithfulness</Badge>
                                        <Badge>Information Integration</Badge>
                                        <Badge>Counterfactual Robustness</Badge>
                                    </div>
                                </SubSection>
                                 <SubSection title="Evaluation Framework">
                                     <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 w-full">
                                        <SubSection title="Benchmarks">
                                            <Badge>CRUD</Badge>
                                            <Badge>RGB</Badge>
                                            <Badge>RECALL</Badge>
                                        </SubSection>
                                         <div className="border-l border-green-200 dark:border-green-800/30"></div>
                                         <SubSection title="Tools">
                                            <Badge>TruLens</Badge>
                                            <Badge>RAGAS</Badge>
                                            <Badge>ARES</Badge>
                                        </SubSection>
                                     </div>
                                </SubSection>
                            </div>
                        </Section>
                    </DashedContainer>
                </div>
            </div>
        </motion.div>
    );
};
