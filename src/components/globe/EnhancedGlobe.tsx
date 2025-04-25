
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const EARTH_RADIUS = 2;
const EARTH_SEGMENTS = 64;

// Earth mesh with proper textures and atmosphere
const Earth = () => {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [loaded, setLoaded] = useState(false);

  // Use drei's useTexture hook for better texture loading
  const textures = useTexture({
    earthMap: '/textures/earth_daymap.jpg',
    normalMap: '/textures/earth_normal.jpg',
    specularMap: '/textures/earth_specular.jpg',
    cloudsMap: '/textures/earth_clouds.jpg',
    bumpMap: '/textures/earth_bump.jpg'
  });
  
  // Set loaded state when textures are ready
  useEffect(() => {
    setLoaded(true);
    console.log("All textures loaded successfully");
  }, [textures]);

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

  if (!loaded) {
    return null;
  }

  return (
    <group ref={earthRef}>
      {/* Earth sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[EARTH_RADIUS, EARTH_SEGMENTS, EARTH_SEGMENTS]} />
        <meshPhongMaterial
          map={textures.earthMap}
          normalMap={textures.normalMap}
          specularMap={textures.specularMap}
          bumpMap={textures.bumpMap}
          bumpScale={0.05}
          shininess={10}
          color={textures.earthMap ? undefined : new THREE.Color(0x0077be)}
        />
      </mesh>
      
      {/* Clouds layer */}
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[EARTH_RADIUS, EARTH_SEGMENTS, EARTH_SEGMENTS]} />
        <meshPhongMaterial 
          map={textures.cloudsMap}
          transparent
          opacity={0.4}
          depthWrite={false}
          color={textures.cloudsMap ? undefined : new THREE.Color(0xffffff)}
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
      
      {/* Climate regions visualization */}
      <Hotspots />
      <OceanCurrents />
      <NaturalElements />
    </group>
  );
};

// Ocean currents visualization
const OceanCurrents = () => {
  const curvesRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (curvesRef.current) {
      gsap.to(curvesRef.current.rotation, {
        y: Math.PI * 2,
        duration: 120,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);

  return (
    <group ref={curvesRef}>
      {[...Array(6)].map((_, i) => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(Math.sin(i * 0.8) * EARTH_RADIUS * 1.02, Math.cos(i * 0.2) * 0.3, Math.cos(i * 0.8) * EARTH_RADIUS * 1.02),
          new THREE.Vector3(Math.sin(i * 0.8 + 1) * EARTH_RADIUS * 1.02, Math.cos(i * 0.2 + 0.3) * 0.5, Math.cos(i * 0.8 + 1) * EARTH_RADIUS * 1.02),
          new THREE.Vector3(Math.sin(i * 0.8 + 2) * EARTH_RADIUS * 1.02, Math.cos(i * 0.2 + 0.6) * 0.4, Math.cos(i * 0.8 + 2) * EARTH_RADIUS * 1.02),
          new THREE.Vector3(Math.sin(i * 0.8 + 3) * EARTH_RADIUS * 1.02, Math.cos(i * 0.2 + 0.9) * 0.2, Math.cos(i * 0.8 + 3) * EARTH_RADIUS * 1.02),
        ]);
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive key={i} object={new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ 
              color: i % 2 === 0 ? 0x3887BE : 0x29ABCA, 
              linewidth: 2,
              transparent: true,
              opacity: 0.7
            })
          )} />
        );
      })}
    </group>
  );
};

