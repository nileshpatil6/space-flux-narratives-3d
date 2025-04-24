import { useEffect } from "react";
import { preloadTextures } from "../utils/texturePreloader";
import Navbar from "../components/layout/Navbar";
import ScrollProgress from "../components/ui/ScrollProgress";
import Hero from "../components/sections/Hero";
import Introduction from "../components/sections/Introduction";
import MethodologySection from "../components/sections/MethodologySection";
import VisualizationSection from "../components/sections/VisualizationSection";
import CallToAction from "../components/sections/CallToAction";

const Index = () => {
  useEffect(() => {
    // Preload Earth textures
    preloadTextures();
    
    // Add fade in animation to sections
    const handleScroll = () => {
      const sections = document.querySelectorAll('.fade-in-section');
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).getBoundingClientRect().top;
        const sectionBottom = (section as HTMLElement).getBoundingClientRect().bottom;
        const isVisible = (sectionTop < window.innerHeight - 100) && (sectionBottom > 0);
        
        if (isVisible) {
          section.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
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
        <div className="container mx-auto px-4">
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
