// src/components/Hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import { BrainCircuit, GraduationCap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { FullScreenToggle } from "./FullScreenToggle";

export const Hero = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };
  
  return (
    <header className="relative bg-background py-20 text-center h-[90vh] flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <FullScreenToggle />
          <ThemeToggle />
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container relative mx-auto px-4">
        <div className="inline-flex items-center justify-center gap-4 mb-6">
            <BrainCircuit className="w-16 h-16 text-primary animate-bounce" />
            <GraduationCap className="w-16 h-16 text-primary animate-bounce [animation-delay:0.2s]" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground/80 mb-4">
          Interactive RAG Tutorial
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            An interactive guide to Retrieval-Augmented Generation.
            Presented by <a href="#" className="font-semibold text-primary hover:underline">IJAS A H</a>.
        </p>
        <div className="flex justify-center gap-4">
            <a href="#content" onClick={handleScroll}>
                <Button size="lg">Start Learning</Button>
            </a>
        </div>
      </div>
    </header>
  );
};
