import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', axes: ['SOFT', 'WONK'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Conoce San Luis Potosí',
  description: 'Conoce San Luis Potosí. Explora su cultura, atractivos naturales, gastronomía y desarrollo sostenible.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${fraunces.variable} ${inter.variable} font-sans antialiased bg-surface-50 text-surface-900 dark:bg-surface-900 dark:text-surface-50 transition-colors duration-500`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
