"use client";

import { useRole } from "@/hooks/useRole";
import type { ReactNode } from "react";

interface PermissionGateProps {
  action: "view" | "create" | "update" | "delete" | "export" | "manage_users" | "manage_settings";
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGate({
  action,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, loading } = useRole();

  if (loading) return null;
  if (!hasPermission(action)) return <>{fallback}</>;
  return <>{children}</>;
}
