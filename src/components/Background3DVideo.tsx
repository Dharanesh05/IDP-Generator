import React from "react";

export default function Background3DVideo() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0e17]">
      {/* 8K Ultra-HD GPU-Accelerated Ping-Pong Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-125 transform origin-top-left contrast-[1.05] brightness-[0.95] saturate-[1.1] will-change-transform image-rendering-crisp"
        style={{
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <source src="/background-video-pingpong-8k.mp4" type="video/mp4" />
        <source src="/background-video-pingpong.mp4" type="video/mp4" />
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
      {/* 8K Ambient Depth Grid & Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-vignette opacity-40 mix-blend-overlay pointer-events-none"></div>
    </div>
  );
}


