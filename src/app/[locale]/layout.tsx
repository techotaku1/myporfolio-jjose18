import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl } from '@/utils/Helpers';
import '@/styles/global.css';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'Jose David Gonzalez — Full-Stack & IA Developer',
    template: '%s | Jose David Gonzalez',
  },
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

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{props.children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
