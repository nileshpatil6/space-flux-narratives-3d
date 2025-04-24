import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { getTexturePaths } from '../../utils/texturePreloader';

const Earth = ({ isAnimating = true }: { isAnimating?: boolean }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
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
  
  // Load textures with error handling
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

    // Helper function to create a solid color texture as fallback
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

    // Load earth day map
    textureLoader.load(
      paths.dayMap, 
      (texture) => {
        loadedTextures.earthMap = texture;
        loadCount++;
        if (loadCount === 4) setTextures(loadedTextures);
      },
      undefined, 
      () => {
        console.warn(`Error loading ${paths.dayMap}, using fallback`);
        loadedTextures.earthMap = null;
        loadCount++;
        if (loadCount === 4) setTextures(loadedTextures);
      }
    );

    // Load normal map
    textureLoader.load(
      paths.normalMap, 
      (texture) => {
        loadedTextures.normalMap = texture;
        loadCount++;
        if (loadCount === 4) setTextures(loadedTextures);
      },
      undefined, 
      () => {
        console.warn(`Error loading ${paths.normalMap}, using fallback`);
        loadedTextures.normalMap = null;
        loadCount++;
        if (loadCount === 4) setTextures(loadedTextures);
      }
    );

    // Load specular map
    textureLoader.load(
      paths.specularMap, 
      (texture) => {
        loadedTextures.specularMap = texture;
        loadCount++;
        if (loadCount === 4) setTextures(loadedTextures);
      },
      undefined, 
      () => {
        console.warn(`Error loading ${paths.specularMap}, using fallback`);
        loadedTextures.specularMap = null;
        loadCount++;
        if (loadCount === 4) setTextures(loadedTextures);
      }
    );

    // Load clouds
    textureLoader.load(
      paths.clouds, 
      (texture) => {
        loadedTextures.cloudsMap = texture;
        loadCount++;
        if (loadCount === 4) {
          setTextures(loadedTextures);
          setTexturesLoaded(true);
        }
      },
      undefined, 
      () => {
        console.warn(`Error loading ${paths.clouds}, using fallback`);
        loadedTextures.cloudsMap = null;
        loadCount++;
        if (loadCount === 4) {
          setTextures(loadedTextures);
          setTexturesLoaded(true);
        }
      }
    );
  }, []);

  // Animation hook
  useFrame(({ clock }) => {
    if (isAnimating && earthRef.current && cloudsRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.07;
    }
  });

  if (!texturesLoaded) {
    return null; // Don't render until textures are resolved (either loaded or fallbacks created)
  }

  return (
    <group>
      {/* Main Earth sphere */}
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
      
      {/* Clouds layer */}
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

const Globe = ({ showControls = true }: { showControls?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Setup GSAP animations for the container
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
        
        {isClient && (
          <>
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
