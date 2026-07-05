"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function NetworkNodes({ count = 150 }) {
  const points = useRef();
  const lines = useRef();
  const mouse = useRef(new THREE.Vector2());

  // Generate random points in a sphere or box
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      vel.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      });
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  const maxConnections = count * count;
  const linePositions = useMemo(() => new Float32Array(maxConnections * 3), [maxConnections]);
  
  useFrame((state) => {
    if (!points.current || !lines.current) return;

    // Gentle rotation of the whole group
    points.current.rotation.y = state.clock.elapsedTime * 0.05;
    lines.current.rotation.y = state.clock.elapsedTime * 0.05;
    points.current.rotation.x = state.clock.elapsedTime * 0.02;
    lines.current.rotation.x = state.clock.elapsedTime * 0.02;

    const pos = points.current.geometry.attributes.position.array;
    let lineIndex = 0;

    // Update positions and bounce off bounds
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      pos[idx] += velocities[i].x;
      pos[idx + 1] += velocities[i].y;
      pos[idx + 2] += velocities[i].z;

      if (Math.abs(pos[idx]) > 8) velocities[i].x *= -1;
      if (Math.abs(pos[idx + 1]) > 8) velocities[i].y *= -1;
      if (Math.abs(pos[idx + 2]) > 8) velocities[i].z *= -1;
    }

    // Connect close points
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        // If close enough, draw a line
        if (distSq < 8) {
          linePositions[lineIndex++] = pos[i * 3];
          linePositions[lineIndex++] = pos[i * 3 + 1];
          linePositions[lineIndex++] = pos[i * 3 + 2];

          linePositions[lineIndex++] = pos[j * 3];
          linePositions[lineIndex++] = pos[j * 3 + 1];
          linePositions[lineIndex++] = pos[j * 3 + 2];
        }
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    
    lines.current.geometry.attributes.position.array = linePositions;
    lines.current.geometry.setDrawRange(0, lineIndex / 3);
    lines.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#308fef"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={0}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4ec8ef" transparent opacity={0.15} depthWrite={false} />
      </lineSegments>
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={1} />
        <NetworkNodes count={120} />
      </Canvas>
    </div>
  );
}
