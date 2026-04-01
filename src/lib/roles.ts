/**
 * Role-Based Access Control (RBAC)
 * Defines admin roles and permissions
 */

export type AdminRole = "super_admin" | "admin" | "viewer";

export type AdminAction =
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "approve"
  | "manage_settings"
  | "manage_roles";

/**
 * Permission matrix
 * Defines what each role can do
 */
const PERMISSIONS: Record<AdminRole, AdminAction[]> = {
  super_admin: [
    "create",
    "edit",
    "delete",
    "export",
    "approve",
    "manage_settings",
    "manage_roles",
  ],
  admin: ["create", "edit", "delete", "export", "approve"],
  viewer: ["export"], // Read-only with export capability
};

/**
 * Check if a role has permission to perform an action
 */
export function hasPermission(
  role: AdminRole,
  action: AdminAction
): boolean {
  const rolePermissions = PERMISSIONS[role];
  return rolePermissions.includes(action);
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: AdminRole): string {
  const displayNames: Record<AdminRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    viewer: "Viewer",
  };
  return displayNames[role];
}

/**
 * Get all available roles
 */
export function getAllRoles(): AdminRole[] {
  return ["super_admin", "admin", "viewer"];
}

/**
 * Admin user interface (extends Firebase User)
 * Firestore document: /admins/{uid}
 */
export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  displayName?: string;
  createdAt: { seconds: number };
  lastLogin?: { seconds: number };
}

/**
 * Numeric role hierarchy for comparison.
 * Higher number = more privileged role.
 */
export const ROLE_HIERARCHY: Record<AdminRole, number> = {
  super_admin: 3,
  admin: 2,
  viewer: 1,
};

/**
 * Check if a role meets or exceeds the required role level.
 */
export function hasRoleLevel(
  userRole: AdminRole,
  requiredRole: AdminRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Default role for new admin users
 */
export const DEFAULT_ADMIN_ROLE: AdminRole = "viewer";
