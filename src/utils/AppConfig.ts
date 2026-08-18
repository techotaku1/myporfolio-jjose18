import { enUS } from '@clerk/localizations';
import type { LocalizationResource } from '@clerk/shared/types';
import type { LocalePrefixMode } from 'next-intl/routing';

/** Locale prefix strategy for next-intl routing. */
const localePrefix: LocalePrefixMode = 'as-needed';

/** Canonical production origin. Used for metadata, canonical URLs, sitemap and robots. */
export const SITE_URL = 'https://josedavid-portfolio.vercel.app';

/**
 * Date the public copy last changed, in ISO form.
 *
 * Deliberately a constant rather than `new Date()`: deriving it from build time
 * would move `lastmod` on every deploy, including deploys that change nothing a
 * crawler can see, and search engines discount a sitemap whose dates always
 * move. Bump this only when the visible content actually changes.
 */
export const CONTENT_LAST_MODIFIED = '2026-08-18';

/**
 * Language of the indexable public content.
 * The portfolio copy is authored in Spanish, so it must not inherit the
 * boilerplate `en` routing locale as the document language.
 */
export const CONTENT_LANG = 'es';

/** Centralized application configuration */
export const AppConfig = {
  name: 'Jose David Gonzalez',
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    localePrefix,
  },
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
