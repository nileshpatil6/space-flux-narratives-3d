
import { useRef, useEffect } from 'react';
import { setupFadeInAnimations } from '../../lib/gsapUtils';
import { Tree, TreePine, TreeDeciduous, Globe, Cloud } from 'lucide-react';
import gsap from 'gsap';

const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const naturePanelRef = useRef<HTMLDivElement>(null);
  const statsPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Setup fade animations
    setupFadeInAnimations('.fade-element');
    
    // Animate the nature panel
    if (naturePanelRef.current) {
      const trees = naturePanelRef.current.querySelectorAll('.tree-element');
      
      gsap.from(trees, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: naturePanelRef.current,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none reset'
        }
      });
      
      // Gentle swaying animation for trees
      trees.forEach((tree) => {
        gsap.to(tree, {
          rotation: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "bottom center"
        });
      });
    }
    
    // Animate stats with moving values
    if (statsPanelRef.current) {
      const statElements = statsPanelRef.current.querySelectorAll('.stat-element');
      
      gsap.from(statElements, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: statsPanelRef.current,
          start: 'top bottom-=100',
          end: 'center center',
          toggleActions: 'play none none reset'
        }
      });
      
      // Add hover effect to stats cards
      statElements.forEach((stat) => {
        stat.addEventListener('mouseenter', () => {
          gsap.to(stat, {
            y: -10,
            boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
            duration: 0.3
          });
        });
        
        stat.addEventListener('mouseleave', () => {
          gsap.to(stat, {
            y: 0,
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            duration: 0.3
          });
        });
      });
    }
    
    // Create moving clouds
    const createClouds = () => {
      const cloudContainer = document.createElement('div');
      cloudContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';
      sectionRef.current?.appendChild(cloudContainer);
      
      for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'absolute';
        
        // Random cloud positioning
        cloud.style.top = `${10 + Math.random() * 40}%`;
        cloud.style.left = `${-20}%`;
        cloud.style.opacity = `${0.5 + Math.random() * 0.3}`;
        cloud.style.zIndex = '1';
        
        const cloudIcon = document.createElement('div');
        cloudIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>';
        cloudIcon.className = 'text-white/20 dark:text-white/10';
        
        cloud.appendChild(cloudIcon);
        cloudContainer.appendChild(cloud);
        
        // Animate cloud movement
        gsap.to(cloud, {
          x: `${window.innerWidth + 100}px`,
          duration: 25 + i * 10,
          repeat: -1,
          ease: "none",
          delay: i * 5
        });
      }
    };
    
    createClouds();
  }, []);

  return (
    <section 
      id="action" 
      ref={sectionRef}
      className="section py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-primary/10 opacity-50"></div>
      
      {/* Moving background elements */}
      <div className="nebula-bg absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] opacity-30"></div>
      <div className="nebula-bg absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] opacity-30"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center fade-element">
          Take <span className="text-primary">Action</span>
        </h2>
        
        {/* Key stats in more visual format */}
        <div ref={statsPanelRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="stat-element glassmorphism p-6 rounded-lg text-center hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 -rotate-12 opacity-10">
              <Globe size={80} />
            </div>
            <div className="text-5xl font-bold text-primary mb-4">1.1°</div>
            <h4 className="text-lg font-medium">Global Temperature Rise</h4>
            <p className="text-sm text-muted-foreground mt-2">Above pre-industrial levels</p>
          </div>
          
          <div className="stat-element glassmorphism p-6 rounded-lg text-center hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 -rotate-12 opacity-10">
              <Cloud size={80} />
            </div>
            <div className="text-5xl font-bold text-primary mb-4">415</div>
            <h4 className="text-lg font-medium">CO₂ PPM</h4>
            <p className="text-sm text-muted-foreground mt-2">Atmospheric concentration</p>
          </div>
          
          <div className="stat-element glassmorphism p-6 rounded-lg text-center hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 -rotate-12 opacity-10">
              <Globe size={80} />
            </div>
            <div className="text-5xl font-bold text-primary mb-4">2050</div>
            <h4 className="text-lg font-medium">Net Zero Target</h4>
            <p className="text-sm text-muted-foreground mt-2">For climate stabilization</p>
          </div>
        </div>
        
        {/* Nature visualization panel */}
        <div ref={naturePanelRef} className="mb-16 py-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-500/10 rounded-xl"></div>
          
          <div className="flex justify-center items-end space-x-4 md:space-x-8 h-32 relative py-4">
            {[...Array(7)].map((_, i) => {
              const treeTypes = [TreePine, TreeDeciduous, Tree];
              const TreeComponent = treeTypes[i % treeTypes.length];
              const size = 24 + Math.floor(i / 2) * 8;
              
              return (
                <div 
                  key={i} 
                  className="tree-element flex flex-col items-center justify-end"
                  style={{ transform: `translateY(${Math.sin(i) * 10}px)` }}
                >
                  <TreeComponent 
                    size={size} 
                    className={`text-green-${500 - (i % 3) * 100} mb-1`} 
                  />
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our forests absorb 2.6 billion tons of CO₂ annually — 
              about one-third of emissions from burning fossil fuels
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group">
            <span>Share Your Climate Story</span>
            <Globe 
              size={20} 
              className="transform transition-transform group-hover:rotate-45"
            />
          </button>
          <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg transition-colors">
            Join Climate Action
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes nebulaMove {
          0% { transform: translate(0, 0); }
          50% { transform: translate(5%, 5%); }
          100% { transform: translate(0, 0); }
        }
        
        .nebula-bg {
          animation: nebulaMove 20s infinite ease-in-out;
        }
        
        .nebula-bg:nth-of-type(2) {
          animation-delay: -10s;
        }
      `}</style>
    </section>
  );
};

export default CallToAction;
