import { useState, useEffect } from "react";
import { StudentProfile, ComprehensiveIDP, User } from "./types";
import StudentForm from "./components/StudentForm";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./components/Dashboard";
import CustomCursor from "./components/CustomCursor";
import ProjectOverview from "./components/ProjectOverview";
import IdpChat from "./components/IdpChat";
import Background3DVideo from "./components/Background3DVideo";
import LoginPage from "./components/LoginPage";
import {
  Compass,
  AlertOctagon,
  RefreshCw,
  Cpu,
  BookOpen,
  LogOut,
  GraduationCap,
  Sparkles
} from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [idp, setIdp] = useState<(ComprehensiveIDP & { isMock?: boolean }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const [chatQuestion, setChatQuestion] = useState<string | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Load existing session on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem("idp_user_session");
      if (savedSession) {
        setCurrentUser(JSON.parse(savedSession));
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem("idp_user_session");
    setCurrentUser(null);
    setUserDropdownOpen(false);
    setProfile(null);
    setIdp(null);
  };

  const handleSelectSection = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        element.classList.add("ring-2", "ring-neon-blue/80", "shadow-[0_0_20px_rgba(0,242,254,0.3)]", "transition-all", "duration-500");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-neon-blue/80", "shadow-[0_0_20px_rgba(0,242,254,0.3)]");
        }, 2000);
      }
    }, 150);
  };

