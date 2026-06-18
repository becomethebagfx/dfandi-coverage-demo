import { Sparkles } from "lucide-react";

interface Props {
  label?: string;
  /** Show the sparkle icon. Default true. */
  icon?: boolean;
  /** Tooltip text shown on hover via the title attribute. */
  title?: string;
  className?: string;
}

/** Small brass pill that telegraphs a paid / AI / agentic feature inside the app. */
export function PremiumBadge({ label = "Premium", icon = true, title, className = "" }: Props) {
  return (
    <span className={`premium-badge ${className}`} title={title}>
      {icon ? <Sparkles className="h-3 w-3" /> : null}
      {label}
    </span>
  );
}
