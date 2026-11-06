import type { GlobeWord } from '../lib/globe-geometry';
import { GlobeCanvas } from './GlobeCanvas';
import styles from './hero.module.css';
import glitch from './glitch.module.css';

interface Props {
  looseWords: GlobeWord[];
}

export function Hero({ looseWords }: Props) {
  return (
    <section className={styles.hero} data-hero>
      <div className={styles.inner}>
        <div className={styles.text}>
          <h1 className={styles.name}>
            <span className={glitch.glitch} data-text="kent caparas.">
              kent caparas<span className={styles.dot}>.</span>
            </span>
          </h1>
          <p className={styles.tagline}>
            <span className={styles.slashes}>//</span> i build things. use cases excite me.
          </p>
          <p className={styles.role}>
            ai forward deployed developer at{' '}
            <a href="https://trelent.com" rel="noopener" target="_blank">
              trelent
            </a>
            . i wire private ai into the workflows quietly draining a team&apos;s hours.
          </p>
        </div>

        <div className={styles.slot} data-globe-slot>
          <GlobeCanvas looseWords={looseWords} />
          <p className={styles.hint} aria-hidden="true">
            drag to spin · click a <span>colored</span> word
          </p>
        </div>
      </div>
    </section>
  );
}
