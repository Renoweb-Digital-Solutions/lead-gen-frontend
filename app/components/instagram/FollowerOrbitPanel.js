"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { Users, Loader2, CheckCircle2 } from "lucide-react";

const MAX_VISIBLE = 30;

const getRandomInitial = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

const getAvatarConfig = (i, f) => {
  let ringIndex = 0;
  let avatarsInRing = 6;
  let baseR = 70;
  
  if (i >= 6 && i < 16) {
    ringIndex = 1;
    avatarsInRing = 10;
    baseR = 120;
  } else if (i >= 16) {
    ringIndex = 2;
    avatarsInRing = 14;
    baseR = 170;
  }
  
  const indexInRing = i - (ringIndex === 0 ? 0 : ringIndex === 1 ? 6 : 16);
  const angleDeg = (indexInRing / avatarsInRing) * 360;
  
  const colors = [
    "bg-pink-500", "bg-purple-500", "bg-fuchsia-500", 
    "bg-rose-500", "bg-orange-400"
  ];
  
  const name = f?.username || "?";
  const initial = name !== "?" ? name.charAt(0).toUpperCase() : getRandomInitial();

  return {
    id: f?.username && f.username !== "?" ? `avatar-${f.username}-${i}` : `avatar-mock-${i}`,
    initial,
    ringIndex,
    radius: baseR,
    angleDeg,
    colorClass: colors[i % colors.length]
  };
};

