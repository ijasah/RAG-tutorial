// src/components/ParameterDemo.tsx
"use client";

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenChart, TokenData } from '@/components/TokenChart';
import { Badge } from './ui/badge';
import { useTypewriter } from '@/hooks/use-typewriter';

interface ParameterDemoProps {
  parameter: 'temperature' | 'top-k' | 'top-p';
}

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
];

const generatedTextSamples = {
    low: "The knight, with his trusty sword, embarked on a quest to the dark castle. He had to save the princess from the dragon.",
    medium: "In a realm of magic and wonder, a young wizard began a great journey. His quest was to find the ancient dragon's lair.",
    high: "The cosmos whispered a poem of starlight and shadow, a story of a celestial dragon embarking on a psychedelic adventure through swirling galaxies.",
};


export const ParameterDemo = ({ parameter }: ParameterDemoProps) => {
  const [value, setValue] = useState(0.5);
  const [runId, setRunId] = useState(0);

  const { title, description, sliderMin, sliderMax, sliderStep } = useMemo(() => {
    switch (parameter) {
      case 'temperature':
        return {
          title: 'Temperature',
          description: 'Controls the randomness of the output. Lower values make the model more deterministic, while higher values encourage more creative and diverse responses.',
          sliderMin: 0,
          sliderMax: 1,
          sliderStep: 0.1
        };
      case 'top-k':
        return {
          title: 'Top-K Sampling',
          description: "Limits the model's choices to the 'K' most likely tokens at each step. A lower 'K' narrows the options, making the output more predictable.",
          sliderMin: 1,
          sliderMax: 10,
          sliderStep: 1
        };
      case 'top-p':
        return {
          title: 'Top-P (Nucleus) Sampling',
          description: "Selects tokens from a cumulative probability distribution that exceeds a threshold 'P'. This is a more dynamic way to control the number of choices.",
          sliderMin: 0.1,
          sliderMax: 1,
          sliderStep: 0.1
        };
    }
  }, [parameter]);

  const { chartData, sampledTokens, generatedText } = useMemo(() => {
    let tokens = [...initialTokens].sort((a, b) => b.probability - a.probability);
    let sampledTokens: string[] = [];
    let generatedText = "";

    switch (parameter) {
        case 'temperature':
            const temp = value === 0 ? 0.001 : value;
            const logits = tokens.map(t => Math.log(t.probability));
            const scaledLogits = logits.map(l => l / temp);
            const expLogits = scaledLogits.map(l => Math.exp(l));
            const sumExpLogits = expLogits.reduce((a, b) => a + b, 0);
            tokens = tokens.map((token, i) => ({
                ...token,
                probability: expLogits[i] / sumExpLogits,
            })).sort((a,b) => b.probability - a.probability);
            sampledTokens = tokens.map(t => t.name);

            if (value < 0.3) generatedText = generatedTextSamples.low;
            else if (value < 0.7) generatedText = generatedTextSamples.medium;
            else generatedText = generatedTextSamples.high;
            break;
        case 'top-k':
            const k = Math.round(value);
            const topKTokens = tokens.slice(0, k);
            const sumProb = topKTokens.reduce((sum, token) => sum + token.probability, 0);
            tokens = tokens.map(token => {
                const isIncluded = topKTokens.some(t => t.name === token.name);
                return {
                    ...token,
                    probability: isIncluded ? token.probability / sumProb : 0,
                    fill: isIncluded ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                };
            });
            sampledTokens = topKTokens.map(t => t.name);

            if (k <= 2) generatedText = "The story begins with a poem...";
            else if (k <= 6) generatedText = "The story of the dragon's journey began with a magical quest.";
            else generatedText = "The poem told a story of a wizard's adventure, a quest for a magic sword to defeat a dragon in a faraway castle.";
            break;
        case 'top-p':
            let cumulativeProb = 0;
            const topPTokens = [];
            for (const token of tokens) {
                if (cumulativeProb < value) {
                    topPTokens.push(token);
                    cumulativeProb += token.probability;
                }
            }
            const sumTopPProb = topPTokens.reduce((sum, token) => sum + token.probability, 0);
            tokens = tokens.map(token => {
                const isIncluded = topPTokens.some(p => p.name === token.name);
                return {
                    ...token,
                    probability: isIncluded ? token.probability / sumTopPProb : 0,
                    fill: isIncluded ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                };
            });
            sampledTokens = topPTokens.map(t => t.name);
            
            if (value < 0.4) generatedText = "A story about a poem...";
            else if (value < 0.8) generatedText = "The story of the dragon's magic adventure was a popular poem.";
            else generatedText = "The poem was a story about a wizard's magic quest to find a sword for his journey to the dragon's castle.";
            break;
    }

    const displayText = useTypewriter(generatedText, 30);
    
    return { chartData: tokens, sampledTokens, generatedText: displayText };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, parameter, runId]);

  const displayText = useTypewriter(generatedText, 30);


  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Adjust Parameter</h4>
          <div className="flex items-center gap-4">
            <Slider
              min={sliderMin}
              max={sliderMax}
              step={sliderStep}
              value={[value]}
              onValueChange={(vals) => {
                setValue(vals[0])
                setRunId(Date.now())
              }}
            />
            <Badge variant="outline" className="text-lg w-20 justify-center">{value.toFixed(parameter === 'top-k' ? 0 : 1)}</Badge>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">Generated Text</h4>
            <div className="p-4 bg-muted/50 rounded-lg border min-h-[150px] text-sm">
              <p>{displayText}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Next Token Probability Distribution</h4>
          <p className="text-xs text-muted-foreground -mt-2">
            The model will sample from the tokens highlighted in <span className="text-primary font-semibold">primary</span>.
          </p>
          <TokenChart data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
};
