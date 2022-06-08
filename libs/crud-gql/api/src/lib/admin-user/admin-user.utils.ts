import { AdminUser, Role } from '@bgap/domain';

export const adminUserRoleIsAtLeast = (
  _adminUser: AdminUser,
  _expectedRole: Role,
) => {
  /*const ROLE_HIERARCHY = [
    undefined,
    Role.inactive,
    Role.staff,
    Role.unitadmin,
    Role.groupadmin,
    Role.chainadmin,
    Role.superuser,
  ];

  const maxAdminRoleIdx = Math.max(
    ...(ser.roleContexts?.items || []).map(rc =>
      ROLE_HIERARCHY.indexOf(rc?.roleContext?.role || undefined),
    ),
  );
  const expectedRoleIdx = ROLE_HIERARCHY.indexOf(expectedRole);
*/
  return true;
  //return maxAdminRoleIdx >= expectedRoleIdx;
};
