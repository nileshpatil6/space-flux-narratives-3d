
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const EARTH_RADIUS = 2;
const EARTH_SEGMENTS = 64;

// Earth mesh with proper textures and atmosphere
const Earth = () => {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  // Load all textures
  const [
    earthMap,
    normalMap,
    specularMap,
    cloudsMap,
    bumpMap,
  ] = useTexture([
    '/textures/earth_daymap.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.jpg',
    '/textures/earth_bump.jpg'
  ]);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      // Slow rotation for the Earth
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    
    if (cloudsRef.current) {
      // Slightly faster rotation for clouds
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.07;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[EARTH_RADIUS, EARTH_SEGMENTS, EARTH_SEGMENTS]} />
        <meshPhongMaterial
          map={earthMap}
          normalMap={normalMap}
          specularMap={specularMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          shininess={10}
        />
      </mesh>
      
      {/* Clouds layer */}
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[EARTH_RADIUS, EARTH_SEGMENTS, EARTH_SEGMENTS]} />
        <meshPhongMaterial 
          map={cloudsMap}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.05, 32, 32]} />
        <meshPhongMaterial
          color={new THREE.Color(0x4794e3)}
          side={THREE.BackSide}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Hotspots */}
      <Hotspots />
    </group>
  );
};

// Hotspots that indicate climate change data points
const Hotspots = () => {
  const hotspots = [
    { lat: 40, lng: -74, color: '#ff4d4d', scale: 1.2 }, // New York
    { lat: 51.5, lng: -0.12, color: '#ff9e3d', scale: 1 }, // London
    { lat: 35.6, lng: 139.7, color: '#ff4d4d', scale: 1.1 }, // Tokyo
    { lat: -33.9, lng: 151.2, color: '#ff9e3d', scale: 1 }, // Sydney
    { lat: -14, lng: -51, color: '#ff4d4d', scale: 1.3 }, // Brazil
    { lat: 28.6, lng: 77.2, color: '#ff4d4d', scale: 1.2 }, // Delhi
  ];

  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
  };

  return (
    <>
      {hotspots.map((spot, i) => {
        const position = latLngToVector3(spot.lat, spot.lng, EARTH_RADIUS * 1.01);
        
        return (
          <group key={i} position={position} scale={[spot.scale, spot.scale, spot.scale]}>
            <mesh lookAt={[0, 0, 0]}>
              <circleGeometry args={[0.1, 32]} />
              <meshBasicMaterial 
                color={spot.color} 
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
              />
            </mesh>
            <pointLight 
              color={spot.color}
              intensity={0.5}
              distance={1}
            />
          </group>
        );
      })}
    </>
  );
};

// Background stars for the scene
const Stars = () => {
  const starsRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (!starsRef.current) return;
    
    gsap.to(starsRef.current.rotation, {
      y: Math.PI * 2,
      duration: 100,
      repeat: -1, 
      ease: "none"
    });
  }, []);
  
  const renderStars = () => {
    const starCount = 3000;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Create a sphere of stars
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      
      starPositions[i3] = radius * Math.sin(theta) * Math.cos(phi);
      starPositions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      starPositions[i3 + 2] = radius * Math.cos(theta);
      
      starSizes[i] = Math.random() * 2 + 0.5;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    return (
      <points ref={starsRef}>
        <bufferGeometry {...starsGeometry} />
        <pointsMaterial
          size={0.7}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation
          vertexShader={`
            attribute float size;
            varying float vSize;
            
            void main() {
              vSize = size;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            varying float vSize;
            
            void main() {
              float distance = length(gl_PointCoord - vec2(0.5, 0.5));
              if (distance > 0.5) {
                discard;
              }
              gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 - (distance * 2.0));
            }
          `}
        />
      </points>
    );
  };
  
  return renderStars();
};

// Main globe component
export const EnhancedGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    setReady(true);
    
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 1.5, 
          ease: "power3.out",
          onComplete: () => {
            // Add pulse glow effect after initial animation
            gsap.to(containerRef.current, {
              boxShadow: "0 0 30px rgba(56, 189, 248, 0.5)",
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        }
      );
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      style={{ 
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 0 30px rgba(0, 150, 255, 0.3)'
      }}
    >
      {ready && (
        <Canvas
          shadows
          camera={{ position: [0, 0, 6], fov: 45 }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 3, 5]} 
            intensity={1.5} 
            castShadow 
          />
          
          {/* Earth with atmosphere */}
          <Earth />
          
          {/* Stars background */}
          <Stars />
          
          {/* Camera controls */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            autoRotate={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      )}
    </div>
  );
};
