// src/components/RagasMetricSimulator.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, CheckCircle, XCircle, FileText, Search } from 'lucide-react';

const metrics = {
  context_precision: {
    name: "Context Precision",
    description: "Measures whether the retrieved context is signal or noise. High precision means the context contains more relevant information.",
    goodExample: {
      question: "What is RAG?",
      context: ["RAG stands for Retrieval-Augmented Generation. It enhances LLMs by adding an information retrieval step.", "A vector database stores embeddings for fast retrieval."],
      answer: "Retrieval-Augmented Generation (RAG) is a technique to improve LLM accuracy by fetching external data.",
      score: 0.92,
      explanation: "High score because the retrieved context was highly relevant and directly used to form the correct answer."
    },
    badExample: {
      question: "What is RAG?",
      context: ["A vector database stores embeddings.", "The sky is blue.", "LLMs are trained on vast amounts of text data."],
      answer: "RAG is a method used with LLMs.",
      score: 0.33,
      explanation: "Low score because most of the retrieved context was irrelevant (noise), leading to a vague answer."
    }
  },
  context_recall: {
    name: "Context Recall",
    description: "Measures if all the necessary information to answer the question was retrieved. High recall means no crucial information was missed.",
    goodExample: {
      question: "What are the two main components of RAG?",
      context: ["RAG's core components are a retriever and a generator. The retriever finds data, the generator answers.", "RAG was introduced by Facebook AI."],
      answer: "The two main components of RAG are the retriever and the generator.",
      score: 1.0,
      explanation: "Perfect score because all information needed from the ground truth answer was present in the retrieved context."
    },
    badExample: {
      question: "What are the two main components of RAG?",
      context: ["RAG uses a retriever to find relevant documents.", "RAG was introduced by Facebook AI in 2020."],
      answer: "RAG uses a retriever component.",
      score: 0.5,
      explanation: "Low score because the context only mentioned the 'retriever' but missed the 'generator', so the answer is incomplete."
    }
  },
  answer_relevancy: {
    name: "Answer Relevancy",
    description: "Evaluates how relevant the generated answer is to the question. A high score means the answer is pertinent and doesn't contain redundant or out-of-context information.",
     goodExample: {
      question: "What is RAG?",
      context: ["..."],
      answer: "Retrieval-Augmented Generation (RAG) is a technique to improve LLM accuracy by fetching external data before responding.",
      score: 0.95,
      explanation: "High score because the answer is concise and directly addresses the question."
    },
    badExample: {
      question: "What is RAG?",
      context: ["..."],
      answer: "That's an interesting question. RAG is a technique to improve LLMs. By the way, LLMs are very complex.",
      score: 0.60,
      explanation: "Lower score because the answer includes conversational filler and irrelevant information, making it less direct."
    }
  },
};

type MetricKey = keyof typeof metrics;

const MetricCard = ({ metric, isGood }: { metric: any, isGood: boolean }) => {
  const data = isGood ? metric.goodExample : metric.badExample;

  return (
    <Card className={`border-2 ${isGood ? 'border-green-500/50' : 'border-red-500/50'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isGood ? 'text-green-400' : 'text-red-400'}`}>
          {isGood ? <CheckCircle /> : <XCircle />}
          {isGood ? "Good Example" : "Bad Example"}
        </CardTitle>
        <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">{data.explanation}</p>
            <div className={`text-2xl font-bold ${isGood ? 'text-green-400' : 'text-red-400'}`}>
                {data.score.toFixed(2)}
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        <div>
          <h4 className="font-semibold mb-1 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-primary" />Question</h4>
          <p className="p-2 bg-muted/50 rounded-md border">{data.question}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1 flex items-center gap-2"><Search className="w-4 h-4 text-primary" />Retrieved Context</h4>
          <div className="space-y-1">
            {data.context.map((c: string, i: number) => <p key={i} className="p-2 bg-muted/50 rounded-md border">{c}</p>)}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-1 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />Generated Answer</h4>
          <p className="p-2 bg-muted/50 rounded-md border">{data.answer}</p>
        </div>
      </CardContent>
    </Card>
  )
}


export const RagasMetricSimulator = () => {
  const [activeTab, setActiveTab] = useState<MetricKey>('context_precision');

  const activeMetric = metrics[activeTab];

  return (
    <Card className="bg-card/50">
        <CardHeader>
            <CardTitle>RAGAS Evaluation Metrics</CardTitle>
            <CardDescription>
                Explore key RAGAS metrics by comparing good and bad examples for each. This helps illustrate what each metric is measuring.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MetricKey)}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="context_precision">Context Precision</TabsTrigger>
                    <TabsTrigger value="context_recall">Context Recall</TabsTrigger>
                    <TabsTrigger value="answer_relevancy">Answer Relevancy</TabsTrigger>
                </TabsList>

                <motion.div
                    key={activeTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <TabsContent value={activeTab} className="mt-4">
                        <div className="text-center p-4 mb-4 bg-muted/40 rounded-lg">
                            <h3 className="text-lg font-semibold text-primary">{activeMetric.name}</h3>
                            <p className="text-sm text-muted-foreground">{activeMetric.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MetricCard metric={activeMetric} isGood={true} />
                            <MetricCard metric={activeMetric} isGood={false} />
                        </div>
                    </TabsContent>
                </motion.div>
            </Tabs>
        </CardContent>
    </Card>
  )
};