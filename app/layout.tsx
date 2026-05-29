import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SiteNav from '@/components/navigation/site-nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Jordan Lee — Full-Stack Engineer',
    template: '%s | Jordan Lee',
  },
  description:
    'Full-stack engineer building things that matter, with code that lasts.',
  metadataBase: new URL('https://jordanlee.dev'),
  openGraph: {
    type: 'website',
    siteName: 'Jordan Lee',
    title: 'Jordan Lee — Full-Stack Engineer',
    description:
      'Full-stack engineer building things that matter, with code that lasts.',
  },
  twitter: {
    card: 'summary',
    title: 'Jordan Lee — Full-Stack Engineer',
    description:
      'Full-stack engineer building things that matter, with code that lasts.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SiteNav />
        <main className="main-content">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>© {new Date().getFullYear()} Jordan Lee</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
