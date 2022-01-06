import * as CrudApi from '@bgap/crud-gql/api';
import { adminUserRoleIsAtLeast } from '@bgap/crud-gql/api';
import { adminUserFixture } from '@bgap/shared/fixtures';

const getAdminUserWithRole = (role: CrudApi.Role): CrudApi.AdminUser => ({
  ...adminUserFixture.adminUser,
  roleContexts: {
    items: [adminUserFixture.getRoleContextItem(role)],
  },
});

describe('adminUserRoleIsAtLeast function', () => {
  const rolesToCheck = [
    CrudApi.Role.inactive,
    CrudApi.Role.staff,
    CrudApi.Role.unitadmin,
    CrudApi.Role.groupadmin,
    CrudApi.Role.chainadmin,
    CrudApi.Role.superuser,
  ];

  const emptyRoleAdminUser = {
    ...adminUserFixture.adminUserBase,
  };
  const mixedRoleAdminUser: CrudApi.AdminUser = {
    ...adminUserFixture.adminUser,
    roleContexts: {
      items: [
        adminUserFixture.getRoleContextItem(CrudApi.Role.unitadmin),
        adminUserFixture.getRoleContextItem(CrudApi.Role.chainadmin),
      ],
    },
  };

  const cases = [
    [emptyRoleAdminUser, [false, false, false, false, false, false]],
    [
      getAdminUserWithRole(CrudApi.Role.inactive),
      [true, false, false, false, false, false],
    ],
    [
      getAdminUserWithRole(CrudApi.Role.staff),
      [true, true, false, false, false, false],
    ],
    [
      getAdminUserWithRole(CrudApi.Role.unitadmin),
      [true, true, true, false, false, false],
    ],
    [
      getAdminUserWithRole(CrudApi.Role.groupadmin),
      [true, true, true, true, false, false],
    ],
    [
      getAdminUserWithRole(CrudApi.Role.chainadmin),
      [true, true, true, true, true, false],
    ],
    [
      getAdminUserWithRole(CrudApi.Role.superuser),
      [true, true, true, true, true, true],
    ],
    [mixedRoleAdminUser, [true, true, true, true, true, false]],
  ];

  test.each(cases)(
    'should check %p admin user, returns %p',
    (adminUser, expectedResults) => {
      rolesToCheck.forEach((role, idx) => {
        expect(adminUserRoleIsAtLeast(<CrudApi.AdminUser>adminUser, role)).toBe(
          (<boolean[]>expectedResults)[idx],
        );
      });
    },
  );
});
