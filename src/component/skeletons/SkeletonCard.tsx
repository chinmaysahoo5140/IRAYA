import React from "react";
import { SkeletonBox } from "./SkeletonBox";
import { SkeletonLine } from "./SkeletonLine";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`space-y-3 p-4 border border-hairline bg-card/50 dark:bg-charcoal/20 rounded ${className}`}>
      <SkeletonBox height="h-32" />
      <SkeletonLine width="w-2/3" height="h-4" />
      <SkeletonLine width="w-1/2" height="h-3.5" />
    </div>
  );
}
