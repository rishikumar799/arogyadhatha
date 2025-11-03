
import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import { Providers } from '@/components/providers';
import { AuthProvider } from '@/contexts/auth-context'; // Import the AuthProvider

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '600', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Arogyadhatha',
  description: 'Arogyadhatha - Your Health Friend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* Wrap the entire application with AuthProvider */}
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
