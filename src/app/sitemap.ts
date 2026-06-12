import type { MetadataRoute } from 'next';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl, getI18nPath } from '@/utils/Helpers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          routing.locales
            .filter((locale) => locale !== routing.defaultLocale)
            .map((locale) => [locale, `${baseUrl}${getI18nPath('', locale)}`]),
        ),
      },
    },
  ];
}
