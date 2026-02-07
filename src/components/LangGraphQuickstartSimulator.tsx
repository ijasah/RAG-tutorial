"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/code-block';

const buildSteps = [
    {
        title: 'Initialize StateGraph',
        code: `from langgraph.graph import StateGraph, MessagesState

# The graph is initialized with a state object that will be passed between nodes.
agent_builder = StateGraph(MessagesState)`,
        explanation: "First, we initialize a `StateGraph`. This is the foundation of our agent. We pass it `MessagesState`, which tells the graph what kind of data it will be tracking as it runs (in this case, a list of messages)."
    },
    {
        title: 'Add "llm_call" Node',
        code: `# Nodes are functions that will be executed.
# This node calls the LLM with the current state.
agent_builder.add_node("llm_call", llm_call)`,
        explanation: 'Next, we add our first node, named "llm_call". A node is a step in our graph. This specific node is responsible for calling the Language Model to decide what to do next.'
    },
    {
        title: 'Add "tool_node"',
        code: `# This node will execute any tools the LLM decides to call.
agent_builder.add_node("tool_node", tool_node)`,
        explanation: 'We add a second node, "tool_node". If the LLM decides to use a tool (like our calculator), this node will be responsible for actually running that tool.'
    },
    {
        title: 'Set the Entry Point',
        code: `# The entry point is the first node to be called.
agent_builder.add_edge(START, "llm_call")`,
        explanation: 'Every graph needs a starting point. We create an "edge" (a connection) from the special `START` marker to our "llm_call" node. This tells the graph to always begin execution there.'
    },
    {
        title: 'Add Conditional Edges',
        code: `# After the LLM call, we check if a tool was called.
agent_builder.add_conditional_edges(
    "llm_call",
    should_continue,
    ["tool_node", END]
)`,
        explanation: "This is the graph's decision-making step. After the 'llm_call' node runs, the `should_continue` function checks the LLM's output. Based on the result, the graph will either proceed to the 'tool_node' (if a tool was called) or to the special `END` marker to finish."
    },
    {
        title: 'Create the Tool-to-LLM Loop',
        code: `# This edge creates the agent's reasoning loop.
agent_builder.add_edge("tool_node", "llm_call")`,
        explanation: "Finally, we add an edge from the 'tool_node' back to the 'llm_call' node. This is the most important step! It creates the agent's reasoning loop, allowing it to use a tool, observe the result, and then think again."
    },
    {
        title: 'Compile the Agent',
        code: `# The graph is now complete and can be compiled into a runnable agent.
agent = agent_builder.compile()`,
        explanation: "The graph definition is complete. Compiling it turns our abstract set of nodes and edges into a runnable object that can process inputs."
    }
];

const GraphNode = ({ name, active, visible }: { name: string, active: boolean, visible: boolean }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                    "border-2 rounded-lg px-4 py-2 text-center font-semibold transition-all duration-300",
                    active ? "border-primary bg-primary/10 text-primary shadow-lg" : "border-border bg-muted/50"
                )}
            >
                {name}
            </motion.div>
        )}
    </AnimatePresence>
);

const GraphArrow = ({ visible, rotate, className }: { visible: boolean, rotate?: string, className?: string }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={cn("absolute", className)}
            >
                <ArrowRight className="w-8 h-8 text-muted-foreground" style={{ transform: rotate }} />
            </motion.div>
        )}
    </AnimatePresence>
);


export const LangGraphQuickstartSimulator = () => {
    const [step, setStep] = useState(0);

    const handleNext = () => setStep(s => Math.min(s + 1, buildSteps.length));
    const handleReset = () => setStep(0);

    const currentStepData = buildSteps[step - 1];

    return (
        <Card className="bg-muted/30 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-4">
                <div className="flex justify-center gap-2 mb-4">
                    <Button onClick={handleReset} variant="outline" className="w-32" disabled={step === 0}>
                        <RefreshCw className="mr-2"/> Reset
                    </Button>
                    <Button onClick={handleNext} className="w-32" disabled={step >= buildSteps.length}>
                        {step === 0 ? <Play className="mr-2"/> : <ArrowRight className="mr-2" />}
                        {step === 0 ? 'Build Graph' : 'Next'}
                    </Button>
                </div>
                
                <p className="text-sm text-muted-foreground min-h-[60px] px-4 mb-4 flex items-center justify-center text-center bg-background rounded-lg border">
                    {step > 0 ? currentStepData.explanation : "Click 'Build Graph' to start building the agent step-by-step."}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Code Column */}
                    <div className="space-y-3 rounded-lg border bg-background p-4 min-h-[300px]">
                        <h3 className="font-semibold text-sm text-center mb-2">Python Code</h3>
                        <AnimatePresence mode="wait">
                            {step > 0 && (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h4 className="text-xs font-bold text-primary mb-1">{currentStepData.title}</h4>
                                    <CodeBlock code={currentStepData.code} className="!my-0" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Graph Visualization Column */}
                    <div className="relative space-y-3 rounded-lg border bg-background p-4 flex items-center justify-center min-h-[300px]">
                        <h3 className="font-semibold text-sm text-center mb-2 absolute top-4">StateGraph Visualization</h3>
                        <div className="w-full max-w-sm relative flex flex-col items-center gap-4">

                            <GraphNode name="START" active={step === 4} visible={step >= 4} />
                            
                            <GraphArrow visible={step >= 4} rotate="rotate(90deg)" className="top-12" />

                            <GraphNode name="llm_call" active={step === 2 || step === 4 || step === 5 || step === 6} visible={step >= 2} />

                            <div className="absolute top-[10.5rem] w-full flex justify-between px-8">
                                <GraphArrow visible={step >= 5} rotate="rotate(135deg)" className="left-10" />
                                <GraphArrow visible={step >= 5} rotate="rotate(45deg)" className="right-10" />
                            </div>
                            <div className="absolute top-[13.5rem] w-full flex justify-between px-8 text-xs text-muted-foreground">
                                {step >= 5 && <motion.span initial={{opacity:0}} animate={{opacity:1, transition:{delay:0.3}}}>tool used</motion.span>}
                                {step >= 5 && <motion.span initial={{opacity:0}} animate={{opacity:1, transition:{delay:0.3}}}>no tool</motion.span>}
                            </div>

                            <div className="w-full flex justify-between items-center mt-12">
                                <GraphNode name="tool_node" active={step === 3 || step === 6} visible={step >= 3} />
                                <GraphNode name="END" active={false} visible={step >= 5} />
                            </div>

                             <AnimatePresence>
                                {step >= 6 &&
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                                        className="absolute top-[12rem] left-0 right-0 mx-auto w-[calc(100%-12rem)] h-16 border-b-2 border-l-2 border-r-2 border-dashed border-muted-foreground rounded-b-full"
                                    >
                                        <ArrowRight className="w-6 h-6 text-muted-foreground absolute -top-3 right-1/2 translate-x-1/2 rotate-90" />
                                    </motion.div>
                                }
                            </AnimatePresence>

                            {step === 7 && 
                                <motion.div initial={{opacity:0}} animate={{opacity:1, transition:{delay: 0.3}}} className="absolute bottom-[-2rem] text-sm font-bold text-green-500">
                                    Agent Compiled!
                                </motion.div>
                            }
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
