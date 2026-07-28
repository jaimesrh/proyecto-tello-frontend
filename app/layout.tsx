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
          <div className="flex flex-col min-h-screen relative overflow-x-hidden">
            {/* Fondo ambiental con imágenes desenfocadas */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.06] dark:opacity-[0.12] blur-2xl scale-110">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                <img
                  src="/images/cascada_tamul_1784665879590.png"
                  alt="Fondo decorativo San Luis Potosí"
                  className="w-full h-full object-cover"
                />
                <img
                  src="/images/jardin_surrealista_1784665889348.png"
                  alt="Fondo decorativo Surrealista"
                  className="w-full h-full object-cover hidden md:block"
                />
              </div>
            </div>

            <Navbar />
            <main className="flex-grow pt-16 relative z-10">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
