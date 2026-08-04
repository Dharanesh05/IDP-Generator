import React, { useRef, useEffect } from "react";

export default function Background3DVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let isReversing = false;
    let lastTime: number | null = null;

    const stepReverse = (now: number) => {
      if (!isReversing || !video) return;

      if (lastTime !== null) {
        const delta = (now - lastTime) / 1000;
        const nextTime = video.currentTime - delta;

        if (nextTime <= 0) {
          video.currentTime = 0;
          isReversing = false;
          video.play().catch(() => {});
          return;
        } else {
          video.currentTime = nextTime;
        }
      }

      lastTime = now;
      animationFrameId = requestAnimationFrame(stepReverse);
    };

    const handleEnded = () => {
      isReversing = true;
      video.pause();
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(stepReverse);
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0e17]">
      {/* Seamless forward & reverse loop background video */}
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

