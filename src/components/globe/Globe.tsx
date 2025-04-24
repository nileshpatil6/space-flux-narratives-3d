import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars as DreiStars } from '@react-three/drei';
import gsap from 'gsap';
import { getTexturePaths } from '../../utils/texturePreloader';

const Earth = ({ isAnimating = true, pulse = false }: { isAnimating?: boolean; pulse?: boolean }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [textures, setTextures] = useState<{
    earthMap: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    specularMap: THREE.Texture | null;
    cloudsMap: THREE.Texture | null;
    earthColor: THREE.Color;
    cloudsColor: THREE.Color;
  }>({
    earthMap: null,
    normalMap: null,
    specularMap: null,
    cloudsMap: null,
    earthColor: new THREE.Color('blue'),
    cloudsColor: new THREE.Color('white')
  });
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const paths = getTexturePaths();
    const loadedTextures = { 
      earthMap: null, 
      normalMap: null, 
      specularMap: null, 
      cloudsMap: null,
      earthColor: new THREE.Color(paths.fallbacks.dayMap),
      cloudsColor: new THREE.Color(paths.fallbacks.clouds)
    };
    let loadCount = 0;

    const createColorTexture = (color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const loadTexture = (url: string, key: string, fallbackColor: string) => {
      textureLoader.load(
        url, 
        (texture) => {
          loadedTextures[key] = texture;
          loadCount++;
          if (loadCount === 4) {
            setTextures(loadedTextures);
            setTexturesLoaded(true);
          }
        },
        undefined, 
        () => {
          console.warn(`Error loading ${url}, using fallback`);
          loadedTextures[key] = createColorTexture(fallbackColor);
          loadCount++;
          if (loadCount === 4) {
            setTextures(loadedTextures);
            setTexturesLoaded(true);
          }
        }
      );
    };

    loadTexture(paths.dayMap, 'earthMap', paths.fallbacks.dayMap);
    loadTexture(paths.normalMap, 'normalMap', paths.fallbacks.normalMap);
    loadTexture(paths.specularMap, 'specularMap', paths.fallbacks.specularMap);
    loadTexture(paths.clouds, 'cloudsMap', paths.fallbacks.clouds);
  }, []);

  useEffect(() => {
    if (pulse && earthRef.current && glowRef.current) {
      const timeline = gsap.timeline({
        repeat: -1,
        yoyo: true
      });
      
      timeline.to(glowRef.current.scale, {
        x: 1.15,
        y: 1.15,
        z: 1.15,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }
  }, [pulse]);

  useFrame(({ clock }) => {
    if (isAnimating && earthRef.current && cloudsRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.07;
    }
  });

  if (!texturesLoaded) {
    return null;
  }

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(0x3388ff)}
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial 
          map={textures.earthMap}
          normalMap={textures.normalMap}
          specularMap={textures.specularMap}
          shininess={5}
          color={textures.earthMap ? undefined : textures.earthColor}
        />
      </mesh>
      
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial 
          map={textures.cloudsMap}
          transparent 
          opacity={0.4}
          color={textures.cloudsMap ? undefined : textures.cloudsColor}
        />
      </mesh>
    </group>
  );
};

const Atmosphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[2.1, 64, 64]} />
      <meshBasicMaterial
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      >
        <primitive attach="color" object={new THREE.Color(0x3388ff)} />
      </meshBasicMaterial>
    </mesh>
  );
};

const EnhancedStars = () => {
  const { scene } = useThree();
  
  useEffect(() => {
    const createStarLayer = (count: number, size: number, distance: number) => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: size,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });
      
      const starVertices = [];
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * distance;
        const y = (Math.random() - 0.5) * distance;
        const z = (Math.random() - 0.5) * distance;
        starVertices.push(x, y, z);
      }
      
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      
      return { geometry: starGeometry, material: starMaterial, mesh: stars };
    };
    
    const nearStars = createStarLayer(1000, 0.1, 500);
    const midStars = createStarLayer(3000, 0.05, 1000);
    const farStars = createStarLayer(6000, 0.02, 1500);
    
    return () => {
      [nearStars, midStars, farStars].forEach(layer => {
        scene.remove(layer.mesh);
        layer.geometry.dispose();
        layer.material.dispose();
      });
    };
  }, [scene]);
  
  return null;
};

const SpaceDust = () => {
  const particles = useRef<THREE.Points>(null);
  
  useFrame(({ clock }) => {
    if (particles.current) {
      particles.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });
  
  return (
    <points ref={particles}>
      <bufferGeometry>
        <float32BufferAttribute
          attach="attributes-position"
          array={new Float32Array([...Array(3000)].map(() => (Math.random() - 0.5) * 300))}
          count={1000}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.7} 
        color="#5555ff" 
        transparent 
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
};

const Globe = ({ showControls = true }: { showControls?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
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
        borderRadius: '50%',
        boxShadow: '0 0 30px rgba(0, 150, 255, 0.3)'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0000" />
        
        {isClient && (
          <>
            <Earth pulse={true} />
            <Atmosphere />
            
            <EnhancedStars />
            <SpaceDust />
            <DreiStars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            
            {showControls && (
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.5}
                autoRotate
                autoRotateSpeed={0.5}
              />
            )}
          </>
        )}
      </Canvas>
    </div>
  );
};

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
