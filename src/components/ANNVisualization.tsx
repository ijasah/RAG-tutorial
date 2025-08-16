// src/components/ANNVisualization.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, CheckCircle, ListTree, RefreshCw, Sparkles, X } from 'lucide-react';

// --- DATA AND TYPES ---
type Point = { id: number; x: number; y: number };
type Split = { p1Id: number; p2Id: number };
type TreeNode = {
  path: string;
  points: Point[];
  split?: Split;
  bounds: { x: number; y: number }[];
  children?: { left: TreeNode; right: TreeNode };
  regionColor?: string;
};

const WIDTH = 550;
const HEIGHT = 450;
const PADDING = 40;

const initialPoints: Point[] = [
    { id: 1, x: 2.0, y: 2.8 }, { id: 2, x: 4.0, y: 8.5 }, { id: 3, x: 8.0, y: 9.0 },
    { id: 4, x: 1.2, y: 1.8 }, { id: 5, x: 2.2, y: 1.5 }, { id: 6, x: 6.5, y: 8.2 },
    { id: 7, x: 7.8, y: 5.5 }, { id: 8, x: 1.0, y: 0.8 }, { id: 9, x: 4.8, y: 6.0 },
    { id: 10, x: 8.5, y: 7.5 }, { id: 11, x: 6.0, y: 4.5 }, { id: 12, x: 6.8, y: 9.5 },
    { id: 13, x: 2.8, y: 2.2 }, { id: 14, x: 8.8, y: 4.8 }, { id: 15, x: 2.0, y: 9.5 },
    { id: 16, x: 5.5, y: 3.0 },
];

const queryPoint = { id: 0, x: 1.5, y: 0.5 };

const splitSequence: (Split & { path: string })[] = [
  { path: 'R', p1Id: 1, p2Id: 9 },
  { path: 'RL', p1Id: 1, p2Id: 4 },
  { path: 'RR', p1Id: 6, p2Id: 12 },
  { path: 'RLR', p1Id: 2, p2Id: 15 },
  { path: 'RRR', p1Id: 7, p2Id: 14 },
];

// --- COORDINATE SCALING ---
const getCoords = (p: { x: number; y: number }) => ({
  x: PADDING + (p.x / 10) * (WIDTH - PADDING * 2),
  y: PADDING + (1 - (p.y / 10)) * (HEIGHT - PADDING * 2),
});

// --- CORE ALGORITHMIC LOGIC ---
const isLeftOfHyperplane = (p: Point, p1: Point, p2: Point) => {
    // Check which point (p1 or p2) the query point p is closer to.
    const d1 = Math.pow(p.x - p1.x, 2) + Math.pow(p.y - p1.y, 2);
    const d2 = Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2);
    return d1 < d2;
};

function createTreeFromSequence(sequence: typeof splitSequence): TreeNode {
    const root: TreeNode = {
        path: 'R',
        points: initialPoints,
        split: sequence.find(s => s.path === 'R'),
        bounds: [ {x:0, y:0}, {x:10, y:0}, {x:10, y:10}, {x:0, y:10} ],
    };

    const nodesToProcess = [root];
    const leafNodes: TreeNode[] = [];

    while (nodesToProcess.length > 0) {
        const currentNode = nodesToProcess.shift()!;
        const split = currentNode.split;

        if (!split) {
            leafNodes.push(currentNode);
            continue;
        }

        const p1 = initialPoints.find(p => p.id === split.p1Id)!;
        const p2 = initialPoints.find(p => p.id === split.p2Id)!;

        const leftPoints: Point[] = [];
        const rightPoints: Point[] = [];

        // Partition points within the CURRENT node's region
        for (const point of currentNode.points) {
            if (isLeftOfHyperplane(point, p1, p2)) {
                leftPoints.push(point);
            } else {
                rightPoints.push(point);
            }
        }
        
        const { leftBounds, rightBounds } = getRegionBoundaries(currentNode.bounds, p1, p2);

        const leftChild: TreeNode = {
            path: currentNode.path + 'L',
            points: leftPoints,
            split: sequence.find(s => s.path === currentNode.path + 'L'),
            bounds: leftBounds,
        };

        const rightChild: TreeNode = {
            path: currentNode.path + 'R',
            points: rightPoints,
            split: sequence.find(s => s.path === currentNode.path + 'R'),
            bounds: rightBounds,
        };

        currentNode.children = { left: leftChild, right: rightChild };
        nodesToProcess.push(leftChild, rightChild);
    }
    
    const colors = ['hsla(347, 84%, 61%, 0.15)', 'hsla(217, 91%, 60%, 0.15)', 'hsla(150, 75%, 42%, 0.15)', 'hsla(39, 91%, 55%, 0.15)', 'hsla(300, 76%, 59%, 0.15)', 'hsla(262, 84%, 58%, 0.2)'];
    leafNodes.forEach((node, i) => node.regionColor = colors[i % colors.length]);

    return root;
}


