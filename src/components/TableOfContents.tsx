
// src/components/TableOfContents.tsx
"use client";

import { cn } from '@/lib/utils';
import { BookOpen, Puzzle, ShieldCheck, Bot, SlidersHorizontal, Database, Route, Sparkles, ChevronRight, Grid, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'llm-to-rag', title: 'The Journey to RAG', icon: <Route className="w-4 h-4" /> },
  { 
    id: 'introduction', 
    title: 'Introduction to RAG', 
    icon: <BookOpen className="w-4 h-4" />,
    subsections: [
        { id: 'intro-what-is', title: 'What is Retrieval?' },
        { id: 'intro-flow', title: 'The RAG Flow' },
        { id: 'intro-pro-con', title: 'Advantages & Challenges' },
    ]
  },
  { 
    id: 'vector-dbs', 
    title: 'Vector DBs & Similarity', 
    icon: <Database className="w-4 h-4" />,
    subsections: [
        { id: 'vector-db-anim', title: 'Vector DB Simulation' },
        { id: 'similarity-metrics', title: 'Similarity Metrics' },
    ]
  },
  { id: 'chunking', title: 'Chunking Strategies', icon: <Puzzle className="w-4 h-4" /> },
  { 
    id: 'parameters', 
    title: 'Generation Parameters', 
    icon: <SlidersHorizontal className="w-4 h-4" />,
     subsections: [
        { id: 'param-temp', title: 'Temperature' },
        { id: 'param-top-k', title: 'Top-K' },
        { id: 'param-top-p', title: 'Top-P' },
    ]
  },
  { id: 'agentic-rag', title: 'Agentic RAG', icon: <Bot className="w-4 h-4" /> },
  { id: 'enhancements', title: 'Enhancement Techniques', icon: <Sparkles className="w-4 h-4" /> },
  { 
    id: 'evaluation', 
    title: 'RAG Evaluation', 
    icon: <ShieldCheck className="w-4 h-4" />,
    subsections: [
        { id: 'eval-terms', title: 'Key Terms' },
        { id: 'eval-precision', title: 'Context Precision' },
        { id: 'eval-recall', title: 'Context Recall' },
        { id: 'eval-faithfulness', title: 'Faithfulness' },
        { id: 'eval-noise', title: 'Noise Sensitivity' },
        { id: 'eval-relevancy', title: 'Response Relevancy' },
        { id: 'eval-summary', title: 'Metrics Summary' },
    ]
  },
  { id: 'ecosystem', title: 'RAG Ecosystem', icon: <Grid className="w-4 h-4" /> },
  { id: 'further-reading', title: 'Further Reading', icon: <BookMarked className="w-4 h-4" /> }
];

interface TableOfContentsProps {
    activeSectionId: string;
    activeSubSectionId: string;
    onLinkClick: (id: string) => void;
}

export const TableOfContents = ({ activeSectionId, activeSubSectionId, onLinkClick }: TableOfContentsProps) => {
  return (
    <div className="sticky top-24">
      <h3 className="text-lg font-semibold mb-4 text-primary">Table of Contents</h3>
      <nav>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(section.id);
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
                  activeSectionId === section.id
                    ? 'bg-primary/10 text-primary shadow-md'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                {section.icon}
                {section.title}
              </a>
               <AnimatePresence>
                {activeSectionId === section.id && section.subsections && (
                    <motion.ul 
                        className="ml-4 mt-1 pl-4 border-l border-primary/20 space-y-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {section.subsections.map(subsection => (
                            <li key={subsection.id}>
                                <a
                                    href={`#${subsection.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onLinkClick(subsection.id);
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 py-1.5 px-2 rounded-md text-xs hover:text-primary hover:bg-primary/5",
                                        activeSubSectionId === subsection.id ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <ChevronRight className="w-3 h-3" />
                                    {subsection.title}
                                </a>
                            </li>
                        ))}
                    </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
