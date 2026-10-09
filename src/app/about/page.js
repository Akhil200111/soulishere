import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Us | Soulishere - Preserving Memories & Honoring Lives',
  description: 'Learn about Soulishere, a dedicated digital memorial platform for preserving stories, photos, and family connections forever.',
  openGraph: {
    title: 'About Us | Soulishere - Preserving Memories & Honoring Lives',
    description: 'Discover Soulishere - creating beautiful, lasting digital memorials for your loved ones.',
    url: 'https://soulishere.com/about',
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

export default function AboutPage() {
  return <AboutClient />;
}
