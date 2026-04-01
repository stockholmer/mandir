"use client";

import { useAuth, type AdminRole } from "./useAuth";

type Permission =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "export"
  | "manage_users"
  | "manage_settings";

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: [
    "view",
    "create",
    "update",
    "delete",
    "export",
    "manage_users",
    "manage_settings",
  ],
  admin: ["view", "create", "update", "delete", "export"],
  viewer: ["view"],
};

export function useRole() {
  const { role, isAdmin, loading } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role].includes(permission);
  };

  return {
    role,
    isAdmin,
    loading,
    hasPermission,
    isSuperAdmin: role === "super_admin",
    canCreate: hasPermission("create"),
    canUpdate: hasPermission("update"),
    canDelete: hasPermission("delete"),
    canExport: hasPermission("export"),
    canManageUsers: hasPermission("manage_users"),
    canManageSettings: hasPermission("manage_settings"),
  };
}
