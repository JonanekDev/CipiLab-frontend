import type { UserRole } from "@/api";

const roleHierarchy: Record<UserRole, number> = {
    FULL_ADMIN: 4,
    SERVICES_ADMIN: 3,
    VIEWONLY_ADMIN: 2,
    USER: 1,
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}