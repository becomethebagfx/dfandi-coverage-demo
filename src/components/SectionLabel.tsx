interface Props {
  children: React.ReactNode;
  className?: string;
}

/** Small uppercase tracked label used throughout the app to introduce sections. */
export function SectionLabel({ children, className = "" }: Props) {
  return <div className={`section-label ${className}`}>{children}</div>;
}
