"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/ui/code-block';
import { Play, RefreshCw, Bot, Code, MessageCircle, Settings } from 'lucide-react';
import { useTypewriter } from '@/hooks/use-typewriter';

const codeSnippets = {
    updates: `# The graph is already defined...

# stream_mode="updates" streams the state *changes* at each step.
for chunk in graph.stream(
  {"topic": "ice cream"},
  stream_mode="updates", 
):
    print(chunk)

# OUTPUT:
# {'refine_topic': {'topic': 'ice cream and cats'}}
# {'generate_joke': {'joke': '...'}}`,
    values: `# The graph is already defined...

# stream_mode="values" streams the *entire state* after each step.
for chunk in graph.stream(
  {"topic": "ice cream"},
  stream_mode="values", 
):
    print(chunk)

# OUTPUT:
# {'topic': 'ice cream and cats', 'joke': ''}
# {'topic': 'ice cream and cats', 'joke': '...'}`,
    messages: `# Graph node now uses a streaming LLM
def generate_joke(state: State):
    # response = model.stream(...)
    # ...
    return {"joke": response_content}

# stream_mode="messages" streams token-by-token from any LLM.
for chunk, metadata in graph.stream(
  {"topic": "ice cream"},
  stream_mode="messages",
):
    if chunk.content:
        print(chunk.content, end="")

# OUTPUT:
# Why| don't| cats| play| poker...|`,
    custom: `from langgraph.config import get_stream_writer

def call_arbitrary_model(state):
    """Example node that calls an arbitrary model and streams the output"""
    # Get the stream writer to send custom data
    writer = get_stream_writer()
    # Assume you have a streaming client that yields chunks
    # Generate LLM tokens using your custom streaming client
    for chunk in your_custom_streaming_client(state["topic"]):
        # Use the writer to send custom data to the stream
        writer({"custom_llm_chunk": chunk})
    return {"result": "completed"}

# graph = ... (Graph is compiled with the node above)
# Set stream_mode="custom" to receive the custom data
for chunk in graph.stream(
    {"topic": "cats"},
    stream_mode="custom",
):
    # The chunk will contain the custom data streamed from the llm
    print(chunk)`
};


const simulationData = {
    updates: [
        { 'refine_topic': { 'topic': 'ice cream and cats' } },
        { 'generate_joke': { 'joke': "Why don't cats play poker in the jungle? Too many cheetahs." } }
    ],
    values: [
        { 'topic': 'ice cream and cats', 'joke': '' },
        { 'topic': 'ice cream and cats', 'joke': "Why don't cats play poker in the jungle? Too many cheetahs." }
    ],
    messages: "Why don't cats play poker in the jungle? Too many cheetahs.".match(/(\w+\s*|\W)/g) || [],
    custom: [
        { "custom_llm_chunk": "Here's" },
        { "custom_llm_chunk": " a" },
        { "custom_llm_chunk": " stream" },
        { "custom_llm_chunk": " from" },
        { "custom_llm_chunk": " any" },
        { "custom_llm_chunk": " LLM!" }
    ]
};

const OutputChunk = ({ data, isMessage }: { data: any, isMessage?: boolean }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 bg-background border rounded-md"
        >
            {isMessage ? (
                <span className="font-mono text-primary">{data}</span>
            ) : (
                <pre className="text-xs font-mono">{JSON.stringify(data, null, 2)}</pre>
            )}
        </motion.div>
    );
};

export const StreamingSimulator = () => {
    const [activeTab, setActiveTab] = useState('updates');
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState<any[]>([]);

    const handleRun = () => {
        setIsRunning(true);
        setOutput([]);
        
        const data = simulationData[activeTab as keyof typeof simulationData];
        let delay = activeTab === 'messages' ? 50 : 800;

        data.forEach((chunk, index) => {
            setTimeout(() => {
                setOutput(prev => [...prev, chunk]);
                if (index === data.length - 1) {
                    setIsRunning(false);
                }
            }, index * delay);
        });
    };

    const handleReset = () => {
        setIsRunning(false);
        setOutput([]);
    };
    
    const displayText = useTypewriter(
      activeTab === 'messages' ? output.join('') : '',
      50
    );


    return (
        <Card className="w-full bg-muted/30 shadow-inner">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <h3 className="font-semibold">Graph Definition & Invocation</h3>
                    <CodeBlock code={codeSnippets[activeTab as keyof typeof codeSnippets]} className="h-full" />
                </div>
                <div className="space-y-4">
                     <h3 className="font-semibold">Live Output</h3>
                    <Tabs value={activeTab} onValueChange={(val) => { handleReset(); setActiveTab(val); }}>
                        <TabsList className="grid grid-cols-4 w-full">
                            <TabsTrigger value="updates">Updates</TabsTrigger>
                            <TabsTrigger value="values">Values</TabsTrigger>
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                            <TabsTrigger value="custom">Custom</TabsTrigger>
                        </TabsList>
                        <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="text-xs text-center text-muted-foreground p-2 h-12">
                                {
                                    activeTab === 'updates' ? 'Streams only the changes to the state at each step.' :
                                    activeTab === 'values' ? 'Streams the entire state object after each step.' :
                                    activeTab === 'messages' ? 'Streams token-by-token output from LLMs in the graph.' :
                                    'Streams custom events manually emitted from your nodes.'
                                }
                            </p>
                        </motion.div>
                        </AnimatePresence>
                    </Tabs>
                    <div className="h-64 w-full rounded-lg border p-2 bg-background/50 overflow-y-auto">
                        <AnimatePresence>
                            {activeTab === 'messages' ? (
                                <p className="font-mono text-primary p-2">{displayText}<span className="animate-ping">|</span></p>
                            ) : (
                                <div className="space-y-2">
                                {output.map((chunk, i) => (
                                    <OutputChunk key={i} data={chunk} />
                                ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                     <div className="flex justify-center gap-2">
                        <Button onClick={handleRun} disabled={isRunning} className="w-28">
                            <Play className="mr-2"/> Run
                        </Button>
                        <Button onClick={handleReset} variant="outline" disabled={!output.length && !isRunning}>
                            <RefreshCw className="mr-2"/> Reset
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
