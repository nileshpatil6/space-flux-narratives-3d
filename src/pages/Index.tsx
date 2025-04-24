
import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { preloadTextures } from "../utils/texturePreloader";
import Navbar from "../components/layout/Navbar";
import ScrollProgress from "../components/ui/ScrollProgress";
import Hero from "../components/sections/Hero";
import Introduction from "../components/sections/Introduction";
import MethodologySection from "../components/sections/MethodologySection";
import VisualizationSection from "../components/sections/VisualizationSection";
import CallToAction from "../components/sections/CallToAction";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { theme } = useTheme();
  const mainRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Preload Earth textures with error handling
    preloadTextures();
    
    // Setup page animations
    setupAnimations();
    
    // Setup stellar background
    setupBackground();
    
    return () => {
      // Cleanup any animation listeners
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
  
  // Setup GSAP animations
  const setupAnimations = () => {
    // Add scroll animations
    const sections = document.querySelectorAll('.fade-in-section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Animate children with stagger
          const elements = entry.target.querySelectorAll('.animate-on-visible');
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
          });
        }
      });
    }, { threshold: 0.15 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    // Create scroll-triggered animations
    gsap.utils.toArray('.scroll-section').forEach((section: any, i) => {
      // Section entry animation
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
          });
        }
      });
      
      // Parallax background effect
      gsap.to(section.querySelector('.section-bg'), {
        y: "30%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
    
    // Setup some floating elements
    gsap.utils.toArray('.float-element').forEach((element: any) => {
      gsap.to(element, {
        y: "-=20",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  };
  
  // Setup space background with stars
  const setupBackground = () => {
    // Create star field
    const createStarLayers = () => {
      const starsContainer = document.createElement('div');
      starsContainer.className = 'stars-container';
      document.body.insertBefore(starsContainer, document.body.firstChild);
      
      // Create 3 star layers
      for (let i = 1; i <= 3; i++) {
        const starsLayer = document.createElement('div');
        starsLayer.className = `stars-layer stars-layer-${i}`;
        starsContainer.appendChild(starsLayer);
        
        // Add random stars to each layer
        const count = i === 1 ? 50 : i === 2 ? 100 : 150;
        for (let j = 0; j < count; j++) {
          const star = document.createElement('div');
          star.className = 'star';
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 100}%`;
          star.style.width = `${4 - i}px`;
          star.style.height = `${4 - i}px`;
          starsLayer.appendChild(star);
        }
      }
      
      // Parallax effect on scroll
      window.addEventListener('scroll', () => {
        const yScroll = window.scrollY;
        const layer1 = document.querySelector('.stars-layer-1') as HTMLElement;
        const layer2 = document.querySelector('.stars-layer-2') as HTMLElement;
        const layer3 = document.querySelector('.stars-layer-3') as HTMLElement;
        
        if (layer1) layer1.style.transform = `translateY(${yScroll * 0.3}px)`;
        if (layer2) layer2.style.transform = `translateY(${yScroll * 0.2}px)`;
        if (layer3) layer3.style.transform = `translateY(${yScroll * 0.1}px)`;
      });
    };
    
    createStarLayers();
  };

  return (
    <div 
      className={`min-h-screen transition-colors ${theme}`} 
      ref={mainRef}
    >
      <ScrollProgress />
      <Navbar />
      
      <main>
        <Hero />
        <Introduction />
        <MethodologySection />
        <VisualizationSection />
        <CallToAction />
      </main>
      
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Tell Us a Climate Story — Visualizing the Greenhouse Gas Story
            </p>
            <p>
              Created with React, Three.js, and GSAP • Data visualization project © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
