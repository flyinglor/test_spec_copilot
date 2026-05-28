import { profile } from '@/content/profile';
import styles from './about.module.css';

export default function AboutHero() {
  return (
    <div className={styles.hero}>
      <div className="container">
        {profile.available && (
          <p className={styles.availableBadge}>Open to opportunities</p>
        )}

        <h1 className={styles.heroName}>{profile.name}</h1>
        <p className={styles.heroRole}>{profile.role}</p>
        <p className={styles.heroTagline}>&ldquo;{profile.tagline}&rdquo;</p>

        <div className={styles.heroSkills}>
          {profile.skills.map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>

        <p className={styles.heroLocation}>
          <span aria-hidden="true">📍</span>
          {profile.location}
        </p>
      </div>
    </div>
  );
}
