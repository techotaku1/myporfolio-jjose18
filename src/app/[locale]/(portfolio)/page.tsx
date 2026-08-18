import type { Metadata } from 'next';
import { PortfolioLanding } from '@/components/portfolio/PortfolioLanding';
import { getBaseUrl } from '@/utils/Helpers';

const BASE_URL = getBaseUrl();

const DESCRIPTION =
  'Desarrollador Full-Stack e IA en Cali, Colombia. React, Next.js, TypeScript, Python y sistemas agénticos. Disponible para proyectos freelance.';

export const metadata: Metadata = {
  title: 'Jose David Gonzalez — Full-Stack & IA Developer',
  description: DESCRIPTION,
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
    type: 'profile',
    locale: 'es_CO',
    url: BASE_URL,
    siteName: 'Jose David Gonzalez — Portfolio',
    title: 'Jose David Gonzalez — Full-Stack & IA Developer',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jose David Gonzalez — Full-Stack & IA Developer',
    description: DESCRIPTION,
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
      image: `${BASE_URL}/pic_profile_avatar.jpg`,
      jobTitle: 'Full-Stack & IA Developer',
      description:
        'Desarrollador Full-Stack especializado en React, Next.js, TypeScript, Python y sistemas agénticos con IA.',
      worksFor: { '@type': 'Organization', name: 'Freelance' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cali',
        addressRegion: 'Valle del Cauca',
        addressCountry: 'CO',
      },
      email: 'jsdg1818@gmail.com',
      sameAs: ['https://github.com/techotaku1', 'https://www.linkedin.com/in/jjose18/'],
      nationality: { '@type': 'Country', name: 'Colombia' },
      knowsLanguage: [
        { '@type': 'Language', name: 'Español', alternateName: 'es' },
        { '@type': 'Language', name: 'Inglés', alternateName: 'en' },
      ],
      alumniOf: [
        { '@type': 'EducationalOrganization', name: 'FCECEP' },
        { '@type': 'EducationalOrganization', name: 'Instituto Ponao' },
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Full-Stack & IA Developer',
        occupationLocation: { '@type': 'City', name: 'Cali, Colombia' },
        skills: 'React, Next.js, TypeScript, Python, FastAPI, sistemas agénticos con IA',
      },
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
    {
      '@type': 'ProfilePage',
      '@id': `${BASE_URL}/#profilepage`,
      url: BASE_URL,
      name: 'Jose David Gonzalez — Full-Stack & IA Developer',
      description: DESCRIPTION,
      inLanguage: 'es-CO',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      mainEntity: { '@id': `${BASE_URL}/#person` },
      primaryImageOfPage: `${BASE_URL}/pic_profile_avatar.jpg`,
    },
  ],
};

export default function PortfolioHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c') }}
      />
      <PortfolioLanding />
    </>
  );
}
