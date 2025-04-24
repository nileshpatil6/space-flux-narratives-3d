
import { useEffect, useRef } from 'react';
import { setupFadeInAnimations } from '../../lib/gsapUtils';

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
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center fade-element">
          Understanding Our Climate Challenge
        </h2>
        
        <div className="space-y-8 text-lg">
          <p className="fade-element">
            Climate change represents one of the most significant challenges of our time. 
            The Earth's climate has always fluctuated naturally over long periods, but the 
            rapid changes we're experiencing today are primarily driven by human activities.
          </p>
          
          <div className="p-6 glassmorphism fade-element">
            <h3 className="text-xl font-semibold mb-3 text-primary">The Greenhouse Effect</h3>
            <p>
              Greenhouse gases in our atmosphere, like carbon dioxide (CO₂) and methane (CH₄), 
              act like a blanket, trapping heat and warming the planet. This natural process 
              is essential for life on Earth, but human activities have intensified it by 
              dramatically increasing greenhouse gas concentrations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-element">
            <div className="p-5 glassmorphism">
              <h4 className="font-semibold text-lg mb-2">Primary Causes</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Burning fossil fuels for energy</li>
                <li>Deforestation and land use changes</li>
                <li>Industrial processes</li>
                <li>Agricultural practices</li>
              </ul>
            </div>
            
            <div className="p-5 glassmorphism">
              <h4 className="font-semibold text-lg mb-2">Observable Impacts</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Rising global temperatures</li>
                <li>Melting ice sheets and glaciers</li>
                <li>Sea level rise</li>
                <li>Extreme weather events</li>
              </ul>
            </div>
          </div>
          
          <p className="fade-element">
            Through interactive data visualization, this project aims to help you explore 
            and understand these complex climate patterns. By making the data accessible 
            and engaging, we hope to inspire informed action and collaboration on climate solutions.
          </p>
          
          <div className="fade-element flex justify-center mt-12">
            <a 
              href="#methodology" 
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg transition-colors"
            >
              Continue to Methodology
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
