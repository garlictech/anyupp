import * as CrudApi from '@bgap/crud-gql/api';

export const adminUserFixture: CrudApi.AdminUser = {
  id: 'admin_user_id',
  name: 'John Doe',
  email: 'john.doe@anyupp.com',
  phone: '+36123456789',
  createdAt: '',
  updatedAt: '',
};

export const getRoleContextItem = (
  role: CrudApi.Role,
): CrudApi.AdminRoleContext => ({
  id: `${role}_context_id`,
  roleContextId: `${role}_role_context_id`,
  adminUserId: adminUserFixture.id,
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
