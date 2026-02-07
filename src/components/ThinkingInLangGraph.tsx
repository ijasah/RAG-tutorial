"use client";
import {
    Brain,
    Database,
    Mail,
    Search,
    Bug,
    DraftingCompass,
    UserCheck,
    Send,
    Check,
    Code,
    TriangleAlert,
    Workflow,
    ArrowDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const StepCard = ({ icon, title, href, children }: { icon: React.ReactNode; title: string; href: string; children: React.ReactNode }) => (
    <a href={href} className="block group">
        <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-base">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{children}</p>
            </CardContent>
        </Card>
    </a>
);

const Node = ({ name, className }: { name: string; className?: string }) => (
    <div className={`flex items-center justify-center py-2 px-4 border rounded-md bg-card shadow-sm text-center text-sm font-medium ${className}`}>
        {name}
    </div>
);


export const ThinkingInLangGraph = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
                 <h3 className="font-semibold text-lg">Customer Support Agent Workflow</h3>
                <div className="relative p-4 border rounded-lg bg-muted/20 diagram-container">
                    <div className="flex flex-col items-center space-y-3 text-center">
                        <Node name="START" />
                        <ArrowDown className="h-5 w-5 text-muted-foreground" />
                        <Node name="Read Email" />
                        <ArrowDown className="h-5 w-5 text-muted-foreground" />
                        <Node name="Classify Intent" />
                        
                        {/* Branching connector */}
                        <div className="h-10 w-full relative">
                            <div className="absolute top-0 left-1/2 w-px h-1/2 bg-border border-dashed border-r"></div>
                            <div className="absolute top-1/2 left-[20%] w-[60%] h-px bg-border border-dashed border-b"></div>
                            <div className="absolute top-1/2 left-[20%] w-px h-1/2 bg-border border-dashed border-r"></div>
                            <div className="absolute top-1/2 left-1/2 w-px h-1/2 bg-border border-dashed border-r"></div>
                            <div className="absolute top-1/2 right-[20%] w-px h-1/2 bg-border border-dashed border-r"></div>
                        </div>

                        <div className="grid grid-cols-3 gap-x-2 w-full max-w-md">
                            <Node name="Doc Search" />
                            <Node name="Bug Track" />
                            <Node name="Human Review" />
                        </div>

                        {/* Merging connector */}
                        <div className="h-10 w-full relative">
                            <div className="absolute bottom-0 left-1/2 w-px h-1/2 bg-border"></div>
                            <div className="absolute bottom-1/2 left-[20%] w-[60%] h-px bg-border"></div>
                            <div className="absolute bottom-1/2 left-[20%] w-px h-1/2 bg-border"></div>
                            <div className="absolute bottom-1/2 left-1/2 w-px h-1/2 bg-border"></div>
                            <div className="absolute bottom-1/2 right-[20%] w-px h-1/2 bg-border"></div>
                        </div>

                        <Node name="Draft Reply" />
                        
                        {/* Second Branching connector */}
                         <div className="h-10 w-full relative">
                            <div className="absolute top-0 left-1/2 w-px h-1/2 bg-border border-dashed border-r"></div>
                            <div className="absolute top-1/2 left-1/4 w-1/2 h-px bg-border border-dashed border-b"></div>
                            <div className="absolute top-1/2 left-1/4 w-px h-1/2 bg-border border-dashed border-r"></div>
                            <div className="absolute top-1/2 right-1/4 w-px h-1/2 bg-border border-dashed border-r"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 w-full max-w-xs">
                             <Node name="Human Review" />
                            <Node name="Send Reply" />
                        </div>

                        {/* Second Merging connector */}
                         <div className="h-10 w-full relative">
                            <div className="absolute bottom-0 left-1/2 w-px h-1/2 bg-border"></div>
                            <div className="absolute bottom-1/2 left-1/4 w-1/2 h-px bg-border"></div>
                            <div className="absolute bottom-1/2 left-1/4 w-px h-1/2 bg-border"></div>
                            <div className="absolute bottom-1/2 right-1/4 w-px h-1/2 bg-border"></div>
                        </div>

                        <Node name="END" />
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="font-semibold text-lg">5 Steps to Building an Agent</h3>
                 <Accordion type="single" collapsible className="w-full" defaultValue="step-1">
                    <AccordionItem value="step-1">
                        <AccordionTrigger>1. Map your workflow</AccordionTrigger>
                        <AccordionContent>
                           Start by identifying the distinct steps in your process. Each step will become a **node** (a function that does one specific thing). Sketch how these steps connect to each other.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="step-2">
                        <AccordionTrigger>2. Identify what each step needs</AccordionTrigger>
                        <AccordionContent>
                           For each node, determine what it needs to do: Is it an LLM call, a data lookup, an action, or does it require user input? This defines the node's function and the context it requires from the shared state.
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-3">
                        <AccordionTrigger>3. Design your state</AccordionTrigger>
                        <AccordionContent>
                            State is the shared memory for your agent. Define a schema that holds the raw data that needs to persist across steps. A key principle is to keep the state raw and format prompts on-demand within each node.
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-4">
                        <AccordionTrigger>4. Build your nodes</AccordionTrigger>
                        <AccordionContent>
                           Implement each step as a Python function that takes the current state and returns updates to it. It's crucial to handle different types of errors appropriately within your nodes (e.g., retries for transient errors, looping back for LLM-recoverable errors).
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-5">
                        <AccordionTrigger>5. Wire it together</AccordionTrigger>
                        <AccordionContent>
                           Connect your nodes into a working graph. Since nodes can handle their own routing, you often only need a few essential edges. For features like human-in-the-loop, you'll compile your graph with a checkpointer to save state between runs.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                 <div className="pt-6">
                    <h3 className="font-semibold text-lg">Key Insights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                       <StepCard title="Break into discrete steps" icon={<Workflow className="text-primary"/>} href="#step-1">
                           Each node does one thing well. This enables resilience, streaming, and clear debugging.
                       </StepCard>
                       <StepCard title="State is shared memory" icon={<Database className="text-primary"/>} href="#step-3">
                           Store raw data, not formatted text. This lets different nodes use the same information in different ways.
                       </StepCard>
                       <StepCard title="Nodes are functions" icon={<Code className="text-primary"/>} href="#step-4">
                           They take state, do work, and return updates. They can also specify the next destination to handle routing.
                       </StepCard>
                       <StepCard title="Errors are part of the flow" icon={<TriangleAlert className="text-primary"/>} href="#step-4">
                           Handle transient, recoverable, and user-fixable errors with different strategies.
                       </StepCard>
                    </div>
                </div>
            </div>
        </div>
    );
};
