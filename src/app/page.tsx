'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { TableOfContents } from '@/components/TableOfContents';
import { Section } from '@/components/Section';
import { AgentCoreComponents } from '@/components/AgentCoreComponents';
import { ReActSimulator } from '@/components/ReActSimulator';
import { MultiAgentSimulator } from '@/components/MultiAgentSimulator';
import { AgentFrameworks } from '@/components/AgentFrameworks';
import { LangGraphQuickstartSimulator } from '@/components/LangGraphQuickstartSimulator';
import { ThinkingInLangGraph } from '@/components/ThinkingInLangGraph';
import { PersistenceSimulator } from '@/components/PersistenceSimulator';
import { SerializationVisual } from '@/components/SerializationVisual';
import { DurableExecutionSimulator } from '@/components/DurableExecutionSimulator';
import { StreamingSimulator } from '@/components/StreamingSimulator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InterruptsSimulator } from '@/components/InterruptsSimulator';


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
  Rocket,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Download,
  Server,
  Link as LinkIcon,
  LineChart,
  Lightbulb,
  Workflow,
  Save,
  MemoryStick,
  UserCheck,
  History,
  ShieldCheck,
  Database,
  Wrench,
  Key,
  Lock,
  Binary,
  ArrowDown,
  Layers,
  Zap,
  Shield,
  Code,
  Radio,
  Hand,
  FileJson,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  { 
    id: 'langgraph-overview', 
    title: 'LangGraph Overview', 
    icon: <GitBranch className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'lg-key-concepts', title: 'Key Concepts' },
        { id: 'lg-core-benefits', title: 'Core Benefits' },
        { id: 'lg-ecosystem', title: 'Ecosystem' },
        { id: 'lg-installation', title: 'Installation' },
    ]
  },
  {
    id: 'thinking-in-langgraph',
    title: 'Thinking in LangGraph',
    icon: <Workflow className="h-8 w-8 text-primary" />,
  },
  { 
    id: 'langgraph-quickstart', 
    title: 'LangGraph Quickstart', 
    icon: <Rocket className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'qs-graph-simulation', title: 'Graph API Simulation' },
        { id: 'qs-functional-api', title: 'Using the Functional API' },
    ]
  },
  { 
    id: 'langgraph-server', 
    title: 'Run a Local Server', 
    icon: <Server className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'server-install-cli', title: 'Install CLI' },
        { id: 'server-create-app', title: 'Create App' },
        { id: 'server-dependencies', title: 'Install Dependencies' },
        { id: 'server-env', title: 'Configure Environment' },
        { id: 'server-launch', title: 'Launch Server' },
        { id: 'server-test', title: 'Test Application' },
    ]
  },
    { 
    id: 'langgraph-persistence', 
    title: 'LangGraph Persistence', 
    icon: <Save className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'persistence-simulation', title: 'Live Simulation' },
        { id: 'persistence-history', title: 'State History API' },
        { id: 'persistence-memory-store', title: 'Memory Store' },
        { id: 'persistence-context-window', title: 'Context Window Management' },
        { id: 'persistence-capabilities', title: 'Key Capabilities' },
        { id: 'persistence-implementation', title: 'Implementation' },
    ]
  },
  {
    id: 'durable-execution',
    title: 'Durable Execution',
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'durable-what-is', title: 'What is Durability?' },
        { id: 'durable-simulation', title: 'Interactive Simulation' },
        { id: 'durable-modes', title: 'Durability Modes' },
    ]
  },
  { 
    id: 'streaming', 
    title: 'Streaming in LangGraph', 
    icon: <Radio className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'streaming-modes', title: 'Stream Modes Explained' },
        { id: 'streaming-simulation', title: 'Live Simulation' },
    ]
  },
  {
    id: 'interrupts',
    title: 'Human-in-the-loop: Interrupts',
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'interrupts-simulation', title: 'Interactive Simulation' },
        { id: 'interrupts-patterns', title: 'Common Patterns' },
    ]
  },
];

const persistenceCode = `from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from typing import Annotated
from typing_extensions import TypedDict
from operator import add

# 1. Define the state schema
class State(TypedDict):
    foo: str
    bar: Annotated[list[str], add]

# 2. Define the nodes
def node_a(state: State):
    return {"foo": "a", "bar": ["a"]}

def node_b(state: State):
    return {"foo": "b", "bar": ["b"]}

# 3. Wire the graph
workflow = StateGraph(State)
workflow.add_node("node_a", node_a)
workflow.add_node("node_b", node_b)
workflow.add_edge(START, "node_a")
workflow.add_edge("node_a", "node_b")
workflow.add_edge("node_b", END)

# 4. Compile with a checkpointer
# This tells LangGraph to save state automatically
checkpointer = MemorySaver()
graph = workflow.compile(checkpointer=checkpointer)

# 5. Invoke with a thread_id
# This creates a new, independent conversation thread
config = {"configurable": {"thread_id": "thread-1"}}
graph.invoke({"foo": "", "bar":[]}, config)`;

const allSectionIds = sections.flatMap(s => [s.id, ...(s.subsections ? s.subsections.map(sub => sub.id) : [])]);

const toolCode = `
# Initialize tools
tools = load_tools([’wikipedia’, ’llm-math’], llm=llm)

# Create agent
agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)

# Run query
result = agent.run("What is the average age of a cat? Multiply by 4.")
`;

