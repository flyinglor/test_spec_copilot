import styles from './projects.module.css';

export default function ProjectsEmptyState() {
  return (
    <div className={styles.emptyState}>
      <h3>No projects yet</h3>
      <p>Projects will appear here once they&apos;re added to the content collection.</p>
    </div>
  );
}
