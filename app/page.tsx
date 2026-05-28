import type { Metadata } from 'next';
import AboutHero from '@/components/sections/about-hero';
import AboutDetails from '@/components/sections/about-details';

export const metadata: Metadata = {
  title: 'Jordan Lee — Full-Stack Engineer',
  description:
    'Full-stack engineer building things that matter, with code that lasts.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutDetails />
    </>
  );
}
