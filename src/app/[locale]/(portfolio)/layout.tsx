import { Inter_Tight, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import '@/styles/portfolio.css';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

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

export default function PortfolioLayout(props: { children: React.ReactNode }) {
  return (
    <div
      className={`portfolio-root ${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      {props.children}
    </div>
  );
}
