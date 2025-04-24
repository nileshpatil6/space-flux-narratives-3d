
import { useRef, useEffect } from 'react';
import { setupFadeInAnimations } from '../../lib/gsapUtils';
import { Globe2, Wind, TreePine, Mountain } from 'lucide-react';

const Introduction = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    setupFadeInAnimations('.fade-element');
  }, []);

  return (
    <section 
      id="introduction" 
      ref={sectionRef}
      className="section pb-24 relative"
    >
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center fade-element">
          Climate Impact Visualization
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-element">
          <div className="p-6 glassmorphism hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <Globe2 className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Global Impact</h3>
            <p className="text-sm text-center text-muted-foreground">
              Worldwide temperature changes and their effects
            </p>
          </div>
          
          <div className="p-6 glassmorphism hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <Wind className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Atmosphere</h3>
            <p className="text-sm text-center text-muted-foreground">
              Greenhouse gas concentrations
            </p>
          </div>
          
          <div className="p-6 glassmorphism hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <TreePine className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Ecosystems</h3>
            <p className="text-sm text-center text-muted-foreground">
              Impact on natural habitats
            </p>
          </div>
          
          <div className="p-6 glassmorphism hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <Mountain className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Geography</h3>
            <p className="text-sm text-center text-muted-foreground">
              Regional climate patterns
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-12 fade-element">
          <a 
            href="#visualizations" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg transition-colors"
          >
            Explore Data
          </a>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
