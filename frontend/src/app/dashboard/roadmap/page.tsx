"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, CheckCircle2, FileText, BrainCircuit, MessageSquare,
  BookOpen, Clock, Code, Library, Sparkles, X, ChevronLeft, ChevronRight, RotateCcw, Loader2
} from "lucide-react";

// ---- Types ----
interface Topic { id: string; name: string; hours?: number; estimated_hours?: number; difficulty: string; }
interface Project { id: string; title: string; time?: string; estimated_time?: string; difficulty: string; tech?: string[]; technologies?: string[]; }
interface Resource { id: string; title: string; type: string; url?: string; }
interface MonthData { month: number; title?: string; topics: Topic[]; projects: Project[]; resources: Resource[]; status?: string; }

// ---- Helpers ----
async function callApi(endpoint: string, body: object) {
  const res = await fetch(`http://localhost:8000${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || `API error ${res.status}`);
  return data;
}

// ---- Quiz Modal ----
function QuizModal({ data, onClose }: { data: any; onClose: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const questions = data?.questions || [];
  const q = questions[currentQ];
  if (!q) return <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="bg-card p-8 rounded-2xl border border-border text-center"><p>No quiz data available.</p><button onClick={onClose} className="mt-4 px-4 py-2 bg-secondary rounded-lg text-sm">Close</button></div></div>;

  const optionLabels = ["A", "B", "C", "D"];
  const isRevealed = revealed[currentQ];
  const userAnswer = selected[currentQ];
  const isCorrect = userAnswer === q.answer;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">Quiz: {data?.topic}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Object.values(revealed).filter(Boolean).length} answered</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5 mb-6">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
          <p className="font-semibold text-base mb-6 leading-relaxed">{q.question}</p>
          <div className="space-y-3 mb-6">
            {(q.options || []).map((opt: string, i: number) => {
              const label = optionLabels[i];
              const isSelected = userAnswer === label;
              const isAnswer = label === q.answer;
              let cls = "border border-border bg-secondary/30 hover:bg-secondary/60";
              if (isRevealed) {
                if (isAnswer) cls = "border-2 border-primary bg-primary/10 text-primary font-semibold";
                else if (isSelected) cls = "border-2 border-red-500 bg-red-500/10 text-red-400";
                else cls = "border border-border bg-secondary/10 opacity-50";
              } else if (isSelected) cls = "border-2 border-primary bg-primary/10 text-primary";
              return (
                <button key={i} disabled={isRevealed} onClick={() => setSelected(p => ({ ...p, [currentQ]: label }))}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${cls}`}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">{label}</span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
          {!isRevealed ? (
            <button disabled={!userAnswer} onClick={() => setRevealed(p => ({ ...p, [currentQ]: true }))}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-40">
              Check Answer
            </button>
          ) : (
            <div className={`p-4 rounded-xl border ${isCorrect ? "border-primary/40 bg-primary/10" : "border-red-500/40 bg-red-500/10"}`}>
              <p className={`font-semibold mb-1 ${isCorrect ? "text-primary" : "text-red-400"}`}>
                {isCorrect ? "✓ Correct!" : `✗ Incorrect — Answer: ${q.answer}`}
              </p>
              <p className="text-sm text-muted-foreground">{q.explanation}</p>
            </div>
          )}
          <div className="flex justify-between mt-6">
            <button disabled={currentQ === 0} onClick={() => setCurrentQ(c => c - 1)}
              className="flex items-center gap-1 px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button disabled={currentQ === questions.length - 1} onClick={() => setCurrentQ(c => c + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 disabled:opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Flashcard Modal ----
function FlashcardModal({ data, onClose }: { data: any; onClose: () => void }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = data?.flashcards || [];
  const card = cards[currentCard];
  if (!card) return <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="bg-card p-8 rounded-2xl border border-border text-center"><p>No flashcard data available.</p><button onClick={onClose} className="mt-4 px-4 py-2 bg-secondary rounded-lg text-sm">Close</button></div></div>;

  const goNext = () => { setCurrentCard(c => c + 1); setFlipped(false); };
  const goPrev = () => { setCurrentCard(c => c - 1); setFlipped(false); };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#9333ea]" />
            <span className="font-bold text-lg">Flashcards: {data?.topic}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <span>Card {currentCard + 1} of {cards.length}</span>
            <span className="text-xs bg-secondary px-2 py-0.5 rounded">Tap card to flip</span>
          </div>
          <div className="relative cursor-pointer" style={{ perspective: "1200px", height: "220px" }} onClick={() => setFlipped(f => !f)}>
            <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5 }}
              style={{ transformStyle: "preserve-3d", width: "100%", height: "100%", position: "relative" }}>
              <div style={{ backfaceVisibility: "hidden", position: "absolute", width: "100%", height: "100%" }}
                className="bg-gradient-to-br from-[#9333ea]/20 to-[#06b6d4]/20 border border-[#9333ea]/40 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <p className="text-xs font-semibold text-[#9333ea] uppercase tracking-wider mb-4">Concept</p>
                <p className="text-xl font-bold">{card.front}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground"><RotateCcw className="w-3 h-3" /> tap to reveal answer</div>
              </div>
              <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", width: "100%", height: "100%" }}
                className="bg-gradient-to-br from-primary/20 to-[#10b981]/20 border border-primary/40 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">Answer</p>
                <p className="text-base text-muted-foreground leading-relaxed">{card.back}</p>
              </div>
            </motion.div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <button disabled={currentCard === 0} onClick={goPrev}
              className="flex items-center gap-1 px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex gap-1.5">
              {cards.map((_: any, i: number) => (
                <button key={i} onClick={() => { setCurrentCard(i); setFlipped(false); }}
                  className={`h-2 rounded-full transition-all ${i === currentCard ? "bg-primary w-5" : "bg-secondary w-2"}`} />
              ))}
            </div>
            <button disabled={currentCard === cards.length - 1} onClick={goNext}
              className="flex items-center gap-1 px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 disabled:opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Chat Modal ----
function ChatModal({ data, topic, onClose }: { data: string; topic: string; onClose: () => void }) {
  const formatMarkdown = (text: string) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i} className="text-base font-bold text-primary mt-4 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold mt-5 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold mt-6 mb-2">{line.slice(2)}</h1>;
      if (line.match(/^\*\*(.+)\*\*$/)) return <p key={i} className="font-semibold text-foreground mt-3">{line.replace(/\*\*/g, "")}</p>;
      if (line.startsWith("* ") || line.startsWith("- ")) return (
        <li key={i} className="flex gap-2 items-start text-sm text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: line.replace(/^(\*|-)\s/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
        </li>
      );
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-sm text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />;
    });

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#06b6d4]" />
            <span className="font-bold text-lg truncate">AI Explains: {topic}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors flex-shrink-0"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-1">{formatMarkdown(data)}</div>
      </motion.div>
    </div>
  );
}

