"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, BrainCircuit, Eye, Info, User, Wand2, CheckCircle, Sparkles, GitBranch, Share2, CornerDownRight, CornerUpLeft } from 'lucide-react';
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
    { name: 'Ready', highlight: { start: -1, end: -1 }, explanation: 'Click "Start" to begin building the agent graph.', graph: {}, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Define State', highlight: { start: 7, end: 9 }, explanation: 'First, we define the "state" of our agent. This dictionary holds the history of messages and a call counter.', graph: {}, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Agent Node', highlight: { start: 33, end: 33 }, explanation: 'We add the primary "agent" node, which is responsible for calling the LLM.', graph: { agent: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Tools Node', highlight: { start: 34, end: 34 }, explanation: 'Next, a "tools" node is added to execute any tools the agent decides to use.', graph: { agent: true, tools: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Set Entry Point', highlight: { start: 35, end: 35 }, explanation: 'We define the entry point. All executions begin at the "agent" node.', graph: { agent: true, tools: true, start: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Conditional Edge', highlight: { start: 36, end: 39 }, explanation: 'After the agent runs, this conditional edge checks if a tool was called. If yes, it routes to "tools"; otherwise, it ends.', graph: { agent: true, tools: true, start: true, conditional: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Add Loop Edge', highlight: { start: 40, end: 40 }, explanation: 'Finally, we add an edge from "tools" back to "agent". This creates the loop that allows the agent to continue working.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [] },
    { name: 'Compile', highlight: { start: 43, end: 43 }, explanation: 'The graph is compiled into a runnable application. The agent is now ready to be invoked.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: {}, state: { messages: [], llm_calls: 0 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }] },
    { name: 'Invoke', highlight: { start: 44, end: 44 }, explanation: 'The agent is invoked with the user\'s message, starting the execution at the "START" edge.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { start: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 0 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }] },
    { name: 'Run Agent Node', highlight: { start: 12, end: 15 }, explanation: 'The LLM runs, processes the messages, and decides the `add` tool is needed.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agent: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }] },
    { name: 'Run Conditional Edge', highlight: { start: 23, end: 27 }, explanation: 'The `should_continue` function checks the last message. Since it contains a tool call, the graph will route to the "tools" node.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agentToTools: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }] },
    { name: 'Run Tools Node', highlight: { start: 17, end: 20 }, explanation: 'The `tool_node` executes the `add` tool with the arguments `(a=3, b=4)` and appends the output to the message list.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { tools: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }, { role: 'tool', content: '7', tool_call_id: 'tool_call_123' }], llm_calls: 1 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }, { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' }, { type: 'Observation', content: 'Tool returned: 7' }] },
    { name: 'Re-run Agent Node', highlight: { start: 12, end: 15 }, explanation: 'The graph loops back. The agent receives the tool\'s output ("7") and synthesizes the final answer.', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agent: true, loop: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }, { role: 'tool', content: '7', tool_call_id: 'tool_call_123' }], llm_calls: 2 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }, { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' }, { type: 'Observation', content: 'Tool returned: 7' }, { type: 'Thought', content: 'I have the result. I will now provide the final answer.' }] },
    { name: 'Run Conditional Edge (End)', highlight: { start: 23, end: 27 }, explanation: 'The `should_continue` function runs again. The last message has no tool calls, so the graph routes to "END".', graph: { agent: true, tools: true, start: true, conditional: true, loop: true }, execution: { agentToEnd: true }, state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }, { role: 'ai', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }, { role: 'tool', content: '7', tool_call_id: 'tool_call_123' }, { role: 'ai', content: 'The sum is 7.' }], llm_calls: 2 }, trace: [{ type: 'Info', content: 'Graph compiled successfully.' }, { type: 'Info', content: 'Invoking agent...' }, { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }, { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' }, { type: 'Observation', content: 'Tool returned: 7' }, { type: 'Thought', content: 'I have the result. I will now provide the final answer.' }, { type: 'Final Answer', content: 'The sum is 7.' }] },
];

const GraphNode = ({ label, visible, executing, isEnd }: { label: string, visible?: boolean, executing?: boolean, isEnd?: boolean }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                className={cn(
                    "border-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300",
                    executing && !isEnd ? "bg-primary/20 border-primary shadow-lg" : "bg-card border-border",
                    executing && isEnd && "bg-green-500/20 border-green-500 shadow-lg"
                )}
            >
                {label}
            </motion.div>
        )}
    </AnimatePresence>
);

const GraphEdge = ({ visible, executing }: { visible?: boolean, executing?: boolean }) => (
    <AnimatePresence>
        {visible && (
            <div className={cn("relative h-full w-8")}>
                <motion.svg
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    width="100%" height="100%" viewBox="0 0 32 2" className="absolute top-1/2 -translate-y-1/2 left-0 overflow-visible"
                >
                    <motion.path
                        d="M 0 1 L 32 1"
                        strokeWidth="2"
                        className={cn(executing ? "stroke-primary" : "stroke-border")}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    />
                     <motion.path
                        d="M 28 -3 L 32 1 L 28 5"
                        strokeWidth="2"
                        fill="none"
                        className={executing ? "stroke-primary" : "stroke-border"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    />
                </motion.svg>
            </div>
        )}
    </AnimatePresence>
);

const ConditionalBranch = ({ label, executing, children }: { label: string, executing: boolean, children: React.ReactNode }) => (
    <div className="flex items-center gap-2">
        <div className={cn("transition-colors", executing ? 'text-primary' : 'text-muted-foreground/50')}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
            </svg>
        </div>
        <Badge variant={executing ? 'default' : 'secondary'} className="text-xs -ml-2 mr-1">{label}</Badge>
        <div className="flex items-center gap-2">
            {children}
        </div>
    </div>
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
            {msg.tool_call_id && (
                 <div className="mt-1 pl-1 border-l-2 border-dashed ml-2 pl-2">
                    <p className="font-semibold">Tool Result ID:</p>
                    <p>{msg.tool_call_id}</p>
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
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg border p-2 text-xs font-mono">
                        <ScrollArea className="h-[450px]">
                            <pre>
                                {codeLines.map((line, i) => {
                                    const isHighlighted = currentStepData.highlight.start <= i + 1 && currentStepData.highlight.end >= i + 1;
                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                "px-2 transition-colors duration-300 rounded-md",
                                                isHighlighted ? 'bg-primary/20' : 'transparent'
                                            )}
                                        >
                                            <span className="text-right pr-4 text-muted-foreground/50 w-8 inline-block select-none">{i + 1}</span>
                                            <span>{line}</span>
                                        </div>
                                    );
                                })}
                            </pre>
                        </ScrollArea>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Graph Visualization */}
                         <div className="h-48 bg-background rounded-lg border p-4 flex flex-col justify-center">
                            {/* START -> agent */}
                            <div className="flex items-center">
                                <GraphNode label="START" visible={currentStepData.graph.start} executing={currentStepData.execution.start}/>
                                <GraphEdge visible={currentStepData.graph.start} executing={currentStepData.execution.start} />
                                <GraphNode label="agent" visible={currentStepData.graph.agent} executing={currentStepData.execution.agent || currentStepData.execution.loop} />
                            </div>

                            {/* Conditional Branches */}
                            <AnimatePresence>
                            {currentStepData.graph.conditional && (
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="pl-20 mt-2">
                                    {/* Tools Branch */}
                                    <ConditionalBranch label="tools" executing={currentStepData.execution.agentToTools}>
                                        <GraphNode label="tools" visible={currentStepData.graph.tools} executing={currentStepData.execution.tools} />
                                        <AnimatePresence>
                                        {currentStepData.graph.loop && (
                                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-1 text-xs">
                                                <CornerUpLeft className={cn("w-4 h-4 transition-colors", currentStepData.execution.loop ? 'text-primary' : 'text-muted-foreground/50')} />
                                                <span className={cn('text-muted-foreground/80 transition-colors', currentStepData.execution.loop && 'text-primary font-semibold')}>agent</span>
                                            </motion.div>
                                        )}
                                        </AnimatePresence>
                                    </ConditionalBranch>

                                    {/* End Branch */}
                                    <ConditionalBranch label="end" executing={currentStepData.execution.agentToEnd}>
                                        <GraphNode label="END" visible={true} executing={currentStepData.execution.agentToEnd} isEnd />
                                    </ConditionalBranch>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                         <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="h-[230px] flex flex-col">
                                <h3 className="font-semibold text-center text-sm mb-2">Execution Trace</h3>
                                <ScrollArea className="flex-grow w-full rounded-lg border p-2 bg-background" ref={traceRef}>
                                    <AnimatePresence>
                                        {currentStepData.trace.map((item, i) => (
                                            <motion.div
                                                key={i} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
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
                            <div className="h-[230px] flex flex-col">
                                <h3 className="font-semibold text-center text-sm mb-2">Graph State</h3>
                                <ScrollArea className="flex-grow w-full rounded-lg border p-2 bg-background" ref={stateRef}>
                                    <div className="flex justify-between items-center bg-muted/50 border rounded p-2 mb-2">
                                        <span className="font-semibold text-sm">llm_calls:</span>
                                        <Badge variant="secondary" className="text-base">{currentStepData.state.llm_calls}</Badge>
                                    </div>
                                    <h4 className="font-semibold text-sm mb-1">messages:</h4>
                                    <AnimatePresence>
                                    {currentStepData.state.messages.map((msg, i) => (
                                        <motion.div key={i} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
                                            <StateMessage msg={msg} />
                                        </motion.div>
                                    ))}
                                    </AnimatePresence>
                                </ScrollArea>
                            </div>
                         </div>
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
