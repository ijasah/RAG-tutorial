// src/app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Hero } from '@/components/Hero';
import { TableOfContents } from '@/components/TableOfContents';
import { Section } from '@/components/Section';
import { RAGFlowDiagram } from '@/components/RAGFlowDiagram';
import { ChunkingSimulator } from '@/components/ChunkingSimulator';
import { RagasMetricSimulator } from '@/components/RagasMetricSimulator';
import { AgenticRAGSimulator } from '@/components/AgenticRAGSimulator';
import { TemperatureDemo } from '@/components/TemperatureDemo';
import { TopKDemo } from '@/components/TopKDemo';
import { TopPDemo } from '@/components/TopPDemo';
import { VectorDBAnimation } from '@/components/VectorDBAnimation';
import { SimilarityMetricsSimulator } from '@/components/SimilarityMetricsSimulator';


import {
  BookOpen,
  BrainCircuit,
  Settings,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  Puzzle,
  BookCopy,
  Bot,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/code-block';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
  { id: 'introduction', title: 'Introduction to RAG', icon: <BookOpen className="h-8 w-8 text-primary" /> },
  { id: 'chunking', title: 'RAG Chunking Strategies', icon: <Puzzle className="h-8 w-8 text-primary" /> },
  { id: 'parameters', title: 'LLM Generation Parameters', icon: <SlidersHorizontal className="h-8 w-8 text-primary" /> },
  { id: 'agentic-rag', title: 'Agentic RAG', icon: <Bot className="h-8 w-8 text-primary" /> },
  { id: 'evaluation', title: 'RAG Evaluation with RAGAS', icon: <ShieldCheck className="h-8 w-8 text-primary" /> },
];

const Index = () => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const isScrolling = useRef(false);

  useEffect(() => {
    sectionRefs.current = sections.map(s => document.getElementById(s.id));
  }, []);

  const scrollToSection = (index: number) => {
    if (isScrolling.current) return;
    const element = document.getElementById(sections[index].id);
    if (element) {
      isScrolling.current = true;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionIndex(index);
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000); // Prevent rapid scrolling
    }
  };

  const handleNextSection = () => {
    const nextIndex = Math.min(activeSectionIndex + 1, sections.length - 1);
    scrollToSection(nextIndex);
  };

  const handlePrevSection = () => {
    const prevIndex = Math.max(activeSectionIndex - 1, 0);
    scrollToSection(prevIndex);
  };

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-100px 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const index = sections.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) {
                setActiveSectionIndex(index);
            }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = sections.map(s => document.getElementById(s.id)).filter(el => el);
    elements.forEach(el => observer.observe(el!));

    return () => {
      elements.forEach(el => observer.unobserve(el!));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <div id="content" className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <TableOfContents activeSectionId={sections[activeSectionIndex]?.id} onLinkClick={(id) => {
              const index = sections.findIndex(s => s.id === id);
              scrollToSection(index);
            }}/>
          </div>
          <main className="lg:col-span-3 space-y-24">
             <Section id="introduction" title="Introduction to RAG" icon={<BookOpen className="h-8 w-8 text-primary" />}>
              <div className="space-y-6">
                <p className="text-muted-foreground mb-4">
                  Retrieval is a crucial part of the RAG framework because it helps the model fetch relevant information from external sources to augment its generated content. By combining retrieval with generation, we can make LLMs more accurate and capable of answering domain-specific questions by pulling in specific knowledge.
                </p>
                
                <Card>
                  <CardHeader>
                    <CardTitle>What is Retrieval?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Retrieval refers to the process of fetching relevant information from an external data source (like a database or a corpus of documents) based on a given input query. This process allows models to answer specific questions or provide more informed responses by leveraging knowledge that may not be encoded in the model itself.
                    </p>
                  </CardContent>
                </Card>

                <RAGFlowDiagram />

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Advantages and Challenges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-green-500/30 bg-green-500/10">
                      <CardHeader>
                        <CardTitle className="text-green-400">Advantages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Keeps information up-to-date without retraining.</li>
                          <li>Allows for domain adaptation by updating the database.</li>
                          <li>Reduces hallucination as answers are grounded.</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border-destructive/30 bg-destructive/10">
                      <CardHeader>
                        <CardTitle className="text-destructive">Challenges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Requires efficient retrieval systems for large datasets.</li>
                          <li>Managing noisy or irrelevant retrieved documents.</li>
                          <li>Handling increased latency due to the retrieval step.</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Vector Databases</h3>
                  <p className="text-muted-foreground mb-4">
                    Vector databases are specialized databases designed to store and manage high-dimensional vectors (embeddings) efficiently. These databases make it easier to perform similarity searches and retrieve relevant information for a given query.
                  </p>
                  <VectorDBAnimation />
                  <SimilarityMetricsSimulator />
                </div>

              </div>
            </Section>

            <Section id="chunking" title="RAG Chunking Strategies" icon={<Puzzle className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                  <p className="text-muted-foreground">
                    In RAG systems, effective chunking strategies are vital for optimizing the retrieval and generation process. Chunking helps break down information into manageable segments, which improves context preservation, relevance, and efficiency. Explore different strategies below.
                  </p>
                  <ChunkingSimulator />
              </div>
            </Section>

            <Section id="parameters" title="LLM Generation Parameters" icon={<SlidersHorizontal className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <p className="text-muted-foreground">
                  The "generation" in RAG is controlled by several key parameters that influence the output of the Large Language Model. Understanding these parameters is crucial for fine-tuning the model's responses to be more accurate, creative, or constrained as needed. Explore the interactive demos below to see how they work.
                </p>
                <TemperatureDemo />
                <TopKDemo />
                <TopPDemo />
              </div>
            </Section>
            
            <Section id="agentic-rag" title="Agentic RAG" icon={<Bot className="h-8 w-8 text-primary" />}>
                <div className="space-y-6">
                    <p className="text-muted-foreground">
                        Agentic RAG represents the next evolution of information retrieval, where an AI agent actively decides whether it needs to fetch external information to answer a query. Instead of retrieving information for every query, the agent analyzes the request and uses a "search" tool only when its internal knowledge is insufficient.
                    </p>
                    <AgenticRAGSimulator />
                </div>
            </Section>


            <Section id="evaluation" title="RAG Evaluation with RAGAS" icon={<ShieldCheck className="h-8 w-8 text-primary" />}>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                    Ragas is a library that provides tools to supercharge the evaluation of Large Language Model (LLM) applications. It is designed to help you evaluate your LLM applications with ease and confidence. Each metric is a paradigm designed to evaluate a particular aspect of the application.
                </p>

                <RagasMetricSimulator />

                <div>
                    <h3 className="text-xl font-semibold mb-3 mt-8 text-foreground">Conclusion</h3>
                    <p className="text-muted-foreground">Incorporating chunking and robust evaluation into RAG is crucial for enhancing the accuracy, efficiency, and context awareness of AI systems. By selecting the most appropriate chunking strategy and using metrics to evaluate performance, we can optimize the retrieval and generation process, ensuring more relevant and accurate responses.</p>
                </div>
              </div>
            </Section>
          </main>
        </div>
      </div>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevSection}
          disabled={activeSectionIndex === 0}
          className={cn('transition-opacity', activeSectionIndex === 0 && 'opacity-50')}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextSection}
          disabled={activeSectionIndex === sections.length - 1}
          className={cn('transition-opacity', activeSectionIndex === sections.length - 1 && 'opacity-50')}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
