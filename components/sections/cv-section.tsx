import { cvEntries } from '@/content/cv';
import type { CVEntry } from '@/content/types';
import styles from './cv.module.css';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function EntryRow({ entry }: { entry: CVEntry }) {
  return (
    <div className={styles.entry}>
      <div className={styles.entryMeta}>
        <p className={styles.entryDate}>
          {formatDate(entry.startDate)}
          {' – '}
          {formatDate(entry.endDate)}
        </p>
        <p className={styles.entryOrg}>{entry.organization}</p>
      </div>
      <div>
        <h3 className={styles.entryRole}>{entry.role}</h3>
        <p className={styles.entryDesc}>{entry.description}</p>
        <div className="tags">
          {entry.skills.map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CVSection() {
  const experience = cvEntries.filter((e) => e.type === 'experience');
  const education = cvEntries.filter((e) => e.type === 'education');

  return (
    <div>
      <div className={styles.cvBlock}>
        <h2 className={styles.cvSectionTitle}>Experience</h2>
        <div className={styles.timeline}>
          {experience.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      <div className={styles.cvBlock}>
        <h2 className={styles.cvSectionTitle}>Education</h2>
        <div className={styles.timeline}>
          {education.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
