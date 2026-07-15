"use client";

import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Target, Zap, AlertTriangle, ArrowRight, BrainCircuit } from "lucide-react";

const skillData = [
  { subject: "Python", current: 80, required: 90, fullMark: 100 },
  { subject: "SQL", current: 60, required: 85, fullMark: 100 },
  { subject: "Math/Stats", current: 40, required: 70, fullMark: 100 },
  { scubject: "Machine Learning", current: 20, required: 80, fullMark: 100 },
  { subject: "Deep Learning", current: 10, required: 75, fullMark: 100 },
  { subject: "Deployment", current: 5, required: 60, fullMark: 100 },
];

export default function SkillGapAnalysis() {
  return (
    <div className="p-6 max-w-6xl mx-auto pb-24 md:pb-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
        <p className="text-muted-foreground mt-2">Compare your current skills with industry requirements for a Machine Learning Engineer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 glass-card p-6 flex flex-col glow-border"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Skill Radar</h2>
            <div className="flex gap-4 text-xs font-medium">
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-primary" /> Required</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#06b6d4]" /> Current</div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Required" dataKey="required" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Radar name="Current" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                  itemStyle={{ color: '#ededed' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Analysis Section */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 border-t-2 border-t-[#06b6d4]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#06b6d4]" />
              <h3 className="font-semibold text-lg">Strengths</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span>Python</span>
                <span className="text-[#06b6d4] font-medium">80/100</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>SQL</span>
                <span className="text-[#06b6d4] font-medium">60/100</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6 border-t-2 border-t-[#ef4444]"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
              <h3 className="font-semibold text-lg">Critical Gaps</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span>Deep Learning</span>
                <span className="text-[#ef4444] font-medium">-65 pts</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>Machine Learning</span>
                <span className="text-[#ef4444] font-medium">-60 pts</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>Deployment</span>
                <span className="text-[#ef4444] font-medium">-55 pts</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-primary/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10" />
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg text-primary">Learning Priority</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Focus on <strong className="text-foreground">Machine Learning algorithms</strong> next to bridge the largest gap before moving to Deep Learning.
            </p>
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
               Update Roadmap <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
