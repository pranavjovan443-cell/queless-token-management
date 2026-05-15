'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

export default function ThreeScene() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 1, 1]} intensity={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Sphere args={[1, 100, 200]} scale={2.4}>
            <MeshDistortMaterial
              color="#4338ca"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0}
            />
          </Sphere>
        </Float>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
