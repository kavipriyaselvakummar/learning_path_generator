"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, Briefcase, DollarSign, TrendingUp, ChevronRight, Star } from "lucide-react";

const mockCareers = [
  { id: 1, title: "Machine Learning Engineer", category: "Technology", salary: "$130k - $180k", demand: "High", icon: "🧠" },
  { id: 2, title: "Data Scientist", category: "Technology", salary: "$110k - $160k", demand: "High", icon: "📊" },
  { id: 3, title: "Full Stack Developer", category: "Technology", salary: "$100k - $150k", demand: "Very High", icon: "💻" },
  { id: 4, title: "UI/UX Designer", category: "Design", salary: "$90k - $140k", demand: "Medium", icon: "🎨" },
  { id: 5, title: "Investment Banker", category: "Finance", salary: "$150k - $250k+", demand: "Medium", icon: "📈" },
  { id: 6, title: "Cybersecurity Analyst", category: "Technology", salary: "$100k - $160k", demand: "High", icon: "🔒" },
];

const categories = ["All", "Technology", "Design", "Finance", "Healthcare", "Engineering", "Business"];

export default function CareerExplorer() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCareers = mockCareers.filter(career => {
    const matchesCategory = activeCategory === "All" || career.category === activeCategory;
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto pb-24 md:pb-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Career Explorer</h1>
        <p className="text-muted-foreground mt-2">Discover and explore hundreds of career paths. Let AI build your roadmap for any of them.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search careers (e.g. Software Engineer, Doctor, CA...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card/50 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary text-sm backdrop-blur-sm"
          />
        </div>
        <button className="px-4 py-3 bg-card border border-border rounded-xl flex items-center gap-2 hover:bg-secondary/50 transition-colors text-sm">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            key={career.id}
            onClick={() => router.push(`/dashboard/roadmap?career=${encodeURIComponent(career.title)}`)}
            className="glass-card p-6 flex flex-col group cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-colors">
                {career.icon}
              </div>
              <button className="text-muted-foreground hover:text-[#fbbf24] transition-colors">
                <Star className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{career.title}</h3>
            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded inline-block w-fit mb-4">
              {career.category}
            </span>
            
            <div className="space-y-2 mt-auto">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground"><DollarSign className="w-4 h-4" /> Avg. Salary</span>
                <span className="font-medium">{career.salary}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground"><TrendingUp className="w-4 h-4" /> Demand</span>
                <span className="font-medium text-primary">{career.demand}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-sm font-medium text-primary">View Details</span>
               <ChevronRight className="w-4 h-4 text-primary" />
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <div className="text-center py-20">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No careers found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          <button className="mt-4 px-6 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30">
            Ask AI to define this career
          </button>
        </div>
      )}
    </div>
  );
}
