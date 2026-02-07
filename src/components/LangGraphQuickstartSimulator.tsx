"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, BrainCircuit, Eye, Info, User, Wand2, CheckCircle, Sparkles, GitBranch, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const agentCode = `from typing import Annotated
from typing_extensions import TypedDict
from langchain_core.messages import AnyMessage
import operator

# 1. Define the state of our graph
class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    llm_calls: int

# 2. Define the nodes (functions)
def llm_call(state: AgentState):
    """LLM decides whether to call a tool or not"""
    # ... implementation calls model ...
    return {"messages": [response], "llm_calls": state.get('llm_calls', 0) + 1}

def tool_node(state: AgentState):
    """This node runs the tools the LLM decided to call."""
    # ... implementation runs tools ...
    return {"messages": tool_outputs}

# 3. Define the conditional edge
def should_continue(state: AgentState):
    """Decides if we should loop or stop"""
    if state["messages"][-1].tool_calls:
        return "tools"
    return "end"

# 4. Define and build the graph
from langgraph.graph import StateGraph, START, END

workflow = StateGraph(AgentState)
workflow.add_node("agent", llm_call)
workflow.add_node("tools", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue, {
    "tools": "tools",
    "end": END
})
workflow.add_edge("tools", "agent")

# 5. Compile and Run
app = workflow.compile()
result = app.invoke({"messages": [("user", "What is 3 + 4?")]})
`;

const steps = [
    { name: 'Ready', highlight: { start: -1, end: -1 }, explanation: 'Click "Start" to begin building and running the LangGraph agent.', graph: {}, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Define State', highlight: { start: 5, end: 8 }, explanation: 'First, we define the "state" of our agent. This is a simple dictionary that will hold the history of messages and a counter for LLM calls.', graph: {}, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Agent Node', highlight: { start: 32, end: 32 }, explanation: 'We add the primary "agent" node. This function is responsible for calling the large language model.', graph: { agent: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Tools Node', highlight: { start: 33, end: 33 }, explanation: 'Next, we add a "tools" node. This function will execute any tools that the agent decides to use.', graph: { agent: true, tools: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Set Entry Point', highlight: { start: 34, end: 34 }, explanation: 'We define the entry point of the graph. All executions will begin at the "agent" node.', graph: { agent: true, tools: true, start: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Conditional Edge', highlight: { start: 35, end: 38 }, explanation: 'After the "agent" node runs, this conditional edge checks if the LLM requested a tool. If yes, it routes to "tools"; otherwise, it ends the execution.', graph: { agent: true, tools: true, start: true, conditional: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Tool->Agent Edge', highlight: { start: 39, end: 39 }, explanation: 'Finally, we add an edge from the "tools" node back to the "agent" node. This creates a loop, allowing the agent to continue working with tool outputs.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Compile', highlight: { start: 42, end: 42 }, explanation: 'The graph definition is compiled into a runnable application.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }] },
    { name: 'Invoke', highlight: { start: 43, end: 43 }, explanation: 'The agent is invoked with the initial user message.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 0 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }] },
    { name: 'Run Agent Node', highlight: { start: 11, end: 14 }, explanation: 'The LLM decides that the `add` tool is needed to answer the user\'s question.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agent: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }] },
    { name: 'Run Tools Node', highlight: { start: 16, end: 19 }, explanation: 'The `tool_node` executes the `add` tool with the arguments `(a=3, b=4)`.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { tools: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }, { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' }] },
    { name: 'Re-run Agent Node', highlight: { start: 11, end: 14 }, explanation: 'The agent receives the tool\'s output ("7") and synthesizes the final answer.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agent: true, loop: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }, { role: 'tool', content: '7' }], llm_calls: 2 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }, { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' }, { type: 'Observation', content: 'Tool returned: 7' }, { type: 'Thought', content: 'I have the result. I will now provide the final answer.' }] },
    { name: 'End', highlight: { start: 25, end: 25 }, explanation: 'The agent has the final answer and no more tools are needed, so the conditional edge routes to END.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { end: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }, { role: 'tool', content: '7' }, { role: 'ai', content: 'The sum is 7.' }], llm_calls: 2 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }, { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' }, { type: 'Observation', content: 'Tool returned: 7' }, { type: 'Thought', content: 'I have the result. I will now provide the final answer.' }, { type: 'Final Answer', content: 'The sum is 7.' }] },
];

const GraphNode = ({ x, y, label, visible, executing }: { x: number, y: number, label: string, visible?: boolean, executing?: boolean }) => (
    <AnimatePresence>
        {visible && (
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <rect x={x - 40} y={y - 15} width="80" height="30" rx="15" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" />
                {executing && <motion.rect x={x - 40} y={y - 15} width="80" height="30" rx="15" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />}
                <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="500" fill="hsl(var(--foreground))">{label}</text>
            </motion.g>
        )}
    </AnimatePresence>
);

const GraphEdge = ({ d, visible, executing, isConditional }: { d: string, visible?: boolean, executing?: boolean, isConditional?: boolean }) => (
    <AnimatePresence>
        {visible && (
            <motion.path d={d} fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray={isConditional ? "4 4" : "0"}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
            >
                {executing && <motion.path d={d} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1, transition: { duration: 0.5, delay: 0.1 } }} />}
            </motion.path>
        )}
    </AnimatePresence>
);


const StateMessage = ({ msg }: { msg: any }) => {
    let roleColor = '';
    let roleIcon: React.ReactNode = null;
    switch(msg.role) {
        case 'user': roleColor = 'text-blue-400'; roleIcon = <User size={14}/>; break;
        case 'ai': roleColor = 'text-purple-400'; roleIcon = <Sparkles size={14}/>; break;
        case 'tool': roleColor = 'text-amber-400'; roleIcon = <Wand2 size={14}/>; break;
    }

    return (
        <div className="p-2 bg-background border rounded-md text-xs">
            <div className={cn("font-bold flex items-center gap-1.5", roleColor)}>
                {roleIcon}
                {msg.role.toUpperCase()}
            </div>
            {msg.content && <p className="mt-1 pl-1">{msg.content}</p>}
            {msg.tool_calls && (
                <div className="mt-1 pl-1 border-l-2 border-dashed ml-2 pl-2">
                    <p className="font-semibold">Tool Call:</p>
                    <p>Name: {msg.tool_calls[0].name}</p>
                    <p>Args: {JSON.stringify(msg.tool_calls[0].args)}</p>
                </div>
            )}
        </div>
    )
}

export const LangGraphQuickstartSimulator = () => {
    const [step, setStep] = useState(0);
    const traceRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef<HTMLDivElement>(null);

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handleReset = () => setStep(0);

    const currentStepData = steps[step];
    const codeLines = agentCode.split('\n');
    
    useEffect(() => {
        if (traceRef.current) {
            traceRef.current.scrollTop = traceRef.current.scrollHeight;
        }
        if (stateRef.current) {
            stateRef.current.scrollTop = stateRef.current.scrollHeight;
        }
    }, [step]);


    return (
        <Card className="bg-muted/30 shadow-inner w-full overflow-hidden">
            <CardHeader className="text-center">
                 <CardTitle>Graph API: Build and Execution Simulation</CardTitle>
                 <CardDescription>
                   {currentStepData.explanation}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg border p-2 text-xs font-mono h-[450px] overflow-auto">
                        <pre>
                            {codeLines.map((line, i) => (
                               <motion.div
                                    key={i}
                                    className={cn("px-2 transition-colors duration-300 rounded-md")}
                                    animate={{ backgroundColor: currentStepData.highlight.start <= i + 1 && currentStepData.highlight.end >= i + 1 ? 'hsla(var(--primary), 0.2)' : 'transparent' }}
                                >
                                    <span className="text-right pr-4 text-muted-foreground/50 w-8 inline-block select-none">{i + 1}</span>
                                    <span>{line}</span>
                                </motion.div>
                            ))}
                        </pre>
                    </div>

                    <div className="bg-background rounded-lg border p-4 flex items-center justify-center">
                        <svg viewBox="0 0 400 220" className="w-full h-full">
                           <GraphNode x={50} y={40} label="START" visible={currentStepData.graph.start} executing={currentStepData.execution.start}/>
                           <GraphNode x={150} y={110} label="agent" visible={currentStepData.graph.agent} executing={currentStepData.execution.agent} />
                           <GraphNode x={350} y={110} label="tools" visible={currentStepData.graph.tools} executing={currentStepData.execution.tools} />
                           <GraphNode x={250} y={190} label="END" visible={currentStepData.graph.conditional} executing={currentStepData.execution.end} />
                           
                           <GraphEdge d="M 50 60 V 95 C 50 100, 130 105, 130 110" visible={currentStepData.graph.start} executing={currentStepData.execution.start} />
                           <GraphEdge d="M 190 110 H 310" visible={currentStepData.graph.conditional} executing={currentStepData.execution.tools} isConditional />
                           <GraphEdge d="M 170 125 Q 200 150, 230 175" visible={currentStepData.graph.conditional} executing={currentStepData.execution.end} isConditional />
                           <GraphEdge d="M 310 100 C 250 50, 190 60, 190 100" visible={currentStepData.graph.loop} executing={currentStepData.execution.loop} />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <div className="space-y-2 flex flex-col">
                        <h3 className="font-semibold text-center text-sm">Graph State</h3>
                         <ScrollArea className="h-48 w-full rounded-lg border p-2 bg-background" ref={stateRef}>
                            <div className="flex justify-between items-center bg-muted/50 border rounded p-2 mb-2">
                                <span className="font-semibold text-sm">llm_calls:</span>
                                <Badge variant="secondary" className="text-base">{currentStepData.state.llm_calls}</Badge>
                            </div>
                            <h4 className="font-semibold text-sm mb-1">messages:</h4>
                            <AnimatePresence>
                            {currentStepData.state.messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-2"
                                >
                                    <StateMessage msg={msg} />
                                </motion.div>
                            ))}
                            </AnimatePresence>
                        </ScrollArea>
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <h3 className="font-semibold text-center text-sm">Execution Trace</h3>
                        <ScrollArea className="h-48 w-full rounded-lg border p-2 bg-background" ref={traceRef}>
                            <AnimatePresence>
                                {currentStepData.trace.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-2 border-l-4 rounded-r-md mb-2 text-xs",
                                            item.type === 'Info' && 'border-gray-400 bg-gray-500/10',
                                            item.type === 'Thought' && 'border-purple-400 bg-purple-500/10',
                                            item.type === 'Action' && 'border-blue-400 bg-blue-500/10',
                                            item.type === 'Observation' && 'border-amber-400 bg-amber-500/10',
                                            item.type === 'Final Answer' && 'border-green-400 bg-green-500/10',
                                        )}
                                    >
                                        <p className="font-bold flex items-center gap-2">
                                        {item.type === 'Info' && <Info size={14}/>}
                                        {item.type === 'Thought' && <BrainCircuit size={14}/>}
                                        {item.type === 'Action' && <Wand2 size={14}/>}
                                        {item.type === 'Observation' && <Eye size={14}/>}
                                        {item.type === 'Final Answer' && <CheckCircle size={14}/>}
                                        {item.type}
                                        </p>
                                        <p className="mt-1 pl-1">{item.content}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </ScrollArea>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t">
                     <Button onClick={handleReset} variant="outline" size="sm" className="w-24" disabled={step === 0}>
                        <RefreshCw className="mr-2"/> Reset
                    </Button>
                    <Button onClick={handleNext} size="sm" className="w-24" disabled={step >= steps.length - 1}>
                        {step === 0 ? 'Start' : 'Next'} <ArrowRight className="ml-2"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
