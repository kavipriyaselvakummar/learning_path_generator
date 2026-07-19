"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield, Sliders, RefreshCw, CheckCircle, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security" | "danger">("profile");
  
  // Profile settings state
  const [name, setName] = useState("Kavi Priya");
  const [email, setEmail] = useState("kavipriya@example.com");
  const [planType, setPlanType] = useState("Free Plan");

  // Preferences state
  const [learningPace, setLearningPace] = useState("Medium (10-15 hrs/week)");
  const [skillLevel, setSkillLevel] = useState("Beginner");

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("user_name");
      const savedEmail = localStorage.getItem("user_email");
      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
      
      const pace = localStorage.getItem("learning_pace");
      const level = localStorage.getItem("skill_level");
      if (pace) setLearningPace(pace);
      if (level) setSkillLevel(level);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_email", email);
      }
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("learning_pace", learningPace);
        localStorage.setItem("skill_level", skillLevel);
      }
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleResetHistory = () => {
    if (confirm("Are you sure you want to reset all learning roadmaps, topic progress, and custom projects? This action is permanent.")) {
      if (typeof window !== "undefined") {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith("progress_") || key.startsWith("projects_status_") || key.startsWith("custom_projects_") || key === "active_career") {
            localStorage.removeItem(key);
          }
        });
        alert("Learning history reset successfully!");
        window.location.reload();
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account profile, preferences, and system settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full md:w-60 flex flex-row md:flex-col gap-2 overflow-x-auto pb-3 md:pb-0 scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === "profile" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-secondary/40"
            }`}
          >
            <User className="w-4 h-4" /> User Profile
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === "preferences" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-secondary/40"
            }`}
          >
            <Sliders className="w-4 h-4" /> Preferences
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
              activeTab === "security" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-secondary/40"
            }`}
          >
            <Shield className="w-4 h-4" /> Password & Security
          </button>
          <button
            onClick={() => setActiveTab("danger")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left text-red-400 whitespace-nowrap hover:bg-red-500/10 ${
              activeTab === "danger" ? "bg-red-500/10 border border-red-500/20" : ""
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Danger Zone
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 w-full glass-card p-6">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border/50 pb-3">User Profile</h3>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Current Plan</label>
                  <div className="flex justify-between items-center bg-secondary/50 rounded-xl p-4 border border-border/50">
                    <div>
                      <p className="font-bold text-foreground">{planType}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Access to basic roadmaps, flashcards and study paths.</p>
                    </div>
                    <button type="button" className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/30">
                      Upgrade
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  {saveSuccess && (
                    <span className="flex items-center gap-1.5 text-xs text-primary font-semibold mr-auto">
                      <CheckCircle className="w-4 h-4" /> Profile saved successfully!
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "preferences" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border/50 pb-3">Learning Preferences</h3>
              <form onSubmit={handleSavePreferences} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Weekly Commitment</label>
                  <select
                    value={learningPace}
                    onChange={e => setLearningPace(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  >
                    <option value="Slow (3-5 hrs/week)">Slow (3-5 hrs/week)</option>
                    <option value="Medium (10-15 hrs/week)">Medium (10-15 hrs/week)</option>
                    <option value="Fast (20+ hrs/week)">Fast (20+ hrs/week)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Experience Level</label>
                  <select
                    value={skillLevel}
                    onChange={e => setSkillLevel(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  >
                    <option value="Beginner">Beginner (Starting from scratch)</option>
                    <option value="Intermediate">Intermediate (Have some core basics)</option>
                    <option value="Advanced">Advanced (Want deep specialization)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  {saveSuccess && (
                    <span className="flex items-center gap-1.5 text-xs text-primary font-semibold mr-auto">
                      <CheckCircle className="w-4 h-4" /> Preferences saved!
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border/50 pb-3">Password & Security</h3>
              <form onSubmit={e => { e.preventDefault(); alert("Mock password updated!"); setCurrentPassword(""); setNewPassword(""); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "danger" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-xl font-bold mb-4 text-red-400 border-b border-red-500/20 pb-3">Danger Zone</h3>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <h4 className="font-bold text-red-200">Reset Learning Progress</h4>
                <p className="text-sm text-red-300/80 mt-1">
                  This will clear your currently generated career roadmaps, your study checklist history, and any customized milestone projects.
                </p>
                <button
                  onClick={handleResetHistory}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Reset All Progress
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
