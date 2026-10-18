import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

function TowingShape() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Main sphere with distortion */}
        <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#facc15"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Orbiting rings */}
        <Torus args={[2.5, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.1} />
        </Torus>
        <Torus args={[3, 0.03, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </Torus>
        
        {/* Small floating cubes */}
        {[...Array(8)].map((_, i) => (
          <Float key={i} speed={3 + i * 0.5} rotationIntensity={2} floatIntensity={2}>
            <Box 
              args={[0.2, 0.2, 0.2]} 
              position={[
                Math.cos(i * Math.PI / 4) * 3.5,
                Math.sin(i * Math.PI / 4) * 0.5,
                Math.sin(i * Math.PI / 4) * 3.5
              ]}
            >
              <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
            </Box>
          </Float>
        ))}
      </group>
    </Float>
  );
}

function ServiceShape() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef}>
        {/* Main gear-like shape */}
        <Sphere args={[1.2, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#ef4444"
            attach="material"
            distort={0.3}
            speed={1.5}
            roughness={0.3}
            metalness={0.7}
          />
        </Sphere>
        
        {/* Mechanical rings */}
        <Torus args={[2, 0.08, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.2} />
        </Torus>
        <Torus args={[2.8, 0.04, 16, 100]} rotation={[Math.PI / 2.5, Math.PI / 6, 0]}>
          <meshStandardMaterial color="#b91c1c" metalness={0.9} roughness={0.1} />
        </Torus>
        
        {/* Floating elements */}
        {[...Array(6)].map((_, i) => (
          <Float key={i} speed={2 + i * 0.3} rotationIntensity={1.5} floatIntensity={1.5}>
            <Sphere 
              args={[0.15, 16, 16]} 
              position={[
                Math.cos(i * Math.PI / 3) * 3,
                Math.sin(i * Math.PI / 3) * 1.5,
                Math.sin(i * Math.PI / 3) * 2
              ]}
            >
              <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.3} />
            </Sphere>
          </Float>
        ))}
      </group>
    </Float>
  );
}

interface Scene3DProps {
  mode: 'tow' | 'service';
}

function Scene({ mode }: Scene3DProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#fbbf24" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color={mode === 'tow' ? '#facc15' : '#ef4444'} />
      
      {mode === 'tow' ? <TowingShape /> : <ServiceShape />}
    </>
  );
}

export default function FloatingCar({ mode }: Scene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Scene mode={mode} />
      </Canvas>
    </div>
  );
}
