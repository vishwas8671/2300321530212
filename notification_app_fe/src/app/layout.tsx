import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AffordMed Campus Hub',
  description: 'A campus notification platform tracking placements, results, and events.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Load Google Fonts directly */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: '"Outfit", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
