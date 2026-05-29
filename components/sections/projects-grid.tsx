import { projects } from '@/content/projects';
import type { Project } from '@/content/types';
import ProjectsEmptyState from './projects-empty-state';
import styles from './projects.module.css';

function ProjectCard({ project }: { project: Project }) {
  const href = project.liveUrl ?? project.url ?? '#';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      aria-label={`${project.title} — ${project.description}`}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <span className={styles.cardArrow} aria-hidden="true">
          ↗
        </span>
      </div>

      <p className={styles.cardDesc}>{project.description}</p>

      <div className={styles.cardFooter}>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <span className={styles.cardYear}>{project.year}</span>
      </div>
    </a>
  );
}

export default function ProjectsGrid() {
  if (projects.length === 0) return <ProjectsEmptyState />;

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div>
      {featured.length > 0 && (
        <div className={styles.featuredGrid}>
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <div className={styles.grid}>
          {rest.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
