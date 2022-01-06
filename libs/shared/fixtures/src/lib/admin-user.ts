import * as CrudApi from '@bgap/crud-gql/api';

const adminUserBase: CrudApi.CreateAdminUserInput = {
  name: 'John Doe',
  email: 'testuser+johndoe@anyupp.com',
  phone: '+36123456789',
};

const adminUser: CrudApi.AdminUser = {
  ...adminUserBase,
  id: 'admin_user_id',
  createdAt: '',
  updatedAt: '',
};

const getRoleContextItem = (role: CrudApi.Role): CrudApi.AdminRoleContext => ({
  id: `${role}_context_id`,
  roleContextId: `${role}_role_context_id`,
  adminUserId: adminUser.id,
  createdAt: '',
  updatedAt: '',
  roleContext: {
    id: 'role_context_id',
    contextId: `${role.toUpperCase()}_CTX_ID`,
    role,
    createdAt: '',
    updatedAt: '',
  },
});

export const adminUserFixture = {
  adminUserBase,
  adminUser,
  getRoleContextItem,
};
