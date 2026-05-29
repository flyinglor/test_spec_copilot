import { contactFallback } from '@/content/contact';
import styles from './contact.module.css';

export default function ContactFallback() {
  return (
    <div className={styles.fallback}>
      <p className={styles.fallbackHeading}>{contactFallback.heading}</p>
      <p className={styles.fallbackText}>{contactFallback.message}</p>
    </div>
  );
}
