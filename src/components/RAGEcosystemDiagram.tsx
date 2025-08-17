// src/components/RAGEcosystemDiagram.tsx
"use client";

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const tooltipData: Record<string, string> = {
    "Dialogue": "Conversational agents that use retrieved context to keep answers factual and context-aware.",
    "Question answering": "Knowledge-intensive QA where retrieved documents provide factual grounding for answers.",
    "Summarization": "Producing concise summaries of retrieved multi-document content or long documents.",
    "Fact verification": "Verifying claims by retrieving supporting or contradicting evidence from external sources.",
    "LangChain": "Orchestration and developer-facing library for building RAG pipelines (connectors, chains, prompt tooling).",
    "LlamaIndex": "Data ingestion / indexing layer that helps structure, chunk, and expose documents to LLMs for retrieval.",
    "FlowiseAI": "Low-code / drag-and-drop interface for composing retrieval + LLM workflows and deploying RAG apps.",
    "AutoGen": "Toolkit for higher-level automation / agent orchestration in multi-component LLM applications (used in RAG flows).",
    "Naive RAG": "Basic retrieve-then-read pipeline: index → retrieve top-k chunks → feed into LLM for generation.",
    "Advanced RAG": "Adds pre- and post-retrieval optimizations (query rewriting, reranking, smarter chunking, compressing).",
    "Modular RAG": "Componentized architecture with replaceable modules (search, memory, routing, task adapters) and new interaction patterns.",
    "Chunk Optimization": "Choosing chunk size and boundaries and adding metadata to improve retrieval granularity and relevance.",
    "Iterative Retrieval": "Repeating retrieval steps (refine query → retrieve again) to gather deeper context or multi-hop info.",
    "Retriever Fine-tuning": "Adapting embedding/retrieval models to domain data for better relevance.",
    "Query Transformation": "Rewriting/expanding the user query (LLM or model-based) to improve retrieval recall/precision.",
    "Recursive Retrieval": "Chaining retrievals so later queries depend on earlier retrieved facts (for complex reasoning).",
    "Generator Fine-tuning": "Fine-tuning the LLM on retrieved-context tasks (or instruction tuning) to improve answer synthesis and faithfulness.",
    "Context Selection": "Post-retrieval filtering and reranking to compress prompt content and surface the most useful passages.",
    "Adaptive Retrieval": "Dynamically choosing how many / which sources to retrieve based on query complexity or confidence.",
    "Dual Fine-tuning": "Joint or coordinated tuning of both retriever and generator to improve end-to-end performance.",
    "What to retrieve": "Deciding which documents or facts are relevant to the query (content selection).",
    "When to retrieve": "Choosing retrieval timing/strategy (e.g., initial vs iterative retrieval, frequency in dialog).",
    "How to use Retrieval": "How to integrate retrieved evidence into prompts or model inputs to avoid hallucination and redundancy.",
    "Retrieval Quality": "Did we get the right evidence?",
    "Generation Quality": "Is the answer correct/useful?",
    "Answer Relevance": "Measures if the answer is pertinent to the question.",
    "Context Relevance": "Measures if the retrieved context is relevant to the query.",
    "Answer Faithfulness": "Measures if the answer is factually supported by the context.",
    "Noise Robustness": "Measures the model's robustness to irrelevant information.",
    "Negation Rejection": "Measures the ability to handle negated queries.",
    "Information Integration": "Measures the ability to synthesize information from multiple documents.",
    "Counterfactual Robustness": "Measures the ability to handle hypothetical or counterfactual questions.",
    "CRUD": "A benchmark for evaluating RAG systems on common operations.",
    "RGB": "A benchmark for evaluating retrieval quality.",
    "RECALL": "A benchmark focusing on the recall of retrieved documents.",
    "TruLens": "An open-source tool for evaluating and tracking LLM applications.",
    "RAGAS": "A framework for evaluating RAG applications, focusing on metrics like faithfulness and answer relevance.",
    "ARES": "An automated evaluation framework for RAG systems.",
    "RAG in Long Context Length": "Handling retrieval and reasoning when required context far exceeds model context windows.",
    "Hybrid": "Combining retrieval with fine-tuning / parameterized knowledge (how to best mix parametric and non-parametric sources).",
    "Robustness": "Reducing noise, adversarial inputs and hallucinations; improving reliability.",
    "Scaling-laws for RAG": "Understanding how model/Index scale affects performance and whether different scaling behaviors appear vs pure LLMs.",
    "Production-ready RAG": "Engineering questions: latency, cost, security, data governance, and recall at scale.",
    "Image": "Extending RAG to retrieve/ground visual items (images) and produce multimodal outputs.",
    "Audio": "Retrieval and stitching of audio segments or audio→text retrieval for multimodal tasks.",
    "Video": "Retrieving temporal video clips or captions as evidence for multimedia Q&A.",
    "Code": "Retrieving code examples, snippets, or API docs to support code search, repair, or generation tasks.",
    "Customization": "Tailoring RAG stacks to domain/enterprise needs (connectors, specialized retrievers, privacy controls).",
    "Simplification": "Lowering the entry barrier (low-code tools, prebuilt connectors, better defaults) for practitioners.",
    "Specialization": "Building production-grade, optimized RAG solutions for specific verticals (search, assistants, legal, medical, etc.)."
};

const Section = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <motion.div variants={itemVariants} className={cn("w-full", className)}>
        <h3 className="font-semibold text-sm flex items-center gap-1.5 text-blue-500 mb-2">
            <ChevronRight className="w-5 h-5" />
            {title}
        </h3>
        {children}
    </motion.div>
);

