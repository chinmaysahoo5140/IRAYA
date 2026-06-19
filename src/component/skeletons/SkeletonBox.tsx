import React from "react";

interface SkeletonBoxProps {
  width?: string;
  height?: string;
  className?: string;
}

export function SkeletonBox({ width = "w-full", height = "h-32", className = "" }: SkeletonBoxProps) {
  return (
    <div
      className={`animate-shimmer rounded bg-secondary dark:bg-charcoal/30 ${width} ${height} ${className}`}
    />
  );
}
