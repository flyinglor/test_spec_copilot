import { profile } from '@/content/profile';
import styles from './about.module.css';

export default function AboutDetails() {
  return (
    <div className={styles.details}>
      <div className="container">
        <div className={styles.detailsGrid}>
          <div>
            <div className="section-header">
              <span className="section-label">About Me</span>
              <h2 className="section-title">A bit about who I am</h2>
            </div>
            <p className={styles.bioText}>{profile.bio}</p>
          </div>

          <aside aria-label="Interests">
            <div className={styles.sideCard}>
              <p className={styles.sideCardTitle}>Interests</p>
              <div className={styles.sideCardItems}>
                {profile.interests.map((interest) => (
                  <span key={interest} className={styles.sideCardItem}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
