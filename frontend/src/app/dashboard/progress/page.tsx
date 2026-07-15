"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { BrainCircuit, Clock, Trophy, Flame } from "lucide-react";

const weeklyData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 1.5 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 2.5 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 3.5 },
];

const monthlyProgress = [
  { month: "Jan", progress: 20 },
  { month: "Feb", progress: 35 },
  { month: "Mar", progress: 50 },
  { month: "Apr", progress: 65 },
  { month: "May", progress: 85 },
];

export default function ProgressPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto pb-24 md:pb-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Progress Analytics</h1>
        <p className="text-muted-foreground mt-2">Track your learning journey, habits, and AI productivity score.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card p-6 border-b-2 border-b-primary">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hours Studied</p>
                <h3 className="text-3xl font-bold">42<span className="text-lg text-muted-foreground font-normal">.5h</span></h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Clock className="w-5 h-5" /></div>
            </div>
         </motion.div>
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="glass-card p-6 border-b-2 border-b-[#f59e0b]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Learning Streak</p>
                <h3 className="text-3xl font-bold">12<span className="text-lg text-muted-foreground font-normal"> Days</span></h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]"><Flame className="w-5 h-5" /></div>
            </div>
         </motion.div>
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="glass-card p-6 border-b-2 border-b-[#06b6d4]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Topics Completed</p>
                <h3 className="text-3xl font-bold">18</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center text-[#06b6d4]"><Trophy className="w-5 h-5" /></div>
            </div>
         </motion.div>
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="glass-card p-6 border-b-2 border-b-[#9333ea] glow-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea]/10 to-transparent -z-10" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">AI Productivity <BrainCircuit className="w-3 h-3 text-[#9333ea]" /></p>
                <h3 className="text-3xl font-bold text-[#d8b4fe]">94<span className="text-lg text-muted-foreground font-normal">/100</span></h3>
              </div>
            </div>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Weekly Learning Chart */}
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-6">Weekly Learning Hours</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </motion.div>

         {/* Monthly Progress Chart */}
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-6">Roadmap Completion</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="progress" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </motion.div>
      </div>
    </div>
  );
}
