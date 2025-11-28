import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

const WavingPlane = () => {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_colorA: { value: new THREE.Color('#0a0e1d') }, // Deep Blue (matches background)
      u_colorB: { value: new THREE.Color('#e0c269') }, // Brighter Gold
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      meshRef.current.material.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  const vertexShader = `
    uniform float u_time;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + u_time * 0.5) * 0.1;
      pos.z += sin(pos.y * 3.0 + u_time * 0.6) * 0.05;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float u_time;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    varying vec2 vUv;

    void main() {
      vec3 color = mix(u_colorA, u_colorB, vUv.y + sin(u_time * 0.5) * 0.1);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <Plane ref={meshRef} args={[15, 15, 64, 64]} rotation={[-Math.PI / 2.2, 0, 0]}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe={true}
      />
    </Plane>
  );
};

const WavingMeshAnimation = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 2, 4], fov: 75 }}>
        <WavingPlane />
      </Canvas>
    </div>
  );
};

export default WavingMeshAnimation;