// src/components/TableOfContents.tsx
"use client";

import { cn } from '@/lib/utils';
import { BookOpen, Puzzle, ShieldCheck, Bot } from 'lucide-react';

const sections = [
  { id: 'introduction', title: 'Introduction to RAG', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'chunking', title: 'Chunking Strategies', icon: <Puzzle className="w-4 h-4" /> },
  { id: 'agentic-rag', title: 'Agentic RAG', icon: <Bot className="w-4 h-4" /> },
  { id: 'evaluation', title: 'RAG Evaluation', icon: <ShieldCheck className="w-4 h-4" /> },
];

interface TableOfContentsProps {
    activeSectionId: string;
    onLinkClick: (id: string) => void;
}

export const TableOfContents = ({ activeSectionId, onLinkClick }: TableOfContentsProps) => {
  return (
    <div className="sticky top-24">
      <h3 className="text-lg font-semibold mb-4 text-primary">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(section.id);
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeSectionId === section.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                {section.icon}
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
