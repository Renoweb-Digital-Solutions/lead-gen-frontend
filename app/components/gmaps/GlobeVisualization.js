"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Scan } from "lucide-react";

// Dynamically import react-globe.gl to avoid SSR issues with Three.js
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-brand-blue/10">
      <div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mb-4" />
      <div className="text-brand-cyan/60 text-xs font-semibold tracking-widest uppercase">Initializing Radar...</div>
    </div>
  ),
});

// Local city coordinates dictionary for instant geocoding
const CITY_COORDINATES = {
  kolkata: { lat: 22.5726, lng: 88.3639 },
  calcutta: { lat: 22.5726, lng: 88.3639 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  madras: { lat: 13.0827, lng: 80.2707 },
  london: { lat: 51.5074, lng: -0.1278 },
  new_york: { lat: 40.7128, lng: -74.0060 },
  nyc: { lat: 40.7128, lng: -74.0060 },
  san_francisco: { lat: 37.7749, lng: -122.4194 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  paris: { lat: 48.8566, lng: 2.3522 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  toronto: { lat: 43.6532, lng: -79.3832 },
  berlin: { lat: 52.5200, lng: 13.4050 },
  manchester: { lat: 53.4808, lng: -2.2426 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  los_angeles: { lat: 34.0522, lng: -118.2437 },
  la: { lat: 34.0522, lng: -118.2437 },
  boston: { lat: 42.3601, lng: -71.0589 },
  seattle: { lat: 47.6062, lng: -122.3321 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
};

export default function GlobeVisualization({ status, targetLocation, resultCount }) {
  const globeRef = useRef();

  // Geocoding fallback: deterministic coordinates based on hash
  const getHashCoordinates = (locStr) => {
    if (!locStr || locStr.trim() === "") return null;
    let hash = 0;
    for (let i = 0; i < locStr.length; i++) {
      hash = locStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const lat = (hash % 120) - 60; // Safe latitude range
    const lng = ((hash * 3) % 360) - 180;
    return { lat, lng };
  };

  const [targetCoords, setTargetCoords] = useState(null);
  const [arcsData, setArcsData] = useState([]);
  const [ringsData, setRingsData] = useState([]);
  const [pointsData, setPointsData] = useState([]);
  const [liveCount, setLiveCount] = useState(0);
  const [countries, setCountries] = useState([]);

  // Fetch coordinates asynchronously with Nominatim lookup & debounce
  useEffect(() => {
    if (!targetLocation || targetLocation.trim() === "") {
      setTargetCoords(null);
      return;
    }

    const cleanLoc = targetLocation.toLowerCase().trim();
    
    // Check instant dictionary
    const matchedCityKey = Object.keys(CITY_COORDINATES).find(city => cleanLoc.includes(city));
    if (matchedCityKey) {
      setTargetCoords(CITY_COORDINATES[matchedCityKey]);
      return;
    }

    // Dynamic Nominatim lookup
    const timer = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(targetLocation)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setTargetCoords({
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            });
          } else {
            setTargetCoords(getHashCoordinates(targetLocation));
          }
        })
        .catch(() => {
          setTargetCoords(getHashCoordinates(targetLocation));
        });
    }, 600);

    return () => clearTimeout(timer);
  }, [targetLocation]);

  // Fetch GeoJSON countries for wireframe
  useEffect(() => {
    fetch("https://unpkg.com/globe.gl/example/datasets/ne_110m_admin_0_countries.geojson")
      .then(res => res.json())
      .then(data => setCountries(data.features))
      .catch(err => console.error("Failed to load globe countries", err));
  }, []);

  // Initialize generic ambient points for "idle" state
  useEffect(() => {
    const ambientPoints = Array.from({ length: 20 }).map(() => ({
      lat: (Math.random() - 0.5) * 160,
      lng: (Math.random() - 0.5) * 360,
      size: 0.15 + Math.random() * 0.2,
      color: "#4ec8ef",
    }));
    setPointsData(ambientPoints);

    // Initial flowing ambient arcs
    const ambientArcs = Array.from({ length: 12 }).map(() => ({
      startLat: (Math.random() - 0.5) * 160,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 160,
      endLng: (Math.random() - 0.5) * 360,
    }));
    setArcsData(ambientArcs);
  }, []);

  // Set globe base material on mount if we want to tweak the raw Three.js material
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.enableZoom = false; // Disable zoom to prevent breaking layout
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, []);

  // Handle State Transitions & Animations
  useEffect(() => {
    if (!globeRef.current) return;

    if (status === "idle") {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;

      const ambientArcs = Array.from({ length: 12 }).map(() => ({
        startLat: (Math.random() - 0.5) * 160,
        startLng: (Math.random() - 0.5) * 360,
        endLat: (Math.random() - 0.5) * 160,
        endLng: (Math.random() - 0.5) * 360,
      }));
      setArcsData(ambientArcs);
      setLiveCount(0);

      // Keep ambient points, clear others
      setPointsData((prev) => prev.slice(0, 20));

      // Rotate to target if location is matched
      if (targetCoords) {
        globeRef.current.pointOfView({ lat: targetCoords.lat, lng: targetCoords.lng, altitude: 2 }, 1500);
        // Add persistent target beacon ring
        setRingsData([{ lat: targetCoords.lat, lng: targetCoords.lng, color: "#ffc857", maxRadius: 5 }]);
      } else {
        setRingsData([]);
      }
    }
    else if (status === "scanning" && targetCoords) {
      globeRef.current.controls().autoRotate = false; // Keep the globe static to focus on the target region
      
      const scanInterval = setInterval(() => {
        // Emit smaller, tight sonar rings from the target
        setRingsData((prev) => [
          ...prev.slice(-2),
          {
            lat: targetCoords.lat,
            lng: targetCoords.lng,
            color: Math.random() > 0.5 ? "#4ec8ef" : "#ffc857",
            maxRadius: 4 + Math.random() * 4
          }
        ]);

        // Add random found points nearby target (within ~45 degrees)
        const newLat = targetCoords.lat + (Math.random() - 0.5) * 45;
        const newLng = targetCoords.lng + (Math.random() - 0.5) * 45;

        setPointsData((prev) => [
          ...prev,
          { lat: newLat, lng: newLng, size: 0.3 + Math.random() * 0.4, color: "#ffc857" }
        ].slice(-60)); // max 60 points to keep performance high

        // Occasionally draw arcs from target to found point
        if (Math.random() > 0.4) {
          setArcsData((prev) => [
            ...prev,
            { startLat: targetCoords.lat, startLng: targetCoords.lng, endLat: newLat, endLng: newLng }
          ].slice(-15)); // max 15 arcs
        }

        // Increment counter in randomized jumps
        setLiveCount((prev) => prev + Math.floor(Math.random() * 4) + 1);

      }, 350);

      return () => {
        clearInterval(scanInterval);
      };
    }
    else if (status === "complete") {
      globeRef.current.controls().autoRotateSpeed = 0.3;
      // Persistent complete target beacon
      if (targetCoords) {
        setRingsData([{ lat: targetCoords.lat, lng: targetCoords.lng, color: "#10b981", maxRadius: 6 }]);
      } else {
        setRingsData([]);
      }
      // Let arcs fade out naturally by clearing them
      setArcsData([]);
      setLiveCount(resultCount || 0);

      // Change found points to steady success color (emerald)
      setPointsData((prev) =>
        prev.map((p, i) => i < 20 ? p : { ...p, color: "#10b981", size: 0.4 })
      );
    }
  }, [status, targetCoords, resultCount]);

  // Responsive sizing wrapper
  const wrapperRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(wrapperRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full min-h-[600px] bg-white rounded-2xl relative overflow-hidden shadow-[0_4px_15px_rgba(2,61,187,0.12)] border border-brand-blue/10 flex items-center justify-center"
      style={{
        backgroundImage: "radial-gradient(circle at center, rgba(48,143,239,0.05) 0%, transparent 70%)",
        isolation: "isolate",
        transform: "translateZ(0)"
      }}
    >

      {/* ── Overlay UI / Status Panel ── */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-brand-dark font-display font-semibold tracking-wide text-lg flex items-center gap-2 drop-shadow-sm">
          <Scan className="w-5 h-5 text-brand-cyan" />
          Global Radar
        </h3>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="mt-3 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-brand-cyan/50 animate-[rw-pulse_2s_infinite]" />
              <p className="text-[#4ec8ef]/70 text-xs uppercase tracking-wider font-semibold">
                {targetLocation ? "Target locked. Ready to scan." : "Scanning for targets..."}
              </p>
            </motion.div>
          )}

          {status === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 bg-white/90 backdrop-blur-md border border-brand-blue/20 rounded-xl p-4 inline-block shadow-[0_4px_20px_rgba(48,143,239,0.15)]"
            >
              <div className="text-[#4ec8ef] text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                Scanning {targetLocation || "Network"}
              </div>
              <div className="text-brand-dark text-3xl font-bold font-display tabular-nums leading-none">
                {liveCount} <span className="text-sm text-gray-500 font-sans font-medium tracking-normal">nodes scanned</span>
              </div>
            </motion.div>
          )}

          {status === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 bg-emerald-50/90 backdrop-blur-md border border-emerald-200 rounded-xl p-4 inline-flex items-center gap-4 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
            >
              <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <div className="text-[#10b981] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
                  Scan Complete
                </div>
                <div className="text-emerald-900 text-2xl font-bold font-display tabular-nums leading-none">
                  {resultCount} <span className="text-sm font-sans font-medium text-emerald-700 tracking-normal">matches</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── The Globe ── */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"

          // Base visuals - Solid white sphere
          globeImageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
          showGraticules={true} // Adds wireframe grid lines

          showAtmosphere={true}
          atmosphereColor="#308fef"
          atmosphereAltitude={0.15}

          // Wireframe Countries
          polygonsData={countries}
          polygonCapColor={() => 'rgba(2, 61, 187, 0.02)'} // Ultra faint blue fill
          polygonSideColor={() => 'rgba(0,0,0,0)'}
          polygonStrokeColor={() => '#4ec8ef'} // Brand deep blue wireframe

          // Points
          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.01}
          pointRadius="size"
          pointsMerge={false}

          // Sonar Rings
          ringsData={ringsData}
          ringLat="lat"
          ringLng="lng"
          ringColor="color"
          ringMaxRadius={(d) => d.maxRadius || 5}
          ringPropagationSpeed={3}
          ringRepeatPeriod={800}

          // Arcs
          arcsData={arcsData}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={() => ["#308fef", "#4ec8ef"]}
          arcDashLength={0.4}
          arcDashGap={1}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={1200}

          // Labels
          labelsData={targetCoords ? [{ lat: targetCoords.lat, lng: targetCoords.lng, text: targetLocation }] : []}
          labelLat="lat"
          labelLng="lng"
          labelText="text"
          labelColor={() => '#023dbb'}
          labelSize={1.4}
          labelDotRadius={0.4}
          labelAltitude={0.03}
        />
      )}
    </div>
  );
}
