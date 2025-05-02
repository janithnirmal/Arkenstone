import { usePage } from '@inertiajs/react';

export default function usePermission() {
    const { props } = usePage<{ auth: { roles: string[]; permissions: string[] } }>();
    const roles = props.auth?.roles || [];
    const permissions = props.auth?.permissions || [];

    const hasRole = (role: string) => roles.includes(role);
    const hasAnyRole = (checkRoles: string[]) => checkRoles.some((r) => roles.includes(r));
    const can = (permission: string) => permissions.includes(permission);
    const canAny = (checkPermissions: string[]) => checkPermissions.some((p) => permissions.includes(p));

    return { hasRole, hasAnyRole, can, canAny };
}
