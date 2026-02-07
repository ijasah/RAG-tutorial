"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight, BrainCircuit, Eye, Info, User, Wand2, CheckCircle, Sparkles } from 'lucide-react';
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

# 4. Define the graph
from langgraph.graph import StateGraph, START, END

workflow = StateGraph(AgentState)
workflow.add_node("agent", llm_call)
workflow.add_node("tools", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

# 5. Compile and Run
agent = workflow.compile()
result = agent.invoke({"messages": [("user", "What is 3 + 4?")]})
`;

const steps = [
    {
        name: 'Ready',
        highlight: { start: 0, end: 0 },
        state: { messages: [], llm_calls: 0 },
        trace: []
    },
    {
        name: 'Compile',
        highlight: { start: 40, end: 40 },
        state: { messages: [], llm_calls: 0 },
        trace: [{ type: 'Info', content: 'The graph definition is compiled into a runnable agent.' }]
    },
    {
        name: 'Invoke',
        highlight: { start: 41, end: 41 },
        state: { messages: [{ role: 'user', content: 'What is 3 + 4?' }], llm_calls: 0 },
        trace: [
            { type: 'Info', content: 'The graph definition is compiled into a runnable agent.' },
            { type: 'Info', content: 'Agent is invoked with the initial user message.' }
        ]
    },
    {
        name: 'Agent Node',
        highlight: { start: 12, end: 15 },
        state: {
            messages: [
                { role: 'user', content: 'What is 3 + 4?' },
                { role: 'ai', content: '', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] }
            ],
            llm_calls: 1
        },
        trace: [
            { type: 'Info', content: 'The graph definition is compiled into a runnable agent.' },
            { type: 'Info', content: 'Agent is invoked with the initial user message.' },
            { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' }
        ]
    },
    {
        name: 'Tools Node',
        highlight: { start: 17, end: 20 },
        state: {
            messages: [
                { role: 'user', content: 'What is 3 + 4?' },
                { role: 'ai', content: '', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] },
                { role: 'tool', content: '7', tool_call_id: 'add' }
            ],
            llm_calls: 1
        },
        trace: [
             { type: 'Info', content: 'The graph definition is compiled into a runnable agent.' },
             { type: 'Info', content: 'Agent is invoked with the initial user message.' },
             { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' },
            { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' },
            { type: 'Observation', content: 'Tool returned: 7' }
        ]
    },
    {
        name: 'Agent Node (Synthesis)',
        highlight: { start: 12, end: 15 },
        state: {
            messages: [
                { role: 'user', content: 'What is 3 + 4?' },
                { role: 'ai', content: '', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] },
                { role: 'tool', content: '7', tool_call_id: 'add' },
                { role: 'ai', content: 'The sum is 7.' }
            ],
            llm_calls: 2
        },
        trace: [
             { type: 'Info', content: 'The graph definition is compiled into a runnable agent.' },
             { type: 'Info', content: 'Agent is invoked with the initial user message.' },
             { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' },
            { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' },
            { type: 'Observation', content: 'Tool returned: 7' },
            { type: 'Thought', content: 'I have the result. I will now provide the final answer.' }
        ]
    },
    {
        name: 'End',
        highlight: { start: 23, end: 28 },
        state: {
             messages: [
                { role: 'user', content: 'What is 3 + 4?' },
                { role: 'ai', content: '', tool_calls: [{ name: 'add', args: { a: 3, b: 4 } }] },
                { role: 'tool', content: '7', tool_call_id: 'add' },
                { role: 'ai', content: 'The sum is 7.' }
            ],
            llm_calls: 2
        },
        trace: [
             { type: 'Info', content: 'The graph definition is compiled into a runnable agent.' },
             { type: 'Info', content: 'Agent is invoked with the initial user message.' },
             { type: 'Thought', content: 'The user is asking for addition. I should use the `add` tool.' },
            { type: 'Action', content: 'Calling tool `add` with args `{\'a\': 3, \'b\': 4}`' },
            { type: 'Observation', content: 'Tool returned: 7' },
            { type: 'Thought', content: 'I have the result. I will now provide the final answer.' },
            { type: 'Final Answer', content: 'The sum is 7.' }
        ]
    }
];

const CodeLine = ({ line, i, highlight, step }: { line: string, i: number, highlight: any, step: number }) => (
    <motion.div
        className={cn(
            "px-2 transition-colors duration-300 rounded-md",
            step > 0 && highlight.start <= i + 1 && highlight.end >= i + 1 ? 'bg-primary/20' : ''
        )}
    >
        <span className="text-right pr-4 text-muted-foreground/50 w-8 inline-block select-none">{i + 1}</span>
        <span>{line}</span>
    </motion.div>
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
                 <CardTitle>Live Code Execution</CardTitle>
                 <CardDescription>
                   Click "Next" to walk through the agent's execution step-by-step.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Code Column */}
                    <div className="lg:col-span-1 bg-background rounded-lg border p-2 text-xs font-mono">
                        <pre>
                            {codeLines.map((line, i) => (
                                <CodeLine key={i} line={line} i={i} highlight={currentStepData.highlight} step={step} />
                            ))}
                        </pre>
                    </div>

                    {/* Outputs Column */}
                    <div className="flex flex-col gap-4">
                        {/* Trace Column */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-center text-primary">Execution Traces</h3>
                            <ScrollArea className="h-64 w-full rounded-lg border p-2" ref={traceRef}>
                                <AnimatePresence>
                                    {currentStepData.trace.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "p-2 border-l-4 rounded-r-md mb-2",
                                                item.type === 'Info' && 'border-gray-400 bg-gray-500/10',
                                                item.type === 'Thought' && 'border-purple-400 bg-purple-500/10',
                                                item.type === 'Action' && 'border-blue-400 bg-blue-500/10',
                                                item.type === 'Observation' && 'border-amber-400 bg-amber-500/10',
                                                item.type === 'Final Answer' && 'border-green-400 bg-green-500/10',
                                            )}
                                        >
                                            <p className="font-bold text-xs flex items-center gap-2">
                                            {item.type === 'Info' && <Info size={14}/>}
                                            {item.type === 'Thought' && <BrainCircuit size={14}/>}
                                            {item.type === 'Action' && <Wand2 size={14}/>}
                                            {item.type === 'Observation' && <Eye size={14}/>}
                                            {item.type === 'Final Answer' && <CheckCircle size={14}/>}
                                            {item.type}
                                            </p>
                                            <p className="text-xs mt-1 pl-1">{item.content}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </ScrollArea>
                        </div>
                         {/* State Column */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-center text-primary">Graph State</h3>
                             <ScrollArea className="h-64 w-full rounded-lg border p-2" ref={stateRef}>
                                <div className="flex justify-between items-center bg-background border rounded p-2 mb-2">
                                    <span className="font-semibold text-sm">llm_calls:</span>
                                    <Badge variant="secondary" className="text-lg">{currentStepData.state.llm_calls}</Badge>
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
                    </div>
                </div>

                <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t">
                     <Button onClick={handleReset} variant="outline" size="sm" className="w-24" disabled={step === 0}>
                        <RefreshCw /> Reset
                    </Button>
                    <Button onClick={handleNext} size="sm" className="w-24" disabled={step >= steps.length - 1}>
                        {step === 0 ? 'Start' : 'Next'} <ArrowRight />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
