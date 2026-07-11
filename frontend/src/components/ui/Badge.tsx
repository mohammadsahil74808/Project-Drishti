/**
 * SentinelX AI — Badge
 * Small status/severity indicator used across hotspot lists, risk scores,
 * case status, and alert severity throughout the platform.
 */
import { type HTMLAttributes } from "react";
import clsx from "clsx";

export type BadgeVariant =
  | "neutral"
  | "info"
  | "success"
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-sx-panel-light text-sx-text-dim border-sx-border",
  info: "bg-sx-accent/15 text-sx-accent border-sx-accent/30",
  success: "bg-sx-success/15 text-sx-success border-sx-success/30",
  low: "bg-sx-success/15 text-sx-success border-sx-success/30",
  medium: "bg-sx-alert/15 text-sx-alert border-sx-alert/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  critical: "bg-sx-critical/15 text-sx-critical border-sx-critical/30",
};

const dotClasses: Record<BadgeVariant, string> = {
  neutral: "bg-sx-text-dim",
  info: "bg-sx-accent",
  success: "bg-sx-success",
  low: "bg-sx-success",
  medium: "bg-sx-alert",
  high: "bg-orange-400",
  critical: "bg-sx-critical",
};

export default function Badge({
  className,
  variant = "neutral",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={clsx("h-1.5 w-1.5 rounded-full", dotClasses[variant])} />
      )}
      {children}
    </span>
  );
}
