
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
      className="section bg-secondary/5 relative"
    >
      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-10 text-center fade-element">
          Data Source & Methodology
        </h2>
        
        <div className="space-y-10">
          <div className="glassmorphism p-6 fade-element">
            <h3 className="text-xl font-semibold mb-4 text-primary">Our Data Sources</h3>
            
            <div className="space-y-4">
              <p>
                This project integrates climate data from multiple authoritative sources to provide a comprehensive 
                view of greenhouse gas emissions and their effects:
              </p>
              
              <ul className="space-y-3 pl-5">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                  <div>
                    <strong className="font-medium">US Greenhouse Gas Center</strong>
                    <p className="text-sm text-muted-foreground">
                      Providing historical and current atmospheric greenhouse gas measurements and 
                      emission estimates specific to different regions and sectors.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                  <div>
                    <strong className="font-medium">NASA GISS Surface Temperature Analysis</strong>
                    <p className="text-sm text-muted-foreground">
                      Temperature anomaly data showing how global surface temperatures have changed over time.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                  <div>
                    <strong className="font-medium">NOAA Global Monitoring Laboratory</strong>
                    <p className="text-sm text-muted-foreground">
                      Long-term measurements of atmospheric composition, providing trends in 
                      greenhouse gas concentrations.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glassmorphism p-6 fade-element">
              <h3 className="text-xl font-semibold mb-4 text-primary">Data Processing</h3>
              <p className="mb-4">
                Raw climate data undergoes several processing steps before visualization:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Collection from public APIs and datasets</li>
                <li>Normalization and cleaning to ensure consistency</li>
                <li>Temporal aggregation (yearly, decadal averages)</li>
                <li>Spatial interpolation for global coverage</li>
                <li>Statistical analysis to identify trends</li>
              </ol>
            </div>
            
            <div className="glassmorphism p-6 fade-element">
              <h3 className="text-xl font-semibold mb-4 text-primary">Visualization Approach</h3>
              <p className="mb-4">
                Our visualizations are designed to make complex climate data accessible:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Interactive 3D globe for spatial context</li>
                <li>Time series charts for historical trends</li>
                <li>Comparative visualizations across regions</li>
                <li>Color-coded indicators for severity levels</li>
                <li>Responsive design for all device types</li>
              </ul>
            </div>
          </div>
          
          <div className="glassmorphism p-6 fade-element">
            <h3 className="text-xl font-semibold mb-4 text-primary">Limitations & Considerations</h3>
            <p className="mb-4">
              While we strive for accuracy and clarity, it's important to acknowledge certain limitations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Data Uncertainties</h4>
                <p className="text-sm text-muted-foreground">
                  Historical records may have gaps or varying degrees of precision, especially for 
                  older time periods or less monitored regions.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Simplification</h4>
                <p className="text-sm text-muted-foreground">
                  Climate systems are extremely complex. Our visualizations necessarily simplify 
                  certain aspects to make them more accessible.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center fade-element">
            <a 
              href="#visualizations" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors"
            >
              Explore the Visualizations
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
