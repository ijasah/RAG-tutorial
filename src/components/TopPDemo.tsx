// src/components/TopPDemo.tsx
"use client";

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenChart, TokenData } from '@/components/TokenChart';
import { Badge } from './ui/badge';
import { useTypewriter } from '@/hooks/use-typewriter';
import { Target } from 'lucide-react';

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
    low: "A story about a poem...",
    medium: "The story of the dragon's magic adventure was a popular poem.",
    high: "The poem was a story about a wizard's magic quest to find a sword for his journey to the dragon's castle."
};

export const TopPDemo = () => {
  const [p, setP] = useState(0.5);

  const { chartData, generatedText, includedTokensCount } = useMemo(() => {
    let tokens = [...initialTokens];
    let cumulativeProb = 0;
    const topPTokens = [];

    for (const token of tokens) {
      if (cumulativeProb < p) {
        topPTokens.push(token);
        cumulativeProb += token.probability;
      }
    }
    
    // Mark non-included tokens
    tokens = tokens.map((token) => {
        const isIncluded = topPTokens.some(t => t.name === token.name);
        return {
            ...token,
            fill: isIncluded ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
        };
    });

    let text;
    if (p < 0.4) text = generatedTextSamples.low;
    else if (p < 0.8) text = generatedTextSamples.medium;
    else text = generatedTextSamples.high;
    
    return { chartData: tokens, generatedText: text, includedTokensCount: topPTokens.length };
  }, [p]);
  
  const displayText = useTypewriter(generatedText, 30);

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target /> Top-P (Nucleus) Sampling</CardTitle>
        <CardDescription>
          Selects tokens from the smallest possible set whose cumulative probability exceeds the threshold 'P'. This is a more dynamic way to control the vocabulary size.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Adjust P</h4>
          <div className="flex items-center gap-4">
            <Slider
              min={0.1}
              max={1.0}
              step={0.05}
              value={[p]}
              onValueChange={(vals) => setP(vals[0])}
            />
            <Badge variant="outline" className="text-lg w-20 justify-center">{p.toFixed(2)}</Badge>
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
            The model will sample from the top {includedTokensCount} tokens (highlighted in <span className="text-primary font-semibold">primary</span>) that make up {Math.round(p*100)}% of the probability mass.
          </p>
          <TokenChart data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
};
