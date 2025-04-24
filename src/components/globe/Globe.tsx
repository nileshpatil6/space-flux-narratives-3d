
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import gsap from 'gsap';

// Earth component that will be rendered inside the Canvas
const Earth = ({ isAnimating = true }: { isAnimating?: boolean }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  // Load textures
  const [earthMap, earthNormalMap, earthSpecularMap, cloudsMap] = useTexture([
    "/earth_daymap.jpg",      // Replace with actual texture paths
    "/earth_normal_map.jpg",  // when assets are available
    "/earth_specular_map.jpg",
    "/earth_clouds.jpg"
  ]);

  // Animation hook
  useFrame(({ clock }) => {
    if (isAnimating && earthRef.current && cloudsRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.07;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial 
          map={earthMap}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          shininess={5}
        />
      </mesh>
      
      {/* Clouds layer */}
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

// Atmosphere glow effect
const Atmosphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[2.1, 64, 64]} />
      <meshBasicMaterial
        color={new THREE.Color(0x3388ff)}
        transparent={true}
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

// Stars background
const Stars = () => {
  const { scene } = useThree();
  
  useEffect(() => {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1
    });
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    return () => {
      scene.remove(stars);
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, [scene]);
  
  return null;
};

// Main Globe component
const Globe = ({ showControls = true }: { showControls?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Setup GSAP animations for the container
  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '50%'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1} 
          castShadow 
        />
        
        {/* Earth with atmosphere */}
        <Earth />
        <Atmosphere />
        
        {/* Background stars */}
        <Stars />
        
        {/* Controls */}
        {showControls && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
    </div>
  );
};

// Fallback placeholder component for when assets aren't loaded yet
export const GlobePlaceholder = () => {
  return (
    <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-blue-600 animate-pulse">
      <div className="text-white text-opacity-60">
        Loading Earth...
      </div>
    </div>
  );
};

export default Globe;
