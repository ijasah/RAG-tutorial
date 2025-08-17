"use client";
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-lg bg-black/50 p-4 my-2 text-sm", className)}>
       <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 w-7 text-white/50 hover:text-white hover:bg-white/10"
                    onClick={handleCopy}
                >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Copy code</p>
            </TooltipContent>
        </Tooltip>
       </TooltipProvider>
      <pre>
        <code className="font-mono text-white/90 whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
  );
}
