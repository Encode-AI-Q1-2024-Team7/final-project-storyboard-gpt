import type { Metadata } from "next";
import "./globals.css";
import { Permanent_Marker } from 'next/font/google';

export const metadata: Metadata = {
  title: "DaVinci GPT",
  description: "DaVinci GPT is a powerful AI painter model.",
};
const pm_custom_font = Permanent_Marker({ weight: '400', subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pastel" className={pm_custom_font.className}>
      <body>{children}</body>
    </html>
  );
}
