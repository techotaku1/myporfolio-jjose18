import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PortfolioLanding } from '@/components/portfolio/PortfolioLanding';

const BASE_URL = 'https://portfolio.josedavid.vercel.app';

type PortfolioHomePageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Jose David Gonzalez — Full-Stack & IA Developer',
  description:
    'Desarrollador Full-Stack e IA en Cali, Colombia. Especializado en React, Next.js, TypeScript, Python y sistemas agénticos con IA. Disponible para proyectos freelance.',
  keywords: [
    'Jose David Gonzalez',
    'desarrollador full-stack',
    'IA developer',
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'FastAPI',
    'sistemas agénticos',
    'inteligencia artificial',
    'desarrollador web Cali',
    'Colombia',
    'freelance',
  ],
  authors: [{ name: 'Jose David Gonzalez', url: BASE_URL }],
  creator: 'Jose David Gonzalez',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: BASE_URL,
    siteName: 'Jose David Gonzalez — Portfolio',
    title: 'Jose David Gonzalez — Full-Stack & IA Developer',
    description:
      'Desarrollador Full-Stack e IA en Cali, Colombia. React, Next.js, TypeScript, Python y sistemas agénticos.',
    images: [
      {
        url: `${BASE_URL}/api/icon?size=512`,
        width: 512,
        height: 512,
        alt: 'Jose David Gonzalez',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Jose David Gonzalez — Full-Stack & IA Developer',
    description:
      'Desarrollador Full-Stack e IA en Cali, Colombia. React, Next.js, TypeScript, Python y sistemas agénticos.',
    images: [`${BASE_URL}/api/icon?size=512`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': 160,
      'max-image-preview': 'large',
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: 'Jose David Gonzalez',
      url: BASE_URL,
      image: `${BASE_URL}/api/icon?size=512`,
      jobTitle: 'Full-Stack & IA Developer',
      description:
        'Desarrollador Full-Stack especializado en React, Next.js, TypeScript, Python y sistemas agénticos con IA.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cali',
        addressRegion: 'Valle del Cauca',
        addressCountry: 'CO',
      },
      email: 'jsdg1818@gmail.com',
      sameAs: ['https://github.com/techotaku1', 'https://www.linkedin.com/in/jjose18/'],
      knowsAbout: [
        'React',
        'Next.js',
        'TypeScript',
        'Python',
        'FastAPI',
        'Inteligencia Artificial',
        'Sistemas Agénticos',
        'Full-Stack Development',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Jose David Gonzalez — Portfolio',
      description: 'Portfolio personal de Jose David Gonzalez, desarrollador Full-Stack & IA.',
      author: { '@id': `${BASE_URL}/#person` },
      inLanguage: 'es-CO',
    },
  ],
};

export default async function PortfolioHomePage(props: PortfolioHomePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioLanding />
    </>
  );
}
