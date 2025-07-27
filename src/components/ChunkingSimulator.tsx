"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextSelect, Puzzle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const sampleText = `RAG Tutorial: Chapter 1

Retrieval-Augmented Generation (RAG) is a powerful framework for enhancing the accuracy and reliability of Large Language Models (LLMs). It works by fetching relevant information from external knowledge bases before generating a response. This grounding process reduces hallucinations and allows the model to use up-to-date information.

The core components of RAG include a retriever and a generator. The retriever, often using a vector database, finds documents relevant to the user's query. These documents are then passed to the generator (the LLM) as context. The LLM uses this context to formulate a more informed and accurate answer. This synergy makes RAG highly effective for domain-specific question answering.`;

const chunkingStrategies = {
  fixed: {
    label: "Fixed-Size Chunking",
    description: "Divides text into chunks of a specific size (e.g., 100 characters), with an optional overlap to maintain context. Simple and fast, but can split sentences awkwardly.",
    chunk: (text: string) => {
      const chunkSize = 100;
      const overlap = 20;
      const chunks = [];
      for (let i = 0; i < text.length; i += chunkSize - overlap) {
        chunks.push(text.substring(i, i + chunkSize));
      }
      return chunks;
    }
  },
  recursive: {
    label: "Recursive Chunking",
    description: "Splits text using a hierarchy of separators (e.g., paragraphs, then sentences). More context-aware than fixed-size chunking as it tries to keep related content together.",
    chunk: (text: string) => {
      const paragraphs = text.split('\n\n');
      const chunks: string[] = [];
      paragraphs.forEach(p => {
        if (p.length < 200) {
          chunks.push(p);
        } else {
          const sentences = p.match(/[^.!?]+[.!?]+/g) || [p];
          chunks.push(...sentences);
        }
      });
      return chunks.filter(c => c.trim() !== "");
    }
  },
  semantic: {
    label: "Semantic Chunking",
    description: "Groups sentences into chunks based on their semantic similarity. This is the most context-aware method, as it ensures each chunk is a coherent block of meaning.",
    chunk: (text: string) => {
        // This is a simplified simulation of semantic chunking
        const sentences = text.match(/[^.!?]+[.!?\n]+/g) || [];
        const chunks: string[] = [];
        let currentChunk = "";
        
        const semanticBreakPoints = [2, 5]; // Pre-determined break points for this demo text

        sentences.forEach((sentence, i) => {
            currentChunk += sentence.trim() + " ";
            if (semanticBreakPoints.includes(i + 1) || i === sentences.length - 1) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }
        });

        return chunks.filter(c => c.trim() !== "");
    }
  },
  sentence: {
    label: "Sentence-Based Chunking",
    description: "Splits the text directly into individual sentences. This preserves the meaning of each sentence but can result in many small chunks.",
    chunk: (text: string) => {
      return (text.match(/[^.!?]+[.!?]+/g) || []).map(s => s.trim());
    }
  }
};

type Strategy = keyof typeof chunkingStrategies;

export const ChunkingSimulator = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>('fixed');
  const [chunks, setChunks] = useState<string[]>([]);

  const handleSimulate = () => {
    const strategy = chunkingStrategies[selectedStrategy];
    setChunks(strategy.chunk(sampleText));
  };

  const strategyInfo = chunkingStrategies[selectedStrategy];

  const colors = ["bg-sky-500/20", "bg-emerald-500/20", "bg-amber-500/20", "bg-rose-500/20", "bg-indigo-500/20"];

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle />
          Chunking Strategy Simulator
        </CardTitle>
        <CardDescription>
          Select a chunking strategy to see how it splits a sample document into smaller pieces for retrieval.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h4 className="font-semibold text-sm mb-2">Original Document</h4>
            <div className="p-4 bg-muted/50 rounded-md border h-64 overflow-y-auto text-sm">
              <p className="whitespace-pre-wrap">{sampleText}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm mb-2">Configuration</h4>
            <Select onValueChange={(v) => setSelectedStrategy(v as Strategy)} defaultValue={selectedStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(chunkingStrategies).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{strategyInfo.label}</AlertTitle>
                <AlertDescription className="text-xs">{strategyInfo.description}</AlertDescription>
            </Alert>
            <Button onClick={handleSimulate} className="w-full">
              <TextSelect className="mr-2" />
              Chunk Document
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Generated Chunks ({chunks.length})</h4>
          <div className="p-4 bg-muted/50 rounded-md border min-h-[200px] space-y-2">
            <AnimatePresence>
              {chunks.map((chunk, index) => (
                <motion.div
                  key={`${selectedStrategy}-${index}`}
                  className={`p-3 rounded-md text-xs border ${colors[index % colors.length]}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                    <strong className="text-primary-foreground/80 block mb-1">Chunk {index + 1}</strong>
                    {chunk}
                </motion.div>
              ))}
            </AnimatePresence>
            {chunks.length === 0 && <p className="text-muted-foreground text-center py-8">Click "Chunk Document" to see the result.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
