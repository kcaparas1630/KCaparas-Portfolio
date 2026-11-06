'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/features/theme-toggle';
import styles from './header.module.css';

interface NavLink {
  label: string;
  href: string;
}

const LINKS: NavLink[] = [
  { label: 'work', href: '/projects' },
  { label: 'writing', href: '/blog' },
  { label: 'wall', href: '/wall' },
];

// Plain anchors on purpose: full navigations keep the cross-document view
// transitions and speculation-rules prerendering the motion design relies on.
export function Header() {
  const pathname = usePathname();
  const isCurrent = (href: string) => !href.includes('#') && pathname.startsWith(href);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a className={styles.brand} href="/" aria-current={pathname === '/' ? 'page' : undefined}>
          kent caparas<span className={styles.dot}>.</span>
        </a>
        <nav className={styles.nav} aria-label="Main">
          {LINKS.map((link) => (
            <a
              key={link.href}
              className={styles.link}
              href={link.href}
              aria-current={isCurrent(link.href) ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
