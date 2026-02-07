
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BrainCircuit, Database, FileJson } from 'lucide-react';
import { CodeBlock } from './ui/code-block';

export const SerializationVisual = () => {
    const liveObjectCode = `state = {
    "user_name": "Alex",
    "history": [
        AIMessage(content="Hi!"),
        HumanMessage(content="Hello!")
    ]
}`;
    const serializedJsonCode = `{
    "user_name": "Alex",
    "history": [
        {
            "type": "ai",
            "content": "Hi!"
        },
        {
            "type": "human",
            "content": "Hello!"
        }
    ]
}`;

    return (
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 my-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><BrainCircuit /> Live Python Object</CardTitle>
                </CardHeader>
                <CardContent>
                    <CodeBlock code={liveObjectCode} className="text-xs" />
                </CardContent>
            </Card>

            <div className="flex flex-col items-center px-2">
                 <p className="text-xs font-semibold text-primary">Serialize</p>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-1">(to save)</p>
            </div>

            <Card>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><FileJson /> Stored JSON Text</CardTitle>
                </CardHeader>
                <CardContent>
                     <CodeBlock code={serializedJsonCode} className="text-xs" />
                </CardContent>
            </Card>
        </div>
    );
};
