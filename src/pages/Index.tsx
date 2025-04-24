
import { useEffect, useRef } from "react";
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
import { setupAnimations } from "../lib/animationUtils";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Preload Earth textures with error handling
    preloadTextures();
    
    // Initialize all animations
    setupAnimations();
    
    // Create a space-themed cursor effect
    const createSpaceDust = () => {
      const cursor = document.createElement('div');
      cursor.className = 'space-dust';
      document.body.appendChild(cursor);
      
      window.addEventListener('mousemove', (e) => {
        // Create particle on mouse move
        const particle = document.createElement('div');
        particle.className = 'space-particle';
        
        // Set positions
        const xPos = `${e.clientX}px`;
        const yPos = `${e.clientY}px`;
        
        particle.style.setProperty('left', xPos);
        particle.style.setProperty('top', yPos);
        cursor.style.setProperty('left', xPos);
        cursor.style.setProperty('top', yPos);
        
        // Random size and color for particles
        const size = Math.random() * 5;
        const hue = 180 + Math.random() * 60; // Blue to cyan
        particle.style.setProperty('width', `${size}px`);
        particle.style.setProperty('height', `${size}px`);
        particle.style.setProperty('background', `hsla(${hue}, 100%, 70%, ${0.5 + Math.random() * 0.5})`);
        
        document.body.appendChild(particle);
        
        // Animate and remove particles
        gsap.to(particle, {
          duration: 1 + Math.random() * 2,
          opacity: 0,
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          onComplete: () => {
            particle.remove();
          }
        });
      });
    };
    
    createSpaceDust();
    
    // Setup a parallax star background
    const setupParallaxStars = () => {
      const starsContainer = document.createElement('div');
      starsContainer.className = 'stars-container';
      document.body.insertBefore(starsContainer, document.body.firstChild);
      
      // Create 3 star layers
      for (let i = 1; i <= 3; i++) {
        const starsLayer = document.createElement('div');
        starsLayer.className = `stars-layer stars-layer-${i}`;
        starsContainer.appendChild(starsLayer);
        
        // Add random stars to each layer
        const count = i === 1 ? 50 : i === 2 ? 100 : 200;
        for (let j = 0; j < count; j++) {
          const star = document.createElement('div');
          star.className = 'star';
          star.style.setProperty('left', `${Math.random() * 100}%`);
          star.style.setProperty('top', `${Math.random() * 100}%`);
          star.style.setProperty('width', `${4 - i}px`);
          star.style.setProperty('height', `${4 - i}px`);
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
    
    setupParallaxStars();
    
    // Add scroll animations
    const sections = document.querySelectorAll('.fade-in-section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // Optional: if you want elements to fade out when scrolled past
          // entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.15 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      // Cleanup
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground cosmic-background" ref={mainRef}>
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
