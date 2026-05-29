import type { Metadata } from 'next';
import SectionShell from '@/components/sections/section-shell';
import ContactMethods from '@/components/sections/contact-methods';
import ContactFallback from '@/components/sections/contact-fallback';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch — I'm always open to interesting conversations.",
};

export default function ContactPage() {
  return (
    <SectionShell>
      <div className="section-header">
        <span className="section-label">Connect</span>
        <h1 className="section-title">Contact</h1>
        <p className="section-subtitle">
          I&apos;m always open to interesting conversations.
        </p>
      </div>

      <ContactMethods />
      <ContactFallback />
    </SectionShell>
  );
}
