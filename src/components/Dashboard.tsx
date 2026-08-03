import { useState, useMemo, useEffect } from "react";
import { motion, Variants } from "motion/react";
import { ComprehensiveIDP, RecommendationItem } from "../types";
import { 
  Award, 
  Terminal, 
  BookOpen, 
  UserCheck, 
  FileText, 
  Video, 
  Compass, 
  Search, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  ArrowLeft,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  Trophy,
  Activity,
  HelpCircle,
  Printer,
  BadgeCheck,
  CreditCard,
  Bot
} from "lucide-react";
import GuidedTour, { TourStep } from "./GuidedTour";
import LoginStreak from "./LoginStreak";
import ProgressTracker from "./ProgressTracker";

interface DashboardProps {
  idp: ComprehensiveIDP & { isMock?: boolean };
  onReset: () => void;
  onAskAiQuestion?: (question: string) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut"
    }
  }
};

export default function Dashboard({ idp, onReset, onAskAiQuestion }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("idp_completed_items_v1");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load completed items from localStorage", e);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("idp_completed_items_v1", JSON.stringify(completedItems));
    } catch (e) {
      console.error("Failed to save completed items to localStorage", e);
    }
  }, [completedItems]);

  // Tab filter or all view
  const [activeTab, setActiveTab] = useState<string>("all");

  // Guided Tour Configuration
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("idp_tour_completed_v1");
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsTourActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTourClose = () => {
    localStorage.setItem("idp_tour_completed_v1", "true");
    setIsTourActive(false);
  };

  const handleRestartTour = () => {
    setIsTourActive(true);
  };

  const tourSteps: TourStep[] = [
    {
      targetId: "idp-hero-card",
      title: "AI Strategic Analysis",
      description: "This primary panel displays the curated strategic summary and customized target career roles calculated for your profile by Gemini AI.",
      fallbackPosition: "bottom"
    },
    {
      targetId: "visual-progress-tracker-component",
      title: "Interactive Progress Tracker",
      description: "Monitor overall and track-specific task completion percentages, unlock milestone badges, and quickly jump to your next unfinished recommendation.",
      fallbackPosition: "bottom"
    },
    {
      targetId: "idp-progress-tracker",
      title: "Dynamic Milestone Progress",
      description: "As you work on your customized plan, check off items to dynamically update your circular progress indicator and visual tracker metrics in real time.",
      fallbackPosition: "center"
    },
    {
      targetId: "idp-filters-bar",
      title: "Instant Search & Track Filters",
      description: "Quickly look up specific materials using keywords or switch between targeted tracks (e.g., Certifications, Guided Projects, Coding Practice) with ease.",
      fallbackPosition: "bottom"
    },
    {
      targetId: "idp-recommendations-list",
      title: "Actionable Development Modules",
      description: "Discover tailored courses, custom code repositories, logical aptitude files, and strategic career materials custom-designed for your future.",
      fallbackPosition: "bottom"
    },
    {
      targetId: "btn-floating-idp-chat",
      title: "Floating Gemini IDP Assistant",
      description: "Have questions about a specific course, project, or interview tip? Click this floating AI button anytime to ask Gemini for instant personalized advice!",
      fallbackPosition: "top"
    }
  ];

  const toggleComplete = (id: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const freeCertifications = useMemo(() => {
    return (idp.certifications || []).filter(item => {
      if (item.isPaid !== undefined) {
        return !item.isPaid;
      }
      const text = `${item.title} ${item.description} ${item.providerOrPlatform} ${item.actionLabel || ""}`.toLowerCase();
      if (text.includes("free") || text.includes("freecodecamp")) return true;
      if (text.includes("paid") || text.includes("subscription") || text.includes("$") || text.includes("coursera") || text.includes("udemy") || text.includes("fee")) return false;
      return item.id.endsWith("2") || item.id.includes("free");
    });
  }, [idp.certifications]);

  const paidCertifications = useMemo(() => {
    return (idp.certifications || []).filter(item => {
      if (item.isPaid !== undefined) {
        return !!item.isPaid;
      }
      const text = `${item.title} ${item.description} ${item.providerOrPlatform} ${item.actionLabel || ""}`.toLowerCase();
      if (text.includes("free") || text.includes("freecodecamp")) return false;
      if (text.includes("paid") || text.includes("subscription") || text.includes("$") || text.includes("coursera") || text.includes("udemy") || text.includes("fee")) return true;
      return !(item.id.endsWith("2") || item.id.includes("free"));
    });
  }, [idp.certifications]);

  const categories = useMemo(() => {
    return [
      { id: "freeCertifications", label: "Free Certifications", icon: BadgeCheck, color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20", items: freeCertifications },
      { id: "paidCertifications", label: "Paid Certifications", icon: CreditCard, color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", items: paidCertifications },
      { id: "projects", label: "Guided Projects", icon: Layers, color: "text-cyan-400", bg: "bg-cyan-400/5", border: "border-cyan-400/20", items: idp.projects },
      { id: "codingPractice", label: "Coding Practice", icon: Terminal, color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20", items: idp.codingPractice },
      { id: "aptitudePractice", label: "Aptitude Prep", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/5", border: "border-purple-400/20", items: idp.aptitudePractice },
      { id: "softSkills", label: "Soft Skills", icon: UserCheck, color: "text-pink-400", bg: "bg-pink-400/5", border: "border-pink-400/20", items: idp.softSkills },
      { id: "resumeImprovements", label: "Resume Upgrades", icon: FileText, color: "text-orange-400", bg: "bg-orange-400/5", border: "border-orange-400/20", items: idp.resumeImprovements },
      { id: "interviewPrep", label: "Interview Mastery", icon: Video, color: "text-rose-400", bg: "bg-rose-400/5", border: "border-rose-400/20", items: idp.interviewPrep },
    ];
  }, [idp, freeCertifications, paidCertifications]);

  // Calculate overall progress across all items
  const totalItemsCount = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  }, [categories]);

  const completedItemsCount = useMemo(() => {
    let count = 0;
    categories.forEach((cat) => {
      cat.items?.forEach((item) => {
        if (completedItems[item.id]) {
          count++;
        }
      });
    });
    return count;
  }, [categories, completedItems]);

  const progressPercentage = totalItemsCount > 0 
    ? Math.round((completedItemsCount / totalItemsCount) * 100) 
    : 0;

  // Filter categories and their inner items based on Search query & Active tab
  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => {
        // First filter by tab if not 'all'
        if (activeTab !== "all" && category.id !== activeTab) {
          return { ...category, items: [] };
        }

        // Then filter items by search query
        const items = (category.items || []).filter((item) => {
          const matchText = `${item.title} ${category.label} ${item.providerOrPlatform} ${item.description} ${(item.skillsAcquired || []).join(" ")}`.toLowerCase();
          return matchText.includes(searchQuery.toLowerCase());
        });

        return { ...category, items };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery, activeTab]);

  const handleSelectProgressCategory = (catId: string) => {
    setActiveTab(catId);
    setTimeout(() => {
      const el = document.getElementById(`section-${catId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleFocusNextTask = () => {
    for (const cat of categories) {
      const uncompleted = (cat.items || []).find((item) => !completedItems[item.id]);
      if (uncompleted) {
        if (activeTab !== "all" && activeTab !== cat.id) {
          setActiveTab("all");
        }
        setTimeout(() => {
          const element = document.getElementById(`card-${uncompleted.id}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("ring-2", "ring-neon-blue", "shadow-[0_0_25px_rgba(0,242,254,0.5)]");
            setTimeout(() => {
              element.classList.remove("ring-2", "ring-neon-blue", "shadow-[0_0_25px_rgba(0,242,254,0.5)]");
            }, 2500);
          }
        }, 150);
        return;
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative z-10" id="idp-dashboard">
      {/* Print-Only Professional Document Header */}
      <div className="print-header-only">
        <h1 className="print-title">INTELLIGENT INDIVIDUAL DEVELOPMENT PLAN (IDP)</h1>
        <p className="text-sm text-gray-600 font-mono">Curated Strategy Roadmap • Generated via Google Gemini AI</p>
      </div>

      {/* Main Back Button & Header Summary Card */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <button
            id="btn-back-to-profile"
            onClick={onReset}
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-neon-blue transition-colors group cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Student Profiler
          </button>

          {/* Real-time Header Search Input */}
          <div className="relative w-full sm:w-64 md:w-80 lg:w-96" id="header-search-bar">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="header-search-input"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cyber-dark/80 border border-neon-blue/20 focus:border-neon-blue rounded-lg pl-9 pr-8 py-1.5 text-xs text-gray-200 outline-none transition-all placeholder-gray-500 shadow-[0_0_10px_rgba(0,242,254,0.02)] focus:shadow-[0_0_15px_rgba(0,242,254,0.15)]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer select-none"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-pdf"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-white bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Printer size={14} />
              <span>Print / Export PDF</span>
            </button>

            <button
              id="btn-restart-tour"
              onClick={handleRestartTour}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neon-blue hover:text-white bg-neon-blue/10 border border-neon-blue/20 hover:border-neon-blue px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-[0_0_10px_rgba(0,242,254,0.1)] hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              <HelpCircle size={14} />
              <span>Interactive Tour Guide</span>
            </button>
          </div>
        </div>

        {/* 3D-effect Hero Panel */}
        <div className="perspective-container">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-neon-blue/30 relative overflow-hidden preserve-3d transition-transform duration-300 hover:scale-[1.01] hover:border-neon-blue/50" id="idp-hero-card">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Left & Middle Column: Core Goals & AI Analysis */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] font-mono uppercase tracking-wider mb-3">
                    <Activity size={12} className="animate-pulse" /> Live Analysis Framework Ready
                  </div>
                  
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-3">
                    Interactive Development Plan (IDP)
                  </h1>
                  
                  <p className="text-sm text-gray-300 leading-relaxed max-w-2xl mb-4 font-sans">
                    {idp.summary}
                  </p>
                </div>

                {/* Target roles badges */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-xs font-mono text-gray-500 flex items-center gap-1">
                    <Briefcase size={12} /> Target Roles:
                  </span>
                  {idp.suggestedRoles?.map((role, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-cyber-dark/80 border border-neon-blue/20 text-neon-blue"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Progress Tracker & Login Streak Panel */}
              <div className="lg:col-span-1 flex flex-col gap-4 justify-between">
                {/* Circular SVG Progress */}
                <div className="glass-panel p-5 rounded-xl border border-neon-blue/10 bg-cyber-dark/40 flex flex-col items-center justify-center text-center" id="idp-progress-tracker">
                  <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                    {/* Circular SVG Progress */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="48" 
                        className="stroke-cyber-dark stroke-[6]"
                        fill="transparent" 
                      />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="48" 
                        className="stroke-neon-blue stroke-[6] transition-all duration-1000 ease-out"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - progressPercentage / 100)}
                        strokeLinecap="round"
                        fill="transparent" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-mono font-bold text-white leading-none">
                        {progressPercentage}%
                      </span>
                      <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider mt-1">
                        Complete
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 font-mono">
                    <span className="text-neon-blue font-bold">{completedItemsCount}</span> of <span className="text-gray-300">{totalItemsCount}</span> Modules Done
                  </div>
                  
                  {progressPercentage === 100 && (
                    <div className="mt-2 text-[10px] text-emerald-400 font-mono animate-bounce flex items-center gap-1 justify-center">
                      <Trophy size={12} /> Master IDP Achieved!
                    </div>
                  )}
                </div>

                {/* Daily Login Streak Widget */}
                <LoginStreak />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progress Tracking & Milestones Component */}
      <ProgressTracker
        categories={categories}
        completedItems={completedItems}
        totalItemsCount={totalItemsCount}
        completedItemsCount={completedItemsCount}
        progressPercentage={progressPercentage}
        onSelectCategory={handleSelectProgressCategory}
        onFocusNextTask={handleFocusNextTask}
      />

      {/* Filters & Navigation Controls bar */}
      <div className="glass-panel p-4 rounded-xl border-neon-blue/20 mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between" id="idp-filters-bar">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            id="search-filter-input"
            placeholder="Search filters: courses, project keys, technologies, STAR methods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cyber-dark/80 border border-neon-blue/20 focus:border-neon-blue rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 outline-none transition-all placeholder-gray-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Category Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === "all"
                ? "bg-neon-blue/20 border border-neon-blue text-neon-blue font-medium"
                : "bg-cyber-dark/40 border border-neon-blue/5 text-gray-400 hover:border-neon-blue/25 hover:text-white"
            }`}
          >
            All Tracks
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  activeTab === cat.id
                    ? "bg-neon-blue/20 border border-neon-blue text-neon-blue font-medium"
                    : "bg-cyber-dark/40 border border-neon-blue/5 text-gray-400 hover:border-neon-blue/25 hover:text-white"
                }`}
              >
                <Icon size={12} className={cat.color} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* recommendation layout results */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border-neon-blue/10">
          <Compass size={48} className="mx-auto text-gray-600 mb-4 animate-spin-slow" />
          <h3 className="font-display font-medium text-lg text-gray-300">No matched recommendations found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto px-4">
            Try adjusting your search filters or select "All Tracks" to display full recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-12" id="idp-recommendations-list">
          {filteredCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div 
                key={category.id} 
                className="relative"
                id={`section-${category.id}`}
              >
                {/* Category Header Label */}
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className={`p-2.5 rounded-xl border border-neon-blue/15 ${category.bg} ${category.color} shadow-[0_0_15px_rgba(0,242,254,0.05)]`}>
                    <CategoryIcon size={20} />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-white tracking-tight flex items-center gap-2">
                      {category.label}
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyber-dark border border-neon-blue/10 text-gray-500 font-normal">
                        {category.items.length} Modules
                      </span>
                    </h2>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wide mt-0.5">
                      Personalized developmental strategy
                    </p>
                  </div>
                </div>

                {/* Cards Grid with Interactive Tilt Support and Staggered entrance */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {category.items.map((item) => {
                    const isCompleted = !!completedItems[item.id];
                    return (
                      <motion.div
                        key={item.id}
                        id={`card-${item.id}`}
                        variants={cardVariants}
                        className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                          isCompleted 
                            ? "border-emerald-500/25 bg-emerald-950/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                            : "border-neon-blue/15 hover:border-neon-blue/40 hover:shadow-[0_0_20px_rgba(0,242,254,0.1)]"
                        }`}
                      >
                        {/* Decorative glowing gradient overlay for hover */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <div className="flex items-start justify-between gap-4 mb-4">
                          {/* Completed Checklist trigger */}
                          <button
                            id={`chk-${item.id}`}
                            onClick={() => toggleComplete(item.id)}
                            className={`p-1 rounded hover:bg-cyber-dark/80 transition-colors shrink-0 cursor-pointer ${
                              isCompleted ? "text-emerald-400" : "text-gray-500 hover:text-neon-blue"
                            }`}
                            title={isCompleted ? "Mark incomplete" : "Mark as completed"}
                          >
                            {isCompleted ? (
                              <CheckSquare size={22} className="stroke-[2.5px]" />
                            ) : (
                              <Square size={22} className="stroke-[1.5px]" />
                            )}
                          </button>

                          {/* Cost & Difficulty badges */}
                          <div className="flex-1 text-right flex items-center justify-end gap-1.5">
                            {(category.id === "freeCertifications" || category.id === "paidCertifications" || item.isPaid !== undefined) && (
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono border font-semibold ${
                                category.id === "freeCertifications" || item.isPaid === false
                                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 animate-pulse"
                                  : "border-amber-500/30 bg-amber-500/5 text-amber-400"
                              }`}>
                                {item.priceInfo || (category.id === "freeCertifications" || item.isPaid === false ? "Free" : "Paid")}
                              </span>
                            )}
                            {item.difficultyOrTime && (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono border border-neon-blue/10 bg-cyber-dark text-gray-400">
                                {item.difficultyOrTime}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title and provider */}
                        <div className="mb-3">
                          <h3 className={`font-display font-semibold text-base leading-snug transition-colors ${
                            isCompleted ? "text-gray-400 line-through" : "text-white group-hover:text-neon-blue"
                          }`}>
                            {item.title}
                          </h3>
                          <p className="text-xs font-mono text-neon-blue/70 mt-1">
                            {item.providerOrPlatform}
                          </p>
                        </div>

                        {/* Description text */}
                        <p className={`text-sm text-gray-300 mb-4 leading-relaxed font-sans ${isCompleted ? "text-gray-500" : ""}`}>
                          {item.description}
                        </p>

                        {/* Skill Tags */}
                        {item.skillsAcquired && item.skillsAcquired.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {item.skillsAcquired.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                  isCompleted 
                                    ? "bg-gray-800/40 border border-gray-700/20 text-gray-500" 
                                    : "bg-neon-blue/5 border border-neon-blue/10 text-neon-blue/90"
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Resource links & Ask AI button */}
                        <div className="pt-2 border-t border-neon-blue/5 flex items-center justify-between gap-2">
                          {onAskAiQuestion ? (
                            <button
                              type="button"
                              onClick={() => onAskAiQuestion(`Can you explain more about "${item.title}" from ${item.providerOrPlatform} and how it fits into my career development?`)}
                              className="inline-flex items-center gap-1.5 text-xs font-mono text-neon-blue/80 hover:text-white hover:bg-neon-blue/10 px-2 py-1 rounded transition-all cursor-pointer border border-neon-blue/20 hover:border-neon-blue/40"
                              title="Ask Gemini Assistant about this recommendation"
                            >
                              <Bot size={13} className="text-neon-blue" />
                              <span>Ask AI</span>
                            </button>
                          ) : <div />}

                          {item.link && (
                            <a
                              id={`link-${item.id}`}
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium transition-all ${
                                isCompleted 
                                  ? "text-gray-500 hover:text-white" 
                                  : "text-neon-blue hover:text-white hover:underline"
                              }`}
                            >
                              <span>{item.actionLabel || "Explore Module"}</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Tour Overlay */}
      <GuidedTour 
        steps={tourSteps} 
        isActive={isTourActive} 
        onClose={handleTourClose} 
      />

      {/* Floating Export PDF Action Button */}
      <motion.button
        id="floating-export-pdf-btn"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.print()}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-cyber-dark/90 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:border-emerald-400 hover:text-white backdrop-blur-md transition-all duration-300 group cursor-pointer print:hidden"
        title="Export IDP to PDF / Print Document"
      >
        <div className="p-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-cyber-dark transition-colors">
          <Printer size={16} />
        </div>
        <div className="flex flex-col items-start pr-1">
          <span className="text-xs font-mono font-bold tracking-wide uppercase leading-none">
            Export PDF
          </span>
          <span className="text-[9px] font-mono text-gray-400 group-hover:text-emerald-200 transition-colors mt-0.5">
            Print-Ready Format
          </span>
        </div>
      </motion.button>
    </div>
  );
}
