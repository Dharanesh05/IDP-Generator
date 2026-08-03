import React, { useState } from "react";
import { StudentProfile } from "../types";
import { GraduationCap, Brain, Compass, Clock, Zap, Cpu, Sparkles } from "lucide-react";

interface StudentFormProps {
  onSubmit: (profile: StudentProfile) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    name: "Full-Stack Developer",
    major: "Computer Science & Engineering",
    skills: "HTML, CSS, JavaScript, React, basic Node.js, Git",
    goals: "Become a Full-Stack Engineer, build scalable web apps, pass enterprise technical coding interviews",
    experienceLevel: "beginner" as const,
    timeCommitment: "10 hours/week"
  },
  {
    name: "AI & Machine Learning Engineer",
    major: "Data Science & Statistics",
    skills: "Python, basic linear algebra, pandas, introductory neural networks, SQL",
    goals: "Secure an internship as an AI Engineer, learn PyTorch, master system design for machine learning projects",
    experienceLevel: "intermediate" as const,
    timeCommitment: "15 hours/week"
  },
  {
    name: "Cloud & DevOps Specialist",
    major: "Information Technology",
    skills: "Linux command line, basic networking, Python, simple shell scripting",
    goals: "Master AWS/GCP architecture, implement CI/CD pipelines, optimize infrastructure scaling, prepare for certifications",
    experienceLevel: "intermediate" as const,
    timeCommitment: "8 hours/week"
  }
];

export default function StudentForm({ onSubmit, isLoading }: StudentFormProps) {
  const [profile, setProfile] = useState<StudentProfile>({
    major: "",
    skills: "",
    goals: "",
    experienceLevel: "intermediate",
    timeCommitment: "10 hours/week"
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentProfile, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof StudentProfile, string>> = {};
    if (!profile.major.trim()) newErrors.major = "Major/Specialization is required";
    if (!profile.skills.trim()) newErrors.skills = "At least one skill is required";
    if (!profile.goals.trim()) newErrors.goals = "Career goals are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(profile);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setProfile(preset);
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative z-10 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono mb-4 tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Cpu size={14} className="text-amber-400 animate-pulse" /> Next-Gen AI Career Planning
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight mb-4">
          Intelligent <span className="inline-block text-rainbow">IDP Generator</span>
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
          Unlock your personalized, AI-mapped Individual Development Plan (IDP). Provide your specialization and career objectives to get an immersive, high-impact guide.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="mb-8">
        <h2 className="text-xs font-mono uppercase tracking-wider text-amber-200/70 mb-3 flex items-center gap-1.5 justify-center">
          <Sparkles size={12} className="text-amber-400 animate-pulse" /> Quick-Test Preset Student Profiles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              id={`preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-4 py-3 text-left bg-[#181427]/80 border border-amber-500/25 hover:border-amber-400 rounded-2xl transition-all group cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]"
            >
              <div className="text-xs font-mono text-amber-400 font-bold mb-1 group-hover:text-white transition-colors">
                {preset.name}
              </div>
              <div className="text-[11px] text-amber-200/60 line-clamp-1">
                {preset.major}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-[#181427]/95 p-6 sm:p-8 rounded-3xl border border-amber-500/35 relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.2)]">
        <div className="space-y-6">
          {/* Major / Specialization */}
          <div>
            <label className="block text-sm font-mono text-amber-200/90 mb-2 flex items-center gap-2">
              <GraduationCap size={16} className="text-amber-400" />
              Major / Field of Study
            </label>
            <input
              type="text"
              id="input-major"
              placeholder="e.g. Computer Science, Mechanical Engineering, Electronics"
              value={profile.major}
              onChange={(e) => setProfile({ ...profile, major: e.target.value })}
              className="w-full bg-[#0f0d18]/90 border border-amber-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-white placeholder-amber-700/50 outline-none transition-all focus:ring-1 focus:ring-amber-400 text-sm"
              aria-invalid={!!errors.major}
            />
            {errors.major && (
              <p className="text-rose-400 text-xs mt-1 font-mono">{errors.major}</p>
            )}
          </div>

          {/* Current Skills */}
          <div>
            <label className="block text-sm font-mono text-amber-200/90 mb-2 flex items-center gap-2">
              <Brain size={16} className="text-amber-400" />
              Current Skills & Technologies
            </label>
            <textarea
              id="input-skills"
              rows={3}
              placeholder="e.g. Python, SQL, Git, communication, problem solving (comma-separated)"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              className="w-full bg-[#0f0d18]/90 border border-amber-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-white placeholder-amber-700/50 outline-none transition-all focus:ring-1 focus:ring-amber-400 text-sm resize-none"
              aria-invalid={!!errors.skills}
            />
            {errors.skills && (
              <p className="text-rose-400 text-xs mt-1 font-mono">{errors.skills}</p>
            )}
          </div>

          {/* Career Goals / Target Roles */}
          <div>
            <label className="block text-sm font-mono text-amber-200/90 mb-2 flex items-center gap-2">
              <Compass size={16} className="text-amber-400" />
              Target Roles & Career Goals
            </label>
            <textarea
              id="input-goals"
              rows={3}
              placeholder="e.g. Aspiring Backend Engineer with cloud expertise, secure a high-growth tech startup role"
              value={profile.goals}
              onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
              className="w-full bg-[#0f0d18]/90 border border-amber-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-white placeholder-amber-700/50 outline-none transition-all focus:ring-1 focus:ring-amber-400 text-sm resize-none"
              aria-invalid={!!errors.goals}
            />
            {errors.goals && (
              <p className="text-rose-400 text-xs mt-1 font-mono">{errors.goals}</p>
            )}
          </div>

          {/* Experience level and Time Commitment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Experience Level */}
            <div>
              <label className="block text-sm font-mono text-amber-200/90 mb-2 flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                Current Technical Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                  <button
                    key={level}
                    id={`btn-level-${level}`}
                    type="button"
                    onClick={() => setProfile({ ...profile, experienceLevel: level })}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono capitalize transition-all cursor-pointer ${
                      profile.experienceLevel === level
                        ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        : "bg-[#0f0d18]/60 border-amber-500/15 text-amber-200/60 hover:border-amber-500/40"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Commitment */}
            <div>
              <label className="block text-sm font-mono text-amber-200/90 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                Weekly Study Commitment
              </label>
              <select
                id="select-commitment"
                value={profile.timeCommitment}
                onChange={(e) => setProfile({ ...profile, timeCommitment: e.target.value })}
                className="w-full bg-[#0f0d18]/90 border border-amber-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-white outline-none transition-all focus:ring-1 focus:ring-amber-400 text-sm"
              >
                <option value="5 hours/week">5 Hours / Week</option>
                <option value="10 hours/week">10 Hours / Week (Recommended)</option>
                <option value="15 hours/week">15 Hours / Week</option>
                <option value="20+ hours/week">20+ Hours / Week (Intense)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            id="btn-submit-profile"
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-gray-950 font-display font-bold tracking-wide py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_45px_rgba(245,158,11,0.65)] cursor-pointer disabled:opacity-50"
          >
            {/* Pulsing button light */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-mono">Compiling Profile & Harnessing Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className="animate-pulse text-gray-950" />
                <span>Generate Smart IDP</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

