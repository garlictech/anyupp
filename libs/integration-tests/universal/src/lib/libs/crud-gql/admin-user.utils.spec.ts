import * as CrudApi from '@bgap/crud-gql/api';
import { adminUserRoleIsAtLeast } from '@bgap/crud-gql/api';
import { adminUserFixture, getRoleContextItem } from '@bgap/shared/fixtures';

const getAdminUserWithRole = (role: CrudApi.Role): CrudApi.AdminUser => ({
  ...adminUserFixture,
  roleContexts: {
    items: [getRoleContextItem(role)],
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
    ...adminUserFixture,
  };
  const mixedRoleAdminUser: CrudApi.AdminUser = {
    ...adminUserFixture,
    roleContexts: {
      items: [
        getRoleContextItem(CrudApi.Role.unitadmin),
        getRoleContextItem(CrudApi.Role.chainadmin),
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
