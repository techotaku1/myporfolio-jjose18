import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/Helpers';

/**
 * Builds the XML sitemap.
 *
 * The public portfolio is published in a single language, so no `alternates`
 * are emitted: advertising routing locales that serve the same Spanish copy
 * would signal duplicate content to search engines.
 * @returns The sitemap entries exposed at `/sitemap.xml`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
