"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, RoundedBox, Capsule, Torus, Html, Environment, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Scene Configuration ---
const RING_RADIUS = 2.6;
const MAX_BOB = 0.08;

// Shared Materials
const SolidMaterial = ({ color }) => (
    <meshPhysicalMaterial 
        color={color}
        roughness={0.2}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        envMapIntensity={2.5}
    />
);

const GlassMaterial = ({ color }) => (
    <MeshTransmissionMaterial 
        color={color}
        roughness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={1}
        thickness={0.5}
        ior={1.5}
        chromaticAberration={0.04}
        samples={4}
        envMapIntensity={2.5}
    />
);

// Individual 3D Object Component
const AudienceObject = ({ index, total, audience, isActive, activeIndex, setActiveIndex }) => {
    const meshRef = useRef();
    const groupRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Calculate base angle in the ring
    const baseAngle = (index / total) * Math.PI * 2;
    // Calculate initial position on ring
    const x = Math.sin(baseAngle) * RING_RADIUS;
    const z = Math.cos(baseAngle) * RING_RADIUS;
    
    // Independent bobbing offset
    const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state, delta) => {
        if (!groupRef.current || !meshRef.current) return;
        
        // World position to determine depth relative to camera
        const worldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPos);
        
        // Depth logic (z=0 is center, max z is roughly +RING_RADIUS)
        // Back objects are further negative in Z.
        // Normalize roughly between 0 (back) and 1 (front)
        const zNorm = Math.max(0, Math.min(1, (worldPos.z + RING_RADIUS) / (RING_RADIUS * 2)));
        
        // Scale based on depth (1.2 at back, 1.6 at front, max 1.8 on hover)
        const baseScale = 1.2 + (zNorm * 0.4); 
        const hoverScale = (hovered && isActive) ? baseScale * 1.06 : baseScale;
        
        meshRef.current.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.1);
        
        // Opacity falloff for depth (no blur)
        // Since PhysicalMaterials don't do depth opacity easily without transparency issues, 
        // we keep them solid but the lighting/scale gives depth. We can dim the color slightly if we want, 
        // but the prompt strictly says "opacity falloff (minimum 0.6)". 
        // MeshPhysicalMaterial needs transparent=true to use opacity.
        if (meshRef.current.children[0]?.material) {
            meshRef.current.children[0].material.transparent = true;
            meshRef.current.children[0].material.opacity = 0.6 + (zNorm * 0.4);
        }

        // Bobbing
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + randomOffset) * MAX_BOB;
        
        // Gentle rotation of the object itself
        meshRef.current.rotation.x += 0.002;
        meshRef.current.rotation.y += 0.004;
    });

    const Icon = audience.icon;
    const Material = audience.glass ? GlassMaterial : SolidMaterial;

    const renderShape = () => {
        switch(audience.shape) {
            case 'roundedTorus': 
                return <Torus args={[0.5, 0.25, 64, 64]} />;
            case 'sphereWithRing': 
                return (
                    <group>
                        <Sphere args={[0.5, 64, 64]} />
                        <Torus args={[0.7, 0.02, 32, 64]} rotation={[Math.PI/4, 0, 0]} material={new THREE.MeshStandardMaterial({color: audience.color, metalness: 0.8, roughness: 0.2})} />
                    </group>
                );
            case 'roundedBox': 
                return <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.15} smoothness={4} />;
            case 'capsule': 
                return <Capsule args={[0.3, 0.6, 4, 32]} />;
            case 'pill': 
                return <Capsule args={[0.25, 0.8, 4, 32]} />;
            default: 
                return <Sphere args={[0.6, 64, 64]} />;
        }
    };

    return (
        <group 
            ref={groupRef}
            position={[x, 0, z]}
            onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        >
            <group ref={meshRef}>
                {/* The Object */}
                <mesh castShadow receiveShadow>
                    {renderShape()}
                    {!audience.shape.includes('WithRing') && <Material color={audience.color} />}
                </mesh>

                {/* Crisp Vector Icon Billboard */}
                <Html 
                    position={[0, 0, 0.6]} 
                    transform 
                    center
                    style={{
                        pointerEvents: 'none',
                        // Render large and scale down for crispness
                        width: '200px',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    scale={0.15}
                >
                    <div 
                        className="w-[120px] h-[120px] rounded-full bg-white/90 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center border-2 border-white/50"
                        style={{ color: audience.color }}
                    >
                        <Icon size={64} strokeWidth={2.5} />
                    </div>
                </Html>
            </group>

            {/* Hover Label */}
            {hovered && !isActive && (
                <Html position={[0, -0.8, 0]} center>
                    <div className="px-3 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded-lg whitespace-nowrap shadow-lg">
                        {audience.title}
                    </div>
                </Html>
            )}
        </group>
    );
};

// Scene Wrapper
const CarouselScene = ({ audiences, activeIndex, setActiveIndex, isParentHovered, prefersReducedMotion }) => {
    const groupRef = useRef();
    const { camera, pointer } = useThree();
    
    // Target rotation: active object goes to +Z (0 angle in my setup, Wait: x=0, z=R means cos=1 -> angle 0)
    const targetRotationY = -(activeIndex / audiences.length) * Math.PI * 2;
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragRotOffset, setDragRotOffset] = useState(0);
    const [idleTime, setIdleTime] = useState(0);

    // Initial Camera setup
    useEffect(() => {
        camera.position.set(0, 1.2, 9);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Auto-rotation logic
        if (isDragging || isParentHovered) {
            setIdleTime(0);
        } else {
            setIdleTime(prev => prev + delta);
        }

        // 1. Ring Rotation
        if (!isDragging) {
            let rotationTarget = targetRotationY;
            
            // Auto rotate if idle > 4s
            if (!prefersReducedMotion && idleTime > 4) {
                // Rotate 1 rev / 60s
                rotationTarget += ((idleTime - 4) * (Math.PI * 2 / 60));
            }
            
            // Spring toward target rotation
            const currentRot = groupRef.current.rotation.y;
            // Shortest path
            let diff = ((rotationTarget + dragRotOffset - currentRot + Math.PI) % (Math.PI * 2)) - Math.PI;
            
            // If the diff wraps oddly due to auto-rotate, we just apply standard lerp
            groupRef.current.rotation.y += diff * 0.08;
            
            // Decay drag offset
            setDragRotOffset(prev => prev * 0.9);
        }

        // 2. Parallax Camera (Pointer following) max 4 degrees
        if (!prefersReducedMotion && !isDragging) {
            const maxOffset = 0.5; // roughly 4 degrees at distance 9
            const targetCamX = pointer.x * maxOffset;
            const targetCamY = 1.2 + (pointer.y * maxOffset);
            
            camera.position.x += (targetCamX - camera.position.x) * 0.05;
            camera.position.y += (targetCamY - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);
        }
    });

    // Simple Drag/Swipe Logic
    const handlePointerDown = (e) => {
        setIsDragging(true);
        setIdleTime(0);
        setDragStart(e.clientX || (e.touches && e.touches[0].clientX) || 0);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const diff = currentX - dragStart;
        setDragRotOffset(diff * 0.005);
    };

    const handlePointerUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        // Snap to next/prev based on drag distance
        if (dragRotOffset > 0.3) {
            setActiveIndex((curr) => (curr - 1 + audiences.length) % audiences.length);
        } else if (dragRotOffset < -0.3) {
            setActiveIndex((curr) => (curr + 1) % audiences.length);
        }
    };

    return (
        <>
            {/* Environment & Lighting */}
            <ambientLight intensity={0.4} />
            <spotLight position={[5, 10, 5]} intensity={2.5} castShadow penumbra={1} angle={0.5} />
            <pointLight position={[-5, 5, -5]} intensity={1.5} color="#023dbb" />
            <Environment preset="city" />

            {/* Invisible drag plane covering the scene */}
            <mesh 
                visible={false} 
                position={[0, 0, 0]} 
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial side={THREE.DoubleSide} />
            </mesh>

            {/* Rotating Ring */}
            <group ref={groupRef} position={[0, 0, 0]}>
                {audiences.map((aud, i) => (
                    <AudienceObject 
                        key={aud.id}
                        index={i}
                        total={audiences.length}
                        audience={aud}
                        isActive={activeIndex === i}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                ))}
            </group>

            {/* Contact Shadows */}
            <ContactShadows 
                position={[0, -2, 0]} 
                opacity={0.3} 
                scale={10} 
                blur={2.5} 
                far={3} 
                color="#000000"
                resolution={512}
            />
            
            {/* Tiny Particles */}
            {!prefersReducedMotion && (
                <group position={[0, 0, -2]}>
                    {[...Array(15)].map((_, i) => (
                        <mesh 
                            key={i}
                            position={[
                                (Math.random() - 0.5) * 12,
                                (Math.random() - 0.5) * 8,
                                (Math.random() - 0.5) * -6 - 2
                            ]}
                        >
                            <sphereGeometry args={[0.03, 8, 8]} />
                            <meshBasicMaterial color="#cbd5e1" transparent opacity={0.4} />
                        </mesh>
                    ))}
                </group>
            )}
        </>
    );
};

export default function Audience3DScene({ audiences, activeIndex, setActiveIndex, isHovered, prefersReducedMotion }) {
    return (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
                shadows
                camera={{ position: [0, 1.2, 9], fov: 35 }}
                dpr={[1, 2]}
                frameloop="demand"
                gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                <CarouselScene 
                    audiences={audiences} 
                    activeIndex={activeIndex} 
                    setActiveIndex={setActiveIndex}
                    isParentHovered={isHovered}
                    prefersReducedMotion={prefersReducedMotion}
                />
            </Canvas>
        </div>
    );
}
