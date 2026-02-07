"use client";

import { cn } from '@/lib/utils';
import { Bot, BrainCircuit, Users, GitBranch, ChevronRight, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { 
    id: 'introduction', 
    title: 'LLM Agents: An Overview', 
    icon: <Bot className="w-4 h-4" />,
    subsections: [
        { id: 'core-components', title: 'Core Components' },
        { id: 'tool-integration', title: 'Tool Integration' },
    ]
  },
  { 
    id: 'react-agent', 
    title: 'The ReAct Framework', 
    icon: <BrainCircuit className="w-4 h-4" />,
    subsections: [
        { id: 'react-how', title: 'How ReAct Works' },
        { id: 'react-simulation', title: 'ReAct Simulation' },
        { id: 'react-benefits', title: 'Key Benefits' },
    ]
  },
  { 
    id: 'multi-agent', 
    title: 'Multi-Agent Systems', 
    icon: <Users className="w-4 h-4" />,
    subsections: [
        { id: 'multi-advantages', title: 'Advantages' },
        { id: 'multi-simulation', title: 'Collaboration Simulation' },
        { id: 'multi-frameworks', title: 'Popular Frameworks' },
        { id: 'multi-challenges', title: 'Challenges' },
    ]
  },
  {
    id: 'langgraph-overview',
    title: 'LangGraph Overview',
    icon: <GitBranch className="w-4 h-4" />,
    subsections: [
        { id: 'lg-key-concepts', title: 'Key Concepts' },
        { id: 'lg-core-benefits', title: 'Core Benefits' },
        { id: 'lg-ecosystem', title: 'Ecosystem' },
        { id: 'lg-installation', title: 'Installation' },
    ]
  },
  {
    id: 'langgraph-quickstart',
    title: 'LangGraph Quickstart',
    icon: <Rocket className="w-4 h-4" />,
    subsections: [
        { id: 'qs-graph-api', title: 'Using the Graph API' },
        { id: 'qs-functional-api', title: 'Using the Functional API' },
    ]
  }
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
