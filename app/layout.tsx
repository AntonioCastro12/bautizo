import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bautizo-valentina-2026.antoniojcc735429.chatgpt.site'),
  title: 'Bautizo de Valentina',
  description: 'Una invitación especial para acompañarnos a celebrar el bautizo de Valentina.',
  openGraph: {
    title: 'Bautizo de Valentina',
    description: '14 de noviembre de 2026 · 11:00 a. m.',
    type: 'website',
    locale: 'es_MX',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Bautizo de Valentina' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bautizo de Valentina',
    description: '14 de noviembre de 2026 · 11:00 a. m.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
