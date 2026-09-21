"use client";

import { motion } from "framer-motion";
import { Target, BookOpen, Clock, ChevronRight, PlayCircle, Code } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardHome() {
  const { user } = useAuth();
  const [activeCareer, setActiveCareer] = useState("Machine Learning Engineer");
  const [roadmapPreview, setRoadmapPreview] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("User");
  const [recommendedNext, setRecommendedNext] = useState("Start your roadmap");
  const [analytics, setAnalytics] = useState({
    total_study_hours: 0,
    topics_completed: 0,
    current_streak: 0,
    sessions: 0
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("active_career");
      const active = saved || "Machine Learning Engineer";
      if (saved) setActiveCareer(saved);

      // Set display name from localStorage or auth context
      const storedName = localStorage.getItem("user_name");
      setDisplayName(storedName || user?.name || "User");
      
      // Read roadmap data and progress for active career
      const savedRoadmap = localStorage.getItem(`roadmap_data_${active}`);
      const savedProgress = localStorage.getItem(`progress_${active}`);
      const progress = savedProgress ? JSON.parse(savedProgress) : {};

      let completedCount = 0;
      let completedHours = 0;
      let totalTopics = 0;

      if (savedRoadmap) {
        const parsed = JSON.parse(savedRoadmap);
        setRoadmapPreview(parsed);

        let foundNext = false;
        for (const month of parsed) {
          for (const topic of (month.topics || [])) {
            totalTopics++;
            const isDone = Boolean(progress[topic.id] || progress[topic.name]);
            if (isDone) {
              completedCount++;
              completedHours += Number(topic.hours || topic.estimated_hours || 0);
            } else if (!foundNext) {
              setRecommendedNext(topic.name);
              foundNext = true;
            }
          }
        }

        if (!foundNext && completedCount > 0) {
          setRecommendedNext("All topics completed! 🎉");
        }
      }

      setAnalytics({
        total_study_hours: completedHours,
        topics_completed: completedCount,
        current_streak: completedCount > 0 ? 5 : 0,
        sessions: completedCount
      });
    }
  }, [user]);

  // Get dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-1 text-foreground">{getGreeting()}, {displayName.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mb-8">Ready to continue your {activeCareer} journey?</p>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 border-t border-t-primary/30">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-sm text-muted-foreground">Total Study Hours</p>
                 <h2 className="text-2xl font-bold mt-1">{analytics.total_study_hours.toFixed(1)} hrs</h2>
               </div>
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Clock className="w-5 h-5 text-primary" />
               </div>
             </div>
             <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full aurora-gradient" />
             </div>
             <p className="text-xs text-muted-foreground mt-2">{analytics.sessions} sessions completed</p>
          </div>

          <div className="glass-card p-6 border-t border-t-[#06b6d4]/30">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-sm text-muted-foreground">Topics Completed</p>
                 <h2 className="text-2xl font-bold mt-1">{analytics.topics_completed}</h2>
               </div>
               <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center">
                 <Target className="w-5 h-5 text-[#06b6d4]" />
               </div>
             </div>
             <p className="text-xs text-muted-foreground mt-4">Keep going!</p>
          </div>

          <div className="glass-card p-6 border-t border-t-[#9333ea]/30 glow-border">
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <p className="text-sm text-primary font-medium">Recommended Next</p>
                 <h2 className="text-lg font-semibold mt-1">{recommendedNext}</h2>
               </div>
               <div className="w-10 h-10 rounded-lg bg-[#9333ea]/10 flex items-center justify-center">
                 <Code className="w-5 h-5 text-[#9333ea]" />
               </div>
             </div>
             <Link href="/dashboard/roadmap">
               <button className="w-full mt-2 py-2 bg-[#9333ea]/20 text-[#d8b4fe] rounded-lg text-sm font-medium flex justify-center items-center gap-2 hover:bg-[#9333ea]/30 transition-colors relative z-10">
                 Start <PlayCircle className="w-4 h-4" />
               </button>
             </Link>
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
               
               {roadmapPreview.length > 0 ? roadmapPreview.slice(0, 2).map((month, index) => (
                 <div key={index} className={`relative pl-8 ${index > 0 ? "opacity-60" : ""}`}>
                   <div className={`absolute w-4 h-4 rounded-full left-[-9px] top-1 ${index === 0 ? "bg-primary shadow-[0_0_10px_#10b981]" : "bg-secondary border-2 border-border"}`} />
                   <p className={`text-xs font-medium mb-1 ${index === 0 ? "text-primary" : "text-muted-foreground"}`}>{month.month}</p>
                   <div className={`rounded-xl p-4 border border-border ${index === 0 ? "bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer" : "bg-background"}`}>
                     <h3 className="font-semibold text-lg">{month.title}</h3>
                     {index === 0 && (
                       <>
                         <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                           <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {month.topics?.length || 0} Topics</span>
                           <span className="flex items-center gap-1"><Code className="w-4 h-4" /> {month.projects?.length || 0} Projects</span>
                         </div>
                         <div className="mt-4 flex flex-wrap gap-2">
                           {month.topics?.slice(0, 3).map((topic: any, tIdx: number) => (
                             <span key={tIdx} className="px-2 py-1 bg-background rounded text-xs">{topic.name}</span>
                           ))}
                           {month.topics?.length > 3 && <span className="px-2 py-1 bg-background rounded text-xs">+{month.topics.length - 3} more</span>}
                         </div>
                       </>
                     )}
                     {index > 0 && (
                       <p className="text-sm text-muted-foreground mt-1">{month.topics?.slice(0, 2).map((t: any) => t.name).join(", ")}...</p>
                     )}
                   </div>
                 </div>
               )) : (
                 <div className="text-center py-6">
                   <p className="text-muted-foreground">No roadmap generated yet.</p>
                   <Link href="/dashboard/roadmap" className="inline-block mt-4 px-6 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30">
                     Generate Roadmap
                   </Link>
                 </div>
               )}

             </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
