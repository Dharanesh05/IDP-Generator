import React, { useState } from "react";
import { User, AuthResponse } from "../types";
import {
  X,
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
  UserPlus
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "login" | "signup";
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({
  isOpen,
  initialMode = "login",
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "alex@example.com", password: "password123" }),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok || !data.success || !data.user) {
        throw new Error(data.message || "Failed to log in with demo account.");
      }
      localStorage.setItem("idp_user_session", JSON.stringify(data.user));
      setSuccessMsg("Logged in with Demo Account!");
      setTimeout(() => {
        onSuccess(data.user!);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Network error during demo login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const endpoint = mode === "login" ? "/api/login" : "/api/signup";
    const payload =
      mode === "login"
        ? { email, password }
        : { name, email, password, institution };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success || !data.user) {
        throw new Error(data.message || `Failed to ${mode === "login" ? "log in" : "sign up"}.`);
      }

      localStorage.setItem("idp_user_session", JSON.stringify(data.user));
      setSuccessMsg(data.message || `${mode === "login" ? "Welcome back!" : "Account created successfully!"}`);

      setTimeout(() => {
        onSuccess(data.user!);
        onClose();
        resetForm();
      }, 700);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password Strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-gray-700", percent: 0 };
    if (password.length < 6) return { label: "Weak", color: "bg-rose-500", percent: 33 };
    if (password.length < 10 || !/\d/.test(password))
      return { label: "Medium", color: "bg-amber-500", percent: 66 };
    return { label: "Strong", color: "bg-emerald-500", percent: 100 };
  };

  const strength = getPasswordStrength();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f172a]/95 border border-neon-blue/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,242,254,0.2)] overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-neon-blue/50 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-neon-blue/20 to-blue-500/20 border border-neon-blue/40 flex items-center justify-center mx-auto mb-3 text-neon-blue shadow-[0_0_20px_rgba(0,242,254,0.3)]">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs font-mono text-gray-400 mt-1">
            {mode === "login"
              ? "Access your saved IDPs & AI Advisory History"
              : "Start building your AI-driven career roadmap"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-900/80 p-1 rounded-xl border border-gray-800 mb-6">
          <button
            type="button"
            onClick={() => handleSwitchMode("login")}
            className={`flex-1 py-2 rounded-lg text-xs font-display font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "login"
                ? "bg-gradient-to-r from-neon-blue to-blue-600 text-cyber-dark shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LogIn size={14} /> Log In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("signup")}
            className={`flex-1 py-2 rounded-lg text-xs font-display font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "signup"
                ? "bg-gradient-to-r from-neon-blue to-blue-600 text-cyber-dark shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UserPlus size={14} /> Sign Up
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 animate-slideUp">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 animate-slideUp">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-cyber-dark/80 border border-gray-700 focus:border-neon-blue rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cyber-dark/80 border border-gray-700 focus:border-neon-blue rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cyber-dark/80 border border-gray-700 focus:border-neon-blue rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === "signup" && password && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-400">Strength:</span>
                  <span className={strength.color.replace("bg-", "text-")}>
                    {strength.label}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
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
              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                University / Institution (Optional)
              </label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g. Stanford University"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-cyber-dark/80 border border-gray-700 focus:border-neon-blue rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-neon-blue to-blue-600 text-cyber-dark font-display font-semibold text-xs uppercase tracking-wider py-3 rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === "login" ? "Sign In to Account" : "Create Account"}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-5 border-t border-gray-800/80 text-center">
          <p className="text-[11px] text-gray-400 font-mono mb-2.5">
            Testing out the system? Use instant demo access:
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-gray-800/60 border border-gray-700 hover:border-neon-blue/40 text-gray-300 hover:text-white font-mono text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            <Zap size={14} className="text-amber-400" />
            <span>Instant Demo Login (Alex Vance)</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-mono text-gray-500">
          <ShieldCheck size={12} className="text-emerald-400" />
          <span>Encrypted Session • Privacy Protected</span>
        </div>
      </div>
    </div>
  );
}
