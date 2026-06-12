import { setRequestLocale } from 'next-intl/server';
import { Inter_Tight, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import '@/styles/portfolio.css';

const fontDisplay = Inter_Tight({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-portfolio-display',
});

const fontSans = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-portfolio-sans',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-portfolio-mono',
});

export default async function PortfolioLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div
      className={`portfolio-root ${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      {props.children}
    </div>
  );
}
