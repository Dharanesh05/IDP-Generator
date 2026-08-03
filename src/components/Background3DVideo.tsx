import React from "react";

export default function Background3DVideo() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0e17]">
      {/* Direct Background Video cleanly without cursor movement or blur filters */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-130 transform origin-top-left"
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
