"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Target, Zap, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

interface SkillItem {
  subject: string;
  current: number;
  required: number;
  fullMark: number;
}

const careerSkillsMapping: Record<string, SkillItem[]> = {
  "Machine Learning Engineer": [
    { subject: "Python", current: 80, required: 95, fullMark: 100 },
    { subject: "SQL", current: 60, required: 85, fullMark: 100 },
    { subject: "Math/Stats", current: 40, required: 70, fullMark: 100 },
    { subject: "Machine Learning", current: 20, required: 90, fullMark: 100 },
    { subject: "Deep Learning", current: 10, required: 85, fullMark: 100 },
    { subject: "Deployment", current: 5, required: 70, fullMark: 100 },
  ],
  "Data Scientist": [
    { subject: "Python/R", current: 75, required: 90, fullMark: 100 },
    { subject: "SQL", current: 70, required: 85, fullMark: 100 },
    { subject: "Math/Stats", current: 50, required: 85, fullMark: 100 },
    { subject: "Machine Learning", current: 30, required: 80, fullMark: 100 },
    { subject: "Visualization", current: 65, required: 85, fullMark: 100 },
    { subject: "Communication", current: 80, required: 90, fullMark: 100 },
  ],
  "Full Stack Developer": [
    { subject: "HTML/CSS", current: 85, required: 95, fullMark: 100 },
    { subject: "JavaScript", current: 70, required: 95, fullMark: 100 },
    { subject: "React/Next.js", current: 50, required: 90, fullMark: 100 },
    { subject: "Node.js", current: 40, required: 85, fullMark: 100 },
    { subject: "Databases", current: 45, required: 80, fullMark: 100 },
    { subject: "DevOps", current: 15, required: 70, fullMark: 100 },
  ],
  "UI/UX Designer": [
    { subject: "Figma", current: 60, required: 95, fullMark: 100 },
    { subject: "Wireframing", current: 50, required: 90, fullMark: 100 },
    { subject: "User Research", current: 30, required: 80, fullMark: 100 },
    { subject: "Prototyping", current: 45, required: 85, fullMark: 100 },
    { subject: "Visual Design", current: 40, required: 90, fullMark: 100 },
    { subject: "Interaction Design", current: 20, required: 80, fullMark: 100 },
  ],
  "Investment Banker": [
    { subject: "Financial Modeling", current: 30, required: 95, fullMark: 100 },
    { subject: "Valuation", current: 20, required: 90, fullMark: 100 },
    { subject: "Excel", current: 65, required: 95, fullMark: 100 },
    { subject: "Accounting", current: 45, required: 85, fullMark: 100 },
    { subject: "Corporate Finance", current: 35, required: 90, fullMark: 100 },
    { subject: "M&A Strategy", current: 10, required: 80, fullMark: 100 },
  ],
  "Cybersecurity Analyst": [
    { subject: "Network Security", current: 40, required: 90, fullMark: 100 },
    { subject: "Linux Systems", current: 60, required: 85, fullMark: 100 },
    { subject: "Penetration Testing", current: 20, required: 80, fullMark: 100 },
    { subject: "Threat Intelligence", current: 15, required: 75, fullMark: 100 },
    { subject: "Cryptography", current: 30, required: 70, fullMark: 100 },
    { subject: "Incident Response", current: 25, required: 85, fullMark: 100 },
  ],
  "Clinical Research Director": [
    { subject: "Clinical Trials", current: 25, required: 95, fullMark: 100 },
    { subject: "FDA Regulations", current: 15, required: 90, fullMark: 100 },
    { subject: "Medical Writing", current: 45, required: 85, fullMark: 100 },
    { subject: "Protocol Design", current: 20, required: 85, fullMark: 100 },
    { subject: "Biostatistics", current: 30, required: 80, fullMark: 100 },
    { subject: "Team Leadership", current: 60, required: 90, fullMark: 100 },
  ],
  "Registered Nurse": [
    { subject: "Patient Care", current: 55, required: 95, fullMark: 100 },
    { subject: "Anatomy/Physiology", current: 70, required: 90, fullMark: 100 },
    { subject: "Pharmacology", current: 40, required: 85, fullMark: 100 },
    { subject: "Emergency Response", current: 30, required: 90, fullMark: 100 },
    { subject: "Diagnostics", current: 35, required: 80, fullMark: 100 },
    { subject: "Medical Records", current: 80, required: 90, fullMark: 100 },
  ],
  "Pharmacist": [
    { subject: "Pharmacology", current: 45, required: 95, fullMark: 100 },
    { subject: "Chemistry", current: 60, required: 85, fullMark: 100 },
    { subject: "Drug Dispensing", current: 30, required: 90, fullMark: 100 },
    { subject: "Patient Counseling", current: 50, required: 90, fullMark: 100 },
    { subject: "Pharmacy Law", current: 20, required: 85, fullMark: 100 },
    { subject: "Drug Interactions", current: 40, required: 95, fullMark: 100 },
  ],
  "Pediatrician": [
    { subject: "Pediatrics", current: 30, required: 95, fullMark: 100 },
    { subject: "Child Development", current: 40, required: 90, fullMark: 100 },
    { subject: "Diagnostics", current: 25, required: 90, fullMark: 100 },
    { subject: "Patient Care", current: 50, required: 95, fullMark: 100 },
    { subject: "Medical Ethics", current: 75, required: 90, fullMark: 100 },
    { subject: "Communication", current: 80, required: 95, fullMark: 100 },
  ],
  "Neurosurgeon": [
    { subject: "Neurosurgery", current: 15, required: 98, fullMark: 100 },
    { subject: "Advanced Anatomy", current: 50, required: 95, fullMark: 100 },
    { subject: "Surgical Skills", current: 20, required: 95, fullMark: 100 },
    { subject: "Critical Care", current: 35, required: 90, fullMark: 100 },
    { subject: "Pathology", current: 30, required: 85, fullMark: 100 },
    { subject: "Diagnostics", current: 40, required: 90, fullMark: 100 },
  ],
  "Anesthesiologist": [
    { subject: "Anesthesiology", current: 20, required: 95, fullMark: 100 },
    { subject: "Pharmacology", current: 45, required: 95, fullMark: 100 },
    { subject: "Physiology", current: 60, required: 90, fullMark: 100 },
    { subject: "Patient Monitoring", current: 30, required: 95, fullMark: 100 },
    { subject: "Pain Management", current: 25, required: 85, fullMark: 100 },
    { subject: "Critical Care", current: 35, required: 90, fullMark: 100 },
  ],
  "Biomedical Researcher": [
    { subject: "Cell Biology", current: 55, required: 90, fullMark: 100 },
    { subject: "Genetics", current: 40, required: 85, fullMark: 100 },
    { subject: "Lab Techniques", current: 65, required: 95, fullMark: 100 },
    { subject: "Biostatistics", current: 30, required: 80, fullMark: 100 },
    { subject: "Scientific Writing", current: 50, required: 85, fullMark: 100 },
    { subject: "Chemistry", current: 60, required: 85, fullMark: 100 },
  ],
  "Robotics Engineer": [
    { subject: "C++/Python", current: 70, required: 90, fullMark: 100 },
    { subject: "ROS Framework", current: 30, required: 85, fullMark: 100 },
    { subject: "Control Systems", current: 45, required: 80, fullMark: 100 },
    { subject: "Kinematics", current: 25, required: 85, fullMark: 100 },
    { subject: "Electronics", current: 50, required: 80, fullMark: 100 },
    { subject: "Computer Vision", current: 20, required: 75, fullMark: 100 },
  ],
  "Aerospace Engineer": [
    { subject: "Aerodynamics", current: 30, required: 90, fullMark: 100 },
    { subject: "Propulsion", current: 15, required: 85, fullMark: 100 },
    { subject: "Structural Analysis", current: 40, required: 85, fullMark: 100 },
    { subject: "CAD Modeling", current: 60, required: 90, fullMark: 100 },
    { subject: "Flight Dynamics", current: 25, required: 80, fullMark: 100 },
    { subject: "Systems Engineering", current: 35, required: 85, fullMark: 100 },
  ],
  "Biomedical Engineer": [
    { subject: "Physiology", current: 50, required: 85, fullMark: 100 },
    { subject: "Biomaterials", current: 30, required: 85, fullMark: 100 },
    { subject: "Biomechanics", current: 35, required: 80, fullMark: 100 },
    { subject: "CAD/Prototyping", current: 55, required: 90, fullMark: 100 },
    { subject: "Medical Devices", current: 25, required: 90, fullMark: 100 },
    { subject: "Signal Processing", current: 40, required: 80, fullMark: 100 },
  ],
  "Product Manager": [
    { subject: "Product Strategy", current: 35, required: 90, fullMark: 100 },
    { subject: "Agile/Scrum", current: 65, required: 85, fullMark: 100 },
    { subject: "User Analytics", current: 40, required: 80, fullMark: 100 },
    { subject: "Market Research", current: 50, required: 80, fullMark: 100 },
    { subject: "Communication", current: 75, required: 95, fullMark: 100 },
    { subject: "Roadmapping", current: 45, required: 85, fullMark: 100 },
  ],
  "Marketing Director": [
    { subject: "SEO/SEM", current: 60, required: 85, fullMark: 100 },
    { subject: "Content Strategy", current: 70, required: 90, fullMark: 100 },
    { subject: "Brand Management", current: 45, required: 90, fullMark: 100 },
    { subject: "Market Analytics", current: 35, required: 80, fullMark: 100 },
    { subject: "Budget Management", current: 50, required: 85, fullMark: 100 },
    { subject: "Social Media Campaigning", current: 80, required: 90, fullMark: 100 },
  ],
  "Operations Consultant": [
    { subject: "Process Mapping", current: 40, required: 90, fullMark: 100 },
    { subject: "Lean/Six Sigma", current: 25, required: 85, fullMark: 100 },
    { subject: "Supply Chain", current: 30, required: 80, fullMark: 100 },
    { subject: "Business Analytics", current: 50, required: 85, fullMark: 100 },
    { subject: "Project Management", current: 65, required: 90, fullMark: 100 },
    { subject: "Change Management", current: 55, required: 80, fullMark: 100 },
  ],
};

