"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Bot, Code, Globe, PenTool, GitBranch } from 'lucide-react';
import { Badge } from './ui/badge';

const frameworks = [
  {
    name: "AutoGen",
    description: "Developed by Microsoft, AutoGen enables the creation of AI agents that collaborate, use tools, and involve humans when necessary. It is versatile and supports complex conversational workflows.",
    icon: <Bot className="w-5 h-5 text-blue-400" />,
  },
  {
    name: "LangChain",
    description: "LangChain acts as a modular framework for building AI applications by connecting various AI components. It facilitates seamless integration of multiple agents into workflows.",
    icon: <GitBranch className="w-5 h-5 text-green-400" />,
  },
  {
    name: "LangGraph",
    description: "Part of the LangChain family, LangGraph introduces graph-based workflows, enabling agents to interact in non-linear, cyclic patterns, ideal for tasks requiring iterative refinement.",
    icon: <GitBranch className="w-5 h-5 text-green-400" />,
  },
  {
    name: "CrewAI",
    description: "Focused on practical, production-ready applications, CrewAI allows developers to assign specific roles and expertise to agents, enhancing task efficiency for enterprise use cases.",
    icon: <PenTool className="w-5 h-5 text-amber-400" />,
  },
  {
    name: "AutoGPT",
    description: "AutoGPT provides agents with persistence, allowing them to remember and build upon previous tasks. Its capabilities include internet search, file summarization, and plugin integration.",
    icon: <Globe className="w-5 h-5 text-rose-400" />,
  },
  {
    name: "Haystack",
    description: "Known for its robustness and excellent documentation, Haystack is ideal for semantic search and question-answering over custom datasets.",
    icon: <Code className="w-5 h-5 text-purple-400" />,
  },
];

export const AgentFrameworks = () => {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="AutoGen">
      {frameworks.map((framework) => (
        <AccordionItem key={framework.name} value={framework.name}>
          <AccordionTrigger>
            <div className="flex items-center gap-3 font-semibold">
                {framework.icon}
                {framework.name}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-10">
            <p className="text-sm text-muted-foreground">{framework.description}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
