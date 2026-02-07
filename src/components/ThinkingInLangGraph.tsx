"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Database,
    Code,
    TriangleAlert,
    Workflow,
    ArrowDown,
    GitBranch,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/code-block';

const stateCode = `
class EmailAgentState(TypedDict):
    # Raw data, not formatted text
    email_content: str
    classification: dict | None
    search_results: list[str] | None
    draft_response: str | None
`;

const nodeCode = `
# A node is just a function that:
# 1. Takes the current state
# 2. Performs some logic
# 3. Returns updates to the state
def search_documentation(state: EmailAgentState) -> dict:
    query = f"{state['classification']['topic']}"
    results = doc_search_tool.invoke(query)
    # Return a dictionary of updates
    return {"search_results": results}
`;

const wiringCode = `
# Create the graph
workflow = StateGraph(EmailAgentState)

# Add nodes
workflow.add_node("read_email", read_email)
workflow.add_node("classify", classify_intent)
# ... add other nodes

# Add edges to define the flow
workflow.add_edge(START, "read_email")
workflow.add_edge("read_email", "classify")
# ... add conditional edges
`;


const StepCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <Card className="h-full bg-card/50">
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
);

const Node = ({ name, className, active }: { name: string; className?: string, active?: boolean }) => (
    <motion.div 
        layout
        className={cn(
        `flex items-center justify-center py-2 px-4 border-2 rounded-lg bg-card shadow-sm text-center text-sm font-medium transition-all duration-300`,
         active ? 'border-primary shadow-lg' : 'border-border',
         className
    )}>
        {name}
    </motion.div>
);

const DiagramArrow = ({ active }: { active?: boolean }) => (
     <motion.div layout>
        <ArrowDown className={cn("h-5 w-5 text-muted-foreground transition-colors", active && "text-primary")} />
     </motion.div>
);

const BranchConnector = ({ active }: { active?: boolean }) => (
    <motion.div layout className="h-10 w-full relative">
        <div className={cn("absolute top-0 left-1/2 w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute top-1/2 left-[20%] w-[60%] h-px bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute top-1/2 left-[20%] w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute top-1/2 right-[20%] w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
    </motion.div>
);

const MergeConnector = ({ active }: { active?: boolean }) => (
     <motion.div layout className="h-10 w-full relative">
        <div className={cn("absolute bottom-0 left-1/2 w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute bottom-1/2 left-[20%] w-[60%] h-px bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute bottom-1/2 left-[20%] w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute bottom-1/2 right-[20%] w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
    </motion.div>
);


export const ThinkingInLangGraph = () => {
    const [activeStep, setActiveStep] = useState("step-1");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
            <div className="space-y-4 sticky top-24">
                 <h3 className="font-semibold text-lg text-center">Customer Support Agent Workflow</h3>
                <div className="relative p-4 border rounded-lg bg-muted/20 min-h-[500px]">
                    <AnimatePresence>
                    <motion.div 
                        className="flex flex-col items-center space-y-2 text-center"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        <Node name="START" active={activeStep === 'step-1' || activeStep === 'step-5'} />
                        <DiagramArrow active={activeStep === 'step-5'}/>
                        <Node name="Classify Intent" active={activeStep === 'step-1' || activeStep === 'step-2'} />
                        <BranchConnector active={activeStep === 'step-5'} />

                        <div className="grid grid-cols-3 gap-x-2 w-full max-w-sm">
                            <Node name="Doc Search" active={activeStep === 'step-1' || activeStep === 'step-2'} />
                            <Node name="Bug Track" active={activeStep === 'step-1' || activeStep === 'step-2'} />
                            <Node name="Human Review" active={activeStep === 'step-1' || activeStep === 'step-2'} />
                        </div>

                        <MergeConnector active={activeStep === 'step-5'} />
                        <Node name="Draft Reply" active={activeStep === 'step-1' || activeStep === 'step-4'} />
                        <DiagramArrow active={activeStep === 'step-5'}/>
                        <Node name="END" active={activeStep === 'step-1' || activeStep === 'step-5'} />
                    </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="font-semibold text-lg">5 Steps to Building an Agent</h3>
                 <Accordion type="single" collapsible className="w-full space-y-2" defaultValue="step-1" onValueChange={value => value && setActiveStep(value)}>
                    <AccordionItem value="step-1" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">1. Map your workflow</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                           <p className="text-sm text-muted-foreground mb-4">Start by identifying the distinct steps in your process. Each step will become a **node**. The diagram on the left shows the complete workflow for our email agent.</p>
                           <StepCard title="Insight: Break into discrete steps" icon={<Workflow className="text-primary"/>}>
                               Each node does one thing well. This enables resilience, streaming, and clear debugging.
                           </StepCard>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="step-2" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">2. Identify what each node needs</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                           <p className="text-sm text-muted-foreground mb-4">For each node, determine its role. The highlighted nodes show different roles: `Classify Intent` (Reasoning), `Doc Search` (Data), and `Bug Track` (Action).</p>
                           <StepCard title="Insight: Nodes have roles" icon={<Brain className="text-primary"/>}>
                               Some nodes reason (LLMs), some fetch data (tools), and some perform actions (APIs). 
                           </StepCard>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-3" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">3. Design your state</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                            <p className="text-sm text-muted-foreground mb-4">State is the shared memory for your agent. Define a schema that holds only the **raw data** that needs to persist across steps.</p>
                            <CodeBlock code={stateCode} />
                            <StepCard title="Insight: State is shared memory" icon={<Database className="text-primary"/>}>
                               Store raw data, not formatted text. This lets different nodes use the same information in different ways.
                           </StepCard>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-4" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">4. Build your nodes</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                           <p className="text-sm text-muted-foreground mb-4">Implement each step as a Python function that takes the current state and returns updates. The `Draft Reply` node is now highlighted.</p>
                           <CodeBlock code={nodeCode} />
                           <div className="grid grid-cols-2 gap-2 mt-2">
                               <StepCard title="Nodes are functions" icon={<Code className="text-primary"/>}>
                                   They take state, do work, and return updates.
                               </StepCard>
                               <StepCard title="Errors are part of the flow" icon={<TriangleAlert className="text-primary"/>}>
                                   Handle transient, recoverable, and user-fixable errors.
                               </StepCard>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-5" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">5. Wire it together</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                           <p className="text-sm text-muted-foreground mb-4">Connect your nodes into a working graph. The highlighted edges show the essential connections. The nodes themselves handle the routing logic.</p>
                           <CodeBlock code={wiringCode} />
                           <StepCard title="Insight: Graph structure emerges naturally" icon={<GitBranch className="text-primary"/>}>
                               You define the essential connections, and your nodes handle their own routing logic.
                           </StepCard>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};
