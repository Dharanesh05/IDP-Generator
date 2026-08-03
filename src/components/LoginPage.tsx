import React, { useState } from "react";
import { User, AuthResponse } from "../types";
import Background3DVideo from "./Background3DVideo";
import {
  Compass,
  Mail,
  Lock,
  User as UserIcon,
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  LogIn,
  UserPlus,
  Cpu,
  Target,
  Award,
  Code2,
  Bot
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setInstitution("");
    setError(null);
    setSuccessMsg(null);
  };

  const handleSwitchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanInstitution = institution.trim() || "University Student";

    if (!cleanEmail || !password || (mode === "signup" && !cleanName)) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/signup";
      const payload =
        mode === "login"
          ? { email: cleanEmail, password }
          : { name: cleanName, email: cleanEmail, password, institution: cleanInstitution };

      let userToLogin: User | null = null;
      let responseSuccess = false;
      let responseMsg = "";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data: AuthResponse = await res.json().catch(() => ({ success: false }));
        if (res.ok && data.success && data.user) {
          userToLogin = data.user;
          responseSuccess = true;
          responseMsg = data.message || (mode === "login" ? "Login successful!" : "Account created successfully!");
        } else if (data.message) {
          responseMsg = data.message;
        }
      } catch (netErr) {
        console.warn("Backend API fetch error, using local auth storage fallback:", netErr);
      }

      // Local storage persistence fallback for accounts across sessions & serverless restarts
      const storedAccountsRaw = localStorage.getItem("idp_registered_accounts");
      let storedAccounts: any[] = [];
      try {
        storedAccounts = storedAccountsRaw ? JSON.parse(storedAccountsRaw) : [];
      } catch (e) {
        storedAccounts = [];
      }

      if (mode === "signup") {
        const existingLocal = storedAccounts.find((a) => a.email === cleanEmail);
        if (existingLocal && !responseSuccess) {
          throw new Error("An account with this email already exists. Please sign in instead.");
        }

        const newUser: User = userToLogin || {
          id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: cleanName,
          email: cleanEmail,
          institution: cleanInstitution,
          createdAt: new Date().toISOString(),
        };

        if (!existingLocal) {
          storedAccounts.push({
            ...newUser,
            password: password,
          });
          localStorage.setItem("idp_registered_accounts", JSON.stringify(storedAccounts));
        }

        userToLogin = newUser;
        setSuccessMsg(responseMsg || "Account created successfully! Redirecting...");
      } else {
        // Mode: Login
        if (!userToLogin) {
          const matchLocal = storedAccounts.find((a) => a.email === cleanEmail && a.password === password);
          if (matchLocal) {
            userToLogin = {
              id: matchLocal.id,
              name: matchLocal.name,
              email: matchLocal.email,
              institution: matchLocal.institution,
              createdAt: matchLocal.createdAt,
            };
          } else {
            throw new Error(responseMsg || "Invalid email or password. If you don't have an account yet, click 'Sign Up' to create one.");
          }
        }

        setSuccessMsg(responseMsg || "Login successful! Redirecting...");
      }

      if (userToLogin) {
        localStorage.setItem("idp_user_session", JSON.stringify(userToLogin));
        setTimeout(() => {
          onLoginSuccess(userToLogin!);
          resetForm();
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-gray-700", percent: 0 };
    if (password.length < 6) return { label: "Weak", color: "bg-rose-500", percent: 33 };
    if (password.length < 10 || !/\d/.test(password))
      return { label: "Medium", color: "bg-amber-500", percent: 66 };
    return { label: "Strong", color: "bg-emerald-500", percent: 100 };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen text-gray-100 relative flex flex-col justify-between overflow-x-hidden bg-[#0f0d18] font-sans">
      {/* Interactive 3D Video Background */}
      <Background3DVideo />

      {/* Top Navigation Header */}
      <header className="border-b border-amber-500/20 bg-[#181427]/90 relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.3)]">
              <Compass size={20} />
            </div>
            <div>
              <span className="font-display font-bold text-white text-base tracking-tight block">
                IDP RECOMMENDER
              </span>
              <span className="text-[10px] font-mono text-amber-400 leading-none">
                AI ADVISORY PLATFORM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.9)]" title="Authentication Portal Online" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center py-10 px-4 relative z-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Platform Features & Pitch */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>Next-Gen Career Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight">
              Craft Your Personalized <br />
              <span className="inline-block text-rainbow">
                Individual Development Plan
              </span>
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed">
              Log in to unlock AI-powered career roadmaps, structured certification tracks, GitHub portfolio projects, and direct advisory from Gemini AI.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#181427]/80 border border-amber-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Target size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display">Targeted Career Roles</h4>
                  <p className="text-[11px] text-amber-200/60 mt-0.5">Tailored industry positions matching your skills.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181427]/80 border border-rose-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <Award size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display">Certifications Track</h4>
                  <p className="text-[11px] text-rose-200/60 mt-0.5">Curated free & professional industry certificates.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181427]/80 border border-fuchsia-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0 mt-0.5">
                  <Code2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display">Portfolio Projects</h4>
                  <p className="text-[11px] text-fuchsia-200/60 mt-0.5">Real-world GitHub builds to stand out to recruiters.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181427]/80 border border-violet-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                  <Bot size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display">24/7 Gemini Advisory</h4>
                  <p className="text-[11px] text-violet-200/60 mt-0.5">Ask questions directly about your custom plan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#181427]/95 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden">
              {/* Glow accents */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Form Title */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-violet-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Cpu size={24} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                  {mode === "login" ? "Log In to System" : "Create Account"}
                </h2>
                <p className="text-xs font-mono text-amber-200/70 mt-1">
                  {mode === "login"
                    ? "Enter your credentials to access your IDP workspace"
                    : "Register to initialize your personalized career portal"}
                </p>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex bg-[#0f0d18] p-1.5 rounded-2xl border border-amber-500/20 mb-6">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("login")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === "login"
                      ? "bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-gray-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                      : "text-amber-200/70 hover:text-white"
                  }`}
                >
                  <LogIn size={14} /> Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("signup")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-gray-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                      : "text-amber-200/70 hover:text-white"
                  }`}
                >
                  <UserPlus size={14} /> Sign Up
                </button>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 animate-slideUp">
                  <AlertCircle size={16} className="shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-2.5 text-xs text-amber-300 animate-slideUp">
                  <CheckCircle2 size={16} className="shrink-0 text-amber-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-200/70 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon size={16} className="absolute left-3.5 top-3.5 text-amber-500/60" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0f0d18]/90 border border-amber-500/30 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-amber-700/50 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-200/70 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-amber-500/60" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0f0d18]/90 border border-amber-500/30 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-amber-700/50 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-200/70 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-amber-500/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#0f0d18]/90 border border-amber-500/30 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-amber-700/50 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-amber-400/60 hover:text-amber-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === "signup" && password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-amber-300/70">Strength:</span>
                        <span className={strength.color.replace("bg-", "text-")}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#0f0d18] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-200/70 mb-1.5">
                      University / Institution (Optional)
                    </label>
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3.5 top-3.5 text-amber-500/60" />
                      <input
                        type="text"
                        placeholder="e.g. Stanford University"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full bg-[#0f0d18]/90 border border-amber-500/30 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-amber-700/50 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-gray-950 font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.65)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === "login" ? "Sign In to Workspace" : "Create Account & Continue"}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 flex items-center justify-center gap-1.5 text-[10px] font-mono text-amber-400/60 border-t border-amber-500/20">
                <ShieldCheck size={12} className="text-amber-400" />
                <span>Protected by Intelligent IDP Auth Security</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 bg-[#0f0d18]/60 py-4 text-center text-xs font-mono text-amber-300/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Intelligent IDP Recommender System</p>
          <p className="text-[11px] text-amber-300/40">Please log in or sign up to access your career roadmap portal.</p>
        </div>
      </footer>
    </div>
  );
}
