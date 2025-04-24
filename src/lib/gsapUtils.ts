
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Initialize GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sets up fade-in animations for elements as they enter the viewport
 * @param selector CSS selector for elements to animate
 */
export const setupFadeInAnimations = (selector: string) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element) => {
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
  if (!globeRef.current) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: '#visualizations',
      start: 'top center',
      end: 'bottom center',
      scrub: true
    }
  }).to(globeRef.current, {
    scale: 1.2,
    duration: 1
  });
};

/**
 * Sets up a pinned element with content that slides in from the sides
 * @param pinSelector Element to pin
 * @param panelsSelector Panels that will slide in
 */
export const setupPinnedSections = (pinSelector: string, panelsSelector: string) => {
  const panels = gsap.utils.toArray(panelsSelector);
  
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
    
    gsap.fromTo(
      panel,
      { 
        x: `${direction * 100}%`,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'top center',
          scrub: true
        }
      }
    );
  });
};

/**
 * Helper to animate counters for statistics
 * @param selector Element containing the number to animate
 * @param endValue Target value
 * @param duration Animation duration in seconds
 */
export const animateCounter = (selector: string, endValue: number, duration: number = 2) => {
  const element = document.querySelector(selector);
  if (!element) return;

  let startValue = 0;
  const increment = endValue / (duration * 60); // 60fps
  
  gsap.to({}, {
    duration: duration,
    onUpdate: function() {
      startValue += increment;
      element.textContent = Math.floor(startValue).toString();
    },
    scrollTrigger: {
      trigger: element,
      start: 'top bottom-=100',
      toggleActions: 'play none none none'
    }
  });
};
