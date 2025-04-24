
import { useEffect, useRef } from 'react';
import Globe from '../globe/Globe';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }
    ).fromTo(
      taglineRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8" // start before the previous animation finishes
    ).fromTo(
      ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    ).fromTo(
      globeContainerRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5 },
      "-=1"
    );
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/60 z-0"></div>
      
      {/* Hero content container */}
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 
              ref={titleRef}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Tell Us a <span className="gradient-text">Climate Story</span>
            </h1>
            
            <p 
              ref={taglineRef}
              className="text-xl md:text-2xl mb-8 text-muted-foreground"
            >
              Visualizing the Greenhouse Gas Story Through Interactive Data
            </p>
            
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#visualizations" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Explore the Data
              </a>
              
              <a 
                href="#introduction" 
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
          
          {/* Globe visualization */}
          <div 
            ref={globeContainerRef} 
            className="lg:w-1/2 max-w-[500px] aspect-square"
          >
            <Globe showControls={true} />
          </div>
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#introduction" aria-label="Scroll down">
          <ArrowDown className="text-muted-foreground" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
