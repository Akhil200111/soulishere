'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const pointsRef = useRef();
  const count = 400; // Reduced from 3000 for a minimal snowfall

  // Create a snowflake/soft circle texture programmatically
  const texture = useMemo(() => {
    // Check if window is defined (for Next.js SSR)
    if (typeof window === 'undefined') return null;

    const canvas = document.createElement('canvas');
    // Increased canvas size to give room for the glow effect
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');

    // Center the drawing
    context.translate(32, 32);
    context.strokeStyle = 'rgba(255, 255, 255, 1)';
    context.lineWidth = 2.5;
    context.lineCap = 'round';

    // Add glowing effect using canvas shadows
    context.shadowBlur = 10;
    context.shadowColor = '#d8b4fe'; // Light purple glow

    for (let i = 0; i < 6; i++) {
      context.rotate(Math.PI / 3);

      // Main stem
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, -18);
      context.stroke();

      // Side branches
      context.beginPath();
      context.moveTo(0, -9);
      context.lineTo(6, -15);
      context.stroke();

      context.beginPath();
      context.moveTo(0, -9);
      context.lineTo(-6, -15);
      context.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Generate random points in a volume
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread them across a 15x15x15 cube
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        // Vary the falling speed for each snowflake so it looks more natural
        // Slowed down the base speed even further for a very calm effect
        const speed = 0.05 + (i % 10) * 0.02;

        // Fall downwards
        positions[i * 3 + 1] -= delta * speed;

        // Individual flutter / sway effect (different snowflakes sway at different rates)
        const flutterFrequency = 1 + (i % 3) * 0.5;
        positions[i * 3] += Math.sin(state.clock.elapsedTime * flutterFrequency + i) * delta * 0.2;

        // Reset to top if they fall below the camera view
        if (positions[i * 3 + 1] < -7.5) {
          positions[i * 3 + 1] = 7.5 + Math.random(); // Add random offset when resetting
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;

      // Gentle, constant overall rotation for depth
      pointsRef.current.rotation.y -= delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#d8b4fe" // Light purple snowflakes
        map={texture}
        transparent={true}
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    >
      <Canvas style={{ pointerEvents: 'none' }} camera={{ position: [0, 0, 5] }}>
        <Particles />
      </Canvas>
    </div>
  );
}
