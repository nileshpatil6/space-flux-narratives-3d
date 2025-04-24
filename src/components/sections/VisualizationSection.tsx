
import { useRef, useEffect, useState } from 'react';
import DataDashboard from '../data/DataDashboard';
import Globe from '../globe/Globe';
import { setupPinnedSections } from '../../lib/gsapUtils';

const VisualizationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!sectionRef.current) return;
    
    const panels = document.querySelectorAll('.vis-panel');
    if (panels.length > 0) {
      setupPinnedSections('#globe-container', '.vis-panel');
    }

    // Initialize GSAP animations
    const initScrollTriggers = () => {
      if (typeof window !== 'undefined') {
        import('../../lib/gsapUtils').then(({ setupFadeInAnimations }) => {
          setupFadeInAnimations('.fade-element');
        });
      }
    };

    initScrollTriggers();
  }, []);

  return (
    <section 
      id="visualizations" 
      ref={sectionRef}
      className="min-h-screen py-20 relative"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-center fade-element">
          Interactive Visualizations
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
            className="aspect-square max-w-[500px] mx-auto fade-element"
          >
            {isClient && <Globe />}
          </div>
          
          {/* Data dashboard */}
          <div className="fade-element">
            <DataDashboard />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-2xl font-bold mb-6 text-center fade-element">
            Key Insights from the Data
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glassmorphism p-6 fade-element">
              <div className="text-5xl font-bold text-primary mb-2">+1.1°C</div>
              <h4 className="text-lg font-medium mb-2">Global Warming</h4>
              <p className="text-sm text-muted-foreground">
                Average global temperature has risen 1.1°C above pre-industrial levels, 
                with significant regional variations.
              </p>
            </div>
            
            <div className="glassmorphism p-6 fade-element">
              <div className="text-5xl font-bold text-primary mb-2">420<span className="text-xl">ppm</span></div>
              <h4 className="text-lg font-medium mb-2">CO₂ Concentration</h4>
              <p className="text-sm text-muted-foreground">
                Atmospheric carbon dioxide has reached levels not seen in over 
                800,000 years, continuing to rise annually.
              </p>
            </div>
            
            <div className="glassmorphism p-6 fade-element">
              <div className="text-5xl font-bold text-primary mb-2">1900<span className="text-xl">ppb</span></div>
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
    </section>
  );
};

export default VisualizationSection;