// ---- Error Toast ----
function ErrorToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 bg-red-900/80 border border-red-500/50 text-red-200 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-sm backdrop-blur-sm">
      <span className="text-sm">{message}</span>
      <button onClick={onClose}><X className="w-4 h-4" /></button>
    </motion.div>
  );
}

// ---- Static fallback roadmap ----
const staticRoadmap: MonthData[] = [
  {
    month: 1, title: "Foundations", status: "in_progress",
    topics: [
      { id: "t1", name: "Core Concepts & Theory", hours: 15, difficulty: "Beginner" },
      { id: "t2", name: "Tools & Environment Setup", hours: 10, difficulty: "Beginner" },
    ],
    projects: [{ id: "p1", title: "Starter Project", time: "1 week", difficulty: "Beginner", tech: ["Python"] }],
    resources: [{ id: "r1", title: "Official Documentation", type: "Website" }]
  },
  {
    month: 2, title: "Core Skills", status: "locked",
    topics: [
      { id: "t3", name: "Intermediate Techniques", hours: 20, difficulty: "Intermediate" },
      { id: "t4", name: "Practical Application", hours: 25, difficulty: "Intermediate" },
    ],
    projects: [{ id: "p2", title: "Portfolio Project", time: "2 weeks", difficulty: "Intermediate", tech: ["Python", "APIs"] }],
    resources: [{ id: "r2", title: "Online Course", type: "Course" }]
  },
];

