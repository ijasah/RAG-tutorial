"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, RefreshCw, User, ArrowRight, Server, BrainCircuit, Eye, Wand2, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const stringToolsCode = `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("StringTools")

@mcp.tool()
def reverse_string(text: str) -> str:
    """Reverses the given string."""
    return text[::-1]

@mcp.tool()
def count_words(text: str) -> int:
    """Counts the number of words in a sentence."""
    return len(text.split())

if __name__ == "__main__":
    mcp.run(transport="stdio")`;

const dateTimeToolsCode = `from datetime import datetime
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("DateTimeTools")

@mcp.tool()
def current_datetime() -> str:
    """Returns the current date and time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@mcp.tool()
def days_until(date_str: str) -> int:
    """Returns num days until a future date."""
    target_date = datetime.strptime(date_str, "%Y-%m-%d")
    delta = target_date - datetime.now()
    return max(delta.days, 0)

if __name__ == "__main__":
    mcp.run(transport="stdio")`;

const clientCode = `import asyncio
from mcp import ClientSession, StdioServerParameters
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent
from langchain_ollama import ChatOllama

async def main():
    # Define connection to tool servers
    server_params = {
        "strings": {"command": "python", "args": ["string_tools_server.py"]},
        "datetime": {"command": "python", "args": ["datetime_tools_server.py"]},
    }

    # Connect to servers and load tools
    async with MultiServerMCPClient(server_params) as client:
        tools = client.get_tools()
        
        # Create agent with the loaded tools
        model = ChatOllama(model="llama3.2")
        agent = create_react_agent(model, tools)

        # Invoke the agent with a user query
        query = {"messages": "How many days until 2025-12-31?"}
        response = await agent.ainvoke(query)
        ...
`;

const queries = [
    { value: 'reverse', label: "Reverse the string 'hello world'" },
    { value: 'count', label: "How many words are in 'MCP is powerful'?" },
    { value: 'datetime', label: 'What is the current date and time?' },
    { value: 'days_until', label: 'How many days until 2025-12-31?' },
];

type LogEntry = {
    type: 'Thought' | 'Action' | 'Observation' | 'Final Answer' | 'Info';
    content: string;
    icon: React.ReactNode;
}

const getSimulationSteps = (query: string): LogEntry[] => {
    switch (query) {
        case 'reverse':
            return [
                { type: 'Info', content: "User asked: \"Reverse the string 'hello world'\"", icon: <User size={14} /> },
                { type: 'Thought', content: "I need to reverse a string. The `reverse_string` tool on the `strings` server seems appropriate.", icon: <BrainCircuit size={14} /> },
                { type: 'Action', content: "Calling tool `reverse_string` with args `{'text': 'hello world'}`", icon: <Wand2 size={14} /> },
                { type: 'Observation', content: "Tool returned: 'dlrow olleh'", icon: <Eye size={14} /> },
                { type: 'Final Answer', content: "The reversed string is 'dlrow olleh'.", icon: <CheckCircle size={14} /> }
            ];
        case 'count':
             return [
                { type: 'Info', content: "User asked: \"How many words are in 'MCP is powerful'?\"", icon: <User size={14} /> },
                { type: 'Thought', content: "The user wants to count words. I should use the `count_words` tool from the `strings` server.", icon: <BrainCircuit size={14} /> },
                { type: 'Action', content: "Calling tool `count_words` with args `{'text': 'MCP is powerful'}`", icon: <Wand2 size={14} /> },
                { type: 'Observation', content: "Tool returned: 3", icon: <Eye size={14} /> },
                { type: 'Final Answer', content: "There are 3 words in the sentence.", icon: <CheckCircle size={14} /> }
            ];
        case 'datetime':
            return [
                { type: 'Info', content: "User asked: \"What is the current date and time?\"", icon: <User size={14} /> },
                { type: 'Thought', content: "I need the current time. The `current_datetime` tool on the `datetime` server can provide this.", icon: <BrainCircuit size={14} /> },
                { type: 'Action', content: "Calling tool `current_datetime`", icon: <Wand2 size={14} /> },
                { type: 'Observation', content: `Tool returned: '${new Date().toLocaleString()}'`, icon: <Eye size={14} /> },
                { type: 'Final Answer', content: `The current date and time is ${new Date().toLocaleString()}.`, icon: <CheckCircle size={14} /> }
            ];
        case 'days_until':
             const targetDate = new Date('2025-12-31');
             const today = new Date();
             const diffTime = Math.abs(targetDate.getTime() - today.getTime());
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             return [
                { type: 'Info', content: "User asked: \"How many days until 2025-12-31?\"", icon: <User size={14} /> },
                { type: 'Thought', content: "The user is asking for the number of days until a specific date. I will use the `days_until` tool from the `datetime` server.", icon: <BrainCircuit size={14} /> },
                { type: 'Action', content: "Calling tool `days_until` with args `{'date_str': '2025-12-31'}`", icon: <Wand2 size={14} /> },
                { type: 'Observation', content: `Tool returned: ${diffDays}`, icon: <Eye size={14} /> },
                { type: 'Final Answer', content: `There are ${diffDays} days until 2025-12-31.`, icon: <CheckCircle size={14} /> }
            ];
        default: return [];
    }
}


export const MCPSimulator = () => {
    const [selectedQuery, setSelectedQuery] = useState(queries[0].value);
    const [log, setLog] = useState<LogEntry[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeServer, setActiveServer] = useState<'strings' | 'datetime'>('strings');

    const handleSimulate = () => {
        setIsRunning(true);
        setLog([]);
        const simulationSteps = getSimulationSteps(selectedQuery);
        
        simulationSteps.forEach((entry, index) => {
            setTimeout(() => {
                setLog(prev => [...prev, entry]);

                if (entry.type === 'Action') {
                     if (entry.content.includes('reverse_string') || entry.content.includes('count_words')) {
                        setActiveServer('strings');
                    } else {
                        setActiveServer('datetime');
                    }
                }

                if (index === simulationSteps.length - 1) {
                    setIsRunning(false);
                }
            }, (index + 1) * 1200);
        });
    };

    const handleReset = () => {
        setIsRunning(false);
        setLog([]);
    };
    
     const getLogColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'Info': return 'border-gray-400 bg-gray-500/10';
            case 'Thought': return 'border-purple-400 bg-purple-500/10';
            case 'Action': return 'border-blue-400 bg-blue-500/10';
            case 'Observation': return 'border-amber-400 bg-amber-500/10';
            case 'Final Answer': return 'border-green-400 bg-green-500/10';
            default: return 'border-border';
        }
    }

    return (
        <Card className="bg-card/50 shadow-inner">
            <CardHeader className="text-center">
                <CardTitle>MCP Agent Simulation</CardTitle>
                <CardDescription>
                    Watch how a LangGraph agent uses MCP to discover and call tools running on separate servers.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select onValueChange={setSelectedQuery} defaultValue={selectedQuery} disabled={isRunning}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a query..." />
                        </SelectTrigger>
                        <SelectContent>
                            {queries.map((q) => (
                                <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Button onClick={!log.length ? handleSimulate : handleReset} className="min-w-[120px]" disabled={isRunning}>
                        {isRunning ? 'Running...' : (log.length === 0 ? <><Play className="mr-2" />Simulate</> : <><RefreshCw className="mr-2" />Reset</>)}
                    </Button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-center">Code Setup</h4>
                        <Tabs value={activeServer} onValueChange={(val) => setActiveServer(val as any)}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="strings">String Tools Server</TabsTrigger>
                                <TabsTrigger value="datetime">DateTime Tools Server</TabsTrigger>
                            </TabsList>
                            <TabsContent value="strings">
                                <CodeBlock code={stringToolsCode} className="text-xs h-[280px] overflow-y-auto"/>
                            </TabsContent>
                             <TabsContent value="datetime">
                                <CodeBlock code={dateTimeToolsCode} className="text-xs h-[280px] overflow-y-auto"/>
                            </TabsContent>
                        </Tabs>
                        
                         <Card className="bg-muted/40">
                             <CardHeader className='p-3'>
                                <CardTitle className="text-sm">Client Code</CardTitle>
                             </CardHeader>
                            <CardContent className='p-3 pt-0'>
                                <CodeBlock code={clientCode} className="text-xs h-[200px] overflow-y-auto"/>
                             </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                         <h4 className="font-semibold text-center">Execution Log</h4>
                        <div className="h-[600px] w-full rounded-lg border p-2 bg-background/50 overflow-y-auto">
                            <AnimatePresence>
                                {log.map((entry, i) => (
                                    <motion.div
                                        key={i} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-2 border-l-4 rounded-r-md mb-2 text-xs",
                                            getLogColor(entry.type)
                                        )}
                                    >
                                        <p className="font-bold flex items-center gap-2">
                                            {entry.icon}
                                            {entry.type}
                                        </p>
                                        <p className="mt-1 pl-6">{entry.content}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
