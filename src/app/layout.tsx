
import type {Metadata} from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/context/language-context';
import { LocationProvider } from '@/context/location-context';

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
        <LanguageProvider>
          <LocationProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
          </LocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
