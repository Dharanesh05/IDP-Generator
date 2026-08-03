import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Target, 
  Award, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare,
  BarChart3,
  Compass
} from "lucide-react";
import { RecommendationItem } from "../types";

export interface ProgressCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  items: RecommendationItem[];
}

interface ProgressTrackerProps {
  categories: ProgressCategory[];
  completedItems: Record<string, boolean>;
  totalItemsCount: number;
  completedItemsCount: number;
  progressPercentage: number;
  onSelectCategory?: (categoryId: string) => void;
  onFocusNextTask?: () => void;
}

export default function ProgressTracker({
  categories,
  completedItems,
  totalItemsCount,
  completedItemsCount,
  progressPercentage,
  onSelectCategory,
  onFocusNextTask
}: ProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "inProgress" | "completed">("all");

  const remainingCount = totalItemsCount - completedItemsCount;

  // Compute stats per category
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const items = cat.items || [];
      const total = items.length;
      const completed = items.filter((item) => completedItems[item.id]).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      const nextTask = items.find((item) => !completedItems[item.id]);

      return {
        ...cat,
        total,
        completed,
        percent,
        nextTask,
        isFullyCompleted: total > 0 && completed === total
      };
    });
  }, [categories, completedItems]);

  // Motivational copy based on progress
  const motivationalData = useMemo(() => {
    if (progressPercentage === 0) {
      return {
        title: "Plan Initialized — Ready for Takeoff",
        desc: "Your custom IDP is ready! Check off your first task to activate your career momentum.",
        badge: "Zero Hour",
        color: "text-neon-blue",
        bg: "bg-neon-blue/10",
        border: "border-neon-blue/30"
      };
    } else if (progressPercentage < 25) {
      return {
        title: "Solid Ignition & Early Momentum",
        desc: `You've completed ${completedItemsCount} task${completedItemsCount > 1 ? "s" : ""}! Great consistency — keep checking off milestones.`,
        badge: "Rookie Catalyst",
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/30"
      };
    } else if (progressPercentage < 50) {
      return {
        title: "Skill Acceleration Phase",
        desc: `Quarter milestone surpassed! You are making steady progress toward technical mastery.`,
        badge: "Quarter Specialist",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/30"
      };
    } else if (progressPercentage < 75) {
      return {
        title: "Over the Halfway Mark!",
        desc: `Over 50% completed (${completedItemsCount}/${totalItemsCount})! Your industry-ready portfolio is taking shape.`,
        badge: "Halfway Hero",
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/30"
      };
    } else if (progressPercentage < 100) {
      return {
        title: "Final Sprint to Career Mastery",
        desc: `Outstanding dedication! Only ${remainingCount} task${remainingCount > 1 ? "s" : ""} remaining to complete your IDP.`,
        badge: "Elite Specialist",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/30"
      };
    } else {
      return {
        title: "100% IDP Master Achieved!",
        desc: "Incredible accomplishment! You have completed every task in your Individual Development Plan.",
        badge: "Master Developer",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/30"
      };
    }
  }, [progressPercentage, completedItemsCount, totalItemsCount, remainingCount]);

  // Achievement milestones
  const achievements = useMemo(() => {
    return [
      {
        id: "first_step",
        title: "First Step",
        desc: "Complete at least 1 task",
        unlocked: completedItemsCount >= 1,
        icon: Zap,
        color: "text-cyan-400"
      },
      {
        id: "quarter_master",
        title: "25% Quarter Mark",
        desc: "Reach 25% overall IDP progress",
        unlocked: progressPercentage >= 25,
        icon: Target,
        color: "text-emerald-400"
      },
      {
        id: "halfway_hero",
        title: "50% Halfway Pioneer",
        desc: "Reach 50% overall IDP progress",
        unlocked: progressPercentage >= 50,
        icon: Flame,
        color: "text-amber-400"
      },
      {
        id: "three_quarter",
        title: "75% Three-Quarter Pro",
        desc: "Reach 75% overall IDP progress",
        unlocked: progressPercentage >= 75,
        icon: Award,
        color: "text-purple-400"
      },
      {
        id: "idp_champion",
        title: "100% IDP Champion",
        desc: "Complete all recommended modules",
        unlocked: progressPercentage === 100,
        icon: Trophy,
        color: "text-yellow-400"
      }
    ];
  }, [completedItemsCount, progressPercentage]);

  const filteredStats = useMemo(() => {
    if (activeFilter === "completed") {
      return categoryStats.filter((cat) => cat.isFullyCompleted);
    }
    if (activeFilter === "inProgress") {
      return categoryStats.filter((cat) => cat.completed > 0 && !cat.isFullyCompleted);
    }
    return categoryStats;
  }, [categoryStats, activeFilter]);

  return (
    <div 
      id="visual-progress-tracker-component"
      className="glass-panel p-6 rounded-2xl border border-gray-800 bg-[#161b22] relative overflow-hidden mb-8"
    >
      {/* Tracker Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <BarChart3 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-white tracking-tight">
                IDP Progress & Milestone Tracker
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${motivationalData.bg} ${motivationalData.color} ${motivationalData.border}`}>
                {motivationalData.badge}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              Track real-time completion percentages across all targeted career tracks
            </p>
          </div>
        </div>

        {/* Toggle Collapse & Next Task Focus */}
        <div className="flex items-center gap-2">
          {onFocusNextTask && remainingCount > 0 && (
            <button
              onClick={onFocusNextTask}
              className="px-3 py-1.5 rounded-lg bg-neon-blue text-cyber-dark hover:bg-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,242,254,0.2)] cursor-pointer"
            >
              <Zap size={13} />
              <span>Next Task</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-cyber-dark border border-neon-blue/20 hover:border-neon-blue text-gray-400 hover:text-white transition-all cursor-pointer"
            title={isExpanded ? "Collapse Tracker Details" : "Expand Tracker Details"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Main Overall Progress Gauge Bar */}
      <div className="pt-5 pb-2">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-gray-300 font-medium flex items-center gap-1.5">
            <Sparkles size={14} className="text-neon-blue" />
            Overall Completion Rate:
            <strong className="text-white text-sm">{progressPercentage}%</strong>
          </span>
          <span className="text-gray-400">
            <strong className="text-neon-blue">{completedItemsCount}</strong> / {totalItemsCount} Tasks Finished
          </span>
        </div>

        {/* Outer Bar Track */}
        <div className="w-full h-4 bg-cyber-dark rounded-full border border-neon-blue/20 p-0.5 relative overflow-hidden shadow-inner">
          {/* Animated Filled Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-neon-blue via-cyan-400 to-emerald-400 relative shadow-[0_0_15px_rgba(0,242,254,0.5)]"
          >
            {/* Gloss sheen animation */}
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
          </motion.div>
        </div>

        {/* Motivational Status Alert Banner */}
        <div className={`mt-3 p-3 rounded-xl border ${motivationalData.border} ${motivationalData.bg} flex items-center justify-between gap-3 text-xs font-sans`}>
          <div className="flex items-center gap-2">
            <Trophy size={16} className={`${motivationalData.color} shrink-0`} />
            <div>
              <strong className={`font-mono text-xs ${motivationalData.color} block`}>
                {motivationalData.title}
              </strong>
              <p className="text-gray-300 text-[11px] leading-tight">
                {motivationalData.desc}
              </p>
            </div>
          </div>
          {progressPercentage < 100 && (
            <span className="font-mono text-[10px] text-gray-400 shrink-0 hidden sm:inline">
              {remainingCount} task{remainingCount === 1 ? "" : "s"} left
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pt-4 border-t border-neon-blue/10 mt-4"
          >
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-cyber-dark/70 border border-gray-800 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Total Modules</span>
                <span className="text-lg font-mono font-bold text-white mt-0.5">{totalItemsCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-cyber-dark/70 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Completed</span>
                <span className="text-lg font-mono font-bold text-emerald-400 mt-0.5">{completedItemsCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-cyber-dark/70 border border-cyan-500/20 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Remaining</span>
                <span className="text-lg font-mono font-bold text-cyan-300 mt-0.5">{remainingCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-cyber-dark/70 border border-purple-500/20 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">Career XP Earned</span>
                <span className="text-lg font-mono font-bold text-purple-300 mt-0.5">+{completedItemsCount * 25} XP</span>
              </div>
            </div>

            {/* Achievement Badges Row */}
            <div>
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Award size={13} className="text-amber-400" />
                Unlocked Milestones
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {achievements.map((ach) => {
                  const IconComp = ach.icon;
                  return (
                    <div
                      key={ach.id}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center relative overflow-hidden ${
                        ach.unlocked
                          ? "bg-cyber-dark/80 border-neon-blue/40 shadow-[0_0_12px_rgba(0,242,254,0.1)]"
                          : "bg-cyber-dark/30 border-gray-800/60 opacity-50 grayscale"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg mb-1 ${ach.unlocked ? "bg-neon-blue/10" : "bg-gray-800"}`}>
                        <IconComp size={16} className={ach.unlocked ? ach.color : "text-gray-600"} />
                      </div>
                      <span className={`text-[10px] font-mono font-bold block truncate max-w-full ${ach.unlocked ? "text-white" : "text-gray-500"}`}>
                        {ach.title}
                      </span>
                      <span className="text-[8px] text-gray-500 mt-0.5 line-clamp-1">
                        {ach.desc}
                      </span>
                      {ach.unlocked && (
                        <div className="absolute top-1 right-1 text-emerald-400">
                          <CheckCircle2 size={10} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Track Breakdown Grid */}
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={13} className="text-neon-blue" />
                  Track Progress Breakdown
                </h3>

                {/* Filters */}
                <div className="flex items-center gap-1 bg-cyber-dark/80 p-0.5 rounded-lg border border-gray-800">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                      activeFilter === "all" ? "bg-neon-blue/20 text-neon-blue font-bold" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    All ({categoryStats.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("inProgress")}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                      activeFilter === "inProgress" ? "bg-amber-400/20 text-amber-400 font-bold" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setActiveFilter("completed")}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                      activeFilter === "completed" ? "bg-emerald-400/20 text-emerald-400 font-bold" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredStats.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${cat.bg} ${cat.border} hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,242,254,0.15)]`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`p-1.5 rounded-lg bg-cyber-dark/80 border border-white/5 ${cat.color}`}>
                            <CatIcon size={14} />
                          </div>
                          <span className="text-xs font-mono font-bold text-gray-200 group-hover:text-neon-blue transition-colors truncate">
                            {cat.label}
                          </span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${cat.percent === 100 ? "text-emerald-400" : "text-white"}`}>
                          {cat.percent}%
                        </span>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-full h-2 bg-cyber-dark/90 rounded-full border border-gray-800 overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            cat.percent === 100 ? "bg-emerald-400" : cat.percent > 0 ? "bg-neon-blue" : "bg-gray-800"
                          }`}
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>

                      {/* Status row */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span>{cat.completed} / {cat.total} done</span>
                        <span className="group-hover:translate-x-1 transition-transform flex items-center gap-0.5 text-neon-blue">
                          View track <ArrowRight size={10} />
                        </span>
                      </div>

                      {/* Next Task Teaser */}
                      {cat.nextTask && (
                        <div className="mt-2.5 pt-2 border-t border-gray-800/60 text-[9px] font-sans text-gray-400 truncate">
                          <span className="text-gray-500 font-mono">Next: </span>
                          <span className="text-gray-300 hover:text-white">{cat.nextTask.title}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