const SubSection = ({ title, children, className }: { title?: string, children: React.ReactNode, className?: string }) => (
    <div className={className}>
        {title && <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">{title}</h4>}
        <div className="flex flex-wrap gap-1.5">
            {children}
        </div>
    </div>
);

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const textContent = typeof children === 'string' ? children : '';
    const description = tooltipData[textContent] || 'No description available.';

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -2, boxShadow: "0px 4px 10px hsla(var(--primary), 0.1)" }}
                    className={cn("bg-white dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg px-2 py-0.5 text-[11px] text-center", className)}>
                    {children}
                </motion.div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-sm">
                <p>{description}</p>
            </TooltipContent>
        </Tooltip>
    );
};

const DashedContainer = ({children, className}: {children: React.ReactNode, className?:string}) => (
    <motion.div variants={itemVariants} className={cn("border-2 border-dashed border-blue-300/50 dark:border-blue-800/50 rounded-2xl p-3 space-y-3", className)}>
        {children}
    </motion.div>
)

export const RAGEcosystemDiagram = () => {
    return (
        <TooltipProvider>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="w-full bg-blue-50 dark:bg-blue-950/10 border border-blue-200/50 dark:border-blue-900/50 rounded-3xl p-4"
            >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

                    {/* Left Column */}
                    <div className="lg:col-span-3 space-y-3 flex flex-col">
                        <Section title="RAG Ecosystem">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3">
                                <SubSection title="Downstream Tasks">
                                    <Badge>Dialogue</Badge>
                                    <Badge>Question answering</Badge>
                                    <Badge>Summarization</Badge>
                                    <Badge>Fact verification</Badge>
                                </SubSection>
                                <div className="border-l border-blue-200 dark:border-blue-800/30"></div>
                                <SubSection title="Technology Stacks">
                                    <Badge>LangChain</Badge>
                                    <Badge>LlamaIndex</Badge>
                                    <Badge>FlowiseAI</Badge>
                                    <Badge>AutoGen</Badge>
                                </SubSection>
                            </div>
                        </Section>

                        <DashedContainer className="bg-yellow-50/30 dark:bg-yellow-950/10 border-yellow-300/50 dark:border-yellow-800/30">
                            <Section title="Techniques for better RAG">
                                <div className="grid grid-cols-3 gap-1.5">
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

                        <DashedContainer className="bg-green-50/30 dark:bg-green-950/10 border-green-300/50 dark:border-green-800/30 flex-grow">
                            <Section title="Evaluation of RAG">
                                <div className="space-y-3 h-full flex flex-col">
                                    <SubSection title="Evaluation Target">
                                        <Badge>Retrieval Quality</Badge>
                                        <Badge>Generation Quality</Badge>
                                    </SubSection>
                                    <SubSection title="Evaluation Aspects">
                                        <div className="grid grid-cols-2 gap-1.5 w-full">
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
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 w-full">
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

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-3 flex flex-col">
                        <Section title="RAG prospect">
                            <div className="grid grid-cols-1 md:grid-cols-[1.2fr,auto,1fr,auto,1fr] gap-3">
                                <SubSection title="Challenges">
                                    <Badge>RAG in Long Context Length</Badge>
                                    <Badge>Hybrid</Badge>
                                    <Badge>Robustness</Badge>
                                    <Badge>Scaling-laws for RAG</Badge>
                                    <Badge>Production-ready RAG</Badge>
                                </SubSection>
                                <div className="border-l border-blue-200 dark:border-blue-800/30"></div>
                                <SubSection title="Modality extension">
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

                        <DashedContainer className="bg-blue-100/30 dark:bg-blue-950/20">
                            <Section title="The RAG paradigm">
                                <div className="bg-white dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-xl p-2 flex items-center justify-around text-sm font-medium">
                                    <Badge>Naive RAG</Badge>
                                    <motion.div variants={itemVariants} className="flex items-center gap-1 text-muted-foreground text-xs"><ChevronRight className="w-4 h-4" /> Advanced RAG <ChevronRight className="w-4 h-4" /></motion.div>
                                    <Badge>Modular RAG</Badge>
                                </div>
                            </Section>
                        </DashedContainer>

                        <DashedContainer className="bg-purple-50/30 dark:bg-purple-950/10 border-purple-300/50 dark:border-purple-800/30 flex-grow">
                            <Section title="Key issues of RAG">
                                <div className="relative flex justify-center items-center h-full min-h-[100px]">
                                    <motion.div
                                        variants={itemVariants}
                                        className="absolute flex items-center justify-center w-24 h-12 bg-pink-200/50 dark:bg-pink-500/10 text-pink-800 dark:text-pink-200 rounded-full blur-sm" style={{ transform: 'translateX(-30%) rotate(-10deg)' }} />
                                    <motion.div
                                        variants={itemVariants}
                                        className="absolute flex items-center justify-center w-24 h-12 bg-purple-200/50 dark:bg-purple-500/10 text-purple-800 dark:text-purple-200 rounded-full blur-sm" style={{ transform: 'translateX(0%) rotate(5deg)' }} />
                                    <motion.div
                                        variants={itemVariants}
                                        className="absolute flex items-center justify-center w-24 h-12 bg-blue-200/50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-200 rounded-full blur-sm" style={{ transform: 'translateX(30%) rotate(-5deg)' }} />

                                    <div className="absolute flex justify-around w-full text-xs font-semibold">
                                        <motion.p variants={itemVariants}>What to retrieve</motion.p>
                                        <motion.p variants={itemVariants}>When to retrieve</motion.p>
                                        <motion.p variants={itemVariants}>How to use Retrieval</motion.p>
                                    </div>
                                </div>
                            </Section>
                        </DashedContainer>
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    );
};
