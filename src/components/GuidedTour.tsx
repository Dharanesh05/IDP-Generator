import React, { useEffect, useState, useRef } from "react";
import { HelpCircle, Sparkles, ChevronRight, ChevronLeft, X, Trophy, Check } from "lucide-react";

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  fallbackPosition: "top" | "bottom" | "center";
}

interface GuidedTourProps {
  steps: TourStep[];
  isActive: boolean;
  onClose: () => void;
}

export default function GuidedTour({ steps, isActive, onClose }: GuidedTourProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);

  const activeStep = steps[currentStepIdx];

  // Helper to find absolute position of target element
  useEffect(() => {
    if (!isActive || !activeStep) return;

    const updatePosition = () => {
      const element = document.getElementById(activeStep.targetId);
      
      if (!element) {
        // Fallback to center spotlight if element is missing or not active/rendered
        setHighlightStyle({
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "2px",
          height: "2px",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 0 9999px rgba(3, 7, 18, 0.85)",
          borderRadius: "50%",
          zIndex: 1000,
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        });

        setTooltipStyle({
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "min(400px, 90vw)",
          transition: "all 0.4s ease",
        });
        return;
      }

      // Scroll element into view smoothly if needed
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      // Small timeout to allow scrolling to complete before calculating client bounds
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const padding = 12;

        // Draw perfect high-contrast spotlight around target
        setHighlightStyle({
          position: "fixed",
          top: `${rect.top - padding}px`,
          left: `${rect.left - padding}px`,
          width: `${rect.width + padding * 2}px`,
          height: `${rect.height + padding * 2}px`,
          boxShadow: "0 0 0 9999px rgba(3, 7, 18, 0.85), 0 0 15px rgba(0, 242, 254, 0.4)",
          borderRadius: "16px",
          border: "2px solid rgba(0, 242, 254, 0.8)",
          pointerEvents: "none",
          zIndex: 999,
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        });

        // Smart tooltip positioner
        const tooltipWidth = 340;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let left = rect.left + rect.width / 2 - tooltipWidth / 2;
        let top = rect.bottom + 16;

        // Adjust horizontally if slipping off screen edges
        if (left < 16) left = 16;
        if (left + tooltipWidth > screenWidth - 16) {
          left = screenWidth - tooltipWidth - 16;
        }

        // Adjust vertically if off screen bottom
        if (top + 200 > screenHeight) {
          top = rect.top - 200; // Place above the target
        }
        if (top < 16) {
          top = 16;
        }

        setTooltipStyle({
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 1000,
          width: `${tooltipWidth}px`,
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        });
      }, 350);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isActive, currentStepIdx, activeStep]);

  if (!isActive) return null;

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-[998]">
      {/* Dynamic Dark Spotlight Backdrop overlay */}
      <div style={highlightStyle} />

      {/* Invisible interactive background block (stops clicking surrounding elements during tour) */}
      <div className="fixed inset-0 bg-transparent" />

      {/* Elegant Floating Tour Coach Card */}
      <div 
        ref={tooltipRef} 
        style={tooltipStyle}
        className="glass-panel p-5 rounded-2xl border-neon-blue/40 shadow-[0_10px_40px_rgba(0,242,254,0.15)] bg-cyber-dark/95 relative"
      >
        {/* Animated glowing top border indicator */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-pulse" />

        {/* Header step title */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neon-blue flex items-center gap-1">
            <Sparkles size={12} className="animate-spin-slow" />
            <span>Advisory Tour • Step {currentStepIdx + 1} of {steps.length}</span>
          </span>
          <button 
            id="tour-close-btn"
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 cursor-pointer"
            title="Exit Tour"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content body */}
        <div className="mb-5">
          <h4 className="font-display font-bold text-base text-white tracking-tight mb-1.5">
            {activeStep.title}
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            {activeStep.description}
          </p>
        </div>

        {/* Footer controls layout */}
        <div className="flex items-center justify-between pt-3 border-t border-neon-blue/10">
          <button
            onClick={onClose}
            className="text-[11px] font-mono text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStepIdx > 0 && (
              <button
                id="tour-prev-btn"
                onClick={handleBack}
                className="px-2.5 py-1.5 rounded-lg border border-neon-blue/15 bg-cyber-dark text-gray-300 hover:text-white hover:border-neon-blue/40 transition-all text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={12} />
                <span>Back</span>
              </button>
            )}

            <button
              id="tour-next-btn"
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-neon-blue to-blue-500 text-cyber-dark font-display font-semibold hover:shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>{currentStepIdx === steps.length - 1 ? "Finish Tour" : "Next"}</span>
              {currentStepIdx === steps.length - 1 ? (
                <Check size={12} className="stroke-[2.5]" />
              ) : (
                <ChevronRight size={12} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
