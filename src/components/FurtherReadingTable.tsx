
// src/components/FurtherReadingTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "./ui/badge";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const papers = [
  { method: "CoG", ref: "[29]", citation: "Copy Is All You Need — T. Lan et al., ICLR", link: "https://arxiv.org/abs/2307.06962" },
  { method: "DenseX", ref: "[30]", citation: "Dense X Retrieval: What retrieval granularity should we use? — T. Chen et al.", link: "https://arxiv.org/abs/2312.06648" },
  { method: "EAR", ref: "[31]", citation: "Divide & conquer for entailment-aware multi-hop evidence retrieval — F. Luo & M. Surdeanu", link: "https://arxiv.org/abs/2311.02616" },
  { method: "UPRISE", ref: "[20]", citation: "UPRISE: Universal prompt retrieval for improving zero-shot evaluation — D. Cheng et al.", link: "https://arxiv.org/abs/2303.08518" },
  { method: "RAST", ref: "[32]", citation: "Diversify question generation with retrieval-augmented style transfer — Q. Gou et al.", link: "https://arxiv.org/abs/2310.14503" },
  { method: "Self-Mem", ref: "[17]", citation: "Lift yourself up: Retrieval-augmented text generation with self memory — X. Cheng et al.", link: "https://arxiv.org/abs/2305.02437" },
  { method: "FLARE", ref: "[24]", citation: "Active retrieval augmented generation — Z. Jiang et al.", link: "https://arxiv.org/abs/2305.06983" },
  { method: "PGRA", ref: "[33]", citation: "Prompt-guided retrieval augmentation for non-knowledge-intensive tasks — Z. Guo et al.", link: "https://arxiv.org/abs/2305.17653" },
  { method: "FILCO", ref: "[34]", citation: "Learning to filter context for retrieval-augmented generation — Z. Wang et al.", link: "https://arxiv.org/abs/2311.08377" },
  { method: "RADA", ref: "[35]", citation: "Retrieval-augmented data augmentation for low-resource domain tasks — M. Seo et al.", link: "https://arxiv.org/abs/2402.13482" },
  { method: "Filter-rerank", ref: "[36]", citation: "Large language model is not a good few-shot information extractor, but a good reranker for hard samples! — Y. Ma et al.", link: "https://arxiv.org/abs/2303.08559" },
  { method: "R-GQA", ref: "[37]", citation: "Retrieval-augmented generative QA for event argument extraction — X. Du & H. Ji", link: "https://arxiv.org/abs/2211.07067" },
  { method: "LLM-R", ref: "[38]", citation: "Learning to retrieve in-context examples for large language models — L. Wang et al.", link: "https://arxiv.org/abs/2307.07164" },
  { method: "TIGER", ref: "[39]", citation: "Recommender systems with generative retrieval — S. Rajput et al.", link: "https://arxiv.org/abs/2305.05065" },
  { method: "LM-Indexer", ref: "[40]", citation: "Language models as semantic indexers — B. Jin et al.", link: "https://arxiv.org/abs/2310.07815" },
  { method: "BEQUE", ref: "[9]", citation: "Large language model based long-tail query rewriting in taobao search — W. Peng et al.", link: "https://arxiv.org/abs/2311.03758" },
  { method: "CT-RAG", ref: "[41]", citation: "Context tuning for retrieval augmented generation — R. Anantha et al.", link: "https://arxiv.org/abs/2312.05708" },
  { method: "Atlas", ref: "[42]", citation: "Few-shot learning with retrieval augmented language models — G. Izacard et al.", link: "https://arxiv.org/abs/2208.03299" },
  { method: "RAVEN", ref: "[43]", citation: "Raven: In-context learning with retrieval augmented encoder-decoder language models — J. Huang et al.", link: "https://arxiv.org/abs/2308.07922" },
  { method: "RETRO++", ref: "[44]", citation: "Shall we pretrain autoregressive language models with retrieval? A comprehensive study — B. Wang et al.", link: "https://arxiv.org/abs/2304.06762" },
];

export const FurtherReadingTable = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Method</TableHead>
              <TableHead className="font-bold">Citation</TableHead>
              <TableHead className="text-right font-bold">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {papers.map((paper) => (
              <TableRow key={paper.method}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{paper.method}</Badge>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{paper.citation.split('—')[0]}</p>
                  <p className="text-xs text-muted-foreground">{paper.citation.split('—')[1]}</p>
                </TableCell>
                <TableCell className="text-right">
                    <Link href={paper.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                        arXiv <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};
