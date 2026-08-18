import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/Helpers';

/**
 * Crawlers used by AI answer engines to build and cite their search indexes.
 * They are listed explicitly so a future restrictive rule for `*` never
 * silently removes the site from AI-generated answers.
 */
const AI_SEARCH_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'meta-externalagent',
  'Amazonbot',
  'Bytespider',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'YouBot',
  'Diffbot',
  'Timpibot',
  'CCBot',
];

/**
 * Paths that must stay out of every index, traditional or AI.
 *
 * Written without a trailing slash so each rule also matches the bare path:
 * `/dashboard/` would leave `/dashboard` itself crawlable. The wildcard entries
 * cover the locale-prefixed variants (`/fr/sign-in`), which the unprefixed
 * rules do not reach.
 *
 * `/fr` is deliberately absent. It serves the same Spanish copy as `/` and
 * already declares `/` as its canonical; disallowing it would stop crawlers
 * from ever reading that canonical, which is what consolidates the duplicate.
 */
const DISALLOWED = [
  '/dashboard',
  '/api/',
  '/sign-in',
  '/sign-up',
  '/*/dashboard',
  '/*/sign-in',
  '/*/sign-up',
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        // `/api/icon` stays crawlable: it serves the favicon referenced by the metadata.
        allow: ['/', '/api/icon'],
        disallow: DISALLOWED,
      },
      {
        userAgent: AI_SEARCH_CRAWLERS,
        allow: ['/', '/llms.txt', '/api/icon'],
        disallow: DISALLOWED,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
