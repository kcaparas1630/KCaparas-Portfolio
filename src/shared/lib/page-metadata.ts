import type { Metadata } from 'next';

const DEFAULT_TITLE = 'kent caparas';
const DEFAULT_DESCRIPTION =
  "i build things. use cases excite me. ai forward deployed developer at trelent, wiring private ai into the workflows quietly draining a team's hours.";

interface PageMeta {
  path: string;
  title?: string;
  description?: string;
}

// Next replaces openGraph, twitter and alternates wholesale rather than merging
// them with the layout's, so every page declares the full set here.
export function pageMetadata({ path, title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION }: PageMeta): Metadata {
  return {
    title,
    description,
    openGraph: { type: 'website', title, description, url: path },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: path,
      types: { 'application/rss+xml': [{ url: '/rss.xml', title: 'Kent Caparas, writing' }] },
    },
  };
}
