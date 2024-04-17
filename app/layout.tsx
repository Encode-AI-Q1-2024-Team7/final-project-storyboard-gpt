import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DaVinci GPT",
  description: "DaVinci GPT is a powerful AI painter model.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pastel" >
      <body>{children}</body>
    </html>
  );
}
