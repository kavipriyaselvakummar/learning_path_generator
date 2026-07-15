"use client";

import { motion } from "framer-motion";
import { Target, BookOpen, Clock, ChevronRight, PlayCircle, Code } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="p-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-1 text-foreground">Good evening, Kavi!</h1>
        <p className="text-muted-foreground mb-8">Ready to continue your Machine Learning Engineer journey?</p>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 border-t border-t-primary/30">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-sm text-muted-foreground">Today's Progress</p>
                 <h2 className="text-2xl font-bold mt-1">2.5 hrs</h2>
               </div>
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Clock className="w-5 h-5 text-primary" />
               </div>
             </div>
             <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1 }} className="h-full aurora-gradient" />
             </div>
             <p className="text-xs text-muted-foreground mt-2">70% of daily goal</p>
          </div>

          <div className="glass-card p-6 border-t border-t-[#06b6d4]/30">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-sm text-muted-foreground">Current Goal</p>
                 <h2 className="text-lg font-semibold mt-1 leading-tight text-balance">Master Neural Networks</h2>
               </div>
               <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center">
                 <Target className="w-5 h-5 text-[#06b6d4]" />
               </div>
             </div>
             <p className="text-xs text-muted-foreground mt-4">Estimated completion: 2 weeks</p>
          </div>

          <div className="glass-card p-6 border-t border-t-[#9333ea]/30 glow-border">
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <p className="text-sm text-primary font-medium">Recommended Next</p>
                 <h2 className="text-lg font-semibold mt-1">Build CNN from scratch</h2>
               </div>
               <div className="w-10 h-10 rounded-lg bg-[#9333ea]/10 flex items-center justify-center">
                 <Code className="w-5 h-5 text-[#9333ea]" />
               </div>
             </div>
             <button className="w-full mt-2 py-2 bg-[#9333ea]/20 text-[#d8b4fe] rounded-lg text-sm font-medium flex justify-center items-center gap-2 hover:bg-[#9333ea]/30 transition-colors relative z-10">
               Start <PlayCircle className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Roadmap Preview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Roadmap Timeline</h2>
            <Link href="/dashboard/roadmap" className="text-sm flex items-center text-primary hover:underline">
              View full <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="glass-card p-6">
             <div className="relative border-l-2 border-border ml-3 space-y-8 py-2">
               
               {/* Timeline Item 1 */}
               <div className="relative pl-8">
                 <div className="absolute w-4 h-4 bg-primary rounded-full left-[-9px] top-1 shadow-[0_0_10px_#10b981]" />
                 <p className="text-xs text-primary font-medium mb-1">Month 3 - Current</p>
                 <div className="bg-secondary/40 rounded-xl p-4 border border-border hover:bg-secondary/60 transition-colors cursor-pointer">
                   <h3 className="font-semibold text-lg">Deep Learning Fundamentals</h3>
                   <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                     <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 4 Topics</span>
                     <span className="flex items-center gap-1"><Code className="w-4 h-4" /> 2 Projects</span>
                   </div>
                   <div className="mt-4 flex flex-wrap gap-2">
                     <span className="px-2 py-1 bg-background rounded text-xs">Neural Networks</span>
                     <span className="px-2 py-1 bg-background rounded text-xs">Backpropagation</span>
                     <span className="px-2 py-1 bg-background rounded text-xs">PyTorch</span>
                   </div>
                 </div>
               </div>

               {/* Timeline Item 2 */}
               <div className="relative pl-8 opacity-60">
                 <div className="absolute w-4 h-4 bg-secondary border-2 border-border rounded-full left-[-9px] top-1" />
                 <p className="text-xs text-muted-foreground font-medium mb-1">Month 4</p>
                 <div className="bg-background rounded-xl p-4 border border-border">
                   <h3 className="font-semibold">Computer Vision & CNNs</h3>
                   <p className="text-sm text-muted-foreground mt-1">Image classification, object detection...</p>
                 </div>
               </div>

             </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
