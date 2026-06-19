import React from "react";

interface SkeletonBadgeProps {
  className?: string;
}

export function SkeletonBadge({ className = "" }: SkeletonBadgeProps) {
  return (
    <div
      className={`animate-shimmer rounded-full bg-secondary dark:bg-charcoal/30 h-5 w-16 ${className}`}
    />
  );
}
