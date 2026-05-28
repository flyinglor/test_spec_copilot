import { skillGroups } from '@/content/cv';
import styles from './cv.module.css';

export default function CVSkillGroups() {
  return (
    <div className={styles.cvBlock}>
      <h2 className={styles.cvSectionTitle}>Skills</h2>
      <div className={styles.skillsGrid}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.skillGroup}>
            <p className={styles.skillGroupLabel}>{group.label}</p>
            <div className={styles.skillList}>
              {group.items.map((item) => (
                <span key={item} className={styles.skillItem}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
