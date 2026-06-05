import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register what we certainly have; ScrollSmoother may be unavailable (Club GSAP plugin)
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize GSAP ScrollSmoother if it's available; otherwise noop gracefully.
 * @param {object} config - The configuration object for ScrollSmoother.create().
 * @param {string} config.wrapper - The selector for the wrapper element.
 * @param {string} config.content - The selector for the content element.
 */
export const useScrollSmoother = (config) => {
  useLayoutEffect(() => {
    let smoother = null;
    let cancelled = false;

    (async () => {
      try {
        const mod = await import(/* @vite-ignore */ 'gsap/ScrollSmoother');
        const ScrollSmoother = mod.ScrollSmoother || mod.default || mod;
        if (cancelled || !ScrollSmoother) return;
        gsap.registerPlugin(ScrollSmoother);
        smoother = ScrollSmoother.create(config);
      } catch (err) {
        // If the plugin isn't available (non-Club build), skip without breaking the app.
        if (import.meta?.env?.DEV) {
          console.warn('ScrollSmoother not available; continuing without it.', err);
        }
      }
    })();

    return () => {
      cancelled = true;
      try { smoother?.kill?.(); } catch { /* noop */ }
    };
  }, [config]);
};
