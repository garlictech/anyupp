import * as CrudApi from '../generated/api';

export const adminUserRoleIsAtLeast = (
  _adminUser: CrudApi.AdminUser,
  _expectedRole: CrudApi.Role,
) => {
  /*const ROLE_HIERARCHY = [
    undefined,
    CrudApi.Role.inactive,
    CrudApi.Role.staff,
    CrudApi.Role.unitadmin,
    CrudApi.Role.groupadmin,
    CrudApi.Role.chainadmin,
    CrudApi.Role.superuser,
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
