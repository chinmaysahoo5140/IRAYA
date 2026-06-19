import React from "react";

interface SkeletonButtonProps {
  className?: string;
}

export function SkeletonButton({ className = "" }: SkeletonButtonProps) {
  return (
    <div
      className={`animate-shimmer rounded bg-secondary dark:bg-charcoal/30 h-10 w-28 ${className}`}
    />
  );
}
