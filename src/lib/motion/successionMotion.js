export const successionMotion = Object.freeze({
  ease: Object.freeze([0.2, 0.75, 0.25, 1]),
  durations: Object.freeze({
    micro: 0.16,
    state: 0.34,
    narrative: 0.68,
  }),
  spring: Object.freeze({
    type: 'spring',
    stiffness: 220,
    damping: 30,
    mass: 0.9,
  }),
});

let gsapRuntimePromise;

export function loadNarrativeGsap() {
  if (!gsapRuntimePromise) {
    gsapRuntimePromise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    });
  }
  return gsapRuntimePromise;
}

export const narrativeMotionAllowed = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