// Natural elements (trees, mountains) on Earth
const NaturalElements = () => {
  const elementsRef = useRef<THREE.Group>(null);
  
  // Places natural elements at specific coordinates
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
  };
  
  // Locations for natural features (forests, mountains)
  const locations = [
    { lat: 50, lng: -100, type: 'forest', scale: 0.15 }, // North American forests
    { lat: 60, lng: 100, type: 'forest', scale: 0.18 }, // Siberian forests
    { lat: -20, lng: -60, type: 'forest', scale: 0.2 }, // Amazon rainforest
    { lat: -5, lng: 20, type: 'forest', scale: 0.15 }, // Congo rainforest
    { lat: 35, lng: 103, type: 'mountain', scale: 0.12 }, // Himalayas
    { lat: 45, lng: -120, type: 'mountain', scale: 0.08 }, // Rocky Mountains
    { lat: -30, lng: -70, type: 'mountain', scale: 0.1 }, // Andes
    { lat: 45, lng: 10, type: 'mountain', scale: 0.07 }, // Alps
  ];

  return (
    <group ref={elementsRef}>
      {locations.map((location, i) => {
        const position = latLngToVector3(location.lat, location.lng, EARTH_RADIUS * 1.01);
        const lookAtCenter = position.clone().normalize();
        const rotation = new THREE.Quaternion();
        
        // Orient objects to face away from the center of the Earth
        rotation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), lookAtCenter);
        
        return (
          <group 
            key={i} 
            position={position}
            quaternion={rotation}
            scale={[location.scale, location.scale, location.scale]}
          >
            {location.type === 'forest' ? (
              <mesh>
                <coneGeometry args={[0.5, 1, 8]} />
                <meshStandardMaterial color={0x2D6A4F} />
              </mesh>
            ) : (
              <mesh>
                <coneGeometry args={[0.7, 0.7, 4]} />
                <meshStandardMaterial color={0x8B8589} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

// Hotspots that indicate climate change data points
const Hotspots = () => {
  const hotspots = [
    { lat: 40, lng: -74, color: '#ff4d4d', scale: 1.2, pulse: true }, // New York
    { lat: 51.5, lng: -0.12, color: '#ff9e3d', scale: 1, pulse: true }, // London
    { lat: 35.6, lng: 139.7, color: '#ff4d4d', scale: 1.1, pulse: false }, // Tokyo
    { lat: -33.9, lng: 151.2, color: '#ff9e3d', scale: 1, pulse: false }, // Sydney
    { lat: -14, lng: -51, color: '#ff4d4d', scale: 1.3, pulse: true }, // Brazil
    { lat: 28.6, lng: 77.2, color: '#ff4d4d', scale: 1.2, pulse: false }, // Delhi
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
            <mesh>
              <circleGeometry args={[0.1, 32]} />
              <meshBasicMaterial 
                color={spot.color} 
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
              />
            </mesh>
            <PulseEffect active={spot.pulse} color={spot.color} />
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

// Pulse effect for hotspots
const PulseEffect = ({ active, color }: { active: boolean; color: string }) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (active && pulseRef.current) {
      gsap.to(pulseRef.current.scale, {
        x: 3,
        y: 3,
        z: 3,
        duration: 1.5,
        repeat: -1,
        ease: "power1.out",
        onComplete: () => {
          if (pulseRef.current) {
            pulseRef.current.scale.set(1, 1, 1);
          }
        }
      });
      
      gsap.to(pulseRef.current.material as THREE.Material, {
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "power1.out",
        onComplete: () => {
          if (pulseRef.current?.material) {
            (pulseRef.current.material as THREE.Material).opacity = 0.6;
          }
        }
      });
    }
  }, [active]);
  
  if (!active) return null;
  
  return (
    <mesh ref={pulseRef}>
      <circleGeometry args={[0.1, 32]} />
      <meshBasicMaterial 
        color={color} 
        side={THREE.DoubleSide}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

// Space environment objects
const SpaceEnvironment = () => {
  const asteroidsRef = useRef<THREE.Group>(null);
  const satellitesRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (asteroidsRef.current) {
      gsap.to(asteroidsRef.current.rotation, {
        y: Math.PI * 2,
        duration: 80,
        repeat: -1,
        ease: "none"
      });
    }
    
    if (satellitesRef.current) {
      gsap.to(satellitesRef.current.rotation, {
        y: Math.PI * 2,
        duration: 40,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);
  
  return (
    <>
      {/* Asteroids belt */}
      <group ref={asteroidsRef}>
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 8 + Math.random() * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * 2;
          
          return (
            <mesh 
              key={i} 
              position={[x, y, z]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
            >
              <dodecahedronGeometry args={[0.1 + Math.random() * 0.2]} />
              <meshStandardMaterial color="#888888" roughness={0.8} />
            </mesh>
          );
        })}
      </group>
      
      {/* Satellites */}
      <group ref={satellitesRef}>
        {[...Array(5)].map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 3 + Math.random() * 0.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * 0.5;
          
          return (
            <group 
              key={i} 
              position={[x, y, z]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
            >
              <mesh>
                <boxGeometry args={[0.2, 0.05, 0.05]} />
                <meshStandardMaterial color="#AAAAAA" metalness={0.7} />
              </mesh>
              <mesh position={[0.12, 0, 0]}>
                <boxGeometry args={[0.03, 0.3, 0.01]} />
                <meshStandardMaterial color="#3377FF" metalness={0.3} />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
};

// Background stars for the scene
const EnhancedStars = () => {
  const starsRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (!starsRef.current || !nebulaRef.current) return;
    
    gsap.to(starsRef.current.rotation, {
      y: Math.PI * 2,
      duration: 100,
      repeat: -1, 
      ease: "none"
    });
    
    gsap.to(nebulaRef.current.rotation, {
      y: Math.PI * 2,
      duration: 150,
      repeat: -1, 
      ease: "none"
    });
  }, []);
  
  const createStarParticles = (count: number, spread: number, size: number, color: string) => {
    const vertices = [];
    const sizes = [];
    const colors = [];
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      vertices.push(
        (Math.random() - 0.5) * spread, 
        (Math.random() - 0.5) * spread, 
        (Math.random() - 0.5) * spread
      );
      
      sizes.push(Math.random() * size + size * 0.5);
      
      const colorVariance = 0.1;
      colors.push(
        colorObj.r + (Math.random() - 0.5) * colorVariance,
        colorObj.g + (Math.random() - 0.5) * colorVariance,
        colorObj.b + (Math.random() - 0.5) * colorVariance
      );
    }
    
    return {
      position: new Float32Array(vertices),
      size: new Float32Array(sizes),
      color: new Float32Array(colors)
    };
  };
  
  const starData = createStarParticles(3000, 300, 0.7, "#ffffff");
  const nebulaData = createStarParticles(1000, 150, 2.5, "#4488ff");
  
  return (
    <>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={starData.position}
            count={starData.position.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={starData.size}
            count={starData.size.length}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.7} 
          color="#ffffff" 
          transparent 
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>
      
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={nebulaData.position}
            count={nebulaData.position.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={nebulaData.size}
            count={nebulaData.size.length}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={2} 
          color="#4488ff" 
          transparent 
          opacity={0.3}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
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
          
          {/* Space elements */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <EnhancedStars />
          <SpaceEnvironment />
          
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