// --- GEOMETRY & CLIPPING HELPERS ---
const getIntersection = (a1: {x:number, y:number}, a2: {x:number, y:number}, b1: {x:number, y:number}, b2: {x:number, y:number}) => {
    const dax = (a1.x - a2.x), dbx = (b1.x - b2.x);
    const day = (a1.y - a2.y), dby = (b1.y - b2.y);

    const den = dax * dby - day * dbx;
    if (den === 0) return null; // parallel

    const a = (a1.x * a2.y - a1.y * a2.x);
    const b = (b1.x * b2.y - b1.y * b2.x);

    const ix = (a * dbx - dax * b) / den;
    const iy = (a * dby - day * b) / den;

    // Ensure the intersection point lies on both line segments
    if (ix < Math.min(a1.x, a2.x) - 1e-9 || ix > Math.max(a1.x, a2.x) + 1e-9) return null;
    if (iy < Math.min(a1.y, a2.y) - 1e-9 || iy > Math.max(a1.y, a2.y) + 1e-9) return null;
    if (ix < Math.min(b1.x, b2.x) - 1e-9 || ix > Math.max(b1.x, b2.x) + 1e-9) return null;
    if (iy < Math.min(b1.y, b2.y) - 1e-9 || iy > Math.max(b1.y, b2.y) + 1e-9) return null;

    return { x: ix, y: iy };
};

const getRegionBoundaries = (bounds: {x:number, y:number}[], p1: Point, p2: Point) => {
    // Hyperplane is the perpendicular bisector of the line segment p1-p2
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Define a point on the hyperplane and its normal vector
    const hp_point = { x: midX, y: midY };
    const hp_normal = { x: dx, y: dy };
    
    // Sutherland-Hodgman algorithm for clipping a polygon
    const clipPolygon = (subjectPolygon: {x:number, y:number}[], isLeft: boolean) => {
        let outputList = subjectPolygon;
        const clipperPolygon = [
          {x: midX - dy * 100, y: midY + dx * 100},
          {x: midX + dy * 100, y: midY - dx * 100},
          isLeft ? {x: midX + dx*100 - dy*100, y: midY + dy*100 + dx*100} : {x: midX - dx*100 - dy*100, y: midY - dy*100 + dx*100},
        ]
        
        const clip = (clipPolygon: {x:number, y:number}[], subjectPolygon: {x:number, y:number}[]) => {
          let new_points: {x:number, y:number}[] = []
          for (let i = 0; i < clipPolygon.length; i++) {
              let k = (i + 1) % clipPolygon.length
              let p1 = clipPolygon[i]
              let p2 = clipPolygon[k]

              let inside_points: {x:number, y:number}[] = []
              for (let j = 0; j < subjectPolygon.length; j++) {
                  let l = (j + 1) % subjectPolygon.length
                  let q1 = subjectPolygon[j]
                  let q2 = subjectPolygon[l]

                  let p_is_inside = (p: {x:number, y:number}) => (p2.x - p1.x) * (p.y - p1.y) - (p2.y - p1.y) * (p.x - p1.x) <= 0
                  
                  let q1_is_inside = p_is_inside(q1)
                  let q2_is_inside = p_is_inside(q2)

                  if (q1_is_inside && q2_is_inside) {
                      inside_points.push(q2)
                  } else if (q1_is_inside && !q2_is_inside) {
                      let intersection = getIntersection(p1, p2, q1, q2)
                      if(intersection) inside_points.push(intersection)
                  } else if (!q1_is_inside && q2_is_inside) {
                      let intersection = getIntersection(p1, p2, q1, q2)
                      if(intersection) inside_points.push(intersection)
                      inside_points.push(q2)
                  }
              }
              subjectPolygon = inside_points
          }
          return subjectPolygon
        }
        
        return clip(clipperPolygon, outputList);
    };
    
    return { leftBounds: clipPolygon(bounds, true), rightBounds: clipPolygon(bounds, false) };
};

