import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_URL } from '@/server/lib/env';
import { pageMetadata } from '@/shared/lib/page-metadata';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { TrpcProvider } from './providers/trpc-provider';
import './styles/fonts.css';
import './styles/global.css';
import './styles/motion.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ path: '/' }),
  // no page of its own to point at, the 404 inherits this
  alternates: undefined,
};

// resolve theme and prove JS before first paint
const THEME_SCRIPT = `(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  try {
    if (localStorage.getItem('theme') === 'dusk') root.setAttribute('data-theme', 'dusk');
  } catch (_) {}
})();`;

// prerender same-site pages on hover so view transitions feel instant
const SPECULATION_RULES = JSON.stringify({
  prerender: [
    {
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/api/*' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // the theme script edits this element's attributes before hydration
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: SPECULATION_RULES }} />
        {/* the name and body text paint in their real faces, no swap flash */}
        <link rel="preload" href="/fonts/basteleur/Basteleur-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/karrik/Karrik-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <TrpcProvider>
          <Header />
          <main className="wrap">{children}</main>
          <Footer />
        </TrpcProvider>
      </body>
    </html>
  );
}