const RotatingRing = ({ ringRadius, ringIndex, speedRef, status, avatars }) => {
  const rotation = useMotionValue(0);
  
  useAnimationFrame((time, delta) => {
    let baseSpeed = 8; 
    if (status === 'scanning') baseSpeed = 25;
    else if (status === 'complete') baseSpeed = 3;
    
    // adjust for ring size (inner faster, outer slower)
    const ringMultiplier = 1 - (ringIndex * 0.2); 
    const currentSpeed = baseSpeed * speedRef.current * ringMultiplier;
    
    rotation.set(rotation.get() + currentSpeed * (delta / 1000));
  });

  const counterRotation = useTransform(rotation, r => -r);

  // 4 ghost dots for ambient life
  const ghosts = Array.from({ length: 4 });

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 rounded-full border border-pink-300/20 border-dashed"
      style={{
        width: ringRadius * 2,
        height: ringRadius * 2,
        x: "-50%",
        y: "-50%",
        rotate: rotation,
        opacity: (status === 'idle') ? 0.3 : 0.8
      }}
    >
      {/* Ambient Ghost Dots */}
      {ghosts.map((_, i) => {
        const offsetAngle = (i / 4) * 360 + (ringIndex * 30);
        return (
          <div
            key={`ghost-${i}`}
            className="absolute top-1/2 left-1/2"
            style={{ 
              width: 0, height: 0, 
              transform: `rotate(${offsetAngle}deg)` 
            }}
          >
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-pink-400/40"
              style={{
                left: ringRadius,
                top: 0,
                transform: "translate(-50%, -50%)"
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.75, // staggered timing
                ease: "easeInOut"
              }}
            />
          </div>
        );
      })}

      {/* Solid Avatars */}
      {avatars.map((f, i) => (
        <div 
          key={f.id} 
          className="absolute top-1/2 left-1/2"
          style={{ 
            width: 0, height: 0, 
            transform: `rotate(${f.angleDeg}deg)` 
          }}
        >
          {/* Avatar scale pop-in */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute"
            style={{
              left: ringRadius,
              top: 0,
              transform: "translate(-50%, -50%)"
            }}
          >
            {/* Counter-rotate to keep text upright */}
            <motion.div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-md border-2 border-white ${f.colorClass}`}
              style={{ rotate: counterRotation }}
            >
              {f.initial}
            </motion.div>
          </motion.div>

          {/* Connection Line when spawned */}
          {status === 'scanning' && f.isNew && (
            <motion.div
              className="absolute left-0 top-[50%] h-[1px] bg-gradient-to-r from-pink-400 to-transparent origin-left"
              style={{ width: ringRadius, transform: 'translateY(-50%)' }}
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default function FollowerOrbitPanel({ status, targetUrl, followers = [] }) {
  const speedRef = useRef(1);
  const [simulatedCount, setSimulatedCount] = useState(0);
  const [simulatedFollowers, setSimulatedFollowers] = useState([]);

  // Status text mapping - Instagram Vibe
  const statusConfig = {
    idle: { text: "AWAITING TARGET PROFILE...", icon: <Users className="w-4 h-4 text-gray-400" />, color: "text-gray-500" },
    locked: { text: "TARGET LOCKED — READY TO SCAN", icon: <CheckCircle2 className="w-4 h-4 text-pink-600" />, color: "text-pink-600" },
    scanning: { text: "EXTRACTING FOLLOWERS...", icon: <Loader2 className="w-4 h-4 text-fuchsia-500 animate-spin" />, color: "text-fuchsia-500" },
    complete: { text: "EXTRACTION COMPLETE", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, color: "text-emerald-600" }
  };

  const currentStatus = statusConfig[status] || statusConfig.idle;

  // Orbit / Spawning logic (Simulation)
  useEffect(() => {
    if (status === 'scanning') {
      const startTime = Date.now();
      let lastSpawnTime = startTime;
      let frameId;
      
      const loop = () => {
        const now = Date.now();
        const elapsedSec = (now - startTime) / 1000;
        
        // Speed ramps up by 60% over 6 seconds
        speedRef.current = 1 + (Math.min(elapsedSec, 6) / 6) * 0.6;
        
        // Base spawn interval 450ms, decreases as speed goes up
        const currentInterval = 450 / speedRef.current;
        
        // --- NOTE ON API WIRING ---
        // This simulation currently generates mock followers incrementally because the backend 
        // endpoint returns all data at once at the very end (when status changes to 'complete').
        // If the backend is updated to stream data via SSE/WebSockets, this block should be 
        // replaced by simply mapping the real streamed data from the `followers` prop.
        
        if (now - lastSpawnTime >= currentInterval) {
          setSimulatedFollowers(prev => {
            if (prev.length >= MAX_VISIBLE) return prev;
            const newF = getAvatarConfig(prev.length, { username: "?" });
            newF.isNew = true; 
            
            const updatedPrev = prev.map(p => ({ ...p, isNew: false }));
            return [...updatedPrev, newF];
          });
          // Update counter with an occasional batch jump to make it look realistic and fast
          setSimulatedCount(prev => prev + Math.floor(Math.random() * 4) + 1);
          lastSpawnTime = now;
        }
        
        frameId = requestAnimationFrame(loop);
      };
      
      frameId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(frameId);
    } else {
      speedRef.current = 1;
      if (status === 'idle' || status === 'locked') {
        setSimulatedFollowers([]);
        setSimulatedCount(0);
      }
    }
  }, [status]);

  // If complete, use real API followers; otherwise, use simulated data for the scanning visual
  const displayFollowers = useMemo(() => {
    if (status === 'complete') {
      return followers.slice(0, MAX_VISIBLE).map((f, i) => getAvatarConfig(i, f));
    }
    return simulatedFollowers;
  }, [status, followers, simulatedFollowers]);

  const rings = [
    { radius: 70, index: 0 },
    { radius: 120, index: 1 },
    { radius: 170, index: 2 }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-pink-500/10 shadow-[0_4px_24px_rgba(219,39,119,0.06)] flex flex-col h-full min-h-[400px] lg:min-h-[500px] overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 relative z-10 shrink-0">
        <div className="w-1 h-3 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400 rounded-full" />
        <h3 className="text-xs uppercase tracking-widest text-pink-600 font-bold flex items-center gap-2">
          Follower Orbit
        </h3>
      </div>

      {/* Orbit Container */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        
        {/* The Rings */}
        {rings.map(ring => (
          <RotatingRing 
            key={`ring-${ring.index}`}
            ringRadius={ring.radius}
            ringIndex={ring.index}
            speedRef={speedRef}
            status={status}
            avatars={displayFollowers.filter(f => f.ringIndex === ring.index)}
          />
        ))}

        {/* Central Avatar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative flex items-center justify-center">
            
            {/* Story Ring (Active when locked, scanning, complete) */}
            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-[-6px] rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888, #f09433)",
                    padding: "2px" // Ring thickness
                  }}
                >
                  <motion.div 
                    className="w-full h-full rounded-full bg-white"
                    animate={status === 'scanning' ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                  {/* A rotating mask to create the spinner effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full mix-blend-overlay"
                    style={{ background: "conic-gradient(from 0deg, transparent 50%, white)" }}
                    animate={status === 'scanning' ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* The actual avatar circle */}
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center relative z-10
              ${status === 'idle' ? 'bg-gray-100 border-2 border-gray-200' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 border-4 border-white shadow-lg'}
              transition-all duration-500
            `}>
              {status === 'idle' ? (
                <Users className="w-6 h-6 text-gray-300" />
              ) : (
                <span className="text-white font-bold text-xl uppercase">
                  {targetUrl ? targetUrl.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/[^a-zA-Z0-9]/g, '').charAt(0) || '@' : '@'}
                </span>
              )}
            </div>
            
          </div>
        </div>

        {/* "+ More" Label */}
        <AnimatePresence>
          {status === 'complete' && followers.length > MAX_VISIBLE && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-pink-600 shadow-sm border border-pink-500/10"
            >
              +{followers.length - MAX_VISIBLE} more
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Status Bar */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between shrink-0 relative z-10">
        <div className={`flex items-center gap-2 text-xs font-bold tracking-wide ${currentStatus.color}`}>
          {currentStatus.icon}
          {status === 'scanning' ? (
            <span>EXTRACTING... ({simulatedCount} FOUND)</span>
          ) : status === 'complete' ? (
            <span>{followers.length} EXTRACTED</span>
          ) : (
            <span>{currentStatus.text}</span>
          )}
        </div>
      </div>
    </div>
  );
}
