import TermsClient from './TermsClient';

export const metadata = {
  title: 'Terms of Service | Soulishere - Respectful Memorial Platform Agreement',
  description: 'Review the Soulishere Terms of Service. Understand our guidelines for memorial creation, family tribute ownership, QR codes, payments, and respectful community conduct.',
  openGraph: {
    title: 'Terms of Service | Soulishere - Respectful Memorial Platform Agreement',
    description: 'Learn about your rights and responsibilities when honoring loved ones, creating digital memorials, and sharing tributes on Soulishere.',
    url: 'https://soulishere.com/terms',
    siteName: 'Soulishere',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Soulishere Logo',
      },
    ],
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
