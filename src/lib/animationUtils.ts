
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { animateGlobeOnScroll } from './gsapUtils';

// Register all GSAP plugins needed
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Setup all animations for the site
 */
export const setupAnimations = () => {
  if (typeof window === 'undefined') return;
  
  // Create timeline for initial page load animations
  const mainTimeline = gsap.timeline();
  
  // Animate the stars container
  gsap.fromTo('.stars-container', 
    { opacity: 0 },
    { opacity: 1, duration: 2 }
  );
  
  // Animate intro section elements
  gsap.utils.toArray('.fade-element').forEach((element: any, i) => {
    gsap.fromTo(
      element,
      { 
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2 * i,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        }
      }
    );
  });
  
  // Animate visualization cards with staggered effect
  gsap.fromTo(
    '.glassmorphism',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: '#visualizations',
        start: 'top center',
      }
    }
  );
  
  // Add parallax depth effect to sections
  gsap.utils.toArray('section').forEach((section: any) => {
    const depth = section.dataset.depth || 0.2;
    
    gsap.fromTo(
      section.querySelector('.container'),
      {
        y: 0
      },
      {
        y: 100 * depth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
  
  // Create floating animation for some elements
  gsap.utils.toArray('.float-element').forEach((element: any) => {
    gsap.to(element, {
      y: '-=20',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  });
  
  // Setup moving nebula background effect
  const nebulas = document.querySelectorAll('.nebula');
  nebulas.forEach((nebula: any) => {
    gsap.to(nebula, {
      backgroundPosition: `${Math.random() * 100}% ${Math.random() * 100}%`,
      duration: 50 + Math.random() * 50,
      repeat: -1,
      yoyo: true,
      ease: "none"
    });
  });

  // Setup interactive elements
  setupInteractiveElements();
};

/**
 * Setup interactive elements that respond to user actions
 */
const setupInteractiveElements = () => {
  // Make buttons have a space-themed hover effect
  gsap.utils.toArray('button, a').forEach((element: any) => {
    element.addEventListener('mouseenter', () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: "0 0 15px rgba(0, 150, 255, 0.7)"
      });
    });
    
    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: "none"
      });
    });
  });
  
  // Setup scroll to sections with smooth animation
  document.querySelectorAll('a[href^="#"]').forEach((anchor: any) => {
    anchor.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: targetElement,
            offsetY: 80
          },
          ease: "power3.inOut"
        });
      }
    });
  });
};

/**
 * Setup cosmic background animations
 */
export const setupCosmicBackground = () => {
  // Add nebula clouds to background
  const addNebulaElements = () => {
    const body = document.body;
    
    for (let i = 0; i < 3; i++) {
      const nebula = document.createElement('div');
      nebula.className = 'nebula';
      nebula.style.opacity = (0.1 + Math.random() * 0.1).toString();
      nebula.style.left = `${Math.random() * 100}%`;
      nebula.style.top = `${Math.random() * 100}%`;
      nebula.style.width = `${300 + Math.random() * 500}px`;
      nebula.style.height = `${300 + Math.random() * 500}px`;
      body.appendChild(nebula);
    }
  };
  
  if (typeof window !== 'undefined') {
    addNebulaElements();
  }
};
