"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BrainCircuit, LayoutDashboard, Map, Compass, 
  BarChart2, Code, Award, Settings, MessageSquare, 
  ChevronRight, Sparkles, X, Menu, Bell,
  User, Target, ArrowRight
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);

  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;
    const userMessage = chatMessage;
    setChatMessage("");
    
    const newHistory = [...chatHistory, { role: "user", text: userMessage }];
    setChatHistory(newHistory);
    setIsChatLoading(true);

    try {
        let token = "";
        if (typeof window !== 'undefined') {
            token = localStorage.getItem("token") || "";
        }
        
        const res = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ 
                message: userMessage, 
                history: chatHistory.map(h => ({ role: h.role, parts: h.text })) 
            })
        });
        
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setChatHistory([...newHistory, { role: "model", text: data.response }]);
    } catch (e) {
        console.error(e);
        setChatHistory([...newHistory, { role: "model", text: "Sorry, I couldn't process that request. Note: You may need to be logged in." }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const navItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Roadmaps", href: "/dashboard/roadmap", icon: Map },
    { name: "Career Explorer", href: "/dashboard/explore", icon: Compass },
    { name: "Skill Gap Analysis", href: "/dashboard/skill-gap", icon: Target },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart2 },
    { name: "Projects", href: "/dashboard/projects", icon: Code },
    { name: "Achievements", href: "/dashboard/achievements", icon: Award },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-16 glass-card z-50 flex items-center justify-between px-4 border-b border-border rounded-none">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <span className="font-bold">AIOS</span>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}>
             <MessageSquare className="w-5 h-5" />
           </button>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </div>

      {/* Left Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 glass-card border-r border-border rounded-none transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col pt-16 md:pt-0`}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border/50 hidden md:flex">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-border">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">AI<span className="text-primary">OS</span></span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-primary/10 text-primary glow-border" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Kavi Priya</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 relative overflow-y-auto overflow-x-hidden pt-16 md:pt-0 scroll-smooth ${isAiSidebarOpen ? "md:pr-80" : ""}`}>
         <div className="absolute top-0 right-0 p-4 hidden md:flex items-center gap-4 z-10">
           <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
             <Bell className="w-5 h-5 text-muted-foreground" />
           </button>
           <button 
             onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
             className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isAiSidebarOpen ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
           >
             <MessageSquare className="w-5 h-5" />
           </button>
         </div>
         {children}
      </main>

      {/* Right Sidebar - AI Assistant */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-80 glass-card border-l border-border rounded-none transition-transform duration-300 transform ${isAiSidebarOpen ? "translate-x-0" : "translate-x-full"} flex flex-col pt-16 md:pt-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
           <div className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-primary" />
             <span className="font-semibold">AI Assistant</span>
           </div>
           <button className="md:hidden" onClick={() => setIsAiSidebarOpen(false)}>
             <X className="w-5 h-5 text-muted-foreground" />
           </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
           {/* Context-aware content */}
           <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
             <p className="text-sm text-primary mb-2 font-medium">✨ Learning Streak</p>
             <p className="text-2xl font-bold">5 Days</p>
             <p className="text-xs text-muted-foreground mt-1">Keep it up! You're in the top 10%.</p>
           </div>
           
           <div className="bg-secondary/30 rounded-xl p-4">
             <p className="text-sm font-medium mb-3">Upcoming Tasks</p>
             <ul className="space-y-3 text-sm">
               <li className="flex items-start gap-2">
                 <div className="w-5 h-5 rounded border border-primary/50 flex-shrink-0 mt-0.5" />
                 <span className="text-muted-foreground">Complete "Intro to React" quiz</span>
               </li>
               <li className="flex items-start gap-2">
                 <div className="w-5 h-5 rounded border border-border flex-shrink-0 mt-0.5" />
                 <span className="text-muted-foreground">Review Machine Learning Chapter 2</span>
               </li>
             </ul>
           </div>
           
           <div className="flex-1 overflow-y-auto mb-4 space-y-3 custom-scrollbar flex flex-col justify-end min-h-[200px]">
             <div className="bg-secondary rounded-xl p-3 text-sm text-muted-foreground">
               Hello! I'm your AI mentor. Ask me anything about your current topic or career path.
             </div>
             {chatHistory.map((msg, i) => (
                <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary/20 text-foreground self-end ml-4' : 'bg-secondary text-muted-foreground mr-4'}`}>
                  {msg.text}
                </div>
             ))}
             {isChatLoading && (
                <div className="p-3 rounded-xl text-sm bg-secondary text-muted-foreground mr-4 animate-pulse">
                  Thinking...
                </div>
             )}
           </div>
           
           <div className="mt-auto relative">
             <input 
               type="text" 
               placeholder="Ask AI..."
               value={chatMessage}
               onChange={(e) => setChatMessage(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
               className="w-full bg-input/50 border border-border rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
             />
             <button 
               onClick={handleChatSubmit}
               disabled={isChatLoading}
               className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
             >
               <ArrowRight className="w-4 h-4" />
             </button>
           </div>
        </div>
      </aside>

    </div>
  );
}

