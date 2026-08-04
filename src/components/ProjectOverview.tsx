import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  BookOpen, 
  Compass, 
  Award, 
  Layers, 
  Terminal, 
  FileText, 
  Video, 
  Flame, 
  ArrowRight,
  Sparkles,
  Cpu,
  BadgeCheck,
  CreditCard,
  UserCheck
} from "lucide-react";

interface ProjectOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  hasIdp: boolean;
  onSelectSection?: (sectionId: string) => void;
}

export default function ProjectOverview({ isOpen, onClose, hasIdp, onSelectSection }: ProjectOverviewProps) {
  const sections = [
    {
      id: "idp-hero-card",
      label: "Overview & Personal Profile Summary",
      desc: "Comprehensive diagnostic feedback analyzed by Gemini models based on student background.",
      icon: UserCheck,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      isDashboardOnly: true
    },
    {
      id: "idp-login-streak",
      label: "Daily Login Streak & Engagement Engine",
      desc: "Gamified tracker rewarding active study with career multipliers, streaks, and Career XP points.",
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      isDashboardOnly: true
    },
    {
      id: "section-freeCertifications",
      label: "Free Certifications Track",
      desc: "Curated zero-cost, high-yield professional credentials and courses (e.g., freeCodeCamp, audit tracks).",
      icon: BadgeCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      isDashboardOnly: true
    },
    {
      id: "section-paidCertifications",
      label: "Paid Certifications Track",
      desc: "Premier industry certifications and professional degree programs (e.g., AWS, Coursera/Meta Pro).",
      icon: CreditCard,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      isDashboardOnly: true
    },
    {
      id: "section-projects",
      label: "Guided Practical Projects",
      desc: "GitHub-hosted and platform open-source projects selected to demonstrate hands-on mastery.",
      icon: Layers,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      isDashboardOnly: true
    },
    {
      id: "section-codingPractice",
      label: "Interactive Coding Challenges",
      desc: "Targeted algorithm and problem-solving puzzles mapped to interview frequency.",
      icon: Terminal,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      isDashboardOnly: true
    },
    {
      id: "section-aptitudePractice",
      label: "Cognitive & Aptitude Drills",
      desc: "Analytical, logical, and non-verbal reasoning assessments required for elite screening.",
      icon: BookOpen,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      isDashboardOnly: true
    },
    {
      id: "section-resumeImprovements",
      label: "ATS-Optimized Resume Upgrades",
      desc: "Strategic keyword matching, structural formatting guidance, and phrasing enhancements.",
      icon: FileText,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      isDashboardOnly: true
    },
    {
      id: "section-interviewPrep",
      label: "STAR Interview Mastery Tracks",
      desc: "Customized situational, technical, and behavior questions complete with optimal response guides.",
      icon: Video,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
      isDashboardOnly: true
    }
  ];

  const handleSectionClick = (id: string) => {
    if (hasIdp && onSelectSection) {
      onSelectSection(id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-cyber-dark/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-3xl max-h-[85vh] bg-cyber-dark/95 border border-neon-blue/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.15)] flex flex-col relative z-10"
          >
            {/* Glowing Top Frame Accent */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent" />

            {/* Modal Header */}
            <div className="p-5 border-b border-neon-blue/10 bg-cyber-dark/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-base tracking-tight uppercase">
                    Project Table of Contents
                  </h2>
                  <p className="text-[10px] font-mono text-neon-blue uppercase tracking-wider leading-none mt-1">
                    Document Specification & Interactive Guide
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Table of Contents Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu size={12} className="text-neon-blue" />
                    Table of Contents
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500">
                    {hasIdp ? "🟢 Navigation Active" : "🟠 Build IDP to unlock jump links"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sections.map((sect) => {
                    const SectIcon = sect.icon;
                    const canNavigate = hasIdp;
                    
                    return (
                      <div
                        key={sect.id}
                        onClick={() => handleSectionClick(sect.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 relative overflow-hidden group ${
                          canNavigate
                            ? "border-neon-blue/15 hover:border-neon-blue bg-cyber-dark/50 hover:bg-neon-blue/5 cursor-pointer hover:shadow-[0_0_15px_rgba(0,242,254,0.08)]"
                            : "border-gray-800/40 bg-cyber-dark/25 opacity-75"
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${sect.bg} ${sect.color}`}>
                          <SectIcon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-mono font-semibold text-gray-200 group-hover:text-neon-blue transition-colors truncate">
                              {sect.label}
                            </span>
                            {canNavigate && (
                              <ArrowRight size={10} className="text-neon-blue opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5 font-sans leading-relaxed">
                            {sect.desc}
                          </p>
                        </div>
                        
                        {/* Interactive hover glow lines */}
                        {canNavigate && (
                          <div className="absolute top-0 right-0 w-1/3 h-[1px] bg-gradient-to-l from-neon-blue/20 to-transparent group-hover:from-neon-blue/50 transition-all" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* System Architecture summary */}
              <section className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={12} className="text-neon-blue" />
                  System Methodology & Craft
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-gray-800 bg-cyber-dark/20 p-3 rounded-lg">
                    <span className="text-[10px] font-mono text-neon-blue font-bold block mb-1">
                      1. PRECISE TUNING
                    </span>
                    <p className="text-[10px] text-gray-500 font-sans leading-normal">
                      Deep structural schema mapping delivers highly customized, accurate certifications, projects, and custom mock questions.
                    </p>
                  </div>
                  <div className="border border-gray-800 bg-cyber-dark/20 p-3 rounded-lg">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
                      2. COST DISCIPLINE
                    </span>
                    <p className="text-[10px] text-gray-500 font-sans leading-normal">
                      Algorithmic separation of courses into free auditing certificates versus paid professional certificates.
                    </p>
                  </div>
                  <div className="border border-gray-800 bg-cyber-dark/20 p-3 rounded-lg">
                    <span className="text-[10px] font-mono text-orange-400 font-bold block mb-1">
                      3. BEHAVIOR DRIVERS
                    </span>
                    <p className="text-[10px] text-gray-500 font-sans leading-normal">
                      Gamified attendance tracking encourages students to check in daily, maximizing focus and momentum.
                    </p>
                  </div>
                </div>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neon-blue/10 bg-cyber-dark/60 text-center flex items-center justify-between">
              <span className="text-[9px] font-mono text-gray-500">
                Specification Engine v1.1.2 • AI Stable Response
              </span>
              <button
                onClick={onClose}
                className="bg-neon-blue hover:bg-white text-cyber-dark font-mono font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(0,242,254,0.2)] hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] cursor-pointer"
              >
                Close Document
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