const EcosystemCard = ({ title, icon, href, children }: { title: string, icon: React.ReactNode, href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block group">
        <Card className="h-full transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    {icon}
                    {title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{children}</p>
            </CardContent>
        </Card>
    </a>
);

const streamModesData = [
  { mode: '`values`', description: 'Streams the full value of the state after each step of the graph.' },
  { mode: '`updates`', description: 'Streams only the updates to the state after each step of the graph.' },
  { mode: '`messages`', description: 'Streams token-by-token output from LLMs within the graph.' },
  { mode: '`custom`', description: 'Streams any custom data that you manually emit from within your nodes.' },
  { mode: '`debug`', description: 'Streams as much information as possible for deep debugging.' },
];


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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_4fr] gap-8">
          <div className="lg:col-span-1">
            <TableOfContents 
              activeSectionId={activeSection} 
              activeSubSectionId={activeSubSectionId}
              onLinkClick={scrollToSection} 
            />
          </div>
          <main className="lg:col-span-1 space-y-24">
            
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
                        A core part of building an agent is giving it access to tools. These are functions the agent can call to interact with the outside world, like searching the web, running calculations, or accessing a database.
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

            <Section id="langgraph-overview" title="LangGraph Overview" icon={<GitBranch className="h-8 w-8 text-primary" />}>
                 <div className="space-y-6">
                    <p className="text-muted-foreground text-lg">
                        LangGraph is a powerful library for building agents that can reliably handle complex tasks. It gives you full control by letting you define an agent's workflow as a graph—a series of connected steps. Before building, it's helpful to understand a few core ideas.
                    </p>
                    <div id="lg-key-concepts">
                        <Card className="bg-muted/40">
                          <CardHeader>
                            <CardTitle>Key Concepts Explained</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-foreground">What is a "Runtime"?</h4>
                                <p className="text-sm text-muted-foreground">The runtime is the engine that executes your agent's graph. It's the system that runs the nodes in the correct order, manages the flow of data between steps, and handles the overall execution of the workflow you've designed.</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">What does "Stateful" mean?</h4>
                                <p className="text-sm text-muted-foreground">A stateful agent has **memory**. It automatically keeps track of the entire history of a task—every message, every tool used, and every result. This "state" allows the agent to make smarter decisions based on past events, not just the most recent input.</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">What is a "Long-Running" Agent?</h4>
                                <p className="text-sm text-muted-foreground">Because agents are stateful, they can be paused (e.g., to wait for human approval) and resumed days later, picking up exactly where they left off. This is essential for complex workflows that aren't finished in a single, quick interaction.</p>
                              </div>
                          </CardContent>
                        </Card>
                    </div>
                     <div id="lg-core-benefits" className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground">Core Benefits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Durable Execution</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Build agents that persist through failures and can run for extended periods, resuming from where they left off.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Human-in-the-loop</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Incorporate human oversight by inspecting and modifying agent state at any point.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Comprehensive Memory</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Create stateful agents with both short-term working memory and long-term memory across sessions.</p></CardContent></Card>
                           <Card className="bg-muted/30"><CardHeader><CardTitle className="text-base">Debugging with LangSmith</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Gain deep visibility into complex agent behavior with visualization tools that trace execution paths.</p></CardContent></Card>
                        </div>
                    </div>
                    
                    <div id="lg-ecosystem" className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground">LangGraph Ecosystem</h3>
                        <div className="space-y-4">
                            <EcosystemCard title="LangSmith" icon={<LineChart />} href="http://www.langchain.com/langsmith">
                                Trace requests, evaluate outputs, and monitor deployments in one place.
                            </EcosystemCard>
                             <EcosystemCard title="LangSmith Agent Server" icon={<Server />} href="https://docs.langchain.com/langsmith/agent-server">
                                Deploy and scale agents effortlessly with a purpose-built deployment platform for long running, stateful workflows.
                            </EcosystemCard>
                             <EcosystemCard title="LangChain" icon={<LinkIcon />} href="https://docs.langchain.com/oss/python/langchain/overview">
                                Provides integrations and composable components to streamline LLM application development.
                            </EcosystemCard>
                        </div>
                    </div>

                    <div id="lg-installation" className="pt-8 space-y-4">
                        <h3 className="text-xl font-semibold text-foreground">Installation</h3>
                        <p className="text-muted-foreground">
                           To build powerful agents, you first need the right tools. LangGraph is the core library for creating the agent's structure.
                        </p>
                        <Tabs defaultValue="pip" className="w-full">
                            <TabsList>
                            <TabsTrigger value="pip">pip</TabsTrigger>
                            <TabsTrigger value="uv">uv</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pip">
                            <CodeBlock code="pip install -U langgraph" />
                            </TabsContent>
                            <TabsContent value="uv">
                            <CodeBlock code="uv add langgraph" />
                            </TabsContent>
                        </Tabs>

                        <p className="text-muted-foreground">
                           While LangGraph can be used on its own, it works best with the rich ecosystem of model and tool integrations provided by the main LangChain library. These integrations make it simple to connect your agent to hundreds of different language models and external tools.
                        </p>
                        
                        <Tabs defaultValue="pip" className="w-full">
                            <TabsList>
                            <TabsTrigger value="pip">pip</TabsTrigger>
                            <TabsTrigger value="uv">uv</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pip">
                            <CodeBlock code="pip install -U langchain" />
                            </TabsContent>
                            <TabsContent value="uv">
                            <CodeBlock code="uv add langchain" />
                            </TabsContent>
                        </Tabs>
                        <p className="text-muted-foreground">
                            To work with specific LLM provider packages, you will need to install them separately. Refer to the integrations page for provider-specific installation instructions.
                        </p>
                    </div>

                    <p className="text-xs text-muted-foreground text-center pt-8">
                        LangGraph is inspired by Pregel and Apache Beam, and its interface draws inspiration from NetworkX.
                    </p>
                 </div>
            </Section>

            <Section id="thinking-in-langgraph" title="Thinking in LangGraph" icon={<Workflow className="h-8 w-8 text-primary" />}>
                <p className="text-muted-foreground text-center mb-8">
                    This interactive simulation walks you through the 5 core steps of building a stateful agent with LangGraph. As you open each step in the accordion, the diagram on the left will highlight the relevant parts, and a concise explanation with key insights will appear. This walkthrough makes the core concepts of nodes, state, and wiring a graph incredibly clear and easy to understand.
                </p>
                <ThinkingInLangGraph />
            </Section>

            <Section id="langgraph-quickstart" title="LangGraph Quickstart" icon={<Rocket className="h-8 w-8 text-primary" />}>
              <div className="space-y-6">
                <p className="text-muted-foreground text-lg">
                    LangGraph offers two main ways to build your agent: the **Graph API** and the **Functional API**. This quickstart demonstrates how to build the same calculator agent using both approaches.
                </p>
                <div className="text-sm text-muted-foreground space-y-2 p-4 border rounded-lg bg-muted/40">
                  <p><strong className='text-foreground'>Graph API:</strong> Best for visualizing complex flows. You explicitly define your agent as a graph of nodes (steps) and edges (connections). This is great for readability and debugging, and it's what we'll visualize in the simulation below.</p>
                   <p><strong className='text-foreground'>Functional API:</strong> Best for simpler, more linear agents. You define your agent using standard Python control flow (`if`, `while`) within a single decorated function. This can be more concise for straightforward logic.</p>
                </div>

                <div id="qs-graph-simulation">
                    <LangGraphQuickstartSimulator />
                </div>
                <div id="qs-functional-api">
                    <Accordion type="single" collapsible className="w-full mt-6">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Full Code for Functional API</AccordionTrigger>
                            <AccordionContent>
                                <CodeBlock code={`# Step 1: Define tools and model
from langchain.tools import tool
from langchain_community.chat_models.anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-3-sonnet-20240229", temperature=0)

# Define tools
@tool
def multiply(a: int, b: int) -> int:
    """Multiply \`a\` and \`b\`.
    Args:
        a: First int
        b: Second int
    """
    return a * b

@tool
def add(a: int, b: int) -> int:
    """Adds \`a\` and \`b\`.
    Args:
        a: First int
        b: Second int
    """
    return a + b

tools = [add, multiply]
tools_by_name = {tool.name: tool for tool in tools}
model_with_tools = model.bind_tools(tools)

from langgraph.graph import add_messages
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
    ToolCall,
    BaseMessage,
)
from langgraph.functional import task, entrypoint

# Step 2: Define model node
@task
def call_llm(messages: list[BaseMessage]):
    """LLM decides whether to call a tool or not"""
    return model_with_tools.invoke(
        [
            SystemMessage(
                content="You are a helpful assistant tasked with performing arithmetic on a set of inputs."
            )
        ]
        + messages
    )

# Step 3: Define tool node
@task
def call_tool(tool_call: ToolCall):
    """Performs the tool call"""
    tool = tools_by_name[tool_call["name"]]
    return tool.invoke(tool_call["args"])

# Step 4: Define agent
@entrypoint
def agent(messages: list[BaseMessage]):
    model_response = call_llm(messages).result()
    while model_response.tool_calls:
        # Execute tools
        tool_result_futures = [
            call_tool(tool_call) for tool_call in model_response.tool_calls
        ]
        tool_results = [fut.result() for fut in tool_result_futures]
        messages = add_messages(messages, [model_response, *tool_results])
        model_response = call_llm(messages).result()
    
    messages = add_messages(messages, model_response)
    return messages

# Invoke
messages = [HumanMessage(content="Add 3 and 4.")]
for chunk in agent.stream(messages, stream_mode="updates"):
    print(chunk)
    print("\\n")`}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

              </div>
            </Section>

            <Section id="langgraph-server" title="Run a Local Server" icon={<Server className="h-8 w-8 text-primary" />}>
              <div className="space-y-6">
                  <p className="text-muted-foreground text-lg">
                      This guide shows you how to run a LangGraph application locally using the `langgraph-cli`.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div className="space-y-8">
                      <div id="server-install-cli">
                          <h3 className="text-xl font-semibold mb-2">1. Install the LangGraph CLI</h3>
                          <p className="text-muted-foreground mb-4">First, install the command-line interface. Python 3.11 or higher is required.</p>
                          <CodeBlock code={'pip install -U "langgraph-cli[inmem]"'} />
                      </div>

                      <div id="server-create-app">
                          <h3 className="text-xl font-semibold mb-2">2. Create a New Application</h3>
                          <p className="text-muted-foreground mb-4">Create a new project from a template. This command sets up a starter application for you.</p>
                          <CodeBlock code={'langgraph new path/to/your/app'} />
                      </div>

                      <div id="server-dependencies">
                          <h3 className="text-xl font-semibold mb-2">3. Install Dependencies</h3>
                          <p className="text-muted-foreground mb-4">Navigate into your new app's directory and install the required packages.</p>
                          <CodeBlock code={'cd path/to/your/app\npip install -e .'} />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div id="server-env">
                          <h3 className="text-xl font-semibold mb-2">4. Configure Environment</h3>
                          <p className="text-muted-foreground mb-4">Create a `.env` file and add your LangSmith API key. You can get one for free from the LangSmith settings page.</p>
                          <CodeBlock code={'LANGSMITH_API_KEY=lsv2...'} />
                      </div>

                      <div id="server-launch">
                          <h3 className="text-xl font-semibold mb-2">5. Launch the Development Server</h3>
                          <p className="text-muted-foreground mb-4">Start the local agent server. This will host your LangGraph application.</p>
                          <CodeBlock code={'langgraph dev'} />
                          <p className="text-muted-foreground mt-4 mb-4">You will see output with links to the API and LangSmith Studio:</p>
                          <CodeBlock code={
`>    - 🚀 API: http://127.0.0.1:2024
>    - 🎨 Studio UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:2024
>    - 📚 API Docs: http://127.0.0.1:2024/docs`
                          } />
                      </div>

                      <div id="server-test">
                          <h3 className="text-xl font-semibold mb-2">6. Test Your Application</h3>
                          <p className="text-muted-foreground mb-4">Use the LangSmith Studio UI link from the previous step to visualize, debug, and interact with your running agent.</p>
                          <Card>
                              <CardHeader>
                                  <CardTitle>Test with the Python SDK</CardTitle>
                                  <CardDescription>You can also interact with your local server programmatically.</CardDescription>
                              </CardHeader>
                              <CardContent>
                                  <CodeBlock code={
`from langgraph_sdk import get_client
import asyncio

client = get_client(url="http://localhost:2024")

async def main():
    async for chunk in client.runs.stream(
        None,  # Threadless run
        "agent", # Assistant name
        input={
            "messages": [{"role": "human", "content": "What is LangGraph?"}],
        },
    ):
        print(chunk.data)

asyncio.run(main())`
                                  } />
                              </CardContent>
                          </Card>
                      </div>
                    </div>
                  </div>
              </div>
            </Section>

            <Section id="langgraph-persistence" title="LangGraph Persistence" icon={<Save className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">The Superpower of Stateful Agents</h3>
                    <p className="text-muted-foreground">
                        LangGraph's persistence layer is what elevates a simple workflow to a truly stateful, long-running agent. By automatically saving the agent's memory at every step, it unlocks powerful capabilities that are impossible with stateless services.
                    </p>
                </div>

                <Card className="bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Core Concepts: Threads & Checkpoints</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2"><ArrowRight className="text-primary"/>What is a Thread?</h4>
                        <p className="text-muted-foreground pl-6">Think of a thread as a single, continuous conversation or task. Every time you start a new, independent run of your agent, you give it a unique `thread_id`. This allows LangGraph to keep all the history for that specific task completely separate from others.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2"><ArrowRight className="text-primary"/>What is a Checkpoint?</h4>
                        <p className="text-muted-foreground pl-6">A checkpoint is a snapshot—a "save point"—of your agent's memory (its state) at a specific moment in time. LangGraph automatically creates a new checkpoint after each step in your graph. This is what makes the agent's memory durable.</p>
                      </div>
                  </CardContent>
                </Card>

                <div id="persistence-simulation">
                    <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Live Simulation: Visualizing Checkpoints</h3>
                    <p className="text-muted-foreground text-center mb-4">
                       This simulation demonstrates these concepts in action. Each time you "Run New Thread," you are creating a new, independent conversation. Watch as checkpoints are saved along the way. **Click on any checkpoint to inspect the agent's memory at that exact moment.**
                    </p>
                    <PersistenceSimulator />
                </div>
                
                 <div id="persistence-history">
                    <Card className="mb-8 bg-blue-500/10 border-blue-500/30">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><Key className="text-primary"/>Where do I get the IDs?</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4">
                            <div>
                                <h4 className="font-semibold text-foreground">`thread_id`: You create this.</h4>
                                <p className="text-muted-foreground">Think of the `thread_id` as a unique name for a conversation (e.g., a customer's session ID). You provide this string when you first invoke the graph. All steps in that conversation are saved under this ID.</p>
                                <CodeBlock code={`# You define the thread_id to start or resume a conversation
config = {"configurable": {"thread_id": "customer-session-123"}}`} className="mt-2" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">`checkpoint_id`: LangGraph gives you this.</h4>
                                <p className="text-muted-foreground">A `checkpoint_id` is the unique ID for each *step* within a thread. You find it by looking at the state history. This complete example shows how:</p>
                                <CodeBlock code={`from typing import Annotated
from typing_extensions import TypedDict
from operator import add
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.runnables import RunnableConfig

# A more complete example graph
class State(TypedDict):
    foo: str
    bar: Annotated[list[str], add]

def node_a(state: State):
    return {"foo": "a", "bar": ["a"]}

def node_b(state: State):
    return {"foo": "b", "bar": ["b"]}

workflow = StateGraph(State)
workflow.add_node("node_a", node_a)
workflow.add_node("node_b", node_b)
workflow.add_edge(START, "node_a")
workflow.add_edge("node_a", "node_b")
workflow.add_edge("node_b", END)

# Compile the graph with a checkpointer
checkpointer = InMemorySaver()
graph = workflow.compile(checkpointer=checkpointer)

# 1. Invoke the graph to create a history for a specific thread_id
config: RunnableConfig = {"configurable": {"thread_id": "my-thread-1"}}
graph.invoke({"foo": "", "bar": []}, config)

# 2. Get the history for that thread
history = graph.get_state_history(config)

# 3. Extract the checkpoint_id from the latest snapshot in the history
# The history is a list of snapshots, most recent first.
latest_checkpoint_id = history[0].config["configurable"]["checkpoint_id"]

print(f"The latest checkpoint ID is: {latest_checkpoint_id}")`} className="mt-2" />
                            </div>
                        </CardContent>
                    </Card>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Interacting with Agent History</h3>
                     <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="get-state" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">1. Get State: View the latest snapshot</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-4">You can retrieve the most recent state of any thread using `get_state`. This is useful for checking the final result of a run or inspecting its current status if it's paused.</p>
                                        <CodeBlock code={`# Get the latest state snapshot for thread "1"
config = {"configurable": {"thread_id": "1"}}
latest_snapshot = graph.get_state(config)`} />
                                    </div>
                                    <Card className="p-4 bg-background">
                                        <p className="text-xs text-muted-foreground text-center mb-2">Result: The latest StateSnapshot</p>
                                        <div className="p-3 border-2 border-primary bg-primary/10 rounded-lg text-xs">
                                            <p><span className="font-semibold text-foreground">values:</span> {'{\'foo\': \'b\', \'bar\': [\'a\', \'b\']}'}</p>
                                            <p><span className="font-semibold text-foreground">next:</span> ()</p>
                                        </div>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="get-history" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">2. Get State History: See every step</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-4">To see the entire journey of an agent, use `get_state_history`. This returns a full list of all checkpoints, letting you trace the agent's path from start to finish.</p>
                                        <CodeBlock code={`# Get the full history for thread "1"
config = {"configurable": {"thread_id": "1"}}
history = list(graph.get_state_history(config))`} />
                                    </div>
                                    <Card className="p-4 bg-background">
                                        <p className="text-xs text-muted-foreground text-center mb-2">Result: A list of all StateSnapshots</p>
                                        <div className="space-y-2">
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Checkpoint 3 (latest)</div>
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Checkpoint 2</div>
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Checkpoint 1</div>
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Checkpoint 0 (start)</div>
                                        </div>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="replay" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">3. Time Travel: Rerun from a past state</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-4">LangGraph's "time travel" lets you resume execution from any point in the past by invoking the graph with a specific `checkpoint_id`. This is incredibly powerful for debugging or exploring different outcomes from a specific decision point.</p>
                                        <CodeBlock code={`# Re-run the graph from a specific checkpoint
config = {"configurable": {
    "thread_id": "1",
    "checkpoint_id": "some_checkpoint_id"
}}
graph.invoke(None, config=config)`} />
                                    </div>
                                    <Card className="p-4 bg-background">
                                        <p className="text-xs text-muted-foreground text-center mb-2">Execution Flow</p>
                                        <div className="flex items-center justify-center">
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">Start</div>
                                            <div className="w-4 h-px bg-border"/>
                                            <div className="p-2 border rounded-lg text-xs border-primary bg-primary/10">Resume from here</div>
                                            <div className="w-4 h-px bg-border"/>
                                            <div className="p-2 border rounded-lg text-xs bg-muted/50">...</div>
                                        </div>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="update-state" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">4. Update State: Manually edit the agent's memory</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    <div>
                                       <p className="text-sm text-muted-foreground mb-4">You can manually modify an agent's memory at any point using `update_state`. This is the core mechanism for human-in-the-loop workflows, where a person can correct or approve an agent's work before it continues.</p>
                                       <CodeBlock code={`# Manually change the value of 'foo'
config = {"configurable": {"thread_id": "1"}}
graph.update_state(config, {"foo": "a new value"})`} />
                                    </div>
                                    <Card className="p-4 bg-background">
                                        <p className="text-xs text-muted-foreground text-center mb-2">State Change</p>
                                        <div className="space-y-2 text-xs">
                                            <p className="font-semibold text-foreground">Before:</p>
                                            <div className="p-2 border rounded-lg bg-muted/50">{'{\'foo\': \'old value\', \'bar\': [...]}'}</div>
                                            <div className="flex justify-center text-muted-foreground"><ArrowDown size={16}/></div>
                                            <p className="font-semibold text-foreground">After:</p>
                                            <div className="p-2 border rounded-lg bg-primary/10 border-primary">{'{\'foo\': \'a new value\', \'bar\': [...]}'}</div>
                                        </div>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                
                <div id="persistence-memory-store">
                    <h3 className="text-xl font-semibold text-foreground my-8">The Memory Store: Sharing State Across Conversations</h3>
                    <p className="text-muted-foreground mb-4">
                        While Checkpoints save the history for a single conversation (thread), the **Memory Store** allows an agent to remember information about a user *across multiple conversations*. This is how an agent can remember your name or preferences from one day to the next.
                    </p>
                    {/* Static Diagram */}
                    <div className="flex flex-col items-center space-y-4 my-6">
                        <Card className="p-4 bg-purple-500/10 border-purple-500/30 w-full max-w-md">
                             <CardTitle className="text-base flex items-center gap-2 text-purple-300"><Database /> Shared Memory Store (User ID: "user_123")</CardTitle>
                             <CardContent className="pt-2">
                                <p className="text-sm p-2 bg-background/50 rounded border">{"{ food_preference: 'I like pizza' }"}</p>
                             </CardContent>
                        </Card>
                        <div className="flex justify-around w-full max-w-2xl">
                           <ArrowDown className="text-muted-foreground" />
                           <ArrowDown className="text-muted-foreground" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                             <Card className="p-3">
                                <CardTitle className="text-sm flex items-center gap-2"><Layers/> Thread 1</CardTitle>
                                <CardContent className="pt-2">
                                    <p className="text-xs p-2 bg-muted rounded border">User: "What's a good place for dinner?"<br/>Agent: "Since you like pizza, how about Tony's Pizzeria?"</p>
                                 </CardContent>
                             </Card>
                             <Card className="p-3">
                                <CardTitle className="text-sm flex items-center gap-2"><Layers/> Thread 2 (a day later)</CardTitle>
                                 <CardContent className="pt-2">
                                    <p className="text-xs p-2 bg-muted rounded border">User: "Any other ideas?"<br/>Agent: "Of course. Besides pizza, what other foods do you enjoy?"</p>
                                 </CardContent>
                             </Card>
                        </div>
                    </div>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="memory-store-basic" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Basic Usage: Storing & Retrieving Memories</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <p className="text-sm text-muted-foreground mb-4">You can `put` memories into the store, namespaced by a user ID, and `search` for them later. This is done inside your agent's nodes.</p>
                               <CodeBlock code={`from langgraph.store.memory import InMemoryStore

# In reality, this would be a persistent store like Postgres
store = InMemoryStore()
user_id = "user_123"
namespace = (user_id, "memories")

# Store a memory
store.put(namespace, "memory_id_1", {"food_preference" : "I like pizza"})

# Retrieve all memories for that user
memories = store.search(namespace)`} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="memory-store-semantic" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Semantic Search: Finding Relevant Memories</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <p className="text-sm text-muted-foreground mb-4">The store can also perform semantic search, using vector embeddings to find memories that are conceptually similar to a query, not just exact matches.</p>
                               <CodeBlock code={`# Find memories related to the user's query
memories = store.search(
    namespace,
    query="What does the user like to eat?",
    limit=3  # Return top 3 matches
)`} />
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="production-stores" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Production Stores</AccordionTrigger>
                             <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-4">For production, use a store backed by a persistent database like Postgres or Redis.</p>
                                <Tabs defaultValue="postgres">
                                    <TabsList>
                                        <TabsTrigger value="postgres">Postgres</TabsTrigger>
                                        <TabsTrigger value="redis">Redis</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="postgres">
                                        <CodeBlock code={`from langgraph.store.postgres import PostgresStore

DB_URI = "postgresql://user:pass@host:port/db"
with PostgresStore.from_conn_string(DB_URI) as store:
    graph = builder.compile(store=store)`} />
                                    </TabsContent>
                                    <TabsContent value="redis">
                                        <CodeBlock code={`from langgraph.store.redis import RedisStore

DB_URI = "redis://user:pass@host:port"
with RedisStore.from_conn_string(DB_URI) as store:
    graph = builder.compile(store=store)`} />
                                    </TabsContent>
                                </Tabs>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div id="persistence-context-window">
                    <h3 className="text-xl font-semibold text-foreground my-8">Context Window Management</h3>
                    <p className="text-muted-foreground mb-4">
                        With short-term memory enabled, long conversations can exceed the LLM’s context window. Here are common solutions to manage the conversation history.
                    </p>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="trim-messages"  className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Trimming Messages</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-4">Use the `trim_messages` utility to keep only a specific number of recent tokens, ensuring the conversation history doesn't exceed the model's context limit.</p>
                                <CodeBlock code={`from langchain_core.messages.utils import (
    trim_messages,
    count_tokens_approximately
)

def call_model(state: MessagesState):
    messages = trim_messages(
        state["messages"],
        strategy="last",
        token_counter=count_tokens_approximately,
        max_tokens=128,
        start_on="human",
        end_on=("human", "tool"),
    )
    response = model.invoke(messages)
    return {"messages": [response]}`}/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="delete-messages"  className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Deleting Messages</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-2">You can permanently remove specific messages or clear the entire history using `RemoveMessage`.</p>
                                <p className="text-sm font-semibold text-foreground mb-2">To remove specific messages:</p>
                                <CodeBlock code={`from langchain.messages import RemoveMessage

def delete_messages(state):
    messages = state["messages"]
    if len(messages) > 2:
        # remove the earliest two messages
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:2]]}`} />
                                <p className="text-sm font-semibold text-foreground mt-4 mb-2">To remove all messages:</p>
                                <CodeBlock code={`from langgraph.graph.message import REMOVE_ALL_MESSAGES

def delete_messages(state):
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)]}`} />
                                <Alert variant="destructive" className="mt-4">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Warning</AlertTitle>
                                    <AlertDescription>
                                        When deleting messages, ensure the resulting history is valid. Some providers require history to start with a `user` message or that `tool` messages follow `assistant` tool calls.
                                    </AlertDescription>
                                </Alert>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="summarize-messages"  className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Summarizing Messages</AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                                <p className="text-sm text-muted-foreground mb-4">To avoid losing information, you can summarize older parts of the conversation. This maintains context while keeping the token count low.</p>
                                <div className="my-4 flex justify-center">
                                    <Image src="https://mintcdn.com/langchain-5e9cc07a/ybiAaBfoBvFquMDz/oss/images/summary.png?fit=max&auto=format&n=ybiAaBfoBvFquMDz&q=85&s=c8ed3facdccd4ef5c7e52902c72ba938" alt="Summarization Diagram" width={609} height={242} className="rounded-lg border bg-background" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">You can extend your state to include a `summary` and create a node to update it periodically.</p>
                                 <CodeBlock code={`from langgraph.graph import MessagesState
from langchain.messages import HumanMessage, RemoveMessage

class State(MessagesState):
    summary: str

def summarize_conversation(state: State):
    summary = state.get("summary", "")
    summary_message = (
        f"This is a summary of the conversation to date: {summary}\\n\\n"
        "Extend the summary by taking into account the new messages above:"
    ) if summary else "Create a summary of the conversation above:"

    messages = state["messages"] + [HumanMessage(content=summary_message)]
    response = model.invoke(messages)

    # Delete all but the 2 most recent messages
    delete_messages = [RemoveMessage(id=m.id) for m in state["messages"][:-2]]
    return {"summary": response.content, "messages": delete_messages}`} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>


                <div id="persistence-capabilities">
                    <h3 className="text-xl font-semibold text-foreground mb-4">What This Enables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><UserCheck className="text-primary"/> Human-in-the-loop</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Pause the agent, ask a human for approval or input, and then resume exactly where it left off, even days later.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><MemoryStick className="text-primary"/> Long-term Memory</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Agents can remember past interactions within the same thread, allowing for rich, context-aware conversations.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><History className="text-primary"/> Time Travel & Debugging</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">You can load the agent's state from any previous checkpoint to debug issues or explore different execution paths.</p></CardContent>
                        </Card>
                         <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="text-primary"/> Fault Tolerance</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">If the agent crashes, it can be restarted from the last successful checkpoint, preventing loss of work.</p></CardContent>
                        </Card>
                    </div>
                </div>
                
                 <div id="persistence-implementation">
                    <h3 className="text-xl font-semibold text-foreground my-8">Checkpointer Implementation Details</h3>
                     <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="checkpointer-libs" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">
                                <div className="flex items-center gap-3"><Database className="w-4 h-4"/> Checkpointer Libraries</div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <p className="text-sm text-muted-foreground mb-4">For production, it's essential to use a durable checkpointer backed by a persistent database. LangGraph offers several integrations.</p>
                                <Tabs defaultValue="postgres" className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="postgres">Postgres</TabsTrigger>
                                        <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
                                        <TabsTrigger value="redis">Redis</TabsTrigger>
                                        <TabsTrigger value="sqlite">Sqlite</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="postgres">
                                        <CodeBlock code={`from langgraph.checkpoint.postgres import PostgresSaver

DB_URI = "postgresql://user:pass@host:port/db"
checkpointer = PostgresSaver.from_conn_string(DB_URI)`} />
                                    </TabsContent>
                                    <TabsContent value="mongodb">
                                         <CodeBlock code={`from langgraph.checkpoint.mongodb import MongoDBSaver

DB_URI = "mongodb://user:pass@host:port/"
checkpointer = MongoDBSaver.from_conn_string(DB_URI)`} />
                                    </TabsContent>
                                    <TabsContent value="redis">
                                         <CodeBlock code={`from langgraph.checkpoint.redis import RedisSaver

DB_URI = "redis://user:pass@host:port"
checkpointer = RedisSaver.from_conn_string(DB_URI)`} />
                                    </TabsContent>
                                     <TabsContent value="sqlite">
                                         <CodeBlock code={`from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3

checkpointer = SqliteSaver(conn=sqlite3.connect("checkpoints.db"))`} />
                                    </TabsContent>
                                </Tabs>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="serializer" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">
                               <div className="flex items-center gap-3"><Binary className="w-4 h-4"/> Serialization</div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <p className="text-sm text-muted-foreground mb-4">
                                **What is it?** Serialization is the process of converting a live Python object (like a dictionary or a custom class object) into a format that can be stored, like a string of text.
                               </p>
                               <p className="text-sm text-muted-foreground mb-4">
                                **Why is it needed?** Databases can only store simple data types like text and numbers. To save your agent's state (its memory), we must first "freeze" the live Python objects into a storable format. When we load the agent later, we "thaw" (deserialize) the text back into live objects.
                                </p>
                                <SerializationVisual />
                               <p className="text-sm text-muted-foreground mb-4">
                                LangGraph's default `JsonPlusSerializer` handles most common data types. However, if you need to save complex objects that aren't standard JSON (like Pandas DataFrames), you can enable a `pickle` fallback.
                               </p>
                                <CodeBlock code={`from langgraph.checkpoint.memory import InMemorySaver
from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer

# WARNING: Unpickling data from an untrusted source is insecure.
graph.compile(
    checkpointer=InMemorySaver(
        serde=JsonPlusSerializer(pickle_fallback=True)
    )
)`} />
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="encryption" className="border-b-0">
                            <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">
                               <div className="flex items-center gap-3"><Lock className="w-4 h-4"/> Encryption</div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 px-2">
                               <p className="text-sm text-muted-foreground mb-4">For security, you can encrypt the state before it's saved. LangGraph provides an `EncryptedSerializer` that works with any checkpointer.</p>
                               <CodeBlock code={`# The key is read from the LANGGRAPH_AES_KEY environment variable
from langgraph.checkpoint.serde.encrypted import EncryptedSerializer
from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3

serde = EncryptedSerializer.from_pycryptodome_aes()
checkpointer = SqliteSaver(sqlite3.connect("checkpoint.db"), serde=serde)
graph.compile(checkpointer=checkpointer)`} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>


              </div>
            </Section>

            <Section id="durable-execution" title="Durable Execution" icon={<ShieldCheck className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <div id="durable-what-is">
                    <p className="text-muted-foreground text-lg">
                        **Durable execution** allows a workflow to save its progress, so it can be paused and resumed later. This is essential for long-running tasks or workflows that require human approval. If a process crashes, you can restart it from the last saved step without re-running everything.
                    </p>
                    <Alert className="mt-4">
                        <Shield className="h-4 w-4" />
                        <AlertTitle>Already Enabled!</AlertTitle>
                        <AlertDescription>
                        If you're using a checkpointer, you already have durable execution enabled. The key is to design your workflow correctly to take advantage of it.
                        </AlertDescription>
                    </Alert>
                </div>

                <div id="durable-simulation">
                    <h3 className="text-xl font-semibold text-foreground text-center">Interactive Simulation: Consistent Replay</h3>
                     <p className="text-muted-foreground text-center mb-4">
                        This simulation shows why you must wrap operations with side-effects (like API calls) in a `@task`. When a workflow resumes, LangGraph **replays** the steps. Without `@task`, the API call runs again, leading to inconsistent results. With `@task`, the result from the first run is loaded from the checkpoint, ensuring consistency.
                    </p>
                    <DurableExecutionSimulator />
                </div>
                
                <div id="durable-modes">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Durability Modes</h3>
                    <p className="text-muted-foreground mb-4">You can choose how often to save progress, balancing performance and safety.</p>
                    <Tabs defaultValue="sync">
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="sync">Sync</TabsTrigger>
                            <TabsTrigger value="async">Async</TabsTrigger>
                            <TabsTrigger value="exit">Exit</TabsTrigger>
                        </TabsList>
                        <TabsContent value="sync">
                             <Card className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle>sync</CardTitle>
                                    <CardDescription>Saves state before each step. Safest, but slowest.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <CodeBlock code={`graph.stream(
    {"input": "test"},
    stream_mode="updates",
    config={"durability": "sync"}
)`} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="async">
                             <Card className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle>async</CardTitle>
                                    <CardDescription>Saves state in the background. Good balance of safety and speed.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <CodeBlock code={`graph.stream(
    {"input": "test"},
    stream_mode="updates",
    config={"durability": "async"}
)`} />
                                </CardContent>
                             </Card>
                        </TabsContent>
                        <TabsContent value="exit">
                             <Card className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle>exit</CardTitle>
                                    <CardDescription>Only saves at the very end. Fastest, but no recovery from mid-run crashes.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <CodeBlock code={`graph.stream(
    {"input": "test"},
    stream_mode="updates",
    config={"durability": "exit"}
)`} />
                                </CardContent>
                             </Card>
                        </TabsContent>
                    </Tabs>
                </div>
              </div>
            </Section>

            <Section id="streaming" title="Streaming in LangGraph" icon={<Radio className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                <p className="text-muted-foreground text-lg">
                  LangGraph provides a powerful streaming system to surface real-time updates. By displaying output progressively, streaming significantly improves user experience, especially when dealing with LLM latency.
                </p>
                <div id="streaming-modes">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Stream Modes Explained</h3>
                   <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mode</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {streamModesData.map((item) => (
                            <TableRow key={item.mode}>
                              <TableCell className="font-mono font-semibold">{item.mode}</TableCell>
                              <TableCell>{item.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                   </Card>
                </div>
                <div id="streaming-simulation">
                  <h3 className="text-xl font-semibold text-center my-6 text-foreground">Live Streaming Simulation</h3>
                  <StreamingSimulator />
                </div>
              </div>
            </Section>

            <Section id="interrupts" title="Human-in-the-loop: Interrupts" icon={<UserCheck className="h-8 w-8 text-primary" />}>
              <div className="space-y-8">
                  <p className="text-muted-foreground text-lg">
                      Interrupts allow you to pause graph execution at specific points and wait for external input before continuing. This enables powerful human-in-the-loop patterns. When an interrupt is triggered, LangGraph saves the graph's state and waits indefinitely until you resume execution.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li><strong className="text-foreground">Checkpointing keeps your place:</strong> The checkpointer writes the exact graph state so you can resume later.</li>
                      <li><strong className="text-foreground">`thread_id` is your pointer:</strong> This tells the checkpointer which conversation state to load.</li>
                      <li><strong className="text-foreground">Interrupt payloads are returned:</strong> The data you pass to `interrupt()` is returned to your application, so you know what the graph is waiting for.</li>
                  </ul>

                  <div id="interrupts-simulation">
                      <h3 className="text-xl font-semibold text-foreground text-center mb-4">Interactive Simulation: Approve/Reject</h3>
                      <p className="text-muted-foreground text-center mb-4">
                          This simulation demonstrates the core interrupt workflow. Run the graph to see it pause for approval. Your choice (Approve/Reject) will be sent back to the graph to determine the next step.
                      </p>
                      <InterruptsSimulator />
                  </div>

                  <div id="interrupts-patterns">
                      <h3 className="text-xl font-semibold text-foreground mb-4">Common Patterns & Full Code Examples</h3>
                      <Accordion type="single" collapsible className="w-full space-y-2">
                          <AccordionItem value="approve-reject" className="border-b-0">
                              <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Approve or Reject Actions</AccordionTrigger>
                              <AccordionContent className="pt-4 px-2">
                                  <p className="text-sm text-muted-foreground mb-4">Pause before executing critical actions like API calls or database changes to get human approval. The value passed to `Command(resume=...)` is returned by the `interrupt()` call.</p>
                                  <CodeBlock code={`from typing import Literal, Optional, TypedDict
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt

class ApprovalState(TypedDict):
    action_details: str
    status: Optional[Literal["pending", "approved", "rejected"]]

def approval_node(state: ApprovalState) -> Command[Literal["proceed", "cancel"]]:
    # Expose details so the caller can render them in a UI
    decision = interrupt({
        "question": "Approve this action?",
        "details": state["action_details"],
    })
    # Route to the appropriate node after resume
    return Command(goto="proceed" if decision else "cancel")

def proceed_node(state: ApprovalState):
    return {"status": "approved"}

def cancel_node(state: ApprovalState):
    return {"status": "rejected"}

builder = StateGraph(ApprovalState)
builder.add_node("approval", approval_node)
builder.add_node("proceed", proceed_node)
builder.add_node("cancel", cancel_node)
builder.add_edge(START, "approval")
builder.add_edge("proceed", END)
builder.add_edge("cancel", END)

# Use a more durable checkpointer in production
checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "approval-123"}}
initial = graph.invoke(
    {"action_details": "Transfer $500", "status": "pending"},
    config=config,
)
print(initial["__interrupt__"])

# Resume with the decision; True routes to proceed, False to cancel
resumed = graph.invoke(Command(resume=True), config=config)
print(resumed["status"]) # -> "approved"`} />
                              </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="review-edit" className="border-b-0">
                              <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Review and Edit State</AccordionTrigger>
                              <AccordionContent className="pt-4 px-2">
                                  <p className="text-sm text-muted-foreground mb-4">Let humans review and modify LLM outputs or other parts of the state before the graph continues.</p>
                                  <CodeBlock code={`import sqlite3
from typing import TypedDict
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt

class ReviewState(TypedDict):
    generated_text: str

def review_node(state: ReviewState):
    # Ask a reviewer to edit the generated content
    updated = interrupt({
        "instruction": "Review and edit this content",
        "content": state["generated_text"],
    })
    return {"generated_text": updated}

builder = StateGraph(ReviewState)
builder.add_node("review", review_node)
builder.add_edge(START, "review")
builder.add_edge("review", END)

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "review-42"}}
initial = graph.invoke({"generated_text": "Initial draft"}, config=config)
print(initial["__interrupt__"])

# Resume with the edited text from the reviewer
final_state = graph.invoke(
    Command(resume="Improved draft after review"),
    config=config,
)
print(final_state["generated_text"]) # -> "Improved draft after review"`} />
                              </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="interrupt-tools" className="border-b-0">
                              <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Interrupts within Tools</AccordionTrigger>
                              <AccordionContent className="pt-4 px-2">
                                  <p className="text-sm text-muted-foreground mb-4">You can place interrupts directly inside tool functions. This makes the tool itself pause for approval whenever it's called.</p>
                                  <CodeBlock code={`import sqlite3
from typing import TypedDict
from langchain.tools import tool
from langchain_anthropic import ChatAnthropic
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt

class AgentState(TypedDict):
    messages: list[dict]

@tool
def send_email(to: str, subject: str, body: str):
    """Send an email to a recipient."""
    response = interrupt({
        "action": "send_email",
        "to": to,
        "subject": subject,
        "body": body,
        "message": "Approve sending this email?",
    })
    if response.get("action") == "approve":
        final_to = response.get("to", to)
        final_subject = response.get("subject", subject)
        final_body = response.get("body", body)
        print(f"[send_email] to={final_to} subject={final_subject} body={final_body}")
        return f"Email sent to {final_to}"
    return "Email cancelled by user"

model = ChatAnthropic(model="claude-3-sonnet-20240229").bind_tools([send_email])

def agent_node(state: AgentState):
    result = model.invoke(state["messages"])
    return {"messages": state["messages"] + [result]}

builder = StateGraph(AgentState)
builder.add_node("agent", agent_node)
builder.add_edge(START, "agent")
builder.add_edge("agent", END)

checkpointer = SqliteSaver(sqlite3.connect("tool-approval.db"))
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "email-workflow"}}
initial = graph.invoke(
    {"messages": [{"role": "user", "content": "Send an email to alice@example.com about the meeting"}]},
    config=config,
)
print(initial["__interrupt__"])

# Resume with approval and optionally edited arguments
resumed = graph.invoke(
    Command(resume={"action": "approve", "subject": "Updated subject"}),
    config=config,
)
print(resumed["messages"][-1])`} />
                              </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="validate-input" className="border-b-0">
                              <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">Validate Human Input</AccordionTrigger>
                              <AccordionContent className="pt-4 px-2">
                                  <p className="text-sm text-muted-foreground mb-4">Use a loop with an interrupt to validate input and re-prompt the user if it's invalid.</p>
                                  <CodeBlock code={`import sqlite3
from typing import TypedDict
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command, interrupt

class FormState(TypedDict):
    age: int | None

def get_age_node(state: FormState):
    prompt = "What is your age?"
    while True:
        answer = interrupt(prompt)
        if isinstance(answer, int) and answer > 0:
            return {"age": answer}
        prompt = f"'{answer}' is not a valid age. Please enter a positive number."

builder = StateGraph(FormState)
builder.add_node("collect_age", get_age_node)
builder.add_edge(START, "collect_age")
builder.add_edge("collect_age", END)

checkpointer = SqliteSaver(sqlite3.connect("forms.db"))
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "form-1"}}
first = graph.invoke({"age": None}, config=config)
print(first["__interrupt__"])

# Provide invalid data; the node re-prompts
retry = graph.invoke(Command(resume="thirty"), config=config)
print(retry["__interrupt__"])

# Provide valid data; loop exits and state updates
final = graph.invoke(Command(resume=30), config=config)
print(final["age"]) # -> 30`} />
                              </AccordionContent>
                          </AccordionItem>
                      </Accordion>
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