// ---- Main Page (inner) ----
function RoadmapPageInner() {
  const searchParams = useSearchParams();
  const careerParam = searchParams.get("career") || "Machine Learning Engineer";

  const [roadmapData, setRoadmapData] = useState<MonthData[]>([]);
  const [careerTitle, setCareerTitle] = useState(careerParam);
  const [isGenerating, setIsGenerating] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(1);
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{ type: "quiz" | "flashcards" | "chat"; data: any; topic: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  // Load progress
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProgress = localStorage.getItem(`progress_${careerParam}`);
      if (savedProgress) {
        setCompletedTopics(JSON.parse(savedProgress));
      } else {
        setCompletedTopics({});
      }
    }
  }, [careerParam]);

  const toggleTopicCompletion = (topicId: string) => {
    setCompletedTopics((prev) => {
      const updated = { ...prev, [topicId]: !prev[topicId] };
      if (typeof window !== "undefined") {
        localStorage.setItem(`progress_${careerParam}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Generate roadmap on mount / career change
  useEffect(() => {
    setCareerTitle(careerParam);
    if (typeof window !== "undefined") {
      localStorage.setItem("active_career", careerParam);
    }
    setIsGenerating(true);
    setRoadmapData([]);
    setExpandedMonth(1);

    callApi("/generate-path-preview", { goal: careerParam, skills: "Beginner", duration: "3 months" })
      .then((data) => {
        const months = (data?.months || data?.roadmap?.months || []) as MonthData[];
        if (months.length > 0) setRoadmapData(months);
        else setRoadmapData(staticRoadmap);
      })
      .catch(() => {
        // Fallback to static
        setRoadmapData(staticRoadmap);
      })
      .finally(() => setIsGenerating(false));
  }, [careerParam]);

  const handleAction = async (topicName: string, actionType: "quiz" | "flashcards" | "chat") => {
    setLoadingTopic(topicName + actionType);
    try {
      let endpoint = "/quiz";
      if (actionType === "flashcards") endpoint = "/flashcards";
      if (actionType === "chat") endpoint = "/chat";

      const body = actionType === "chat"
        ? { message: `Explain "${topicName}" clearly with key concepts, examples and why it matters for ${careerTitle}.`, history: [] }
        : { topic: topicName };

      const data = await callApi(endpoint, body);
      setModalContent({ type: actionType, data: actionType === "chat" ? data.response : data, topic: topicName });
    } catch (e: any) {
      setErrorMsg(e?.message || "Failed to generate content. Make sure the backend is running.");
    } finally {
      setLoadingTopic(null);
    }
  };

  const getMonthStatus = (month: MonthData, index: number) => {
    const monthTopics = month.topics || [];
    if (monthTopics.length === 0) return "not_started";
    const completedCount = monthTopics.filter(t => completedTopics[t.id || t.name]).length;
    if (completedCount === 0) return "not_started";
    if (completedCount === monthTopics.length) return "completed";
    return "in_progress";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 glow-border">
            <Sparkles className="w-3 h-3" /> AI Generated Path
          </motion.div>
          <h1 className="text-3xl font-bold">{careerTitle}</h1>
          <p className="text-muted-foreground mt-2">
            {isGenerating ? "Generating your personalized roadmap..." : `${roadmapData.length} Months • AI-curated curriculum`}
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Export as PDF
        </button>
        <style>{`
          @media print {
            aside, header, nav, button, .inline-flex, .bg-secondary, .flex-shrink-0 {
              display: none !important;
            }
            body, html, main, .glass-card, .bg-background {
              background: white !important;
              color: black !important;
              box-shadow: none !important;
              border: none !important;
            }
            .glass-card {
              border: 1px solid #e4e4e7 !important;
              margin-bottom: 1.5rem !important;
            }
            .text-muted-foreground, .text-xs {
              color: #71717a !important;
            }
            main {
              padding-right: 0 !important;
              margin: 0 auto !important;
              max-width: 100% !important;
            }
          }
        `}</style>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Generating roadmap for <strong className="text-foreground">{careerTitle}</strong>...</p>
        </div>
      )}

      {/* Roadmap */}
      {!isGenerating && (
        <div className="relative">
          <div className="absolute left-[27px] top-4 bottom-0 w-1 bg-border rounded-full" />
          <div className="absolute left-[27px] top-4 h-1/3 w-1 bg-primary rounded-full aurora-gradient shadow-[0_0_15px_#10b981]" />

          <div className="space-y-12">
            {roadmapData.map((month, index) => {
              const isExpanded = expandedMonth === month.month;
              const status = getMonthStatus(month, index);
              const isCompleted = status === "completed";
              const isInProgress = status === "in_progress";
              const monthTitle = month.title || `Month ${month.month}`;

              // Normalize topic hours
              const topics = (month.topics || []).map(t => ({ ...t, hours: t.hours || t.estimated_hours || 0 }));
              const projects = (month.projects || []).map(p => ({
                ...p, time: p.time || p.estimated_time || "N/A",
                tech: p.tech || p.technologies || []
              }));

              return (
                <motion.div key={month.month || index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }} className="relative pl-16">

                  <div className={`absolute left-[16px] top-2 w-6 h-6 rounded-full border-4 border-background z-10 transition-colors ${
                    isCompleted ? "bg-primary" : isInProgress ? "bg-[#06b6d4] shadow-[0_0_15px_#06b6d4]" : status === "not_started" ? "bg-yellow-500/20 border-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.3)]" : "bg-muted-foreground"
                   }`} />

                  <div className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isInProgress ? "glow-border ring-1 ring-[#06b6d4]/50" : ""}`}>
                    <div onClick={() => setExpandedMonth(isExpanded ? null : month.month)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                      <div>
                        <p className={`text-sm font-semibold mb-1 ${isCompleted ? "text-primary" : isInProgress ? "text-[#06b6d4]" : "text-yellow-500/80"}`}>
                          Month {month.month} • {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Not Started"}
                        </p>
                        <h3 className="text-xl font-bold">{monthTitle}</h3>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="border-t border-border bg-black/20">
                          <div className="p-5 space-y-8">

                            {/* Topics */}
                            {topics.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
                                  <BookOpen className="w-4 h-4" /> Core Topics
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {topics.map((topic, ti) => (
                                    <div key={topic.id || ti} className="bg-background rounded-xl p-4 border border-border flex flex-col hover:border-primary/50 transition-colors group">
                                      <div className="flex justify-between items-start mb-2">
                                         <span className="font-medium text-sm group-hover:text-primary transition-colors">{topic.name}</span>
                                         <button 
                                           onClick={() => toggleTopicCompletion(topic.id || topic.name)}
                                           className={`transition-colors ${completedTopics[topic.id || topic.name] ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                                         >
                                           <CheckCircle2 className="w-4 h-4" />
                                         </button>
                                      </div>
                                      <div className="mt-auto flex justify-between text-xs text-muted-foreground">
                                        {topic.hours > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.hours}h</span>}
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ml-auto ${topic.difficulty === "Hard" ? "bg-red-500/20 text-red-400" : topic.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                                          {topic.difficulty}
                                        </span>
                                      </div>
                                      <div className="mt-4 pt-3 border-t border-border/50 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                        <button onClick={() => handleAction(topic.name, "quiz")} disabled={!!loadingTopic}
                                          className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-secondary text-xs flex items-center gap-1.5 hover:bg-primary/20 hover:text-primary transition-colors disabled:opacity-50 font-medium">
                                          {loadingTopic === topic.name + "quiz" ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                                          {loadingTopic === topic.name + "quiz" ? "Generating..." : "Quiz"}
                                        </button>
                                        <button onClick={() => handleAction(topic.name, "flashcards")} disabled={!!loadingTopic}
                                          className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-secondary text-xs flex items-center gap-1.5 hover:bg-[#9333ea]/20 hover:text-[#d8b4fe] transition-colors disabled:opacity-50 font-medium">
                                          {loadingTopic === topic.name + "flashcards" ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                                          {loadingTopic === topic.name + "flashcards" ? "Generating..." : "Flashcards"}
                                        </button>
                                        <button onClick={() => handleAction(topic.name, "chat")} disabled={!!loadingTopic}
                                          className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-secondary text-xs flex items-center gap-1.5 hover:bg-[#06b6d4]/20 hover:text-[#67e8f9] transition-colors disabled:opacity-50 font-medium">
                                          {loadingTopic === topic.name + "chat" ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquare className="w-3 h-3" />}
                                          {loadingTopic === topic.name + "chat" ? "Thinking..." : "Ask AI"}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Projects */}
                            {projects.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
                                  <Code className="w-4 h-4" /> Milestone Projects
                                </h4>
                                <div className="space-y-3">
                                  {projects.map((project, pi) => (
                                    <div key={project.id || pi} className="bg-background rounded-xl p-4 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                                      <div>
                                        <h5 className="font-semibold text-sm">{project.title}</h5>
                                        {project.tech.length > 0 && (
                                          <div className="flex gap-2 mt-2 flex-wrap">
                                            {project.tech.map((tech: string) => (
                                              <span key={tech} className="px-2 py-0.5 rounded-md bg-secondary text-[10px] uppercase font-semibold">{tech}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                                        <span>{project.time}</span>
                                        <button onClick={() => handleAction(project.title, "chat")} disabled={!!loadingTopic}
                                          className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center gap-1">
                                          {loadingTopic === project.title + "chat" ? <><Loader2 className="w-3 h-3 animate-spin" /> Loading...</> : "View Details"}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Resources */}
                            {(month.resources || []).length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
                                  <Library className="w-4 h-4" /> Recommended Resources
                                </h4>
                                <ul className="space-y-2">
                                  {(month.resources || []).map((res, ri) => (
                                    <li key={res.id || ri} className="flex items-center gap-2 text-sm">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                      <a href={res.url || "#"} target="_blank" rel="noreferrer"
                                        className="hover:text-primary transition-colors hover:underline">{res.title}</a>
                                      <span className="text-xs text-muted-foreground ml-auto bg-secondary px-2 py-0.5 rounded">{res.type}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modalContent?.type === "quiz" && <QuizModal data={modalContent.data} onClose={() => setModalContent(null)} />}
        {modalContent?.type === "flashcards" && <FlashcardModal data={modalContent.data} onClose={() => setModalContent(null)} />}
        {modalContent?.type === "chat" && <ChatModal data={modalContent.data} topic={modalContent.topic} onClose={() => setModalContent(null)} />}
        {errorMsg && <ErrorToast message={errorMsg} onClose={() => setErrorMsg(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ---- Exported Page with Suspense ----
export default function RoadmapPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <RoadmapPageInner />
    </Suspense>
  );
}
