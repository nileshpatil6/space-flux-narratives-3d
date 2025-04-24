
import { useRef, useEffect } from 'react';
import { setupFadeInAnimations } from '../../lib/gsapUtils';

const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    setupFadeInAnimations('.fade-element');
  }, []);

  return (
    <section 
      id="action" 
      ref={sectionRef}
      className="section py-32 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/10 opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center fade-element">
          Take Action
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glassmorphism p-8 text-center fade-element hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold text-primary mb-4">1.1°</div>
            <h4 className="text-lg font-medium">Global Rise</h4>
          </div>
          
          <div className="glassmorphism p-8 text-center fade-element hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold text-primary mb-4">415</div>
            <h4 className="text-lg font-medium">CO₂ PPM</h4>
          </div>
          
          <div className="glassmorphism p-8 text-center fade-element hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold text-primary mb-4">2050</div>
            <h4 className="text-lg font-medium">Target Year</h4>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button className="bg-[#1da1f2] hover:bg-[#1da1f2]/90 text-white px-6 py-3 rounded-lg transition-colors">
            Share Story
          </button>
          <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
