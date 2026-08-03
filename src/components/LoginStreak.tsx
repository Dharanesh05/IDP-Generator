import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  Check, 
  Sparkles, 
  Clock, 
  Calendar, 
  Trophy,
  Award,
  Zap
} from "lucide-react";

export default function LoginStreak() {
  const [streak, setStreak] = useState<number>(0);
  const [lastClaimDate, setLastClaimDate] = useState<string>("");
  const [claimedDates, setClaimedDates] = useState<string[]>([]);
  const [totalClaims, setTotalClaims] = useState<number>(0);
  const [streakPoints, setStreakPoints] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [floatingText, setFloatingText] = useState<string | null>(null);

  // en-CA gives YYYY-MM-DD reliably
  const getTodayStr = () => new Date().toLocaleDateString("en-CA");
  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString("en-CA");
  };

  useEffect(() => {
    try {
      const storedStreak = localStorage.getItem("idp_streak_count_v1");
      const storedLastClaim = localStorage.getItem("idp_streak_last_claim_v1");
      const storedClaimedDates = localStorage.getItem("idp_streak_claimed_dates_v1");
      const storedTotalClaims = localStorage.getItem("idp_streak_total_claims_v1");
      const storedPoints = localStorage.getItem("idp_streak_points_v1");

      const today = getTodayStr();
      const yesterday = getYesterdayStr();

      let currentStreak = storedStreak ? parseInt(storedStreak, 10) : 0;
      let lastClaim = storedLastClaim || "";
      let claimsList: string[] = storedClaimedDates ? JSON.parse(storedClaimedDates) : [];
      let total = storedTotalClaims ? parseInt(storedTotalClaims, 10) : 0;
      let points = storedPoints ? parseInt(storedPoints, 10) : 0;

      // Automatically check for broken streak
      if (lastClaim && lastClaim !== today && lastClaim !== yesterday) {
        // More than 1 day missed, reset streak to 0 (but keep other historic stats intact)
        currentStreak = 0;
        localStorage.setItem("idp_streak_count_v1", "0");
      }

      setStreak(currentStreak);
      setLastClaimDate(lastClaim);
      setClaimedDates(claimsList);
      setTotalClaims(total);
      setStreakPoints(points);
    } catch (e) {
      console.error("Failed to load streak statistics", e);
    }
  }, []);

  const hasClaimedToday = useMemo(() => {
    return lastClaimDate === getTodayStr();
  }, [lastClaimDate]);

  // Generate the 7 days of the current week (Monday - Sunday)
  const weekDays = useMemo(() => {
    const current = new Date();
    const day = current.getDay();
    // Adjust monday start offset
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const days = [];
    const todayStr = getTodayStr();

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toLocaleDateString("en-CA");
      days.push({
        name: d.toLocaleDateString("en-US", { weekday: "short" }), // Mon, Tue
        dateStr: dStr,
        dayOfMonth: d.getDate(),
        isToday: dStr === todayStr,
        isClaimed: claimedDates.includes(dStr),
      });
    }
    return days;
  }, [claimedDates]);

  const handleClaim = () => {
    if (hasClaimedToday) return;

    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    let newStreak = streak;
    if (lastClaimDate === yesterday) {
      newStreak += 1;
    } else {
      // First claim or broken streak
      newStreak = 1;
    }

    const newClaimedDates = [...claimedDates, today];
    const newTotalClaims = totalClaims + 1;
    
    // Earn 50 Base points + 10 points bonus per streak day
    const pointsEarned = 50 + (newStreak * 10);
    const newPoints = streakPoints + pointsEarned;

    setStreak(newStreak);
    setLastClaimDate(today);
    setClaimedDates(newClaimedDates);
    setTotalClaims(newTotalClaims);
    setStreakPoints(newPoints);

    try {
      localStorage.setItem("idp_streak_count_v1", newStreak.toString());
      localStorage.setItem("idp_streak_last_claim_v1", today);
      localStorage.setItem("idp_streak_claimed_dates_v1", JSON.stringify(newClaimedDates));
      localStorage.setItem("idp_streak_total_claims_v1", newTotalClaims.toString());
      localStorage.setItem("idp_streak_points_v1", newPoints.toString());
    } catch (e) {
      console.error("Failed to save updated streak data", e);
    }

    // Interactive VFX triggers
    setFloatingText(`+${pointsEarned} Career XP!`);
    setShowCelebration(true);

    // Audio cue (optional, using default browser oscillators for premium, dependency-free sci-fi audio!)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(1174.66, audioCtx.currentTime + 0.3); // D6
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (_) {}

    setTimeout(() => {
      setFloatingText(null);
    }, 2200);

    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  return (
    <div 
      id="idp-login-streak" 
      className="glass-panel p-5 rounded-2xl border border-neon-blue/20 bg-cyber-dark/40 relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background ambient neon flare */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Floating XP Award text */}
      <AnimatePresence>
        {floatingText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1.1 }}
            exit={{ opacity: 0, y: -70, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 z-30 font-mono font-bold text-xs bg-neon-blue text-cyber-dark px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,242,254,0.4)] flex items-center gap-1"
          >
            <Sparkles size={12} className="animate-pulse" />
            {floatingText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with streak count */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
            <Flame 
              size={18} 
              className={`${streak > 0 ? "text-orange-400 animate-bounce" : "text-gray-500"} transition-colors`} 
            />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-gray-300 tracking-wide uppercase">
              Daily Login Streak
            </h3>
            <p className="text-[10px] font-mono text-gray-500">
              Claim daily attendance to boost XP
            </p>
          </div>
        </div>

        {/* Current streak indicator pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyber-dark border border-neon-blue/20">
          <Flame size={14} className="text-orange-400" />
          <span className="text-xs font-mono font-bold text-white">
            {streak} {streak === 1 ? "Day" : "Days"}
          </span>
        </div>
      </div>

      {/* 7-day calendar strip */}
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {weekDays.map((day) => {
          const isActive = day.isClaimed;
          return (
            <div 
              key={day.dateStr}
              className={`flex flex-col items-center p-1.5 rounded-xl border transition-all duration-300 relative ${
                day.isToday 
                  ? "border-neon-blue bg-neon-blue/5 shadow-[0_0_8px_rgba(0,242,254,0.1)]" 
                  : isActive
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-cyber-dark bg-cyber-dark/30"
              }`}
            >
              <span className={`text-[9px] font-mono font-medium ${
                day.isToday ? "text-neon-blue font-bold" : isActive ? "text-emerald-400" : "text-gray-500"
              }`}>
                {day.name}
              </span>
              
              <div className={`w-6 h-6 rounded-full my-1.5 flex items-center justify-center transition-all ${
                isActive 
                  ? "bg-emerald-500/10 border border-emerald-500 text-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.2)]" 
                  : day.isToday
                    ? "bg-neon-blue/10 border border-neon-blue/40 text-neon-blue animate-pulse"
                    : "bg-cyber-dark border border-gray-800 text-gray-600"
              }`}>
                {isActive ? (
                  <Check size={10} strokeWidth={3} />
                ) : (
                  <span className="text-[10px] font-mono font-bold">{day.dayOfMonth}</span>
                )}
              </div>

              {day.isToday && !isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-neon-blue rounded-full animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Action claim button */}
      <div className="space-y-3">
        <button
          onClick={handleClaim}
          disabled={hasClaimedToday}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all relative overflow-hidden flex items-center justify-center gap-2 group cursor-pointer ${
            hasClaimedToday
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-not-allowed"
              : "bg-neon-blue text-cyber-dark hover:bg-white border border-transparent shadow-[0_0_15px_rgba(0,242,254,0.15)] hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] active:scale-98"
          }`}
        >
          {hasClaimedToday ? (
            <>
              <Check size={14} className="shrink-0 animate-scale-in" />
              <span>Checked In Today (+Active)</span>
            </>
          ) : (
            <>
              <Zap size={14} className="shrink-0 animate-pulse group-hover:scale-125 transition-transform" />
              <span>Claim Today's Attendance</span>
            </>
          )}

          {/* Premium gloss animation on active button */}
          {!hasClaimedToday && (
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
          )}
        </button>

        {/* Small stats summary */}
        <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 px-1 border-t border-gray-800/40 pt-2.5">
          <span className="flex items-center gap-1">
            <Trophy size={10} className="text-amber-500" />
            Total Attendance: <strong className="text-gray-300">{totalClaims}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Award size={10} className="text-neon-blue" />
            Gained XP: <strong className="text-gray-300">{streakPoints}</strong>
          </span>
        </div>
      </div>

      {/* Celebration sparkles overlay overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neon-blue/5 pointer-events-none z-20 flex items-center justify-center"
          >
            <div className="absolute inset-0 border border-neon-blue animate-pulse opacity-50" />
            {/* Sparkle emitters */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1.2, 0], 
                  x: [(Math.random() - 0.5) * 160, (Math.random() - 0.5) * 260],
                  y: [(Math.random() - 0.5) * 120, (Math.random() - 0.5) * 200]
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute text-orange-400"
              >
                <Sparkles size={16} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
