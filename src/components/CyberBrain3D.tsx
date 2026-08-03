import React, { useState, useRef, useEffect } from "react";
import { Cpu, Zap, Activity, Eye, RefreshCw, Sparkles, Layers } from "lucide-react";

interface CyberBrain3DProps {
  className?: string;
  showControls?: boolean;
}

export default function CyberBrain3D({ className = "", showControls = true }: CyberBrain3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isSurging, setIsSurging] = useState(false);
  const [flowSpeed, setFlowSpeed] = useState<"normal" | "fast" | "turbo">("normal");
  const [activeTab, setActiveTab] = useState<"neural" | "circuits" | "data">("neural");

  // Mouse move 3D tilt effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation degrees (capped at 15 degrees max)
    const rotateY = (mouseX / (rect.width / 2)) * 14;
    const rotateX = -(mouseY / (rect.height / 2)) * 14;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const triggerNeuralSurge = () => {
    setIsSurging(true);
    setTimeout(() => setIsSurging(false), 2500);
  };

  // Speed multiplier for CSS animation
  const speedClass = 
    flowSpeed === "turbo" ? "duration-500" :
    flowSpeed === "fast" ? "duration-1000" : "duration-2000";

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Container with Perspective */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-2xl aspect-[16/9] sm:aspect-[21/9] rounded-2xl p-1 group cursor-pointer select-none transition-transform duration-200 ease-out"
        style={{
          perspective: "1000px",
        }}
      >
        {/* Outer Glowing Hologram Boundary Frame */}
        <div 
          className="relative w-full h-full rounded-2xl overflow-hidden bg-cyber-dark/80 border border-cyan-500/30 group-hover:border-cyan-400/60 shadow-[0_0_30px_rgba(0,242,254,0.15)] group-hover:shadow-[0_0_50px_rgba(0,242,254,0.35)] transition-all duration-300"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(10px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Cybernetic Tech Grid Floor in 3D */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.12)_0%,rgba(13,17,23,0.95)_75%)] pointer-events-none" />

          {/* Holographic Vertical Laser Scanner Line */}
          <div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f2fe] z-20 pointer-events-none animate-scan-beam"
            style={{ animationDuration: isSurging ? "1.2s" : "3.5s" }}
          />

          {/* MAIN CYBER BRAIN IMAGE with Background Removal via Mix Blend & Radial Mask */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img 
              src="/cyber_brain.png" 
              alt="3D Glowing Cybernetic Neural Brain"
              className={`w-full h-full object-cover mix-blend-screen opacity-90 transition-all duration-500 ${
                isSurging ? "scale-105 filter brightness-125 contrast-125 blur-0" : "scale-100 group-hover:scale-105"
              }`}
              style={{
                maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
                WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
              }}
            />

            {/* OVERLAY SVG: FLOWING CIRCUIT LINES & NEURAL PATHWAYS */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-10" 
              viewBox="0 0 800 400"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Neon Cyan Gradient */}
                <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#00f2fe" stopOpacity="1" />
                  <stop offset="100%" stopColor="#4facfe" stopOpacity="0.2" />
                </linearGradient>

                {/* Neon Magenta Gradient */}
                <linearGradient id="neonMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#f43f5e" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                </linearGradient>

                {/* Glowing Particle Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* FLOWING LINE 1: Left Input Neural Circuit */}
              <path 
                d="M 50,200 L 180,200 L 250,150 L 320,150 L 380,180" 
                fill="none" 
                stroke="url(#neonCyan)" 
                strokeWidth="2.5" 
                strokeDasharray="12 6"
                filter="url(#glow)"
                className="animate-circuit-flow"
                style={{ animationDuration: isSurging ? "0.8s" : "2s" }}
              />

              {/* FLOWING LINE 2: Right Output Neural Circuit */}
              <path 
                d="M 420,180 L 480,150 L 550,150 L 620,200 L 750,200" 
                fill="none" 
                stroke="url(#neonCyan)" 
                strokeWidth="2.5" 
                strokeDasharray="12 6"
                filter="url(#glow)"
                className="animate-circuit-flow-reverse"
                style={{ animationDuration: isSurging ? "0.8s" : "2.2s" }}
              />

              {/* FLOWING LINE 3: Top Brain Crown Hemisphere Arc */}
              <path 
                d="M 220,160 Q 400,40 580,160" 
                fill="none" 
                stroke="url(#neonMagenta)" 
                strokeWidth="3" 
                strokeDasharray="15 8"
                filter="url(#glow)"
                className="animate-circuit-flow"
                style={{ animationDuration: isSurging ? "1s" : "2.5s" }}
              />

              {/* FLOWING LINE 4: Bottom Synapse Stream */}
              <path 
                d="M 240,240 Q 400,360 560,240" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2" 
                strokeDasharray="10 5"
                filter="url(#glow)"
                className="animate-circuit-flow-reverse"
                style={{ animationDuration: isSurging ? "1.2s" : "3s" }}
              />

              {/* FLOWING LINE 5: Complex Intersecting Core Circuit Paths */}
              <path 
                d="M 280,120 L 340,180 L 340,240 L 400,280 L 460,240 L 460,180 L 520,120" 
                fill="none" 
                stroke="#00f2fe" 
                strokeWidth="1.8" 
                strokeDasharray="8 4"
                className="animate-circuit-flow"
                style={{ animationDuration: isSurging ? "0.6s" : "1.8s" }}
              />

              {/* PULSING NEURAL NODES (3D glowing junction points) */}
              {[
                { x: 180, y: 200, color: "#00f2fe" },
                { x: 250, y: 150, color: "#ec4899" },
                { x: 380, y: 180, color: "#00f2fe" },
                { x: 420, y: 180, color: "#10b981" },
                { x: 550, y: 150, color: "#ec4899" },
                { x: 620, y: 200, color: "#00f2fe" },
                { x: 400, y: 100, color: "#f43f5e" },
                { x: 400, y: 300, color: "#10b981" },
              ].map((node, i) => (
                <g key={i}>
                  {/* Pulse Ring */}
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="8" 
                    fill="none" 
                    stroke={node.color} 
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                    style={{ animationDuration: `${1.5 + (i % 3) * 0.5}s` }}
                  />
                  {/* Solid Center */}
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="3.5" 
                    fill={node.color} 
                    filter="url(#glow)"
                  />
                </g>
              ))}

              {/* FLOATING BINARY DATA STREAMS ALONG THE LINES */}
              <text x="70" y="190" fill="#00f2fe" fontSize="10" fontFamily="monospace" opacity="0.8" className="animate-pulse">
                1010110
              </text>
              <text x="650" y="190" fill="#ec4899" fontSize="10" fontFamily="monospace" opacity="0.8" className="animate-pulse">
                0100101
              </text>
              <text x="360" y="80" fill="#10b981" fontSize="10" fontFamily="monospace" opacity="0.9">
                SYNAPSE_IDP_v2.5
              </text>
              <text x="360" y="330" fill="#00f2fe" fontSize="10" fontFamily="monospace" opacity="0.9">
                NEURAL_LINK_ACTIVE
              </text>
            </svg>

            {/* Floating 3D Corner Tech Badges */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cyber-dark/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 backdrop-blur-md z-20">
              <Cpu size={12} className="animate-spin text-cyan-400" style={{ animationDuration: '4s' }} />
              <span>3D NEURAL CORE: ONLINE</span>
            </div>

            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-cyber-dark/80 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 backdrop-blur-md z-20">
              <Activity size={12} className="animate-pulse text-emerald-400" />
              <span>SIGNAL FLOW: {isSurging ? "HIGH SURGE (100 GB/s)" : "OPTIMAL (45 GB/s)"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      {showControls && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 relative z-20">
          {/* Neural Surge Button */}
          <button
            type="button"
            onClick={triggerNeuralSurge}
            disabled={isSurging}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
              isSurging
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/40 animate-pulse"
                : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 shadow-cyan-500/10"
            }`}
          >
            <Zap size={14} className={isSurging ? "animate-bounce" : "text-cyan-400"} />
            <span>{isSurging ? "Neural Surge Active!" : "Trigger 3D Signal Surge"}</span>
          </button>

          {/* Flow Speed Selector */}
          <div className="inline-flex items-center gap-1 p-1 bg-cyber-dark/80 border border-gray-800 rounded-xl backdrop-blur-md text-xs font-mono">
            <span className="px-2 text-gray-400 text-[11px] flex items-center gap-1">
              <Sparkles size={11} className="text-cyan-400" /> Speed:
            </span>
            {(["normal", "fast", "turbo"] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setFlowSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg text-[11px] uppercase transition-colors cursor-pointer ${
                  flowSpeed === spd
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {spd}
              </button>
            ))}
          </div>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={() => setRotation({ x: 0, y: 0 })}
            className="px-3 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white bg-gray-800/60 border border-gray-700 hover:border-gray-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset 3D Angle"
          >
            <RefreshCw size={13} />
            <span>Center 3D View</span>
          </button>
        </div>
      )}
    </div>
  );
}
