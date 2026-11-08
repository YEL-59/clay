import gsap from 'gsap';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function animatePageEnter(container: HTMLElement | null): void {
  if (!container || prefersReducedMotion()) return;
  const words = container.querySelectorAll('.head__title .w > span');
  const stats = container.querySelectorAll('.stat');
  const cards = container.querySelectorAll('[data-in]');

  gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .fromTo(
      words,
      { yPercent: 105 },
      { yPercent: 0, duration: 0.9, stagger: 0.06, clearProps: 'transform' },
      0
    )
    .fromTo(
      stats,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, clearProps: 'transform,opacity' },
      0.12
    )
    .fromTo(
      cards,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, clearProps: 'transform,opacity' },
      0.16
    );
}

export function animateNumber(
  el: HTMLElement | null,
  targetValue: number,
  formatter: (val: number) => string,
  delay = 0.15
): void {
  if (!el) return;
  if (prefersReducedMotion()) {
    el.textContent = formatter(targetValue);
    return;
  }
  const state = { v: 0 };
  gsap.to(state, {
    v: targetValue,
    duration: 1.2,
    delay,
    ease: 'power3.out',
    onUpdate: () => {
      el.textContent = formatter(state.v);
    },
  });
}

export function animateBounce(el: HTMLElement | null): void {
  if (!el || prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { scale: 0.94 },
    { scale: 1, duration: 0.6, ease: 'back.out(2.4)', clearProps: 'transform' }
  );
}

export function runViewTransition(triggerEl: HTMLElement | null, callback: () => void): void {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  if (!doc.startViewTransition || prefersReducedMotion()) {
    callback();
    return;
  }
  const rect = triggerEl?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : 0;
  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  doc
    .startViewTransition(callback)
    .ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 520,
          easing: 'cubic-bezier(.2,.8,.2,1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {});
}
