import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne();

    if (settings && settings.seo) {
      return {
        title: settings.seo.title,
        description: settings.seo.description,
        keywords: settings.seo.keywords,
        icons: {
          icon: '/logo.png',
          shortcut: '/logo.png',
          apple: '/logo.png',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }

  return {
    title: 'Soulishere - Digital Memorial Platform',
    description: 'Create beautiful, lasting digital memorials for your loved ones. Preserve memories, celebrate lives, and share tributes with family and friends.',
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Playball&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <div className="app">
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

