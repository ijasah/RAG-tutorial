
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { TableOfContents } from '@/components/TableOfContents';
import { Section } from '@/components/Section';
import { AgentCoreComponents } from '@/components/AgentCoreComponents';
import { ReActSimulator } from '@/components/ReActSimulator';
import { MultiAgentSimulator } from '@/components/MultiAgentSimulator';
import { AgentFrameworks } from '@/components/AgentFrameworks';


import {
  Bot,
  BrainCircuit,
  ChevronUp,
  ChevronDown,
  Puzzle,
  BookCopy,
  Users,
  CheckCircle,
  XCircle,
  FileWarning,
  Clock,
  Sparkles,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';

const sections = [
  { 
    id: 'introduction', 
    title: 'LLM Agents: An Overview', 
    icon: <Bot className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'core-components', title: 'Core Components' },
        { id: 'tool-integration', title: 'Tool Integration' },
    ]
  },
  { 
    id: 'react-agent', 
    title: 'The ReAct Framework', 
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'react-how', title: 'How ReAct Works' },
        { id: 'react-simulation', title: 'ReAct Simulation' },
        { id: 'react-benefits', title: 'Key Benefits' },
    ]
  },
  { 
    id: 'multi-agent', 
    title: 'Multi-Agent Systems', 
    icon: <Users className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'multi-advantages', title: 'Advantages' },
        { id: 'multi-simulation', title: 'Collaboration Simulation' },
        { id: 'multi-frameworks', title: 'Popular Frameworks' },
        { id: 'multi-challenges', title: 'Challenges' },
    ]
  },
];

const allSectionIds = sections.flatMap(s => [s.id, ...(s.subsections ? s.subsections.map(sub => sub.id) : [])]);

const toolCode = `
# Initialize tools
tools = load_tools([’wikipedia’, ’llm-math’], llm=llm)

# Create agent
agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)

# Run query
result = agent.run("What is the average age of a cat? Multiply by 4.")
`;

