import React from "react";

export default function Background3DVideo() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0e17]">
      {/* 100% Smooth GPU-Accelerated Ping-Pong (Forward + Reverse) Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-130 transform origin-top-left"
      >
        <source src="/background-video-pingpong.mp4" type="video/mp4" />
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}


