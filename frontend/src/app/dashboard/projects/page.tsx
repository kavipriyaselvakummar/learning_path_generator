"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, BookOpen, ExternalLink, Plus, FolderOpen, Award } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  career: string;
  tech: string[];
  difficulty: string;
  time: string;
  status: "not_started" | "in_progress" | "completed";
}

const careerProjectsMapping: Record<string, Omit<ProjectItem, "career">[]> = {
  "Machine Learning Engineer": [
    { id: "p1", title: "Matrix Operations Library from scratch", tech: ["Python", "NumPy"], difficulty: "Intermediate", time: "1 week", status: "not_started" },
    { id: "p2", title: "Global Sales EDA & Dashboard", tech: ["Pandas", "Plotly"], difficulty: "Intermediate", time: "2 weeks", status: "not_started" },
    { id: "p3", title: "House Price Predictor", tech: ["Scikit-Learn"], difficulty: "Beginner", time: "1 week", status: "not_started" }
  ],
  "Data Scientist": [
    { id: "p4", title: "Customer Churn Prediction Model", tech: ["R", "ggplot2", "RandomForest"], difficulty: "Intermediate", time: "2 weeks", status: "not_started" },
    { id: "p5", title: "Interactive Covid-19 Tracker", tech: ["Python", "Dash", "Plotly"], difficulty: "Beginner", time: "1 week", status: "not_started" },
    { id: "p6", title: "Financial Market Sentiment Analysis", tech: ["Python", "NLTK", "Scikit-Learn"], difficulty: "Hard", time: "3 weeks", status: "not_started" }
  ],
  "Full Stack Developer": [
    { id: "p7", title: "E-Commerce REST API & Storefront", tech: ["React", "Node.js", "Express", "MongoDB"], difficulty: "Hard", time: "3 weeks", status: "not_started" },
    { id: "p8", title: "Real-time Chat Application", tech: ["Next.js", "Socket.io", "TailwindCSS"], difficulty: "Intermediate", time: "2 weeks", status: "not_started" }
  ],
  "UI/UX Designer": [
    { id: "p9", title: "Redesigning a Local Delivery App", tech: ["Figma", "User Research", "Wireframing"], difficulty: "Intermediate", time: "2 weeks", status: "not_started" },
    { id: "p10", title: "High-Fidelity Smart Home Dashboard", tech: ["Prototyping", "Design System", "Figma"], difficulty: "Hard", time: "3 weeks", status: "not_started" }
  ]
};

export default function ProjectsPage() {
  const [career, setCareer] = useState("Machine Learning Engineer");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [customProjects, setCustomProjects] = useState<ProjectItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTech, setNewTech] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("Beginner");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const active = localStorage.getItem("active_career") || "Machine Learning Engineer";
      setCareer(active);
      
      // Load saved project statuses if any
      const savedStatus = localStorage.getItem(`projects_status_${active}`);
      const baseProjects = careerProjectsMapping[active] || careerProjectsMapping["Machine Learning Engineer"];
      
      const mapped: ProjectItem[] = baseProjects.map(p => ({
        ...p,
        career: active,
        status: savedStatus ? (JSON.parse(savedStatus)[p.id] || "not_started") : "not_started"
      }));
      setProjects(mapped);

      // Load custom projects
      const savedCustom = localStorage.getItem(`custom_projects_${active}`);
      if (savedCustom) {
        setCustomProjects(JSON.parse(savedCustom));
      }
    }
  }, []);

  const handleStatusChange = (id: string, isCustom: boolean, newStatus: ProjectItem["status"]) => {
    if (isCustom) {
      const updated = customProjects.map(p => p.id === id ? { ...p, status: newStatus } : p);
      setCustomProjects(updated);
      localStorage.setItem(`custom_projects_${career}`, JSON.stringify(updated));
    } else {
      const updated = projects.map(p => p.id === id ? { ...p, status: newStatus } : p);
      setProjects(updated);
      const statusMap = updated.reduce((acc, p) => ({ ...acc, [p.id]: p.status }), {});
      localStorage.setItem(`projects_status_${career}`, JSON.stringify(statusMap));
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProject: ProjectItem = {
      id: `custom_${Date.now()}`,
      title: newTitle,
      career: career,
      tech: newTech.split(",").map(t => t.trim()).filter(Boolean),
      difficulty: newDifficulty,
      time: "Self-paced",
      status: "not_started"
    };

    const updated = [...customProjects, newProject];
    setCustomProjects(updated);
    localStorage.setItem(`custom_projects_${career}`, JSON.stringify(updated));

    // Reset Form
    setNewTitle("");
    setNewTech("");
    setNewDifficulty("Beginner");
    setShowAddForm(false);
  };

  const allProjects = [...projects, ...customProjects];
  const completedCount = allProjects.filter(p => p.status === "completed").length;

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Milestone Projects</h1>
          <p className="text-muted-foreground mt-2">
            Build hands-on projects to validate your skills for <strong className="text-foreground">{career}</strong>.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Add Custom Project Form */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8 border border-primary/20">
          <h3 className="font-bold text-lg mb-4">Add Custom Project</h3>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Project Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Portfolio Website"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Technologies (comma separated)</label>
              <input
                type="text"
                value={newTech}
                onChange={e => setNewTech(e.target.value)}
                placeholder="e.g. Next.js, Prisma, PostgreSQL"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={e => setNewDifficulty(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm hover:bg-secondary/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/95"
              >
                Save Project
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Progress Metric */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-primary" />
          <div>
            <h4 className="font-bold text-foreground">Project Milestones</h4>
            <p className="text-xs text-muted-foreground">Complete projects to build your portfolio and earn career badges.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-primary">{completedCount} / {allProjects.length}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Completed</p>
        </div>
      </div>

      {/* Projects Grid */}
      {allProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allProjects.map((project) => {
            const isCustom = project.id.startsWith("custom_");
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      project.difficulty === "Hard" ? "bg-red-500/10 text-red-400" : project.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                    }`}>
                      {project.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">{project.time}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{project.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tech.map((t, idx) => (
                      <span key={idx} className="bg-secondary/50 text-[10px] text-muted-foreground px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4 flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.id, isCustom, e.target.value as ProjectItem["status"])}
                    className={`text-xs font-bold bg-secondary border border-border px-3 py-1.5 rounded-lg focus:outline-none ${
                      project.status === "completed" ? "text-primary bg-primary/10 border-primary/20" : project.status === "in_progress" ? "text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20" : "text-muted-foreground"
                    }`}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-secondary/10">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No projects for this career</h3>
          <p className="text-muted-foreground mt-1 text-sm">Add a custom project using the button above to get started!</p>
        </div>
      )}
    </div>
  );
}
