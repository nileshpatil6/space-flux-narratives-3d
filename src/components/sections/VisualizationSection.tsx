
import { useRef, useEffect, useState } from 'react';
import DataDashboard from '../data/DataDashboard';
import Globe from '../globe/Globe';
import { animateGlobeOnScroll, animateCounter, create3DRotationEffect } from '../../lib/gsapUtils';
import gsap from 'gsap';

const VisualizationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!sectionRef.current || !globeRef.current) return;
    
    // Apply parallax effect to the globe
    animateGlobeOnScroll(globeRef);
    
    // Animate counters
    animateCounter('.counter-temp', 1.1, 2, '°C');
    animateCounter('.counter-co2', 420, 3, 'ppm');
    animateCounter('.counter-methane', 1900, 3, 'ppb');
    
    // Apply 3D rotation effect to cards
    create3DRotationEffect('.glassmorphism', 5);
    
    // Create particles around the globe
    const createGlobeParticles = () => {
      const globeElement = globeRef.current;
      if (!globeElement) return;
      
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'globe-particles absolute inset-0 pointer-events-none';
      globeElement.appendChild(particlesContainer);
      
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'globe-particle absolute rounded-full bg-blue-500';
        
        // Set random sizes
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Set random positions around the globe
        const angle = Math.random() * Math.PI * 2;
        const radius = (Math.random() * 20) + 45; // Percentage from center
        const x = Math.cos(angle) * radius + 50; // Center point is 50%
        const y = Math.sin(angle) * radius + 50;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particlesContainer.appendChild(particle);
        
        // Animate each particle
        gsap.to(particle, {
          opacity: Math.random() * 0.5 + 0.2,
          scale: Math.random() * 1.5 + 0.5,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        
        // Orbit animation
        gsap.to(particle, {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: Math.random() * 20 + 20,
          repeat: -1,
          ease: "none",
        });
      }
    };
    
    createGlobeParticles();
    
    // Animate data cards on scroll
    const dataCards = document.querySelectorAll('.glassmorphism');
    dataCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { 
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reset'
          }
        }
      );
    });
    
    // Add magnetic hover effect to the globe
    if (globeRef.current) {
      const globe = globeRef.current;
      const maxMovement = 20;
      
      globe.addEventListener('mousemove', (e) => {
        const rect = globe.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center as percentage
        const distanceX = (e.clientX - centerX) / (rect.width / 2);
        const distanceY = (e.clientY - centerY) / (rect.height / 2);
        
        // Apply movement based on cursor position
        gsap.to(globe, {
          x: distanceX * maxMovement,
          y: distanceY * maxMovement,
          rotation: distanceX * 5,
          duration: 1,
          ease: "power2.out"
        });
      });
      
      // Reset position on mouse leave
      globe.addEventListener('mouseleave', () => {
        gsap.to(globe, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1,
          ease: "elastic.out(1, 0.3)"
        });
      });
    }
  }, [isClient]);

  return (
    <section 
      id="visualizations" 
      ref={sectionRef}
      className="min-h-screen py-20 relative"
    >
      {/* Space themed background elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-40 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold mb-10 text-center fade-element text-glow">
          Interactive <span className="gradient-text">Visualizations</span>
        </h2>
        
        <div className="text-center mb-16 max-w-2xl mx-auto fade-element">
          <p className="text-xl text-muted-foreground">
            Explore greenhouse gas data through our interactive visualizations. 
            Select different regions, time periods, and gas types to see how 
            climate indicators have changed over time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
          {/* Globe visualization */}
          <div 
            ref={globeRef} 
            className="aspect-square max-w-[500px] mx-auto fade-element relative"
          >
            {isClient && <Globe />}
            
            {/* Add data connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
              <path className="data-connection" d="M50,50 L80,30" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="0.5" />
              <path className="data-connection" d="M50,50 L85,50" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="0.5" />
              <path className="data-connection" d="M50,50 L75,70" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="0.5" />
            </svg>
          </div>
          
          {/* Data dashboard */}
          <div className="fade-element" ref={dataRef}>
            <DataDashboard />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-2xl font-bold mb-6 text-center fade-element text-glow-subtle">
            Key Insights from the Data
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glassmorphism p-6 fade-element">
              <div className="text-5xl font-bold text-primary mb-2 counter-temp">0</div>
              <h4 className="text-lg font-medium mb-2">Global Warming</h4>
              <p className="text-sm text-muted-foreground">
                Average global temperature has risen 1.1°C above pre-industrial levels, 
                with significant regional variations.
              </p>
            </div>
            
            <div className="glassmorphism p-6 fade-element">
              <div className="text-5xl font-bold text-primary mb-2 counter-co2">0<span className="text-xl">ppm</span></div>
              <h4 className="text-lg font-medium mb-2">CO₂ Concentration</h4>
              <p className="text-sm text-muted-foreground">
                Atmospheric carbon dioxide has reached levels not seen in over 
                800,000 years, continuing to rise annually.
              </p>
            </div>
            
            <div className="glassmorphism p-6 fade-element">
              <div className="text-5xl font-bold text-primary mb-2 counter-methane">0<span className="text-xl">ppb</span></div>
              <h4 className="text-lg font-medium mb-2">Methane Levels</h4>
              <p className="text-sm text-muted-foreground">
                Methane concentrations are now 2.5 times pre-industrial levels, 
                with a sharp acceleration in recent decades.
              </p>
            </div>
          </div>
          
          <div className="glassmorphism p-6 fade-element">
            <h3 className="text-xl font-semibold mb-4">Regional Comparison</h3>
            <p className="mb-6">
              While climate change is a global phenomenon, its impacts and 
              contributing factors vary significantly by region. Explore the data 
              to compare emissions, concentrations, and temperature changes across 
              different parts of the world.
            </p>
            
            <div className="text-sm text-muted-foreground">
              <p>
                Note: Our visualization currently includes data for North America, Europe, and Asia. 
                We're working to expand our coverage to include more detailed regional breakdowns.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-16 fade-element">
            <a 
              href="#action" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors"
            >
              Take Action
            </a>
          </div>
        </div>
      </div>
      
      <style>
        {`
        .globe-particle {
          opacity: 0;
          box-shadow: 0 0 10px 2px rgba(56, 189, 248, 0.7);
          z-index: 20;
        }
        
        @keyframes connectionPulse {
          0% { stroke-dashoffset: 100; opacity: 0; }
          20% { opacity: 0.8; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        
        .data-connection {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: connectionPulse 3s infinite;
        }
        
        .data-connection:nth-child(2) {
          animation-delay: 1s;
        }
        
        .data-connection:nth-child(3) {
          animation-delay: 2s;
        }
        `}
      </style>
    </section>
  );
};

export default VisualizationSection;
