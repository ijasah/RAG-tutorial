
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, BrainCircuit, Wand2, Eye, MessageSquare, Calculator, ArrowRight, CornerDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/code-block';

const codeSnippets = {
    state: `class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]`,
    llm_call: `def llm_call(state: dict):
    # The LLM decides whether to use a tool or respond to the user.
    return {"messages": [model_with_tools.invoke(state["messages"])]}`,
    tool_node: `def tool_node(state: dict):
    # This runs the tool and returns the results.
    tool_call = state["messages"][-1].tool_calls[0]
    result = tools_by_name[tool_call["name"]].invoke(tool_call["args"])
    return {"messages": [ToolMessage(content=str(result), tool_call_id=tool_call["id"])]}`,
    graph: `agent_builder = StateGraph(MessagesState)
agent_builder.add_node("llm_call", llm_call)
agent_builder.add_node("tool_node", tool_node)
agent_builder.add_edge(START, "llm_call")
agent_builder.add_conditional_edges("llm_call", should_continue)
agent_builder.add_edge("tool_node", "llm_call")
agent = agent_builder.compile()`,
    invoke: `agent.invoke({"messages": [HumanMessage(content="Add 3 and 4.")]})`
};

const simulationSteps = [
    {
        id: 'start',
        highlight: 'invoke',
        output: [],
        explanation: 'The simulation starts by invoking the compiled agent with the user\'s message.'
    },
    {
        id: 'thought_1',
        highlight: 'llm_call',
        output: [
            { icon: <BrainCircuit />, title: 'Thought', content: 'The user wants to add 3 and 4. I should use the `add` tool.' },
        ],
        explanation: 'The agent graph enters the `llm_call` node. The LLM reasons about the user\'s request.'
    },
    {
        id: 'action_1',
        highlight: 'llm_call',
        output: [
            { icon: <BrainCircuit />, title: 'Thought', content: 'The user wants to add 3 and 4. I should use the `add` tool.' },
            { icon: <Wand2 />, title: 'Action', content: 'Calling tool `add` with arguments {"a": 3, "b": 4}' }
        ],
        explanation: 'The LLM decides to call a tool. The graph will now route to the `tool_node`.'
    },
    {
        id: 'observation_1',
        highlight: 'tool_node',
        output: [
            { icon: <BrainCircuit />, title: 'Thought', content: 'The user wants to add 3 and 4. I should use the `add` tool.' },
            { icon: <Wand2 />, title: 'Action', content: 'Calling tool `add` with arguments {"a": 3, "b": 4}' },
            { icon: <Eye />, title: 'Observation', content: 'Tool returned: 7' }
        ],
        explanation: 'The `tool_node` executes the `add` tool, which returns `7`. This observation is added to the agent\'s state.'
    },
     {
        id: 'thought_2',
        highlight: 'llm_call',
        output: [
            { icon: <BrainCircuit />, title: 'Thought', content: 'The user wants to add 3 and 4. I should use the `add` tool.' },
            { icon: <Wand2 />, title: 'Action', content: 'Calling tool `add` with arguments {"a": 3, "b": 4}' },
            { icon: <Eye />, title: 'Observation', content: 'Tool returned: 7' },
            { icon: <BrainCircuit />, title: 'Thought', content: 'I have the result from the tool. I can now provide the final answer to the user.' }
        ],
        explanation: 'The graph loops back to the `llm_call` node. With the new observation, the LLM decides it has enough information.'
    },
    {
        id: 'answer',
        highlight: 'llm_call',
        output: [
            { icon: <BrainCircuit />, title: 'Thought', content: 'The user wants to add 3 and 4. I should use the `add` tool.' },
            { icon: <Wand2 />, title: 'Action', content: 'Calling tool `add` with arguments {"a": 3, "b": 4}' },
            { icon: <Eye />, title: 'Observation', content: 'Tool returned: 7' },
            { icon: <BrainCircuit />, title: 'Thought', content: 'I have the result from the tool. I can now provide the final answer to the user.' },
            { icon: <MessageSquare />, title: 'Final Answer', content: 'The result is 7.' }
        ],
        explanation: 'The agent provides the final answer. Since no more tools are called, the graph execution finishes.'
    }
];


export const LangGraphQuickstartSimulator = () => {
    const [step, setStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const handleStart = () => {
        setIsRunning(true);
        setStep(1);
    };

    const handleNext = () => {
        if (step < simulationSteps.length -1) {
            setStep(s => s + 1);
        }
    };
    
    const handleReset = () => {
        setIsRunning(false);
        setStep(0);
    };

    const currentSimStep = simulationSteps[step];
    const isFinished = step === simulationSteps.length - 1;

    return (
        <Card className="bg-muted/30 my-8 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle>Execution Simulation</CardTitle>
                <CardDescription>
                    This is a step-by-step, line-by-line simulation. On the left is the agent's code, and on the right is the output. Click "Start" and then "Next" to see how the agent executes its logic.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Code Column */}
                    <div className="space-y-3 rounded-lg border bg-background p-4">
                        <h3 className="font-semibold text-sm text-center mb-2">Agent Code</h3>
                        {Object.entries(codeSnippets).map(([key, code]) => (
                            <motion.div
                                key={key}
                                animate={{
                                    borderColor: currentSimStep.highlight === key ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                    scale: currentSimStep.highlight === key ? 1.02 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="border-2 rounded-lg"
                            >
                                <CodeBlock code={code} className="!my-0" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Output Column */}
                     <div className="space-y-3 rounded-lg border bg-background p-4">
                        <h3 className="font-semibold text-sm text-center mb-2">Simulated Output</h3>
                        <div className="space-y-2">
                             <AnimatePresence>
                                {currentSimStep.output.map((line, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="p-2.5 rounded-lg border bg-muted/50 text-sm"
                                    >
                                        <h4 className="font-semibold mb-1.5 flex items-center gap-2 text-xs text-primary/80">
                                            {line.icon} {line.title}
                                        </h4>
                                        <p className="pl-6 text-muted-foreground text-xs">{line.content}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                 <div className="mt-4 pt-4 border-t text-center space-y-2">
                     <p className="text-sm text-muted-foreground min-h-[40px] px-4 flex items-center justify-center">
                        {currentSimStep.explanation}
                    </p>
                    <div className="flex justify-center gap-2">
                        {!isRunning ? (
                             <Button onClick={handleStart} className="w-32">
                                <Play className="mr-2"/> Start
                            </Button>
                        ) : (
                            <>
                                <Button onClick={handleReset} variant="outline" className="w-32">
                                    <RefreshCw className="mr-2"/> Reset
                                </Button>
                                <Button onClick={handleNext} disabled={isFinished} className="w-32">
                                    Next <ArrowRight className="ml-2"/>
                                </Button>
                            </>
                        )}
                    </div>
                 </div>

            </CardContent>
        </Card>
    );
};
