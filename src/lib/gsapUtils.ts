
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import TextPlugin from 'gsap/TextPlugin';

// Initialize GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);
}

/**
 * Sets up fade-in animations for elements as they enter the viewport
 * @param selector CSS selector for elements to animate
 */
export const setupFadeInAnimations = (selector: string) => {
  if (typeof window === 'undefined') return;
  
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    gsap.fromTo(
      element,
      { 
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: index * 0.1, // Stagger effect
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: 'top bottom-=100',
          toggleActions: 'play none none none'
        }
      }
    );
  });
};

/**
 * Creates a scroll-based animation for the globe
 * @param globeRef Reference to the globe element
 */
export const animateGlobeOnScroll = (globeRef: React.RefObject<HTMLDivElement>) => {
  if (typeof window === 'undefined' || !globeRef.current) return;

  // Create more dynamic animation for the globe
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#visualizations',
      start: 'top center',
      end: 'bottom center',
      scrub: true
    }
  });
  
  tl.to(globeRef.current, {
    scale: 1.2,
    rotation: 15,
    duration: 1
  }).to(globeRef.current, {
    scale: 1.1,
    rotation: -5,
    duration: 1
  }).to(globeRef.current, {
    scale: 1.3,
    rotation: 0,
    duration: 1
  });
};

/**
 * Sets up a pinned element with content that slides in from the sides
 * @param pinSelector Element to pin
 * @param panelsSelector Panels that will slide in
 */
export const setupPinnedSections = (pinSelector: string, panelsSelector: string) => {
  if (typeof window === 'undefined') return;
  
  const panels = gsap.utils.toArray(panelsSelector);
  
  // Create a more dynamic pinned section with 3D perspective
  gsap.set(panels, { perspective: 1000 });
  
  gsap.timeline({
    scrollTrigger: {
      trigger: pinSelector,
      start: 'top top',
      end: `+=${panels.length * 100}%`,
      pin: true,
      pinSpacing: true,
      scrub: true
    }
  });

  panels.forEach((panel, i) => {
    const direction = i % 2 === 0 ? -1 : 1;
    const rotation = i % 2 === 0 ? 10 : -10;
    
    gsap.fromTo(
      panel as Element,
      { 
        x: `${direction * 100}%`,
        opacity: 0,
        rotationY: rotation
      },
      {
        x: 0,
        opacity: 1,
        rotationY: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel as Element,
          start: 'top bottom',
          end: 'top center',
          scrub: true
        }
      }
    );
  });
};

/**
 * Helper to animate counters for statistics with a more engaging effect
 * @param selector Element containing the number to animate
 * @param endValue Target value
 * @param duration Animation duration in seconds
 * @param suffix Optional suffix to add after the number (like %)
 */
export const animateCounter = (selector: string, endValue: number, duration: number = 2, suffix: string = '') => {
  if (typeof window === 'undefined') return;
  
  const element = document.querySelector(selector);
  if (!element) return;

  // Set initial text to 0
  if (element.textContent !== null) {
    element.textContent = '0' + suffix;
  }
  
  // Create a more dynamic counter animation with easing
  gsap.to({}, {
    duration: duration,
    onUpdate: function() {
      const progress = gsap.getProperty(this, "progress");
      // Use eased progress for a more natural counting effect
      const easedProgress = gsap.parseEase("power2.out")(progress as number);
      const currentValue = Math.round(easedProgress * endValue);
      
      if (element && element.textContent !== null) {
        element.textContent = currentValue + suffix;
      }
    },
    scrollTrigger: {
      trigger: element,
      start: 'top bottom-=100',
      toggleActions: 'play none none reset'
    }
  });
  
  // Add a highlight effect when the counter completes
  gsap.to(element, {
    color: '#38bdf8',
    textShadow: '0 0 10px rgba(56, 189, 248, 0.7)',
    duration: 0.5,
    delay: duration,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom-=100',
    }
  });
};

/**
 * Creates animated text reveal effects
 * @param selector Element containing text to animate
 */
export const animateTextReveal = (selector: string) => {
  if (typeof window === 'undefined') return;
  
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element) => {
    const text = element.textContent;
    element.textContent = '';
    
    gsap.to(element, {
      duration: 2,
      text: {
        value: text,
        delimiter: ''
      },
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        toggleActions: 'play none none none'
      }
    });
  });
};

/**
 * Creates animated path drawing effect for SVG elements
 * @param svgSelector SVG element selector
 * @param pathSelector Path element selector within the SVG
 */
export const animateSvgPath = (svgSelector: string, pathSelector: string) => {
  if (typeof window === 'undefined') return;
  
  const paths = document.querySelectorAll(`${svgSelector} ${pathSelector}`);
  
  paths.forEach((path: any) => {
    const length = path.getTotalLength();
    
    // Set up the starting position
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1
    });
    
    // Animate the path drawing
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: path,
        start: 'top bottom-=100',
        toggleActions: 'play none none reset'
      }
    });
  });
};

/**
 * Creates a 3D rotation effect on mouse movement
 * @param selector Element to apply the effect to
 * @param intensity Effect intensity (default: 15)
 */
export const create3DRotationEffect = (selector: string, intensity: number = 15) => {
  if (typeof window === 'undefined') return;
  
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element: HTMLElement) => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (centerY - y) / centerY * intensity;
      const rotateY = (x - centerX) / centerX * intensity;
      
      gsap.to(element, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out"
      });
    });
    
    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    });
  });
};
