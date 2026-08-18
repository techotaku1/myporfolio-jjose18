import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Env } from '@/libs/Env';
import { routing } from '@/libs/I18nRouting';
import { CONTENT_LANG } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import '@/styles/global.css';

/**
 * Search Console hands out the token twice in different shapes: the DNS record
 * is `google-site-verification=<token>`, while the HTML tag expects the bare
 * `<token>`. Pasting the DNS form into the env var renders a meta tag Google
 * silently rejects, so strip the prefix if it is present.
 */
const googleVerification = Env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.replace(
  /^google-site-verification=/u,
  '',
);

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'Jose David Gonzalez — Full-Stack & IA Developer',
    template: '%s | Jose David Gonzalez',
  },
  verification: googleVerification ? { google: googleVerification } : undefined,
  icons: [
    { rel: 'icon', type: 'image/svg+xml', url: '/user-icon-base.svg' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/api/icon?size=32' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/api/icon?size=16' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/api/icon?size=192' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/api/icon?size=180' },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0b10',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={CONTENT_LANG}>
      <body>
        <NextIntlClientProvider>{props.children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
