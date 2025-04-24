
import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { EnhancedGlobe } from '../globe/EnhancedGlobe';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Hero animation timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
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
      { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.7)" },
      "-=1"
    );
    
    // Create parallax effect for the hero section
    if (heroRef.current && globeContainerRef.current) {
      window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20;
        const y = (clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to(globeContainerRef.current, {
          x: x,
          y: y,
          duration: 1,
          ease: "power2.out"
        });
      });
    }
    
    // Animate the arrow
    gsap.to('[data-arrow-down]', {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  return (
    <section 
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16 transition-colors"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/70 z-0"></div>
      
      {/* Add nebula effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-[100px] animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px] animate-pulse z-0"></div>
      
      {/* Hero content container */}
      <div className="container mx-auto relative z-10 flex flex-col items-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 w-full max-w-7xl">
          
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-6xl font-bold mb-6 text-glow"
            >
              Tell Us a <span className="gradient-text">Climate Story</span>
            </h1>
            
            <p 
              ref={taglineRef}
              className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-lg"
            >
              Visualizing our changing planet through interactive climate data
            </p>
            
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#visualizations" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Explore Data
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
            className="lg:w-1/2 max-w-[500px] aspect-square float-element"
          >
            <EnhancedGlobe />
          </div>
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2" data-arrow-down>
        <a href="#introduction" aria-label="Scroll down" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
          <span className="mb-2 text-sm">Scroll Down</span>
          <ArrowDown className="animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
