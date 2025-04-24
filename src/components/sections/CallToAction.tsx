
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
      className="section py-20 relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/10 opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center fade-element">
          Conclusions & Call to Action
        </h2>
        
        <div className="glassmorphism p-8 mb-12 fade-element">
          <h3 className="text-2xl font-semibold mb-4 text-primary">Key Takeaways</h3>
          
          <div className="space-y-4 mb-6">
            <p>
              The data visualized in this project highlights several critical facts about our climate:
            </p>
            
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                <p>
                  Greenhouse gas concentrations are rising at an unprecedented rate, primarily due to human activities.
                </p>
              </li>
              
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                <p>
                  Global temperatures are increasing as a direct result, with significant regional variations.
                </p>
              </li>
              
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                <p>
                  The changes we're observing today are occurring at a pace far exceeding natural climate cycles.
                </p>
              </li>
              
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                <p>
                  Without significant action, these trends will continue, leading to potentially severe consequences.
                </p>
              </li>
            </ul>
          </div>
          
          <p className="text-muted-foreground italic">
            "The data tells a clear story: our climate is changing rapidly, and human activities are the primary driver. 
            But data also gives us hope - it shows that our actions can make a meaningful difference."
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glassmorphism p-6 fade-element">
            <h3 className="text-xl font-semibold mb-4 text-primary">What You Can Do</h3>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                <div>
                  <strong className="font-medium">Reduce Energy Consumption</strong>
                  <p className="text-sm text-muted-foreground">
                    Improve home efficiency, opt for renewable energy sources, and choose energy-efficient appliances.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                <div>
                  <strong className="font-medium">Sustainable Transportation</strong>
                  <p className="text-sm text-muted-foreground">
                    Walk, cycle, use public transportation, or switch to electric vehicles when possible.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 mr-3"></span>
                <div>
                  <strong className="font-medium">Support Climate Policies</strong>
                  <p className="text-sm text-muted-foreground">
                    Vote for candidates who prioritize climate action and advocate for climate-smart policies.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="glassmorphism p-6 fade-element">
            <h3 className="text-xl font-semibold mb-4 text-primary">Get Involved</h3>
            
            <div className="space-y-4">
              <p>
                Join the growing movement of individuals and organizations working to address climate change:
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <a 
                  href="#" 
                  className="block p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  <h4 className="font-medium">Climate Action Organizations</h4>
                  <p className="text-sm text-muted-foreground">Connect with groups working on climate solutions</p>
                </a>
                
                <a 
                  href="#" 
                  className="block p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  <h4 className="font-medium">Educational Resources</h4>
                  <p className="text-sm text-muted-foreground">Learn more about climate science and solutions</p>
                </a>
                
                <a 
                  href="#" 
                  className="block p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  <h4 className="font-medium">Community Initiatives</h4>
                  <p className="text-sm text-muted-foreground">Find local projects you can participate in</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center max-w-2xl mx-auto fade-element">
          <h3 className="text-2xl font-semibold mb-6">
            Share This Climate Story
          </h3>
          
          <p className="mb-8">
            Help spread awareness by sharing this visualization with your network. 
            The more people understand our climate data, the more effectively we 
            can work together toward solutions.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-[#1da1f2] hover:bg-[#1da1f2]/90 text-white px-6 py-3 rounded-lg transition-colors">
              Share on Twitter
            </button>
            <button className="bg-[#4267B2] hover:bg-[#4267B2]/90 text-white px-6 py-3 rounded-lg transition-colors">
              Share on Facebook
            </button>
            <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg transition-colors">
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
