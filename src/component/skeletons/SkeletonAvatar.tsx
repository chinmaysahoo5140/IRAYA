import React from "react";

interface SkeletonAvatarProps {
  size?: string;
  className?: string;
}

export function SkeletonAvatar({ size = "h-12 w-12", className = "" }: SkeletonAvatarProps) {
  return (
    <div
      className={`animate-shimmer rounded-full bg-secondary dark:bg-charcoal/30 ${size} ${className}`}
    />
  );
}
