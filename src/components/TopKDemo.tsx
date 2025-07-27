// src/components/TopKDemo.tsx
"use client";

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenChart, TokenData } from '@/components/TokenChart';
import { Badge } from './ui/badge';
import { useTypewriter } from '@/hooks/use-typewriter';
import { ListFilter } from 'lucide-react';

const initialTokens: TokenData[] = [
    { name: 'story', probability: 0.25 },
    { name: 'poem', probability: 0.20 },
    { name: 'adventure', probability: 0.15 },
    { name: 'journey', probability: 0.10 },
    { name: 'dragon', probability: 0.08 },
    { name: 'magic', probability: 0.07 },
    { name: 'quest', probability: 0.06 },
    { name: 'castle', probability: 0.05 },
    { name: 'wizard', probability: 0.03 },
    { name: 'sword', probability: 0.01 },
].sort((a,b) => b.probability - a.probability);

const generatedTextSamples = {
    1: "The story...",
    2: "The story was a poem...",
    4: "The story of the adventure was a journey...",
    7: "The poem told a story of a dragon's magic adventure, a quest for a...",
    10: "The poem was a story about a wizard's magic quest to find a sword for his journey to the dragon's castle."
};

export const TopKDemo = () => {
  const [k, setK] = useState(4);

  const { chartData, generatedText } = useMemo(() => {
    let tokens = [...initialTokens];
    const topKTokens = tokens.slice(0, k);

    // Mark non-included tokens
    tokens = tokens.map((token, index) => ({
      ...token,
      fill: index < k ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
    }));

    let text;
    if (k <= 1) text = generatedTextSamples[1];
    else if (k <= 2) text = generatedTextSamples[2];
    else if (k <= 4) text = generatedTextSamples[4];
    else if (k <= 7) text = generatedTextSamples[7];
    else text = generatedTextSamples[10];
    
    return { chartData: tokens, generatedText: text };
  }, [k]);
  
  const displayText = useTypewriter(generatedText, 30);

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ListFilter/> Top-K Sampling</CardTitle>
        <CardDescription>
          Limits the model's choices to the 'K' most likely tokens at each step. A lower 'K' narrows the options, making the output more predictable and less prone to errors.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Adjust K</h4>
          <div className="flex items-center gap-4">
            <Slider
              min={1}
              max={10}
              step={1}
              value={[k]}
              onValueChange={(vals) => setK(vals[0])}
            />
            <Badge variant="outline" className="text-lg w-20 justify-center">{k}</Badge>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">Simulated Generated Text</h4>
            <div className="p-4 bg-muted/50 rounded-lg border min-h-[150px] text-sm">
              <p>{displayText}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Next Token Probability Distribution</h4>
          <p className="text-xs text-muted-foreground -mt-2">
            The model will only sample from the top {k} tokens highlighted in <span className="text-primary font-semibold">primary</span>.
          </p>
          <TokenChart data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
};
