import React from "react";

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

export function SkeletonLine({ width = "w-full", height = "h-4", className = "" }: SkeletonLineProps) {
  return (
    <div
      className={`animate-shimmer rounded bg-secondary dark:bg-charcoal/30 ${width} ${height} ${className}`}
    />
  );
}