export default function SkillGapAnalysis() {
  const router = useRouter();
  const [career, setCareer] = useState<string>("Machine Learning Engineer");
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const active = localStorage.getItem("active_career") || "Machine Learning Engineer";
      setCareer(active);
      const mapped = careerSkillsMapping[active] || careerSkillsMapping["Machine Learning Engineer"];
      setSkills(mapped);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Calculate gaps
  const strengths = skills.filter((s) => s.current >= 60).sort((a, b) => b.current - a.current);
  const gaps = skills
    .filter((s) => s.required > s.current)
    .map((s) => ({
      subject: s.subject,
      gap: s.required - s.current,
    }))
    .sort((a, b) => b.gap - a.gap);

  const primaryGapSubject = gaps[0]?.subject || "core topics";

  return (
    <div className="p-6 max-w-6xl mx-auto pb-24 md:pb-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Compare your current skills with industry requirements for a <strong className="text-foreground">{career}</strong>.
        </p>
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
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" /> Required
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#06b6d4]" /> Current
              </div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Required" dataKey="required" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Radar name="Current" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ color: "#ededed" }}
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
            {strengths.length > 0 ? (
              <ul className="space-y-3">
                {strengths.map((s, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span>{s.subject}</span>
                    <span className="text-[#06b6d4] font-medium">{s.current}/100</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Keep learning to build strengths in this field!</p>
            )}
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
            {gaps.length > 0 ? (
              <ul className="space-y-3">
                {gaps.map((g, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span>{g.subject}</span>
                    <span className="text-[#ef4444] font-medium">-{g.gap} pts</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">You are matching or exceeding all requirements!</p>
            )}
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
              Focus on <strong className="text-foreground">{primaryGapSubject}</strong> next to bridge the largest gap before moving to other advanced topics.
            </p>
            <button
              onClick={() => router.push(`/dashboard/roadmap?career=${encodeURIComponent(career)}`)}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              Update Roadmap <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
