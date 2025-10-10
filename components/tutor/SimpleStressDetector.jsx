"use client";

import React, { useEffect, useRef, useState } from "react";

const SimpleStressDetector = ({ onStressDetected, intervalMs = 2000, hidden = true }) => {
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const startDetection = () => {
      setIsActive(true);
      
      // Simulate realistic stress patterns
      const generateStressScore = () => {
        const time = Date.now() / 1000; // seconds
        const baseStress = 25; // Base stress level
        const timeVariation = Math.sin(time / 30) * 10; // Slow oscillation over 30 seconds
        const randomSpike = Math.random() < 0.1 ? Math.random() * 40 : 0; // 10% chance of stress spike
        const randomNoise = (Math.random() - 0.5) * 15; // Random variation
        
        const stressScore = Math.max(0, Math.min(100, 
          baseStress + timeVariation + randomSpike + randomNoise
        ));
        
        return Math.round(stressScore);
      };

      // Start detection loop
      intervalId = setInterval(() => {
        if (!isMounted) return;
        const stressScore = generateStressScore();
        onStressDetected && onStressDetected(stressScore);
      }, intervalMs);

      // Send initial reading
      const initialScore = generateStressScore();
      onStressDetected && onStressDetected(initialScore);
    };

    startDetection();

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [onStressDetected, intervalMs]);

  if (hidden) {
    return null; // Don't render anything if hidden
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        width: 220,
        height: 160,
        padding: 6,
        background: "rgba(0,0,0,0.4)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "14px",
        textAlign: "center",
      }}
    >
      <div>
        <div>🧠 Stress Monitor</div>
        <div style={{ fontSize: "12px", marginTop: "8px", opacity: 0.8 }}>
          {isActive ? "Simulated Mode" : "Inactive"}
        </div>
        {error && (
          <div style={{ fontSize: "10px", marginTop: "4px", color: "#ff6b6b" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleStressDetector;
