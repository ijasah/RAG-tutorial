// src/components/TemperatureDemo.tsx
"use client";

import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenChart, TokenData } from '@/components/TokenChart';
import { Badge } from './ui/badge';
import { useTypewriter } from '@/hooks/use-typewriter';
import { Thermometer } from 'lucide-react';

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

export const TemperatureDemo = () => {
  const [temperature, setTemperature] = useState(0.5);
  const [runId, setRunId] = useState(0);

  const { chartData, generatedText } = useMemo(() => {
    let tokens = [...initialTokens];
    const temp = temperature === 0 ? 0.001 : temperature;
    
    // Recalculate probabilities using softmax with temperature
    const logits = tokens.map(t => Math.log(t.probability));
    const scaledLogits = logits.map(l => l / temp);
    const maxLogit = Math.max(...scaledLogits); // For numerical stability
    const expLogits = scaledLogits.map(l => Math.exp(l - maxLogit));
    const sumExpLogits = expLogits.reduce((a, b) => a + b, 0);
    const finalProbabilities = expLogits.map(e => e / sumExpLogits);
    
    tokens = tokens.map((token, i) => ({
      ...token,
      probability: finalProbabilities[i],
    })).sort((a, b) => b.probability - a.probability);
    
    let text;
    if (temperature < 0.3) text = generatedTextSamples.low;
    else if (temperature < 0.7) text = generatedTextSamples.medium;
    else text = generatedTextSamples.high;

    return { chartData: tokens, generatedText: text };
  }, [temperature]);

  const displayText = useTypewriter(generatedText, 30);

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Thermometer/> Temperature</CardTitle>
        <CardDescription>
            Controls the randomness of the output. Lower values make the model more deterministic and focused, while higher values encourage more creative and surprising responses.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Adjust Temperature</h4>
          <div className="flex items-center gap-4">
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(vals) => setTemperature(vals[0])}
            />
            <Badge variant="outline" className="text-lg w-20 justify-center">{temperature.toFixed(1)}</Badge>
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
            Observe how the probabilities become more uniform (creative) or sharper (focused) as you adjust the temperature.
          </p>
          <TokenChart data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
};
