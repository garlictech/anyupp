import * as CrudApi from '@bgap/crud-gql/api';

export const adminUserRoleIsAtLeast = (
  adminUser: CrudApi.AdminUser,
  expectedRole: CrudApi.Role,
) => {
  const ROLE_HIERARCHY = [
    undefined,
    CrudApi.Role.inactive,
    CrudApi.Role.staff,
    CrudApi.Role.unitadmin,
    CrudApi.Role.groupadmin,
    CrudApi.Role.chainadmin,
    CrudApi.Role.superuser,
  ];

  const maxAdminRoleIdx = Math.max(
    ...(adminUser.roleContexts?.items || []).map(rc =>
      ROLE_HIERARCHY.indexOf(rc?.roleContext?.role || undefined),
    ),
  );
  const expectedRoleIdx = ROLE_HIERARCHY.indexOf(expectedRole);

  return maxAdminRoleIdx >= expectedRoleIdx;
};
