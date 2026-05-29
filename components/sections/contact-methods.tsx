import { contactMethods } from '@/content/contact';
import type { ContactMethod } from '@/content/types';
import styles from './contact.module.css';

const ICONS: Record<string, string> = {
  email: '✉',
  github: '⌥',
  linkedin: 'in',
  twitter: '𝕏',
};

function MethodRow({ method }: { method: ContactMethod }) {
  const icon = ICONS[method.id] ?? method.id[0].toUpperCase();

  return (
    <a
      href={method.url}
      target={method.id === 'email' ? undefined : '_blank'}
      rel={method.id === 'email' ? undefined : 'noopener noreferrer'}
      className={`${styles.method} ${method.primary ? styles.primary : ''}`}
      aria-label={`${method.label}: ${method.value}`}
    >
      <span className={styles.methodIcon} aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className={styles.methodLabel}>{method.label}</p>
        <p className={styles.methodValue}>{method.value}</p>
      </div>
      <span className={styles.methodArrow} aria-hidden="true">
        →
      </span>
    </a>
  );
}

export default function ContactMethods() {
  return (
    <div className={styles.methods}>
      {contactMethods.map((method) => (
        <MethodRow key={method.id} method={method} />
      ))}
    </div>
  );
}