function createClientFallbackIDP(studentProfile: StudentProfile): ComprehensiveIDP & { isMock?: boolean } {
  const major = studentProfile.major?.trim() || "Computer Science";
  const goals = studentProfile.goals?.trim() || "Software Developer";
  const skills = studentProfile.skills?.trim() || "Programming, Problem Solving";
  const commitment = studentProfile.timeCommitment || "10 hours/week";

  return {
    isMock: true,
    summary: `Based on your profile in ${major} targeting ${goals}, here is your tailored Individual Development Plan (IDP). Focus on turning your foundation in ${skills} into industry-ready software engineering skills over ${commitment} of weekly commitment.`,
    suggestedRoles: [
      `${goals}`,
      `Associate Software Engineer (${major})`,
      `Junior Tech Lead`
    ],
    certifications: [
      {
        id: "cert_free_1",
        title: "Responsive Web Design & Modern Frontend Certification",
        providerOrPlatform: "freeCodeCamp",
        description: "Comprehensive 300-hour hands-on certification covering HTML5, CSS3, Flexbox, CSS Grid, and responsive UI principles.",
        link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
        difficultyOrTime: "4 weeks (Self-Paced)",
        skillsAcquired: ["Responsive Web Design", "HTML5 & CSS3", "Flexbox & Grid", "UI Design"],
        actionLabel: "Start Free Certification",
        isPaid: false,
        priceInfo: "Free"
      },
      {
        id: "cert_free_2",
        title: `Foundational ${major} & Software Engineering Principles`,
        providerOrPlatform: "Meta / Coursera (Free Audit)",
        description: `Explore core computational concepts, clean code standards, and modern development workflows tailored for ${goals} roles.`,
        link: "https://www.coursera.org",
        difficultyOrTime: "3-4 weeks",
        skillsAcquired: ["Software Principles", "Version Control", "Algorithmic Thinking"],
        actionLabel: "Audit For Free",
        isPaid: false,
        priceInfo: "Free"
      },
      {
        id: "cert_free_3",
        title: "AWS Cloud Quest & Cloud Practitioner Foundations",
        providerOrPlatform: "AWS Skill Builder",
        description: "Interactive role-based learning game and practical cloud fundamentals certification offered directly by Amazon Web Services.",
        link: "https://aws.amazon.com/training/digital/",
        difficultyOrTime: "2-3 weeks",
        skillsAcquired: ["Cloud Computing", "AWS Core Services", "Infrastructure Fundamentals"],
        actionLabel: "Start AWS Free Track",
        isPaid: false,
        priceInfo: "Free"
      },
      {
        id: "cert_paid_1",
        title: `Professional Certificate in Advanced ${major} Concepts`,
        providerOrPlatform: "Coursera (Google / IBM)",
        description: `A highly recognized professional certificate to solidify core engineering principles for ${goals} roles.`,
        link: "https://www.coursera.org",
        difficultyOrTime: "6-8 weeks",
        skillsAcquired: ["Core Concepts", "Best Practices", "System Design"],
        actionLabel: "Explore Course",
        isPaid: true,
        priceInfo: "Paid Certificate"
      },
      {
        id: "cert_paid_2",
        title: "AWS Certified Developer / Cloud Architect Associate",
        providerOrPlatform: "Amazon Web Services (AWS)",
        description: "Industry-standard certification validating technical expertise in building and deploying cloud applications on AWS.",
        link: "https://aws.amazon.com/certification/",
        difficultyOrTime: "2-3 months",
        skillsAcquired: ["AWS Services", "Serverless Architecture", "Cloud Security"],
        actionLabel: "View Exam Guide",
        isPaid: true,
        priceInfo: "Paid Exam ($150)"
      }
    ],
    projects: [
      {
        id: "proj_1",
        title: `Full-Stack Portfolio Project for ${goals}`,
        providerOrPlatform: "Self-Guided (GitHub)",
        description: `Build an interactive web platform demonstrating your skills in ${skills}. Include dark mode, responsive layout, and live demo links on GitHub.`,
        link: "https://github.com",
        difficultyOrTime: "2-3 weeks",
        skillsAcquired: ["Full-Stack Architecture", "Git & GitHub", "Tailwind / CSS"],
        actionLabel: "Initialize Repository"
      },
      {
        id: "proj_2",
        title: "Open Source Bug Fix & Feature Contribution",
        providerOrPlatform: "GitHub Open Source",
        description: "Contribute clean code or documentation updates to open source repositories relevant to your stack.",
        link: "https://github.com/explore",
        difficultyOrTime: "Ongoing",
        skillsAcquired: ["Open Source Workflow", "Code Review", "Collaboration"],
        actionLabel: "Find Good First Issues"
      }
    ],
    codingPractice: [
      {
        id: "code_1",
        title: "Data Structures & Algorithms Problem Solving Track",
        providerOrPlatform: "LeetCode / HackerRank",
        description: "Solve 2-3 algorithmic challenges daily focusing on Arrays, Strings, Hash Maps, and Binary Search.",
        link: "https://leetcode.com",
        difficultyOrTime: "Daily (30 mins)",
        skillsAcquired: ["Problem Solving", "Time & Space Complexity", "Algorithms"],
        actionLabel: "Start Coding Practice"
      }
    ],
    aptitudePractice: [
      {
        id: "apt_1",
        title: "Logical Reasoning & Quantitative Assessment",
        providerOrPlatform: "IndiaBIX / GeeksforGeeks",
        description: "Practice quantitative aptitude and logical reasoning modules common in technical campus recruitment rounds.",
        link: "https://www.indiabix.com",
        difficultyOrTime: "3 times/week",
        skillsAcquired: ["Quantitative Aptitude", "Logical Reasoning", "Speed Math"],
        actionLabel: "Start Assessment Prep"
      }
    ],
    softSkills: [
      {
        id: "soft_1",
        title: "Technical Writing & Developer Communication",
        providerOrPlatform: "Google Technical Writing Course",
        description: "Master technical documentation, clear pull request descriptions, and effective engineering communications.",
        link: "https://developers.google.com/tech-writing",
        difficultyOrTime: "2 hours",
        skillsAcquired: ["Technical Writing", "PR Reviews", "Documentation"],
        actionLabel: "Read Guide"
      }
    ],
    resumeImprovements: [
      {
        id: "res_1",
        title: "Action-Verbs & Quantified Metrics Resume Optimization",
        providerOrPlatform: "ATS Checker / Resume Prep",
        description: "Rewrite resume project bullet points using action verbs and quantified outcomes (e.g. 'boosted query speed by 35%').",
        link: "https://www.google.com/search?q=ats+resume+tips",
        difficultyOrTime: "1 hour",
        skillsAcquired: ["ATS Optimization", "Impact Metrics", "Concise Formatting"],
        actionLabel: "Improve Resume"
      }
    ],
    interviewPrep: [
      {
        id: "int_1",
        title: "STAR Behavioral Interview Storybank",
        providerOrPlatform: "Behavioral Guide",
        description: "Formulate 5 stories using Situation, Task, Action, and Result (STAR) highlighting leadership, teamwork, and problem solving.",
        link: "https://www.google.com/search?q=star+interview+method",
        difficultyOrTime: "1 hour",
        skillsAcquired: ["STAR Methodology", "Behavioral Interviewing", "Communication"],
        actionLabel: "Prepare Answers"
      }
    ]
  };
}

  const generateIDP = async (studentProfile: StudentProfile) => {
    setIsLoading(true);
    setProfile(studentProfile);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-idp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentProfile),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setIdp(data);
    } catch (err: any) {
      console.warn("Generate IDP API error, generating intelligent client-side IDP:", err);
      const fallbackData = createClientFallbackIDP(studentProfile);
      setIdp(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setProfile(null);
    setIdp(null);
    setErrorMsg(null);
  };

  // IF NOT LOGGED IN -> Show Dedicated Standalone Login & Sign Up Page FIRST
  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // IF LOGGED IN -> Show Main Home Page & Workspace
  return (
    <div className="min-h-screen text-gray-100 relative pb-16 flex flex-col justify-between overflow-x-hidden font-sans bg-[#0f0d18]">
      {/* 3D Animated Video & Interactive Canvas Background */}
      <Background3DVideo />
      
      {/* Top Brand Logo / Banner */}
      <header className="border-b border-amber-500/20 bg-[#181427]/90 relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={resetAll}>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 group-hover:shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-all">
              <Compass size={18} />
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm tracking-tight block">IDP RECOMMENDER</span>
              <span className="text-[9px] font-mono text-amber-400 leading-none">AI CAREER PLANNING</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-project-overview-header"
              onClick={() => setShowOverview(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono text-amber-100 hover:text-white bg-[#0f0d18]/80 border border-amber-500/30 hover:border-amber-400 transition-colors cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)]"
            >
              <BookOpen size={13} className="text-amber-400" />
              <span>Project Abstract</span>
            </button>

            {/* User Profile Badge & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f0d18]/80 border border-amber-500/40 hover:border-amber-400 text-xs font-mono text-amber-100 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-gray-950 font-bold flex items-center justify-center text-[10px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-white max-w-[110px] truncate">{currentUser.name}</span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#181427] border border-amber-500/40 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn font-sans">
                  <div className="px-3 py-2 border-b border-amber-500/20 mb-1">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-amber-300/70 truncate font-mono">{currentUser.email}</p>
                    {currentUser.institution && (
                      <p className="text-[10px] text-amber-400 flex items-center gap-1 mt-1 font-mono">
                        <GraduationCap size={11} /> {currentUser.institution}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>

            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-pulse" title="System Online" />
          </div>
        </div>
      </header>



      {/* Main Container */}
      <main className="flex-grow flex flex-col justify-center py-6 relative z-10">
        {errorMsg && (
          <div className="max-w-md mx-auto px-4 py-8 text-center relative z-20">
            <div className="glass-panel p-6 rounded-2xl border-rose-500/30 bg-rose-950/10 shadow-[0_0_25px_rgba(244,63,94,0.1)]">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500 flex items-center justify-center text-rose-400 mx-auto mb-4">
                <AlertOctagon size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Advisory Generation Error</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 font-sans">
                {errorMsg}
              </p>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => profile && generateIDP(profile)}
                  className="w-full bg-gradient-to-r from-neon-blue to-blue-500 text-cyber-dark font-display font-semibold text-xs uppercase tracking-wider py-3 rounded-lg hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={14} /> Retry Generation
                </button>
                <button
                  onClick={resetAll}
                  className="w-full bg-cyber-dark/60 border border-neon-blue/10 hover:border-neon-blue/30 text-gray-400 hover:text-white font-mono text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Return to Profiler
                </button>
              </div>
            </div>
          </div>
        )}

        {!errorMsg && (
          <>
            {isLoading && <LoadingScreen />}
            {!isLoading && !idp && <StudentForm onSubmit={generateIDP} isLoading={isLoading} />}
            {!isLoading && idp && (
              <Dashboard 
                idp={idp} 
                onReset={resetAll} 
                onAskAiQuestion={(q) => setChatQuestion(q)} 
              />
            )}
          </>
        )}
      </main>

      {/* Footer Area */}
      <footer className="border-t border-neon-blue/5 bg-cyber-dark/40 py-6 text-center text-xs font-mono text-gray-600 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Intelligent IDP Recommender • Guided by Gemini AI</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Cpu size={12} className="text-neon-blue" /> v1.0.0 Stable
            </span>
            <span>•</span>
            <span className="text-gray-500 font-sans">Logged in as {currentUser.name}</span>
          </div>
        </div>
      </footer>

      {/* Project Abstract & Table of Contents Modal */}
      <ProjectOverview 
        isOpen={showOverview} 
        onClose={() => setShowOverview(false)} 
        hasIdp={!!idp} 
        onSelectSection={handleSelectSection} 
      />

      {/* Floating Gemini Chat Interface */}
      <IdpChat 
        idp={idp} 
        studentProfile={profile} 
        initialQuestion={chatQuestion}
        onClearInitialQuestion={() => setChatQuestion(null)}
      />
    </div>
  );
}
