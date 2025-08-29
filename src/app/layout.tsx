import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import QuantumBackground from '@/components/QuantumBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'QuantumCrypt - Quantum Random Number Generator',
  description: 'Advanced quantum-inspired encryption and decryption with secure password generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚛️</text></svg>" />
        <meta name="theme-color" content="#1f2937" />
      </head>
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen antialiased`}>
        <div className="relative min-h-screen">
          <QuantumBackground />
          <div className="relative z-10">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}