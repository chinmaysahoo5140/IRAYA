import React from "react";

// Auth guarding is handled server-side by the /_authenticated route's
// beforeLoad (see src/routes/_authenticated/route.tsx). By the time any
// component under /_authenticated renders, the user is guaranteed to be
// authenticated. This component is kept as a thin wrapper so callers don't
// need to be updated, but it no longer does any client-side redirect logic.
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
