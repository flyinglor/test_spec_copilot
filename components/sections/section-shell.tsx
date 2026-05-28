interface SectionShellProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionShell({ children, className, id }: SectionShellProps) {
  return (
    <section id={id} className={['section', className].filter(Boolean).join(' ')}>
      <div className="container">{children}</div>
    </section>
  );
}
