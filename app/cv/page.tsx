import type { Metadata } from 'next';
import SectionShell from '@/components/sections/section-shell';
import CVSection from '@/components/sections/cv-section';
import CVSkillGroups from '@/components/sections/cv-skill-groups';

export const metadata: Metadata = {
  title: 'CV',
  description: 'Professional experience, education, and skills.',
};

export default function CVPage() {
  return (
    <SectionShell>
      <div className="section-header">
        <span className="section-label">Background</span>
        <h1 className="section-title">Curriculum Vitae</h1>
        <p className="section-subtitle">
          A summary of my professional experience, education, and technical
          skills.
        </p>
      </div>

      <CVSection />

      <div style={{ marginTop: '3rem' }}>
        <CVSkillGroups />
      </div>
    </SectionShell>
  );
}
