import type { Metadata } from 'next';
import Navigation from './components/sections/Navigation';
import Footer from './components/sections/Footer';
import {
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from 'next/font/google';
import './globals.css';

// These variables are consumed by the Tailwind v4 theme tokens in globals.css.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: 'Jackie Wong',
  description: "Third iteration of Jackie Wong's portfolio.",
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`${display.variable} ${body.variable} ${mono.variable} h-full scroll-smooth antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        {/* Navigation is a client component; the layout can remain server-rendered. */}
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