// --- REACT COMPONENT ---
export function ANNVisualization() {
    const [step, setStep] = useState(0);
    const maxSteps = splitSequence.length + 2; // 5 splits + query + result

    const tree = useMemo(() => createTreeFromSequence(splitSequence), []);

    const allNodes: TreeNode[] = useMemo(() => {
      const nodes: TreeNode[] = [];
      const queue = [tree];
      while(queue.length > 0){
        const node = queue.shift()!;
        nodes.push(node);
        if(node.children){
          queue.push(node.children.left, node.children.right);
        }
      }
      return nodes;
    }, [tree]);

    const hyperplanes = useMemo(() => {
        return splitSequence.map((split, i) => {
            const parentNode = allNodes.find(n => n.path === split.path.slice(0, -1));
            if (!parentNode) return null;
            const p1 = initialPoints.find(p => p.id === split.p1Id)!;
            const p2 = initialPoints.find(p => p.id === split.p2Id)!;
            
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;

            // Create two points on the infinite perpendicular bisector
            const lineP1 = {x: midX - dy * 100, y: midY + dx * 100};
            const lineP2 = {x: midX + dy * 100, y: midY - dx * 100};

            // Find intersections with the parent's bounding box
            const intersections = [];
            for (let j = 0; j < parentNode.bounds.length; j++) {
                const boundP1 = parentNode.bounds[j];
                const boundP2 = parentNode.bounds[(j + 1) % parentNode.bounds.length];
                const intersect = getIntersection(lineP1, lineP2, boundP1, boundP2);
                if (intersect) {
                     intersections.push(intersect);
                }
            }
            
            // Return the clipped line segment
            if (intersections.length >= 2) {
                 return { id: `split-${i}`, p1: intersections[0], p2: intersections[1] };
            }
            return null;
        }).filter(Boolean);
    }, [splitSequence, allNodes]);
    
    
    const queryPath = useMemo(() => {
        if (step < splitSequence.length + 1) return [];
        let currentNode = tree;
        const path = [currentNode.path];
        while(currentNode.children){
            const split = currentNode.split!;
            const p1 = initialPoints.find(p => p.id === split.p1Id)!;
            const p2 = initialPoints.find(p => p.id === split.p2Id)!;
            if(isLeftOfHyperplane(queryPoint as Point, p1, p2)){
                currentNode = currentNode.children.left;
                path.push(currentNode.path);
            } else {
                currentNode = currentNode.children.right;
                path.push(currentNode.path);
            }
        }
        return path;
    }, [step, tree]);

    const finalQueryNode = useMemo(() => allNodes.find(n => n.path === queryPath[queryPath.length - 1]), [allNodes, queryPath]);

    const reset = () => setStep(0);
    const nextStep = () => setStep(s => Math.min(s + 1, maxSteps));
    const prevStep = () => setStep(s => Math.max(0, s - 1));

    const getStepDescription = () => {
        if (step === 0) return "We start with 16 data points. Our goal is to partition the space to enable fast searches.";
        if (step > 0 && step <= splitSequence.length) {
            const currentSplit = splitSequence[step - 1];
            return `Step ${step}/${splitSequence.length}: Select points ${currentSplit.p1Id} & ${currentSplit.p2Id}. Draw a hyperplane equidistant between them, splitting their parent region.`;
        }
        if (step === splitSequence.length + 1) return "The space is now fully partitioned. A new query point ('X') arrives. We need to find which region it belongs to by traversing the tree.";
        if (step === maxSteps) {
            const finalNode = finalQueryNode;
            if (finalNode) {
                 return `The query point falls into the region defined by path ${finalNode.path}. All points in this region (${finalNode.points.map(p=>p.id).join(', ')}) are now candidates for the nearest neighbors.`;
            }
        }
        return "";
    };
    
    const getVisibleLeafNodes = () => {
        if (step <= splitSequence.length) {
          const visibleNodePaths: string[] = ['R'];
          for(let i=0; i<step; i++) {
            const currentPath = splitSequence[i].path;
            const parentPath = currentPath.slice(0, -1);
            // remove parent path and add children paths
            const index = visibleNodePaths.indexOf(parentPath);
            if(index > -1) {
              visibleNodePaths.splice(index, 1);
              visibleNodePaths.push(parentPath + 'L', parentPath + 'R');
            }
          }
          return allNodes.filter(n => visibleNodePaths.includes(n.path) && !n.children);
        }
        // After all splits, show all leaf nodes
        return allNodes.filter(n => !n.children);
    }
    
    // --- RENDER ---
    return (
        <Card className="bg-card/50 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTree /> Annoy Index Simulation</CardTitle>
                <CardDescription>A step-by-step visualization of how Annoy builds a space-partitioning tree for approximate nearest neighbor search.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="lg:grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                        <div className="relative border-2 border-border rounded-lg bg-background" style={{ width: WIDTH, height: HEIGHT }}>
                            <svg width={WIDTH} height={HEIGHT}>
                                {/* Region Fills */}
                                <AnimatePresence>
                                {getVisibleLeafNodes().map((node) => (
                                    <motion.path
                                        key={`region-${node.path}`}
                                        d={`M ${node.bounds.map(p => `${getCoords(p).x},${getCoords(p).y}`).join(' L ')} Z`}
                                        fill={node.regionColor || 'transparent'}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    />
                                ))}
                                </AnimatePresence>
                                
                                {/* Highlight Final Query Region */}
                                {step === maxSteps && finalQueryNode && (
                                     <motion.path
                                        d={`M ${finalQueryNode.bounds.map(p => `${getCoords(p).x},${getCoords(p).y}`).join(' L ')} Z`}
                                        fill={finalQueryNode.regionColor?.replace('0.15', '0.4').replace('0.2', '0.5')}
                                        stroke={finalQueryNode.regionColor?.replace(/, 0\.\d+\)/, ', 1)')}
                                        strokeWidth="2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    />
                                )}

                                {/* Dividing Lines */}
                                <AnimatePresence>
                                    {hyperplanes.slice(0, step).map((line, i) => (
                                        line && <motion.line
                                            key={line.id}
                                            x1={getCoords(line.p1).x} y1={getCoords(line.p1).y}
                                            x2={getCoords(line.p2).x} y2={getCoords(line.p2).y}
                                            stroke={'hsl(var(--foreground))'} strokeWidth="1.5"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    ))}
                                </AnimatePresence>
                                
                                {/* Data Points */}
                                {initialPoints.map((p) => {
                                    const { x, y } = getCoords(p);
                                    const currentSplit = step > 0 && step <= splitSequence.length ? splitSequence[step-1] : null;
                                    const isSplitPoint = currentSplit && (p.id === currentSplit.p1Id || p.id === currentSplit.p2Id);
                                    const isCandidate = step === maxSteps && finalQueryNode?.points.some(fp => fp.id === p.id);
                                    
                                    return (
                                        <g key={`point-group-${p.id}`} className="transition-opacity" style={{opacity: isSplitPoint ? 1 : 0.7}}>
                                             <motion.circle
                                                key={`point-${p.id}`}
                                                cx={x} cy={y} r={isSplitPoint || isCandidate ? 7 : 5}
                                                className={cn("stroke-muted-foreground/80", {
                                                    "fill-primary stroke-primary": isCandidate,
                                                    "fill-destructive stroke-destructive/80": isSplitPoint,
                                                    "fill-background": !isCandidate && !isSplitPoint,
                                                })}
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            />
                                            <text x={x + 10} y={y + 5} className="text-[11px] fill-foreground font-semibold pointer-events-none">{p.id}</text>
                                        </g>
                                    );
                                })}

                                {/* Query Point */}
                                {step >= splitSequence.length + 1 && (
                                     <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transform={`translate(${getCoords(queryPoint).x} ${getCoords(queryPoint).y})`}>
                                      <motion.path key="query-x-1" d="M-7 7 L7 -7" stroke="hsl(var(--accent-foreground))" strokeWidth={4} strokeLinecap="round" />
                                      <motion.path key="query-x-2" d="M-7 -7 L7 7" stroke="hsl(var(--accent-foreground))" strokeWidth={4} strokeLinecap="round" />
                                      <text x="12" y="6" className="fill-accent-foreground font-bold text-lg">X</text>
                                    </motion.g>
                                )}
                            </svg>
                        </div>
                         <div className="flex justify-between items-center">
                            <Button variant="outline" onClick={prevStep} disabled={step === 0}><ArrowLeft className="mr-2 h-4 w-4" />Previous</Button>
                            <span className="text-sm text-muted-foreground">Step {step} / {maxSteps}</span>
                            <Button variant="outline" onClick={nextStep} disabled={step >= maxSteps}>Next<ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </div>
                    </div>
                     <div className="lg:col-span-2 flex flex-col justify-between">
                         <div className="space-y-4">
                            <Alert className="min-h-[100px] flex flex-col">
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>What's Happening?</AlertTitle>
                                <AlertDescription className="flex-grow flex items-center">
                                    <AnimatePresence mode="wait">
                                        <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm leading-relaxed">
                                            {getStepDescription()}
                                        </motion.p>
                                    </AnimatePresence>
                                </AlertDescription>
                            </Alert>

                            {/* Binary Tree Visualization */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Partition Tree</CardTitle>
                                </CardHeader>
                                <CardContent className="font-mono text-xs scale-90 -ml-4 -mt-2" style={{ height: '220px'}}>
                                    <svg viewBox="0 0 250 150" className="w-full h-full">
                                        {/* Render Nodes and Edges */}
                                        {allNodes.filter(n => n.split && step >= splitSequence.findIndex(s => s.path === n.path) + 1).map(node => {
                                            const getPos = (path: string) => {
                                                 const level = path.length - 1;
                                                 let pos = 0;
                                                 if (path.length > 1) {
                                                     // Simplified positioning logic
                                                     const pathBits = path.substring(1).split('');
                                                     pos = pathBits.reduce((acc, val, idx) => acc + (val === 'R' ? 1 : -1) * (1 / Math.pow(2, idx + 1)), 0);
                                                 }

                                                const x = 125 + pos * 110;
                                                const y = 20 + level * 35;
                                                return {x, y};
                                            }
                                            
                                            const myPos = getPos(node.path);
                                            const isInQueryPath = queryPath.includes(node.path);
                                            
                                            return (
                                                <g key={`tree-node-${node.path}`}>
                                                  {node.children && <line x1={myPos.x} y1={myPos.y} x2={getPos(node.children.left.path).x} y2={getPos(node.children.left.path).y} stroke="hsl(var(--border))" />}
                                                  {node.children && <line x1={myPos.x} y1={myPos.y} x2={getPos(node.children.right.path).x} y2={getPos(node.children.right.path).y} stroke="hsl(var(--border))" />}

                                                  <rect x={myPos.x - 12} y={myPos.y-8} width="24" height="16" rx="4" fill={isInQueryPath ? "hsl(var(--primary))" : "hsl(var(--muted))"} stroke="hsl(var(--border))" />
                                                  <text x={myPos.x} y={myPos.y + 3} textAnchor="middle" fontSize="8" fill={isInQueryPath ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}>
                                                    ({node.split?.p1Id},{node.split?.p2Id})
                                                  </text>
                                                    
                                                  {/* Leaf Nodes */}
                                                  {step > splitSequence.length && !node.children && (
                                                     (allNodes.find(p => p.children?.left === node || p.children?.right === node)) &&
                                                      <g key={`leaf-${node.path}`}>
                                                        <rect x={myPos.x - 18} y={myPos.y-8} width="36" height="16" rx="4" fill={isInQueryPath ? "hsl(var(--primary))" : "hsl(var(--muted))"} stroke="hsl(var(--border))" />
                                                        <text x={myPos.x} y={myPos.y + 3} textAnchor="middle" fontSize="6" fill={isInQueryPath ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}>
                                                         {node.points.map(p=>p.id).join(',')}
                                                        </text>
                                                      </g>
                                                  )}
                                                </g>
                                            )
                                        })}
                                    </svg>
                                </CardContent>
                            </Card>
                             
                            {step === maxSteps && finalQueryNode && (
                                <motion.div initial={{opacity: 0, y:10}} animate={{opacity:1, y:0}}>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-lg"><CheckCircle className="text-green-500"/> Search Result</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">The query point is in the region containing points:</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {finalQueryNode.points.map(p => (
                                                <span key={p.id} className="font-bold text-lg text-primary bg-primary/10 px-3 py-1 rounded-md">{p.id}</span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                </motion.div>
                            )}

                         </div>
                        <Button onClick={reset} className="w-full mt-4"><RefreshCw className="mr-2 h-4 w-4" />Reset Simulation</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

    