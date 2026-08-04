import React, { useRef, useEffect } from "react";

export default function Background3DVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animId: number;
    let lastTime: number | null = null;
    let isReversing = false;

    const handleEnded = () => {
      if (isReversing) return;
      isReversing = true;
      video.pause();
      lastTime = performance.now();
      animId = requestAnimationFrame(stepReverse);
    };

    const stepReverse = (timestamp: number) => {
      if (!isReversing || !video) return;

      if (lastTime !== null) {
        const delta = (timestamp - lastTime) / 1000;
        const newTime = video.currentTime - delta;

        if (newTime <= 0.05) {
          video.currentTime = 0;
          isReversing = false;
          lastTime = null;
          video.play().catch(() => {});
          return;
        } else {
          video.currentTime = newTime;
        }
      }

      lastTime = timestamp;
      animId = requestAnimationFrame(stepReverse);
    };

    const handleTimeUpdate = () => {
      if (!isReversing && video.duration && video.currentTime >= video.duration - 0.08) {
        handleEnded();
      }
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0e17]">
      {/* Direct Background Video with smooth forward & reverse boomerang loop */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-130 transform origin-top-left"
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

