import PrivacyClient from './PrivacyClient';

export const metadata = {
  title: 'Privacy Policy | Soulishere - Safeguarding Your Sacred Memories',
  description: 'Read the Soulishere Privacy Policy. Learn how we protect personal information, memorial stories, family photos, and videos with the highest level of security and respect.',
  openGraph: {
    title: 'Privacy Policy | Soulishere - Safeguarding Your Sacred Memories',
    description: 'Learn how Soulishere protects your personal data, memorial tributes, and family memories with complete transparency and care.',
    url: 'https://soulishere.com/privacy',
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

export default function PrivacyPage() {
  return <PrivacyClient />;
}
