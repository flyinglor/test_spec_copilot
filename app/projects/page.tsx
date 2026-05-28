import type { Metadata } from 'next';
import SectionShell from '@/components/sections/section-shell';
import ProjectsGrid from '@/components/sections/projects-grid';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    "A selection of things I've built — tools, apps, and experiments.",
};

export default function ProjectsPage() {
  return (
    <SectionShell>
      <div className="section-header">
        <span className="section-label">Work</span>
        <h1 className="section-title">Projects</h1>
        <p className="section-subtitle">
          A selection of things I&apos;ve built — tools, apps, and experiments.
        </p>
      </div>
      <ProjectsGrid />
    </SectionShell>
  );
}
