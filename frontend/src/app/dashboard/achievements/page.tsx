"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Lock, CheckCircle, Zap, ShieldAlert, Sparkles } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  criteria: string;
  unlocked: boolean;
  icon: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [career, setCareer] = useState("Machine Learning Engineer");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const active = localStorage.getItem("active_career") || "Machine Learning Engineer";
      setCareer(active);

      // Check roadmap progress
      const savedProgress = localStorage.getItem(`progress_${active}`);
      const progress = savedProgress ? JSON.parse(savedProgress) : {};
      const completedTopicsCount = Object.values(progress).filter(Boolean).length;

      // Check projects progress
      const savedProjects = localStorage.getItem(`projects_status_${active}`);
      const projects = savedProjects ? JSON.parse(savedProjects) : {};
      const completedProjectsCount = Object.values(projects).filter(status => status === "completed").length;
      
      const customProjects = localStorage.getItem(`custom_projects_${active}`);
      const parsedCustom = customProjects ? JSON.parse(customProjects) : [];
      const completedCustomProjectsCount = parsedCustom.filter((p: any) => p.status === "completed").length;
      const totalCompletedProjects = completedProjectsCount + completedCustomProjectsCount;

      const items: Achievement[] = [
        {
          id: "ach_1",
          title: "First Steps",
          description: "Created your first personalized AI learning path.",
          category: "Getting Started",
          criteria: "Generate any career roadmap",
          unlocked: true,
          icon: "🚀"
        },
        {
          id: "ach_2",
          title: "Consistency King",
          description: "Maintained a 5-day learning streak in your dashboard.",
          category: "Activity",
          criteria: "Study 5 days in a row",
          unlocked: true, // Sidebars default to 5-day streak
          icon: "🔥"
        },
        {
          id: "ach_3",
          title: "Topic Conqueror",
          description: "Completed your first study topic on the timeline.",
          category: "Learning",
          criteria: "Check at least 1 topic as completed",
          unlocked: completedTopicsCount > 0,
          icon: "📚"
        },
        {
          id: "ach_4",
          title: "Milestone Builder",
          description: "Completed a primary milestone project in your roadmap.",
          category: "Projects",
          criteria: "Mark 1 project as Completed",
          unlocked: totalCompletedProjects > 0,
          icon: "🛠️"
        },
        {
          id: "ach_5",
          title: "Career Graduate",
          description: "Fully mastered all the topics in your career roadmap.",
          category: "Graduate",
          criteria: "Complete all topics in your timeline",
          unlocked: completedTopicsCount >= 6 && completedTopicsCount > 0, // Mock condition: completes all topics
          icon: "🎓"
        }
      ];

      setAchievements(items);
    }
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Achievements & Badges</h1>
        <p className="text-muted-foreground mt-2">
          Earn badges by studying topics, finishing projects, and staying consistent in <strong className="text-foreground">{career}</strong>.
        </p>
      </div>

      {/* Progress Metric */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-t border-t-primary/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Unlocked Badges</p>
            <h2 className="text-3xl font-black text-primary mt-1">{unlockedCount} / {achievements.length}</h2>
          </div>
          <Award className="w-10 h-10 text-primary opacity-80" />
        </div>
        <div className="glass-card p-6 border-t border-t-[#06b6d4]/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Gamer Score</p>
            <h2 className="text-3xl font-black text-[#06b6d4] mt-1">{unlockedCount * 150} pts</h2>
          </div>
          <Zap className="w-10 h-10 text-[#06b6d4] opacity-80" />
        </div>
        <div className="glass-card p-6 border-t border-t-[#9333ea]/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Rank Status</p>
            <h2 className="text-lg font-black text-[#d8b4fe] mt-1 uppercase tracking-wide">
              {unlockedCount === achievements.length ? "Elite Guru" : unlockedCount >= 3 ? "Active Scholar" : "Novice Explorer"}
            </h2>
          </div>
          <Sparkles className="w-10 h-10 text-[#9333ea] opacity-80" />
        </div>
      </div>

      {/* Achievements list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((ach) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card p-5 relative overflow-hidden transition-all duration-300 flex gap-4 items-start ${
              ach.unlocked ? "border-primary/20 bg-primary/[0.02]" : "border-border opacity-70"
            }`}
          >
            {/* Visual Icon Badge */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg ${
              ach.unlocked 
                ? "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30" 
                : "bg-secondary border border-border text-muted-foreground grayscale"
            }`}>
              {ach.unlocked ? ach.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
            </div>

            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                ach.unlocked ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {ach.category}
              </span>
              <h3 className="font-bold text-base mt-2 text-foreground flex items-center gap-1.5">
                {ach.title}
                {ach.unlocked && <CheckCircle className="w-4 h-4 text-primary" />}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{ach.description}</p>
              <p className="text-[11px] text-muted-foreground/70 mt-3 border-t border-border/40 pt-2">
                <span className="font-semibold text-foreground/80">Requirement:</span> {ach.criteria}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
