
import { useRef, useEffect } from 'react';
import { setupFadeInAnimations } from '../../lib/gsapUtils';

const MethodologySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    setupFadeInAnimations('.fade-element');
  }, []);

  return (
    <section 
      id="methodology" 
      ref={sectionRef} 
      className="section bg-secondary/5 relative py-32"
    >
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold mb-16 text-center fade-element">
          Our Approach
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="fade-element">
            <div className="glassmorphism aspect-square mb-4 p-6 flex items-center justify-center">
              <div className="text-8xl font-bold text-primary/20">01</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
            <p className="text-sm text-muted-foreground">
              Gathering climate data from multiple authoritative sources
            </p>
          </div>
          
          <div className="fade-element">
            <div className="glassmorphism aspect-square mb-4 p-6 flex items-center justify-center">
              <div className="text-8xl font-bold text-primary/20">02</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Processing and analyzing patterns in climate data
            </p>
          </div>
          
          <div className="fade-element">
            <div className="glassmorphism aspect-square mb-4 p-6 flex items-center justify-center">
              <div className="text-8xl font-bold text-primary/20">03</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Visualization</h3>
            <p className="text-sm text-muted-foreground">
              Creating interactive 3D visualizations of climate impact
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-12 fade-element">
          <a 
            href="#visualizations" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg transition-colors"
          >
            View Results
          </a>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
