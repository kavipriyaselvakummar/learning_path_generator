"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BrainCircuit, LineChart, Target, Compass, Sparkles, Code, User, Settings, Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI<span className="text-primary">OS</span></span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth?mode=login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/auth?mode=signup" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Background Particles (Simulated) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9333ea]/20 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powered by Next-Gen AI & RAG</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Your AI Mentor for <br className="hidden md:block" />
            <span className="aurora-text">Every Career.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            Generate highly personalized roadmaps, track your progress, and get instant answers tailored to your specific goals and skills.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/dashboard/roadmap" className="glow-border inline-block">
              <button className="px-8 py-4 bg-card text-foreground rounded-xl font-medium flex items-center gap-2 w-full justify-center hover:bg-card/80 transition-colors">
                Generate Roadmap <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/dashboard/explore" className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-medium flex items-center gap-2 justify-center hover:bg-secondary/80 transition-colors">
              Explore Careers <Compass className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Futuristic Floating UI Demo Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-6 md:p-8 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-6">
                   <div className="flex items-center gap-4 border-b border-border pb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9333ea] to-primary flex items-center justify-center">
                        <Code className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Machine Learning Engineer</h3>
                        <p className="text-sm text-muted-foreground">Month 3 • Neural Networks</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "65%" }} transition={{ duration: 1.5 }} className="h-full aurora-gradient" />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                   </div>
                </div>
                <div className="glass-card p-4 flex flex-col gap-4">
                  <div className="text-sm font-medium flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Up Next</div>
                  <div className="text-sm">Build a CNN from scratch</div>
                  <div className="text-xs text-muted-foreground">Estimated: 15 hours</div>
                  <button className="mt-auto w-full py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-colors">Start Learning</button>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">A complete OS for your learning</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to master a new skill, in one beautifully designed workspace.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: "AI Generated Roadmaps", desc: "Dynamic paths that adapt to your pace and goals." },
              { icon: BrainCircuit, title: "Knowledge Base (RAG)", desc: "Answers sourced from verified PDFs and documentation." },
              { icon: LineChart, title: "Progress Tracking", desc: "Beautiful analytics to keep you motivated." },
              { icon: Code, title: "Project Recommender", desc: "Curated projects with GitHub templates and difficulty." },
              { icon: Target, title: "Skill Gap Analysis", desc: "Radar charts showing your exact missing skills." },
              { icon: Compass, title: "Career Explorer", desc: "Hundreds of career profiles with salary and scopes." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-6 hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">AIOS</span>
          </div>
          <p>© 2026 AI OS Learning. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
