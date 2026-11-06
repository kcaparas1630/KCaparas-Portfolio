'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './theme-toggle.module.css';

/* Dusk toggle. The icon is driven by [data-theme] in CSS, so it is right
 * before any JS runs. The switch spreads as a circle from the button. */

const isDusk = () => document.documentElement.getAttribute('data-theme') === 'dusk';

function apply() {
  const root = document.documentElement;
  const toDusk = !isDusk();
  if (toDusk) root.setAttribute('data-theme', 'dusk');
  else root.removeAttribute('data-theme');
  try {
    localStorage.setItem('theme', toDusk ? 'dusk' : 'paper');
  } catch {}
}

function reveal(button: HTMLButtonElement, update: () => void) {
  const root = document.documentElement;
  const box = button.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.classList.add('theme-switching');
  const transition = document.startViewTransition(update);
  transition.ready.then(
    () =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 650,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      ),
    () => {},
  );
  transition.finished.finally(() => root.classList.remove('theme-switching'));
}

export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);

  // the theme is resolved by the inline head script before hydration
  useEffect(() => {
    setPressed(isDusk());
  }, []);

  function handleClick() {
    const button = buttonRef.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // startViewTransition runs its callback later, so the state is read in there
    const update = () => {
      apply();
      setPressed(isDusk());
    };
    if (!button || !document.startViewTransition || reduced) update();
    else reveal(button, update);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.toggle}
      data-theme-toggle
      aria-label="Dusk theme"
      aria-pressed={pressed}
      onClick={handleClick}
    >
      <svg className={`${styles.icon} ${styles.sun}`} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className={`${styles.icon} ${styles.moon}`} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