const Index = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeSubSectionId, setActiveSubSectionId] = useState('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isScrolling = useRef(false);

  useEffect(() => {
    allSectionIds.forEach(id => {
        sectionRefs.current[id] = document.getElementById(id);
    })
  }, []);

  const scrollToSection = (id: string) => {
    if (isScrolling.current) return;
    const element = document.getElementById(id);
    if (element) {
      isScrolling.current = true;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      const parentSection = sections.find(s => s.id === id || s.subsections?.some(sub => sub.id === id));
      if(parentSection) {
          setActiveSection(parentSection.id);
      }
      setActiveSubSectionId(id);

      setTimeout(() => {
        isScrolling.current = false;
      }, 1000); // Prevent rapid scrolling
    }
  };

  const handleNextSection = () => {
    const currentMainIndex = sections.findIndex(s => s.id === activeSection);
    const nextIndex = Math.min(currentMainIndex + 1, sections.length - 1);
    scrollToSection(sections[nextIndex].id);
  };

  const handlePrevSection = () => {
    const currentMainIndex = sections.findIndex(s => s.id === activeSection);
    const prevIndex = Math.max(currentMainIndex - 1, 0);
    scrollToSection(sections[prevIndex].id);
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
            const id = entry.target.id;
            const parentSection = sections.find(s => s.id === id || s.subsections?.some(sub => sub.id === id));
            if (parentSection) {
                setActiveSection(parentSection.id);
            }
            setActiveSubSectionId(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionRefs.current).forEach(el => {
        if(el) observer.observe(el);
    });

    return () => {
      Object.values(sectionRefs.current).forEach(el => {
        if(el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <div id="content" className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1 mt-16">
            <TableOfContents 
              activeSectionId={activeSection} 
              activeSubSectionId={activeSubSectionId}
              onLinkClick={scrollToSection} 
            />
          </div>
          <main className="lg:col-span-3 space-y-24">
            
             <Section id="introduction" title="LLM Agents: An Overview" icon={<Bot className="h-8 w-8 text-primary" />}>
              <div className="space-y-12">
                <p className="text-muted-foreground text-lg">
                  LLM Agents are advanced systems that utilize Large Language Models (LLMs) as their core engine
                  to solve complex tasks requiring reasoning, planning, memory, and the use of external tools. Unlike
                  static applications of LLMs, agents are dynamic and capable of executing multi-step tasks by
                  breaking them into smaller, manageable subtasks.
                </p>
                
                <div id="core-components">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Core Components of an LLM Agent</h3>
                    <AgentCoreComponents />
                </div>
                
                <div id="tool-integration" className="pt-8">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Tool Integration</h3>
                   <p className="text-muted-foreground mb-4">
                        LLM Agents use external tools to expand their capabilities beyond text generation. This allows them to access real-time data, perform calculations, or interact with other systems.
                    </p>
                  <CodeBlock code={toolCode} />
                </div>

              </div>
            </Section>
            
            <Section id="react-agent" title="The ReAct Framework" icon={<BrainCircuit className="h-8 w-8 text-primary" />}>
               <div className="space-y-12">
                 <p className="text-muted-foreground text-lg" id="react-how">
                    A ReAct (Reasoning and Acting) Agent is an advanced framework that enables LLMs to reason through problems while interacting with external tools. It combines two essential capabilities: generating a reasoning trace and executing task-specific actions in a continuous loop.
                  </p>
                  
                  <div id="react-simulation" className="pt-8">
                     <ReActSimulator />
                  </div>

                  <div id="react-benefits" className="pt-8">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Key Benefits of ReAct Agents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><CheckCircle className="text-primary"/> Improved Accuracy</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Breaking problems into smaller steps reduces errors and improves reliability.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="text-primary"/> Dynamic Interaction</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Agents can gather additional data or clarify ambiguities during execution.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Rocket className="text-primary"/> Enhanced Problem Solving</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Combines reasoning with action to solve real-world, multi-step problems.</p></CardContent>
                        </Card>
                    </div>
                  </div>
               </div>
            </Section>

            <Section id="multi-agent" title="Multi-Agent Systems" icon={<Users className="h-8 w-8 text-primary" />}>
              <div className="space-y-12">
                  <p className="text-muted-foreground text-lg">
                    Multi-agent LLM systems consist of multiple agents that collaborate to solve complex tasks. While single-agent systems are effective for independent cognitive tasks, multi-agent systems shine in scenarios requiring teamwork, extended context management, and dynamic interaction.
                  </p>

                   <div id="multi-advantages" className="pt-8">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Single Agent vs. Multi-Agent</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-red-500/30 bg-red-500/10">
                                <CardHeader>
                                <CardTitle className="text-red-400 flex items-center gap-2"><Bot /> Single Agent</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="flex items-start gap-2 text-sm"><XCircle className="w-5 h-5 mt-0.5 shrink-0"/> Prone to hallucinations without verification.</p>
                                    <p className="flex items-start gap-2 text-sm"><XCircle className="w-5 h-5 mt-0.5 shrink-0"/> Limited by context window for long tasks.</p>
                                    <p className="flex items-start gap-2 text-sm"><XCircle className="w-5 h-5 mt-0.5 shrink-0"/> Operates sequentially, can be slow.</p>
                                </CardContent>
                            </Card>
                            <Card className="border-green-500/30 bg-green-500/10">
                                <CardHeader>
                                <CardTitle className="text-green-400 flex items-center gap-2"><Users/> Multi-Agent</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="flex items-start gap-2 text-sm"><CheckCircle className="w-5 h-5 mt-0.5 shrink-0"/> Agents can debate and verify each other's work.</p>
                                    <p className="flex items-start gap-2 text-sm"><CheckCircle className="w-5 h-5 mt-0.5 shrink-0"/> Tasks can be divided to handle large contexts.</p>
                                    <p className="flex items-start gap-2 text-sm"><CheckCircle className="w-5 h-5 mt-0.5 shrink-0"/> Enables parallel processing for better efficiency.</p>
                                </CardContent>
                            </Card>
                        </div>
                   </div>

                  <div id="multi-simulation" className="pt-8">
                      <MultiAgentSimulator />
                  </div>
                  
                  <div id="multi-frameworks" className="pt-8">
                     <h3 className="text-xl font-semibold mb-4 text-foreground">Popular Multi-Agent Frameworks</h3>
                     <AgentFrameworks />
                  </div>

                  <div id="multi-challenges" className="pt-8">
                     <h3 className="text-xl font-semibold mb-4 text-foreground">Challenges and Limitations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><FileWarning className="text-destructive"/> Task Allocation & Coordination</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Efficiently dividing tasks and ensuring agents debate and reach consensus requires sophisticated protocols.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Clock className="text-destructive"/> Time and Cost</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Multi-agent setups demand higher computational resources, leading to increased latency and expenses.</p></CardContent>
                        </Card>
                    </div>
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
          disabled={sections.findIndex(s => s.id === activeSection) === 0}
          className={cn('transition-opacity', sections.findIndex(s => s.id === activeSection) === 0 && 'opacity-50')}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextSection}
          disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
          className={cn('transition-opacity', sections.findIndex(s => s.id === activeSection) === sections.length - 1 && 'opacity-50')}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
