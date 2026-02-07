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
import { LangGraphQuickstartSimulator } from '@/components/LangGraphQuickstartSimulator';


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
    id: 'langgraph-quickstart', 
    title: 'LangGraph Quickstart', 
    icon: <Rocket className="h-8 w-8 text-primary" />,
    subsections: [
        { id: 'qs-graph-api', title: 'Using the Graph API' },
        { id: 'qs-functional-api', title: 'Using the Functional API' },
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

            <Section id="langgraph-quickstart" title="LangGraph Quickstart" icon={<Rocket className="h-8 w-8 text-primary" />}>
              <div className="space-y-6">
                <p className="text-muted-foreground text-lg">
                    LangGraph offers two main ways to build your agent: the **Graph API** and the **Functional API**. This quickstart demonstrates how to build the same calculator agent using both approaches.
                </p>
                <div className="text-sm text-muted-foreground space-y-2 p-4 border rounded-lg bg-muted/40">
                  <p><strong className='text-foreground'>Graph API:</strong> Best for visualizing complex flows. You explicitly define your agent as a graph of nodes (steps) and edges (connections). This is great for readability and debugging, and it's what we'll visualize in the simulation below.</p>
                   <p><strong className='text-foreground'>Functional API:</strong> Best for simpler, more linear agents. You define your agent using standard Python control flow (`if`, `while`) within a single decorated function. This can be more concise for straightforward logic.</p>
                </div>

                <Tabs defaultValue="graph-api" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="graph-api">Use the Graph API</TabsTrigger>
                        <TabsTrigger value="functional-api">Use the Functional API</TabsTrigger>
                    </TabsList>
                    <TabsContent value="graph-api" id="qs-graph-api" className='pt-4'>
                        <LangGraphQuickstartSimulator />
                    </TabsContent>
                    <TabsContent value="functional-api" id="qs-functional-api">
                        <p className="text-muted-foreground my-4">
                            The Functional API achieves the same result with more familiar Python syntax. Instead of defining nodes and edges, you use decorators (`@task`, `@entrypoint`) and standard control flow.
                        </p>
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
                    </TabsContent>
                </Tabs>
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
