"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    Database,
    Code,
    GitBranch,
    Workflow,
    ArrowDown,
    Share2,
    BookCopy,
    Wrench,
    AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { CodeBlock } from './ui/code-block';

const stateCode = `class AgentState(TypedDict):
    # The agent's memory
    email_content: str
    classification: str
    search_results: list[str]
    draft_response: str`;

const nodeCode = `# A node is a function that edits the state
def search_documentation(state: AgentState) -> dict:
    topic = state['classification']
    results = search_tool(topic)
    return {"search_results": results}`;
    
const conditionalEdgeCode = `def should_route(state: AgentState):
    if state['classification'] == "billing":
        return "human_review"
    else:
        return "search_documentation"

workflow.add_conditional_edges(
    "classify_intent",
    should_route
)`;

const wiringCode = `workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("classify_intent", classify_intent_node)
workflow.add_node("search_documentation", search_documentation_node)
# ...

# Add edges
workflow.add_edge(START, "classify_intent")
workflow.add_edge("search_documentation", "draft_response")
# ...

app = workflow.compile()`;


const InsightCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="mt-4 p-3 border rounded-lg bg-muted/40">
        <h4 className="font-semibold text-sm flex items-center gap-2 mb-1">
            {icon}
            {title}
        </h4>
        <p className="text-xs text-muted-foreground pl-7">{children}</p>
    </div>
);

const Node = ({ name, className, active }: { name: string; className?: string, active?: boolean }) => (
    <motion.div 
        className={cn(
        `flex items-center justify-center py-2 px-4 border-2 rounded-lg bg-card shadow-sm text-center text-sm font-medium transition-all duration-300`,
         active ? 'border-primary shadow-lg text-primary-foreground bg-primary/80' : 'border-border text-foreground/80',
         className
    )}>
        {name}
    </motion.div>
);

const DiagramArrow = ({ active, className }: { active?: boolean, className?: string }) => (
    <div className={cn("flex justify-center items-center", className)}>
        <ArrowDown className={cn("h-5 w-5 text-muted-foreground/60 transition-colors", active && "text-primary")} />
     </div>
);

const BranchConnector = ({ active, className }: { active?: boolean, className?: string }) => (
    <div className={cn("h-10 w-full relative", className)}>
        <div className={cn("absolute top-0 left-1/2 w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute top-1/2 left-[15%] w-[70%] h-px bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute top-1/2 left-[15%] w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute top-1/2 right-[15%] w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
    </div>
);

const MergeConnector = ({ active, className }: { active?: boolean, className?: string }) => (
     <div className={cn("h-10 w-full relative", className)}>
        <div className={cn("absolute bottom-0 left-1/2 w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute bottom-1/2 left-[15%] w-[70%] h-px bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute bottom-1/2 left-[15%] w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
        <div className={cn("absolute bottom-1/2 right-[15%] w-px h-1/2 bg-border transition-colors", active && "bg-primary")}></div>
    </div>
);


export const ThinkingInLangGraph = () => {
    const [activeStep, setActiveStep] = useState("step-1");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,3fr] gap-8 items-start mt-8">
            <div className="sticky top-24">
                 <h3 className="font-semibold text-lg text-center mb-4">Customer Support Agent Workflow</h3>
                <div className="relative p-4 border rounded-lg bg-muted/20">
                    <div className="grid grid-cols-3 gap-x-2 text-center" style={{ gridTemplateRows: 'auto auto auto auto auto auto auto' }}>
                        <Node name="START" className="col-start-2" active={activeStep === 'step-5'} />
                        <DiagramArrow className="col-start-2" active={activeStep === 'step-5'} />

                        <Node name="Classify Intent" className="col-start-2" active={activeStep === 'step-1' || activeStep === 'step-4'} />
                        <BranchConnector className="col-span-3" active={activeStep === 'step-4'} />

                        <Node name="Doc Search" active={activeStep === 'step-1' || activeStep === 'step-3'} />
                        <Node name="Bug Track" active={activeStep === 'step-1'} />
                        <Node name="Human Review" active={activeStep === 'step-1'} />

                        <MergeConnector className="col-span-3" active={activeStep === 'step-5'}/>
                        <Node name="Draft Reply" className="col-start-2" active={activeStep === 'step-1'} />

                        <DiagramArrow className="col-start-2" active={activeStep === 'step-5'}/>
                        <Node name="END" className="col-start-2" active={activeStep === 'step-5'} />
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">5 Steps to Building an Agent</h3>
                 <Accordion type="single" collapsible className="w-full space-y-2" defaultValue="step-1" onValueChange={value => value && setActiveStep(value)}>
                    <AccordionItem value="step-1" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">1. Map your workflow into nodes</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                           <p className="text-sm text-muted-foreground mb-4">First, think of your process as a flowchart. Each specific task, like classifying an email or searching documentation, becomes a "node" in your graph.</p>
                           <InsightCard title="Key Insight" icon={<Workflow className="text-primary"/>}>
                               Breaking a complex process into small, single-responsibility nodes makes your agent resilient, observable, and much easier to debug.
                           </InsightCard>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-2" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">2. Design the agent's memory (State)</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                            <p className="text-sm text-muted-foreground mb-4">Next, define the "state"—the shared memory that flows between your nodes. This object holds all the information the agent needs to track its progress.</p>
                            <CodeBlock code={stateCode} />
                            <InsightCard title="Key Insight" icon={<Database className="text-primary"/>}>
                               Store only raw data (like IDs or text), not formatted prompts. This allows different nodes to use the same information in unique ways.
                           </InsightCard>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-3" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">3. Build the nodes as functions</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                           <p className="text-sm text-muted-foreground mb-4">Each node in your diagram is a simple Python function. It takes the current state as input, performs its job, and returns a dictionary of updates to the state.</p>
                           <CodeBlock code={nodeCode} />
                            <InsightCard title="Key Insight" icon={<Code className="text-primary"/>}>
                               Nodes are the "skills" of your agent. Each one should have a single, clear responsibility, like calling a tool or an LLM.
                           </InsightCard>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-4" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">4. Define the agent's decisions (Edges)</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                           <p className="text-sm text-muted-foreground mb-4">Edges connect your nodes. "Conditional edges" are special because they let the agent decide which path to take based on the current state.</p>
                           <CodeBlock code={conditionalEdgeCode} />
                           <InsightCard title="Key Insight" icon={<GitBranch className="text-primary"/>}>
                               Conditional edges turn a simple flowchart into an intelligent agent that can react dynamically to new information.
                           </InsightCard>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="step-5" className="border-b-0">
                        <AccordionTrigger className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left">5. Wire it all together</AccordionTrigger>
                        <AccordionContent className="pt-4 px-2">
                           <p className="text-sm text-muted-foreground mb-4">Finally, you declare your nodes and edges to LangGraph. This "compiles" your workflow into a fully runnable agent application.</p>
                           <CodeBlock code={wiringCode} />
                           <InsightCard title="Key Insight" icon={<Share2 className="text-primary"/>}>
                               The final graph represents the complete logic of your agent, ready to be executed, paused, and resumed.
                           </InsightCard>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};
