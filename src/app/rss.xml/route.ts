import { formatTag, postHref } from '@/entities/post';
import { getPublishedPosts } from '@/server/lib/content/posts';
import { SITE_URL } from '@/server/lib/env';

export const dynamic = 'force-static';

const TITLE = 'Kent Caparas, writing';
const DESCRIPTION =
  'Notes from deploying AI with real teams, the things I build, and whatever I learned this week.';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getPublishedPosts();
  const items = posts
    .map((post) => {
      const link = escapeXml(new URL(postHref(post), SITE_URL).href);
      return [
        '<item>',
        `<title>${escapeXml(post.data.title)}</title>`,
        `<link>${link}</link>`,
        `<guid isPermaLink="true">${link}</guid>`,
        `<description>${escapeXml(post.data.excerpt)}</description>`,
        `<pubDate>${post.data.date.toUTCString()}</pubDate>`,
        `<category>${escapeXml(formatTag(post.data.tag))}</category>`,
        '</item>',
      ].join('');
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(TITLE)}</title><description>${escapeXml(DESCRIPTION)}</description><link>${SITE_URL}/</link><language>en-us</language>${items}</channel></rss>`;

  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
