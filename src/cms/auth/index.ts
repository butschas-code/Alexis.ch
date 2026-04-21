export { CmsAuthProvider, useCmsAuth, useCmsAuthOptional, useCmsPermission } from "./cms-auth-context";
export { AdminAuthGate } from "@/components/admin/AdminAuthGate";
export { fetchCmsUserRole } from "./fetch-cms-role";
export { mapFirebaseAuthErrorToMessage } from "./map-auth-error";
export {
  canAccessCmsDashboard,
  isCmsAdminRole,
  userHasAnyCmsRole,
  CMS_EDITOR_ROLES,
  CMS_ADMIN_ONLY_ROLES,
  roleHasPermission,
  roleHasAllPermissions,
  type CmsPermission,
} from "./permissions";
export { CmsPermissionGate } from "./cms-permission-gate";
