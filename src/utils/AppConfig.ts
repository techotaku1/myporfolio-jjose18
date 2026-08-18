import { enUS, frFR } from '@clerk/localizations';
import type { LocalizationResource } from '@clerk/shared/types';
import type { LocalePrefixMode } from 'next-intl/routing';

/** Locale prefix strategy for next-intl routing. */
const localePrefix: LocalePrefixMode = 'as-needed';

/** Canonical production origin. Used for metadata, canonical URLs, sitemap and robots. */
export const SITE_URL = 'https://josedavid-portfolio.vercel.app';

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
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    localePrefix,
  },
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  fr: frFR,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
