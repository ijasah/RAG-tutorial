// src/components/EvaluationMetricsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "./ui/badge";

const metrics = [
  {
    metric: "Context Precision",
    question: "Is the context relevant?",
    formula: "Relevant Chunks / Total Retrieved",
    focus: "Measures the signal-to-noise ratio in the retrieved context. High precision means less noise.",
  },
  {
    metric: "Context Recall",
    question: "Was all relevant context retrieved?",
    formula: "Retrieved GT Contexts / Total GT Contexts",
    focus: "Measures how much of the necessary information was actually found by the retriever.",
  },
  {
    metric: "Faithfulness",
    question: "Is the answer supported by the context?",
    formula: "Supported Claims / Total Claims",
    focus: "Measures factual consistency and prevents hallucinations by verifying the answer against the context.",
  },
  {
    metric: "Noise Sensitivity",
    question: "Does 'noise' in the context affect the answer?",
    formula: "Incorrect Claims / Total Claims",
    focus: "Measures the model's robustness to irrelevant information. A lower score is better.",
  },
  {
    metric: "Response Relevancy",
    question: "Is the answer relevant to the query?",
    formula: "Avg. Similarity(Original Query, Generated Qs)",
    focus: "Measures how well the answer addresses the user's specific question, penalizing incomplete or verbose answers.",
  },
];

export const EvaluationMetricsTable = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Metric</TableHead>
              <TableHead className="font-bold">Core Question</TableHead>
              <TableHead className="font-bold">Focus</TableHead>
              <TableHead className="text-right font-bold">Simplified Formula</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.metric}>
                <TableCell className="font-medium">{metric.metric}</TableCell>
                <TableCell className="italic text-muted-foreground">"{metric.question}"</TableCell>
                <TableCell>{metric.focus}</TableCell>
                <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs whitespace-pre-wrap">{metric.formula}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};
