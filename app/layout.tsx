import type { Metadata } from 'next';
import './globals.css';
import { Permanent_Marker } from 'next/font/google';

export const metadata: Metadata = {
  title: 'StoryTime GPT',
  description: 'StoryTime GPT creates imaginations into stories.',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      url: '/static/apple-touch-icon.png',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon.ico',
      media: '(prefers-color-scheme: dark)',
    },
  ],

};
const pm_custom_font = Permanent_Marker({ weight: '400', subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' data-theme='pastel' className={pm_custom_font.className}>
      <body>{children}</body>
    </html>
  );
}
