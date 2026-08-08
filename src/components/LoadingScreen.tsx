import { useEffect, useState } from "react";
import { Cpu, Server, Sparkles, Binary, CheckCircle } from "lucide-react";

const LOADING_STEPS = [
  "Initializing individual career mapper...",
  "Structuring curriculum parameters for study path...",
  "Querying Google Gemini Pro for personalized certifications...",
  "Parsing code repositories for bespoke project outlines...",
  "Optimizing interview modules & quantitative aptitude modules...",
  "Injecting high-performance glassmorphism viewport panels...",
  "Compiling tailored Individual Development Plan (IDP)..."
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Progressively show simulation logs matching technical steps
    const logInterval = setInterval(() => {
      if (currentStep < LOADING_STEPS.length) {
        setLogs((prev) => [...prev, LOADING_STEPS[currentStep]]);
        setCurrentStep((prev) => prev + 1);
      }
    }, 600);

    return () => clearInterval(logInterval);
  }, [currentStep]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative z-10" id="loading-screen">
      <div className="max-w-md w-full glass-panel rounded-2xl p-8 border-gray-800 relative text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#161b22] border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Cpu className="animate-spin" size={20} />
        </div>

        <h2 className="font-display font-bold text-2xl text-white mt-4 mb-2">
          Generating Your Custom IDP
        </h2>
        <p className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-wider">
          Invoking Gemini-3.5-Flash
        </p>

        {/* Progress bar */}
        <div className="w-full bg-cyber-dark/80 rounded-full h-1.5 border border-neon-blue/10 overflow-hidden mb-6">
          <div 
            className="bg-gradient-to-r from-neon-blue to-blue-500 h-full transition-all duration-1000 ease-out shadow-[0_0_8px_#00f2fe]"
            style={{ width: `${Math.min(100, ((currentStep + 1) / (LOADING_STEPS.length + 1)) * 100)}%` }}
          />
        </div>

        {/* Cyber Logs list */}
        <div className="text-left bg-cyber-dark/90 rounded-xl p-4 border border-neon-blue/15 font-mono text-xs text-gray-400 space-y-2 max-h-48 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-neon-blue/70">
            <Binary size={12} className="animate-pulse" />
            <span>[info] established secure connection to server</span>
          </div>
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-1.5 text-gray-300">
              <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>{log}</span>
            </div>
          ))}
          {currentStep < LOADING_STEPS.length && (
            <div className="flex items-center gap-1.5 text-neon-blue animate-pulse pl-1">
              <span className="w-1.5 h-3 bg-neon-blue inline-block"></span>
              <span>Thinking...</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs font-mono text-gray-500">
          <span className="flex items-center gap-1">
            <Server size={12} /> Cloud Run Sandbox
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-neon-blue" /> Zero-friction OAuth config
          </span>
        </div>
      </div>
    </div>
  );
}
