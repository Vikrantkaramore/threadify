import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- Particle Logic (from InteractiveParticles.jsx) ---
const Particles = ({ count = 5000 }) => {
  const meshRef = useRef();
  const { viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);

      particle.mx += (state.mouse.x * viewport.width - particle.mx) * 0.01;
      particle.my += (state.mouse.y * viewport.height - particle.my) * 0.01;

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color="#FF94B4" roughness={0.5} />
    </instancedMesh>
  );
};

// --- Floating Shape Logic (from FloatingShapes.jsx) ---
const Shape = ({ position, size, color }) => {
  const ref = useRef();
  const randomRotationSpeed = useRef(Math.random() * 0.005 + 0.001);
  const randomAxis = useRef(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize());

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += Math.sin(Date.now() * 0.0005 + position[1]) * 0.01;
      ref.current.rotateOnAxis(randomAxis.current, randomRotationSpeed.current);
    }
  });

  return (
    <Icosahedron ref={ref} args={[size, 1]} position={position}>
      <meshStandardMaterial 
        color={color} 
        roughness={0.1} 
        metalness={0.9} 
        transparent 
        opacity={0.7}
      />
    </Icosahedron>
  );
};

// --- Component to hold the scene and GSAP animations ---
const Scene = () => {
  const { camera } = useThree();
  const sceneRef = useRef();

  useLayoutEffect(() => {
    // Ensure ScrollTrigger is ready
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section", // The trigger element
        start: "top top",
        end: "bottom top",
        scrub: 1, // Smoothly scrubs the animation on scroll
      },
    });

    // Animate camera position
    tl.to(camera.position, { x: 1, y: -1, z: 12 }, 0);
    // Animate camera rotation
    tl.to(camera.rotation, { x: -0.2, y: 0.4 }, 0);

  }, [camera.position, camera.rotation]);

  return (
    <group ref={sceneRef}>
      {/* Render the particle field */}
      <Particles count={3000} />

      {/* Render the floating shapes */}
      <Shape position={[-2.5, 1, 0]} size={1.2} color="#d4af37" />
      <Shape position={[2.5, -1.5, -1]} size={1} color="#e0c269" />
      <Shape position={[1, 2, -2]} size={0.8} color="#fff" />
    </group>
  );
}

// --- Main Combined Animation Component ---
const CombinedAnimation = ({ fixed = true }) => {
  const style = fixed
    ? { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1 }
    : { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 };

  return (
    <div style={style}>
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        {/* Lighting for both animations */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#FF94B4" />
        <pointLight position={[-10, -10, -10]} color="#d4af37" intensity={2} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default CombinedAnimation;