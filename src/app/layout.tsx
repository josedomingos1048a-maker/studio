'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter, Space_Grotesk } from 'next/font/google';
import { SplashScreen } from '@/components/splash-screen';
import { usePathname } from 'next/navigation';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

// Metadata can't be exported from a client component, so we define it here.
// You can still export a 'generateMetadata' function from a server component
// in the same file if you need to generate it dynamically.
// export const metadata: Metadata = {
//   title: 'Simplifica INSS',
//   description: 'Um assistente para ajudar na solicitação de benefícios do INSS.',
// };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Show splash for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);


  return (
    <html lang="pt-BR" className="dark">
      <head>
          <title>Simplifica INSS</title>
          <meta name="description" content="Um assistente para ajudar na solicitação de benefícios do INSS." />
      </head>
      <body
        className={cn(
          'antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        {loading ? (
          <SplashScreen />
        ) : (
          <>
            {children}
            <Toaster />
          </>
        )}
      </body>
    </html>
  );
}
